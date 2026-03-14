'use client';

import React from 'react';
import {
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Legend,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import type { SkillGapEntry } from '../../types/charts';

interface Props {
    data: SkillGapEntry[];
}

const GOLD = '#D4A843';
const WHITE = '#FFFFFF';
const MUTED = '#A0A0A0';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    background: 'rgba(15, 15, 25, 0.95)',
                    border: `1px solid ${GOLD}`,
                    borderRadius: '8px',
                    padding: '10px 14px',
                    minWidth: '160px',
                }}
            >
                <p style={{ color: GOLD, fontWeight: 700, marginBottom: 4 }}>{label}</p>
                {payload.map((entry: { name: string; value: number; color: string }, i: number) => (
                    <p key={i} style={{ color: entry.color, margin: '2px 0', fontSize: 13 }}>
                        {entry.name}: <span style={{ color: WHITE, fontWeight: 600 }}>{entry.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function SkillGapRadar({ data }: Props) {
    return (
        <div style={{ width: '100%', height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <defs>
                        <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={GOLD} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                        </radialGradient>
                    </defs>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis
                        dataKey="skill"
                        tick={{ fill: MUTED, fontSize: 11, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{ fill: MUTED, fontSize: 10 }}
                        axisLine={false}
                    />
                    <Radar
                        name="My Level"
                        dataKey="myLevel"
                        stroke={GOLD}
                        fill={GOLD}
                        fillOpacity={0.2}
                        strokeWidth={2}
                        dot={{ fill: GOLD, r: 3 }}
                    />
                    <Radar
                        name="Industry Req"
                        dataKey="industryReq"
                        stroke={WHITE}
                        fill="transparent"
                        strokeWidth={1.5}
                        strokeDasharray="5 3"
                        dot={{ fill: WHITE, r: 2 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        iconType="circle"
                        iconSize={10}
                        wrapperStyle={{ color: MUTED, fontSize: 12, paddingTop: 8 }}
                        formatter={(value) => (
                            <span style={{ color: value === 'My Level' ? GOLD : WHITE }}>{value}</span>
                        )}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
