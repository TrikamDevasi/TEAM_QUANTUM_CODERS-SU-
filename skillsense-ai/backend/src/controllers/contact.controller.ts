import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import ContactRequest from '../models/ContactRequest.model';
import { sendDemoRequest } from '../services/email.service';
import { buildApiResponse, parsePagination, buildPaginatedResponse } from '../utils/pagination.utils';

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  organization: z.string().min(2),
  role: z.string().min(2),
  phone: z.string().optional(),
  message: z.string().min(10).max(2000),
  privacyAccepted: z.boolean().refine((v) => v === true, {
    message: 'Privacy policy must be accepted',
  }),
});

export const createContactRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const body = contactSchema.parse(req.body);

    const contactReq = await ContactRequest.create(body);

    // Send emails — don't fail the request if email fails
    sendDemoRequest(body.email, body.name, body.organization).catch(() => {});

    res.status(201).json(buildApiResponse(
      { id: contactReq._id, status: contactReq.status },
      'Demo request received. We will be in touch within 1-2 business days.'
    ));
  } catch (err) { next(err); }
};

export const listContactRequests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { skip, limit, page } = parsePagination(req.query);
    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.status = req.query.status;

    const [requests, total] = await Promise.all([
      ContactRequest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ContactRequest.countDocuments(filter),
    ]);
    res.status(200).json(buildPaginatedResponse(requests, total, page, limit, 'Contact requests retrieved'));
  } catch (err) { next(err); }
};
