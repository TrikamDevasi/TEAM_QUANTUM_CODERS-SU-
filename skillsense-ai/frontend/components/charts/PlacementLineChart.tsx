'use client';

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Dot,
} from 'recharts';
import type { PlacementData } from '../../types/charts';

interface Props {
    data: PlacementData[];
}

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const d = payload[0].payload as PlacementData;
        return (
            <div
                style={{
                    background: 'rgba(15, 15, 25, 0.95)',
                    border: `1px solid ${GOLD}`,
                    borderRadius: '8px',
                    padding: '12px 16px',
                    minWidth: '200px',
                }}
            >
                <p style={{ color: GOLD, fontWeight: 700, marginBottom: 8 }}>{label}</p>
                <p style={{ color: WHITE, fontSize: 13, margin: '3px 0' }}>
                    Placed: <span style={{ color: GOLD }}>{d.placedCount}</span>
                </p>
                <p style={{ color: WHITE, fontSize: 13, margin: '3px 0' }}>
                    Avg Salary: <span style={{ color: GOLD }}>₹{d.avgSalary.toLocaleString('en-IN')}</span>
                </p>
                <p style={{ color: WHITE, fontSize: 13, margin: '3px 0' }}>
                    Rate: <span style={{ color: GOLD }}>{d.placementRate}%</span>
                </p>
                <p style={{ color: MUTED, fontSize: 12, margin: '3px 0' }}>
                    Top: {d.topSector} • Female {d.femalePercent}%
                </p>
            </div>
        );
    }
    return null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GoldDot = (props: any) => {
    const { cx, cy } = props;
    return <Dot cx={cx} cy={cy} r={4} fill={GOLD} stroke="rgba(212,168,67,0.4)" strokeWidth={3} />;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GoldActiveDot = (props: any) => {
    const { cx, cy } = props;
    return (
        <g>
            <circle cx={cx} cy={cy} r={10} fill="rgba(212,168,67,0.2)" />
            <circle cx={cx} cy={cy} r={6} fill={GOLD} />
            <circle cx={cx} cy={cy} r={3} fill={WHITE} />
        </g>
    );
};

export default function PlacementLineChart({ data }: Props) {
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                    <defs>
                        <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={GOLD} stopOpacity={0.35} />
                            <stop offset="95%" stopColor={GOLD} stopOpacity={0.02} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: MUTED, fontSize: 11 }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: MUTED, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${v}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="placedCount"
                        stroke={GOLD}
                        strokeWidth={2.5}
                        fill="url(#goldGradient)"
                        dot={<GoldDot />}
                        activeDot={<GoldActiveDot />}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
