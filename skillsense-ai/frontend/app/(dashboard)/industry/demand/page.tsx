'use client';

import React from 'react';
import IndustryDemandBar from '../../../../components/charts/IndustryDemandBar';
import SkillForecastArea from '../../../../components/charts/SkillForecastArea';
import { sampleIndustryDemand } from '../../../../data/sampleIndustryDemand';
import type { ForecastEntry } from '../../../../types/charts';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

const forecastData: ForecastEntry[] = [
    { month: 'Apr 25', actual: 62 },
    { month: 'May 25', actual: 64 },
    { month: 'Jun 25', actual: 67 },
    { month: 'Jul 25', actual: 69 },
    { month: 'Aug 25', actual: 71 },
    { month: 'Sep 25', actual: 73 },
    { month: 'Oct 25', actual: 75 },
    { month: 'Nov 25', actual: 76 },
    { month: 'Dec 25', actual: 74 },
    { month: 'Jan 26', actual: 77 },
    { month: 'Feb 26', actual: 79 },
    { month: 'Mar 26', actual: 81, forecast: 81 },
    { month: 'Apr 26', forecast: 83 },
    { month: 'May 26', forecast: 85 },
    { month: 'Jun 26', forecast: 87 },
];

export default function DemandPage() {
    return (
        <div style={{ color: WHITE, maxWidth: 1100 }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                    Demand <span style={{ color: GOLD }}>Signals</span>
                </h1>
                <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                    Real-time and forecasted skill demand across sectors
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,168,67,0.18)', borderRadius: 14, padding: '20px' }}>
                    <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700 }}>Skill Availability Forecast</h3>
                    <p style={{ margin: '0 0 14px', fontSize: 12, color: MUTED }}>Actual (solid) vs Forecast (dashed) availability %</p>
                    <SkillForecastArea data={forecastData} currentMonthIndex={11} />
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,168,67,0.18)', borderRadius: 14, padding: '20px' }}>
                    <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700 }}>Top Demand by Domain</h3>
                    <p style={{ margin: '0 0 14px', fontSize: 12, color: MUTED }}>Current openings across tracked skill areas</p>
                    <IndustryDemandBar data={sampleIndustryDemand} showTop={6} />
                </div>
            </div>

            {/* Detailed demand table */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                        <tr style={{ background: 'rgba(212,168,67,0.08)' }}>
                            {['Skill', 'Domain', 'Current Demand', 'Projected 2026', 'Growth', 'Avg Salary', 'Gap'].map((h) => (
                                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[...sampleIndustryDemand].sort((a, b) => b.growthPercent - a.growthPercent).map((d, i) => (
                            <tr key={d.skill} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                                <td style={{ padding: '10px 14px', color: WHITE, fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{d.skill}</td>
                                <td style={{ padding: '10px 14px', color: MUTED, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{d.domain}</td>
                                <td style={{ padding: '10px 14px', color: WHITE, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{d.currentDemand.toLocaleString('en-IN')}</td>
                                <td style={{ padding: '10px 14px', color: GOLD, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{d.projectedDemand2026.toLocaleString('en-IN')}</td>
                                <td style={{ padding: '10px 14px', color: d.growthPercent > 50 ? '#22c55e' : d.growthPercent > 0 ? GOLD : '#ef4444', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    {d.growthPercent >= 0 ? '+' : ''}{d.growthPercent}%
                                </td>
                                <td style={{ padding: '10px 14px', color: MUTED, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>₹{d.avgSalary.toLocaleString('en-IN')}</td>
                                <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: d.supplyGap === 'critical' ? 'rgba(239,68,68,0.15)' : d.supplyGap === 'moderate' ? 'rgba(212,168,67,0.15)' : 'rgba(34,197,94,0.12)', color: d.supplyGap === 'critical' ? '#ef4444' : d.supplyGap === 'moderate' ? GOLD : '#22c55e', border: `1px solid ${d.supplyGap === 'critical' ? 'rgba(239,68,68,0.3)' : d.supplyGap === 'moderate' ? 'rgba(212,168,67,0.3)' : 'rgba(34,197,94,0.3)'}` }}>
                                        {d.supplyGap}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
