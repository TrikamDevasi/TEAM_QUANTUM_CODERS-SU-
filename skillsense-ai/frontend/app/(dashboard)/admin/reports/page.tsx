'use client';

import React from 'react';
import ReportGenerator from '../../../../components/dashboard/ReportGenerator';
import { downloadPageAsPDF } from '../../../../utils/downloadPDF';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

const RECENT_REPORTS = [
    { name: 'Q4 FY25-26 Placement Report', type: 'placement', format: 'PDF', date: '2026-03-10', size: '2.4 MB', status: 'ready' },
    { name: 'National Fairness Audit', type: 'fairness', format: 'XLSX', date: '2026-03-01', size: '1.1 MB', status: 'ready' },
    { name: 'Cloud Program ROI Analysis', type: 'roi', format: 'PDF', date: '2026-02-20', size: '890 KB', status: 'ready' },
    { name: 'Skill Gap — Critical States', type: 'skill-gap', format: 'CSV', date: '2026-02-15', size: '340 KB', status: 'ready' },
    { name: 'PMKVY 4.0 Compliance Check', type: 'compliance', format: 'PDF', date: '2026-02-01', size: '1.8 MB', status: 'archived' },
];

const TYPE_ICONS: Record<string, string> = { placement: 'PLC', fairness: 'FIR', roi: 'ROI', 'skill-gap': 'SKL', compliance: 'CMP' };
const FORMAT_COLORS: Record<string, string> = { PDF: '#ef4444', XLSX: '#22c55e', CSV: '#3b82f6' };

export default function ReportsPage() {
    return (
        <div style={{ color: WHITE, maxWidth: 1100 }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                    Reports <span style={{ color: GOLD }}>Centre</span>
                </h1>
                <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                    Generate, schedule, and download system reports
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
                <ReportGenerator onGenerate={(config) => { downloadPageAsPDF('Report-' + config.type); }} />

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,168,67,0.18)', borderRadius: 14, padding: '22px' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Recent Reports</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {RECENT_REPORTS.map((report) => (
                            <div
                                key={report.name}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: '10px 12px',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    borderRadius: 8,
                                    transition: 'background 0.15s',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(212,168,67,0.05)'; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'; }}
                            >
                                <span style={{ fontSize: 18 }}>{TYPE_ICONS[report.type]}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: WHITE, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{report.name}</p>
                                    <p style={{ margin: '2px 0 0', fontSize: 11, color: MUTED }}>
                                        {new Date(report.date).toLocaleDateString('en-IN')} • {report.size}
                                    </p>
                                </div>
                                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: `${FORMAT_COLORS[report.format]}18`, color: FORMAT_COLORS[report.format], border: `1px solid ${FORMAT_COLORS[report.format]}40` }}>{report.format}</span>
                                <button onClick={() => downloadPageAsPDF(report.name)} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(212,168,67,0.3)', background: 'transparent', color: GOLD, fontSize: 11, cursor: 'pointer' }}>↓</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
