'use client';

import React from 'react';
import PlacementLineChart from '../../../../components/charts/PlacementLineChart';
import KPICard from '../../../../components/dashboard/KPICard';
import { samplePlacements } from '../../../../data/samplePlacements';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

const latest = samplePlacements[samplePlacements.length - 1];
const prev = samplePlacements[samplePlacements.length - 2];

export default function PlacementPage() {
    return (
        <div style={{ color: WHITE, maxWidth: 1100 }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                    Placement <span style={{ color: GOLD }}>Analytics</span>
                </h1>
                <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>Annual placement performance — FY 2025-26</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                <KPICard label="Placed This Month" value={latest.placedCount} trend={Math.round(((latest.placedCount - prev.placedCount) / prev.placedCount) * 100)} trendDirection="up" icon="+" />
                <KPICard label="Placement Rate" value={latest.placementRate} unit="%" trend={parseFloat((latest.placementRate - prev.placementRate).toFixed(1))} trendDirection="up" icon="%" />
                <KPICard label="Avg Salary" value={latest.avgSalary} unit="₹" trend={Math.round(((latest.avgSalary - prev.avgSalary) / prev.avgSalary) * 100)} trendDirection="up" icon="₹" />
                <KPICard label="Female %" value={latest.femalePercent} unit="%" trend={1} trendDirection="up" icon="F" />
                <KPICard label="Top Sector" value={latest.topSector} icon="S" />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,168,67,0.18)', borderRadius: 14, padding: '24px', marginBottom: 24 }}>
                <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700 }}>Monthly Placement Trend</h3>
                <p style={{ margin: '0 0 16px', fontSize: 12, color: MUTED }}>Students placed by month — showing consistent upward trajectory</p>
                <PlacementLineChart data={samplePlacements} />
            </div>

            {/* Monthly table */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                        <tr style={{ background: 'rgba(212,168,67,0.08)' }}>
                            {['Month', 'Placed', 'Rate %', 'Avg Salary', 'Female %', 'Top Sector'].map((h) => (
                                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[...samplePlacements].reverse().map((row, i) => (
                            <tr key={row.month} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                                <td style={{ padding: '10px 14px', color: i === 0 ? GOLD : WHITE, fontWeight: i === 0 ? 700 : 400, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.month}{i === 0 && ' (latest)'}</td>
                                <td style={{ padding: '10px 14px', color: WHITE, fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.placedCount}</td>
                                <td style={{ padding: '10px 14px', color: row.placementRate >= 75 ? '#22c55e' : GOLD, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.placementRate}%</td>
                                <td style={{ padding: '10px 14px', color: MUTED, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>₹{row.avgSalary.toLocaleString('en-IN')}</td>
                                <td style={{ padding: '10px 14px', color: MUTED, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.femalePercent}%</td>
                                <td style={{ padding: '10px 14px', color: MUTED, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{row.topSector}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
