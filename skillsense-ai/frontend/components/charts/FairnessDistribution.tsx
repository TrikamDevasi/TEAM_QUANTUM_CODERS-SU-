'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    ReferenceLine,
} from 'recharts';
import type { FairnessMetrics } from '../../types/charts';

interface Props {
    data: FairnessMetrics;
}

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';
const WARN = '#ef4444';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const gap = Math.abs(
            (payload[0]?.value ?? 0) - (payload[1]?.value ?? 0)
        );
        return (
            <div
                style={{
                    background: 'rgba(15, 15, 25, 0.95)',
                    border: `1px solid ${GOLD}`,
                    borderRadius: '8px',
                    padding: '10px 14px',
                    minWidth: '180px',
                }}
            >
                <p style={{ color: GOLD, fontWeight: 700, marginBottom: 6 }}>{label}</p>
                {payload.map((p: { name: string; value: number; fill: string }, i: number) => (
                    <p key={i} style={{ color: WHITE, fontSize: 13, margin: '2px 0' }}>
                        {p.name}:{' '}
                        <span style={{ color: p.fill, fontWeight: 600 }}>{p.value?.toFixed(1)}</span>
                    </p>
                ))}
                {payload.length === 2 && (
                    <p
                        style={{
                            color: gap > 10 ? WARN : gap > 5 ? '#f59e0b' : '#22c55e',
                            fontSize: 12,
                            marginTop: 6,
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            paddingTop: 6,
                        }}
                    >
                        Gap: {gap.toFixed(1)}% {gap > 10 ? '- High' : gap > 5 ? '~ Medium' : 'OK'}
                    </p>
                )}
            </div>
        );
    }
    return null;
};

export default function FairnessDistribution({ data }: Props) {
    const chartData = [
        { category: 'Male', score: data.genderGap.male, group: 'Gender' },
        { category: 'Female', score: data.genderGap.female, group: 'Gender' },
        { category: 'North', score: data.regionGap.north, group: 'Region' },
        { category: 'South', score: data.regionGap.south, group: 'Region' },
        { category: 'East', score: data.regionGap.east, group: 'Region' },
        { category: 'West', score: data.regionGap.west, group: 'Region' },
        { category: 'Central', score: data.regionGap.central, group: 'Region' },
    ];

    const avgScore =
        chartData.reduce((s, d) => s + d.score, 0) / chartData.length;

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
                    barSize={28}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
                    <XAxis
                        dataKey="category"
                        tick={{ fill: MUTED, fontSize: 12 }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        tickLine={false}
                    />
                    <YAxis
                        domain={[50, 100]}
                        tick={{ fill: MUTED, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine
                        y={avgScore}
                        stroke={WHITE}
                        strokeDasharray="4 2"
                        strokeOpacity={0.3}
                        label={{
                            value: `Avg ${avgScore.toFixed(1)}`,
                            fill: MUTED,
                            fontSize: 10,
                            position: 'insideTopRight',
                        }}
                    />
                    <Bar
                        dataKey="score"
                        radius={[4, 4, 0, 0]}
                        fill={GOLD}
                        fillOpacity={0.85}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
