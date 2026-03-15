import { Request, Response } from 'express';
import IndustryInquiry from '../models/IndustryInquiry.model';

/**
 * @desc    Submit a new industry inquiry
 * @route   POST /api/v1/contact/industry
 * @access  Public
 */
export const submitInquiry = async (req: Request, res: Response) => {
    try {
        const { companyName, email, phone, plan, teamSize, message } = req.body;

        if (!companyName || !email || !plan || !teamSize) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: companyName, email, plan, teamSize'
            });
        }

        const inquiry = await IndustryInquiry.create({
            companyName,
            email,
            phone,
            plan,
            teamSize,
            message
        });

        res.status(201).json({
            success: true,
            data: inquiry,
            message: 'Inquiry submitted successfully. Our team will contact you soon.'
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

/**
 * @desc    Get all industry inquiries
 * @route   GET /api/v1/contact/industry
 * @access  Private/Admin
 */
export const getInquiries = async (req: Request, res: Response) => {
    try {
        const inquiries = await IndustryInquiry.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: inquiries.length,
            data: inquiries
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

/**
 * @desc    Update inquiry status
 * @route   PUT /api/v1/contact/industry/:id
 * @access  Private/Admin
 */
export const updateInquiryStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        
        const inquiry = await IndustryInquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found'
            });
        }

        res.status(200).json({
            success: true,
            data: inquiry
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};
