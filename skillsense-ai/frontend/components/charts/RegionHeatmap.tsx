'use client';

import React, { useState } from 'react';
import type { RegionData } from '../../types/charts';

interface RegionHeatmapProps {
    data: RegionData[];
}

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

const STATE_POSITIONS: Record<string, { x: number; y: number }> = {
    'Jammu & Kashmir': { x: 28, y: 6 },
    'Himachal Pradesh': { x: 34, y: 12 },
    'Punjab': { x: 28, y: 16 },
    'Uttarakhand': { x: 42, y: 16 },
    'Haryana': { x: 33, y: 20 },
    'Delhi': { x: 36, y: 22 },
    'Rajasthan': { x: 25, y: 30 },
    'Uttar Pradesh': { x: 46, y: 28 },
    'Bihar': { x: 58, y: 30 },
    'West Bengal': { x: 66, y: 36 },
    'Sikkim': { x: 70, y: 24 },
    'Assam': { x: 78, y: 28 },
    'Meghalaya': { x: 76, y: 32 },
    'Manipur': { x: 82, y: 36 },
    'Tripura': { x: 76, y: 36 },
    'Mizoram': { x: 79, y: 40 },
    'Nagaland': { x: 84, y: 30 },
    'Arunachal Pradesh': { x: 85, y: 22 },
    'Jharkhand': { x: 60, y: 36 },
    'Odisha': { x: 60, y: 44 },
    'Chhattisgarh': { x: 52, y: 40 },
    'Madhya Pradesh': { x: 40, y: 38 },
    'Gujarat': { x: 18, y: 38 },
    'Maharashtra': { x: 30, y: 48 },
    'Telangana': { x: 42, y: 54 },
    'Andhra Pradesh': { x: 46, y: 60 },
    'Karnataka': { x: 34, y: 62 },
    'Kerala': { x: 30, y: 74 },
    'Tamil Nadu': { x: 38, y: 72 },
    'Goa': { x: 24, y: 60 },
};

function getHeatColor(score: number): string {
    if (score >= 80) return 'rgba(212, 168, 67, 0.9)';
    if (score >= 70) return 'rgba(212, 168, 67, 0.65)';
    if (score >= 60) return 'rgba(212, 168, 67, 0.38)';
    return 'rgba(239, 68, 68, 0.55)';
}

export default function RegionHeatmap({ data }: RegionHeatmapProps) {
    const [tooltip, setTooltip] = useState<RegionData | null>(null);

    return (
        <div style={{ width: '100%' }}>
            {/* State dot map */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '90%',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: 12,
                    border: '1px solid rgba(255,255,255,0.08)',
                    overflow: 'hidden',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <svg viewBox="0 0 100 95" style={{ width: '100%', height: '100%' }}>
                        {/* India rough outline lines */}
                        <path
                            d="M30,10 Q45,5 65,10 Q85,20 88,35 Q82,55 70,70 Q55,85 40,80 Q25,78 20,65 Q12,50 18,35 Q22,20 30,10Z"
                            fill="none"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="0.5"
                        />

                        {/* State dots */}
                        {data.map((region) => {
                            const pos = STATE_POSITIONS[region.state];
                            if (!pos) return null;
                            return (
                                <g key={region.state}>
                                    <circle
                                        cx={pos.x}
                                        cy={pos.y}
                                        r={3.5}
                                        fill={getHeatColor(region.skillScore)}
                                        stroke="rgba(255,255,255,0.2)"
                                        strokeWidth={0.3}
                                        style={{ cursor: 'pointer', transition: 'r 0.2s' }}
                                        onMouseEnter={() => setTooltip(region)}
                                        onMouseLeave={() => setTooltip(null)}
                                    />
                                    <text
                                        x={pos.x}
                                        y={pos.y + 5.5}
                                        textAnchor="middle"
                                        fill={MUTED}
                                        fontSize="2.2"
                                        pointerEvents="none"
                                    >
                                        {region.state.split(' ')[0].slice(0, 6)}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>

                    {/* Floating tooltip on hover */}
                    {tooltip && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: 16,
                                left: 16,
                                background: 'rgba(15,15,25,0.97)',
                                border: `1px solid ${GOLD}`,
                                borderRadius: 10,
                                padding: '10px 14px',
                                minWidth: 200,
                                zIndex: 10,
                                pointerEvents: 'none',
                            }}
                        >
                            <p style={{ color: GOLD, fontWeight: 700, marginBottom: 6 }}>
                                {tooltip.state}
                            </p>
                            <p style={{ color: WHITE, fontSize: 12, margin: '2px 0' }}>
                                Skill Score: <span style={{ color: GOLD }}>{tooltip.skillScore}</span>
                            </p>
                            <p style={{ color: WHITE, fontSize: 12, margin: '2px 0' }}>
                                Placement Rate: <span style={{ color: GOLD }}>{tooltip.placementRate}%</span>
                            </p>
                            <p style={{ color: WHITE, fontSize: 12, margin: '2px 0' }}>
                                Students: <span style={{ color: GOLD }}>{tooltip.studentCount.toLocaleString('en-IN')}</span>
                            </p>
                            {tooltip.criticalGaps.length > 0 && (
                                <p style={{ color: '#ef4444', fontSize: 11, marginTop: 6 }}>
                                    ⚑ {tooltip.criticalGaps.join(', ')}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Color legend */}
            <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
                {[
                    { label: '≥ 80', color: 'rgba(212,168,67,0.9)' },
                    { label: '70–79', color: 'rgba(212,168,67,0.65)' },
                    { label: '60–69', color: 'rgba(212,168,67,0.38)' },
                    { label: '< 60 Critical', color: 'rgba(239,68,68,0.55)' },
                ].map((item) => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                background: item.color,
                            }}
                        />
                        <span style={{ color: MUTED, fontSize: 11 }}>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
