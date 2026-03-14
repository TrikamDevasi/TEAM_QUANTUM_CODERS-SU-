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
    LabelList,
    Cell,
} from 'recharts';
import type { IndustryDemandData } from '../../types/charts';

interface Props {
    data: IndustryDemandData[];
    showTop?: number;
}

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

const GAP_COLORS: Record<string, string> = {
    critical: '#ef4444',
    moderate: '#f59e0b',
    stable: '#22c55e',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const d = payload[0].payload as IndustryDemandData;
        return (
            <div
                style={{
                    background: 'rgba(15, 15, 25, 0.95)',
                    border: `1px solid ${GOLD}`,
                    borderRadius: '8px',
                    padding: '12px 16px',
                    minWidth: '220px',
                }}
            >
                <p style={{ color: GOLD, fontWeight: 700, marginBottom: 8 }}>{d.skill}</p>
                <p style={{ color: WHITE, fontSize: 12, margin: '3px 0' }}>
                    Domain: <span style={{ color: MUTED }}>{d.domain}</span>
                </p>
                <p style={{ color: WHITE, fontSize: 12, margin: '3px 0' }}>
                    Current: <span style={{ color: GOLD }}>{d.currentDemand.toLocaleString('en-IN')}</span>
                </p>
                <p style={{ color: WHITE, fontSize: 12, margin: '3px 0' }}>
                    2026 Forecast:{' '}
                    <span style={{ color: GOLD }}>{d.projectedDemand2026.toLocaleString('en-IN')}</span>
                </p>
                <p style={{ color: WHITE, fontSize: 12, margin: '3px 0' }}>
                    Growth:{' '}
                    <span style={{ color: d.growthPercent >= 0 ? '#22c55e' : '#ef4444' }}>
                        {d.growthPercent >= 0 ? '+' : ''}
                        {d.growthPercent}%
                    </span>
                </p>
                <p style={{ color: WHITE, fontSize: 12, margin: '3px 0' }}>
                    Avg Salary: <span style={{ color: GOLD }}>₹{d.avgSalary.toLocaleString('en-IN')}</span>
                </p>
                <p style={{ fontSize: 11, margin: '6px 0 0', color: GAP_COLORS[d.supplyGap] }}>
                    Supply Gap: {d.supplyGap.toUpperCase()}
                </p>
            </div>
        );
    }
    return null;
};

export default function IndustryDemandBar({ data, showTop = 10 }: Props) {
    const sorted = [...data]
        .sort((a, b) => b.currentDemand - a.currentDemand)
        .slice(0, showTop);

    return (
        <div style={{ width: '100%', height: Math.max(300, sorted.length * 40) }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={sorted}
                    layout="vertical"
                    margin={{ top: 5, right: 80, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" horizontal={false} />
                    <XAxis
                        type="number"
                        tick={{ fill: MUTED, fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) =>
                            v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`
                        }
                    />
                    <YAxis
                        type="category"
                        dataKey="skill"
                        width={160}
                        tick={{ fill: MUTED, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="currentDemand" radius={[0, 4, 4, 0]} maxBarSize={22}>
                        {sorted.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={GOLD} fillOpacity={0.85} />
                        ))}
                        <LabelList
                            dataKey="currentDemand"
                            position="right"
                            formatter={(v: number) =>
                                v >= 1000 ? `${(v / 1000).toFixed(0)}K` : `${v}`
                            }
                            style={{ fill: MUTED, fontSize: 11 }}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
