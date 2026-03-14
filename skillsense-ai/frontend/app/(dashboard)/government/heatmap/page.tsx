'use client';

import React from 'react';
import RegionHeatmap from '../../../../components/charts/RegionHeatmap';
import type { RegionData } from '../../../../types/charts';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

const regionData: RegionData[] = [
    { region: 'West', state: 'Gujarat', lat: 22.3, lng: 72.1, skillScore: 83, placementRate: 86, studentCount: 45000, criticalGaps: [] },
    { region: 'West', state: 'Maharashtra', lat: 19.1, lng: 75.7, skillScore: 78, placementRate: 80, studentCount: 120000, criticalGaps: ['Cloud Computing'] },
    { region: 'South', state: 'Karnataka', lat: 15.3, lng: 75.7, skillScore: 82, placementRate: 81, studentCount: 88000, criticalGaps: [] },
    { region: 'South', state: 'Tamil Nadu', lat: 11.1, lng: 78.6, skillScore: 79, placementRate: 74, studentCount: 95000, criticalGaps: ['Cybersecurity'] },
    { region: 'South', state: 'Andhra Pradesh', lat: 15.9, lng: 79.7, skillScore: 71, placementRate: 67, studentCount: 72000, criticalGaps: ['Full-Stack Dev', 'AI/ML'] },
    { region: 'South', state: 'Telangana', lat: 18.1, lng: 79.0, skillScore: 76, placementRate: 73, studentCount: 60000, criticalGaps: [] },
    { region: 'South', state: 'Kerala', lat: 10.8, lng: 76.2, skillScore: 80, placementRate: 78, studentCount: 42000, criticalGaps: [] },
    { region: 'North', state: 'Delhi', lat: 28.6, lng: 77.2, skillScore: 77, placementRate: 82, studentCount: 55000, criticalGaps: ['DevOps'] },
    { region: 'North', state: 'Uttar Pradesh', lat: 26.8, lng: 80.9, skillScore: 64, placementRate: 61, studentCount: 180000, criticalGaps: ['Full-Stack Dev', 'Cloud Computing', 'Data Science'] },
    { region: 'North', state: 'Rajasthan', lat: 27.0, lng: 74.2, skillScore: 66, placementRate: 62, studentCount: 90000, criticalGaps: ['Backend Dev', 'Cloud Computing'] },
    { region: 'North', state: 'Punjab', lat: 31.1, lng: 75.3, skillScore: 75, placementRate: 74, studentCount: 38000, criticalGaps: [] },
    { region: 'North', state: 'Haryana', lat: 29.1, lng: 76.1, skillScore: 73, placementRate: 71, studentCount: 44000, criticalGaps: [] },
    { region: 'North', state: 'Himachal Pradesh', lat: 31.1, lng: 77.2, skillScore: 70, placementRate: 66, studentCount: 18000, criticalGaps: [] },
    { region: 'North', state: 'Uttarakhand', lat: 30.1, lng: 79.2, skillScore: 69, placementRate: 63, studentCount: 22000, criticalGaps: [] },
    { region: 'East', state: 'West Bengal', lat: 22.9, lng: 87.8, skillScore: 68, placementRate: 64, studentCount: 105000, criticalGaps: ['Full-Stack Dev', 'Cybersecurity'] },
    { region: 'East', state: 'Bihar', lat: 25.1, lng: 85.3, skillScore: 58, placementRate: 52, studentCount: 140000, criticalGaps: ['DevOps', 'Cloud Computing', 'Backend Dev', 'AI/ML'] },
    { region: 'East', state: 'Jharkhand', lat: 23.6, lng: 85.3, skillScore: 61, placementRate: 55, studentCount: 68000, criticalGaps: ['Data Science', 'Cloud Computing'] },
    { region: 'East', state: 'Odisha', lat: 20.9, lng: 84.2, skillScore: 63, placementRate: 58, studentCount: 78000, criticalGaps: ['Full-Stack Dev', 'AI/ML'] },
    { region: 'Central', state: 'Madhya Pradesh', lat: 22.9, lng: 78.6, skillScore: 63, placementRate: 60, studentCount: 110000, criticalGaps: ['DevOps', 'Cybersecurity'] },
    { region: 'Central', state: 'Chhattisgarh', lat: 21.3, lng: 81.6, skillScore: 60, placementRate: 57, studentCount: 65000, criticalGaps: ['Full-Stack Dev', 'Data Science', 'Cloud Computing'] },
];

export default function HeatmapPage() {
    return (
        <div style={{ color: WHITE, maxWidth: 1000 }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                    Region <span style={{ color: GOLD }}>Heatmap</span>
                </h1>
                <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                    State-level skill scores and placement disparities
                </p>
            </div>

            {/* Summary stats */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 24, flexWrap: 'wrap' }}>
                {[
                    { label: 'States Tracked', value: regionData.length },
                    { label: 'Avg Score', value: `${Math.round(regionData.reduce((s, r) => s + r.skillScore, 0) / regionData.length)}/100` },
                    { label: 'Below 65 (At Risk)', value: regionData.filter((r) => r.skillScore < 65).length },
                    { label: 'Total Students', value: `${(regionData.reduce((s, r) => s + r.studentCount, 0) / 1000000).toFixed(1)}M` },
                ].map((s) => (
                    <div key={s.label} style={{ padding: '12px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
                        <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: GOLD }}>{s.value}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: MUTED }}>{s.label}</p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,168,67,0.18)', borderRadius: 14, padding: '20px' }}>
                    <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700 }}>India Skill Heatmap</h3>
                    <RegionHeatmap data={regionData} />
                </div>

                {/* Bottom states table */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,168,67,0.18)', borderRadius: 14, padding: '20px' }}>
                    <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700 }}>Priority Intervention States</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[...regionData].sort((a, b) => a.skillScore - b.skillScore).slice(0, 8).map((r) => (
                            <div key={r.state} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>
                                <div>
                                    <p style={{ margin: 0, fontSize: 13, color: WHITE, fontWeight: 500 }}>{r.state}</p>
                                    {r.criticalGaps.length > 0 && (
                                        <p style={{ margin: '2px 0 0', fontSize: 11, color: '#ef4444' }}>⚑ {r.criticalGaps[0]}{r.criticalGaps.length > 1 ? ` +${r.criticalGaps.length - 1}` : ''}</p>
                                    )}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: r.skillScore < 60 ? '#ef4444' : GOLD }}>{r.skillScore}</p>
                                    <p style={{ margin: 0, fontSize: 11, color: MUTED }}>score</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
