'use client';

import React from 'react';
import { sampleInstitutions } from '../../../../data/sampleInstitutions';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

const FUND_DATA = [
    { state: 'Bihar', region: 'East', allocationNeeded: 2800, currentAlloc: 1200, gapScore: 58, priority: 'Critical', students: 140000 },
    { state: 'Uttar Pradesh', region: 'North', allocationNeeded: 4200, currentAlloc: 2100, gapScore: 64, priority: 'Critical', students: 180000 },
    { state: 'Chhattisgarh', region: 'Central', allocationNeeded: 1600, currentAlloc: 900, gapScore: 60, priority: 'Critical', students: 65000 },
    { state: 'Madhya Pradesh', region: 'Central', allocationNeeded: 2400, currentAlloc: 1400, gapScore: 63, priority: 'High', students: 110000 },
    { state: 'Odisha', region: 'East', allocationNeeded: 1800, currentAlloc: 1100, gapScore: 63, priority: 'High', students: 78000 },
    { state: 'Jharkhand', region: 'East', allocationNeeded: 1400, currentAlloc: 900, gapScore: 61, priority: 'High', students: 68000 },
    { state: 'Rajasthan', region: 'North', allocationNeeded: 2200, currentAlloc: 1600, gapScore: 66, priority: 'Medium', students: 90000 },
    { state: 'Himachal Pradesh', region: 'North', allocationNeeded: 600, currentAlloc: 480, gapScore: 70, priority: 'Low', students: 18000 },
];

const PRIORITY_COLORS: Record<string, string> = { Critical: '#ef4444', High: '#f59e0b', Medium: GOLD, Low: '#22c55e' };

export default function FundTargetingPage() {
    const totalNeeded = FUND_DATA.reduce((s, f) => s + f.allocationNeeded, 0);
    const totalAllocated = FUND_DATA.reduce((s, f) => s + f.currentAlloc, 0);
    const gap = totalNeeded - totalAllocated;

    return (
        <div style={{ color: WHITE, maxWidth: 1100 }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                    💸 Fund <span style={{ color: GOLD }}>Targeting</span>
                </h1>
                <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                    AI-driven fund allocation recommendations for maximum impact
                </p>
            </div>

            {/* Summary */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                {[
                    { label: 'Total Need (₹ Cr)', value: `₹${totalNeeded.toLocaleString('en-IN')} Cr`, color: WHITE },
                    { label: 'Currently Allocated', value: `₹${totalAllocated.toLocaleString('en-IN')} Cr`, color: GOLD },
                    { label: 'Funding Gap', value: `₹${gap.toLocaleString('en-IN')} Cr`, color: '#ef4444' },
                    { label: 'States Needing Action', value: FUND_DATA.filter((f) => f.priority === 'Critical' || f.priority === 'High').length, color: '#f59e0b' },
                ].map((s) => (
                    <div key={s.label} style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, flex: 1, minWidth: 140 }}>
                        <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: MUTED }}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Fund allocation table */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                        <tr style={{ background: 'rgba(212,168,67,0.08)' }}>
                            {['State', 'Region', 'Students', 'Skill Score', 'Need (₹Cr)', 'Allocated (₹Cr)', 'Gap', 'Priority'].map((h) => (
                                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {FUND_DATA.map((row, i) => (
                            <tr key={row.state} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                                <td style={{ padding: '10px 14px', color: WHITE, fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.state}</td>
                                <td style={{ padding: '10px 14px', color: MUTED, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.region}</td>
                                <td style={{ padding: '10px 14px', color: MUTED, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.students.toLocaleString('en-IN')}</td>
                                <td style={{ padding: '10px 14px', color: row.gapScore < 62 ? '#ef4444' : row.gapScore < 68 ? GOLD : WHITE, fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.gapScore}</td>
                                <td style={{ padding: '10px 14px', color: WHITE, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>₹{row.allocationNeeded}</td>
                                <td style={{ padding: '10px 14px', color: GOLD, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>₹{row.currentAlloc}</td>
                                <td style={{ padding: '10px 14px', color: '#ef4444', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>₹{row.allocationNeeded - row.currentAlloc}</td>
                                <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: `${PRIORITY_COLORS[row.priority]}15`, border: `1px solid ${PRIORITY_COLORS[row.priority]}40`, color: PRIORITY_COLORS[row.priority] }}>
                                        {row.priority}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* AI recommendation */}
            <div style={{ marginTop: 20, padding: '16px 20px', background: 'rgba(212,168,67,0.07)', border: '1px solid rgba(212,168,67,0.3)', borderRadius: 12 }}>
                <p style={{ margin: '0 0 8px', fontWeight: 700, color: GOLD }}>AI Allocation Recommendation</p>
                <p style={{ margin: 0, fontSize: 13, color: MUTED, lineHeight: 1.7 }}>
                    Prioritize Bihar (highest gap, lowest score at 58) with an additional ₹1,600 Cr over 2 years, focused on EV & Solar programs. Redistributing 15% of current North allocation to Central region would improve national equity score by an estimated 4.2 points.
                </p>
            </div>
        </div>
    );
}
