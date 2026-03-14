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
    ReferenceLine,
} from 'recharts';
import type { ForecastEntry } from '../../types/charts';

interface Props {
    data: ForecastEntry[];
    currentMonthIndex?: number; // index where forecast starts
}

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

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
                }}
            >
                <p style={{ color: GOLD, fontWeight: 700, marginBottom: 6 }}>{label}</p>
                {payload.map((p: { name: string; value: number; color: string }, i: number) => (
                    <p key={i} style={{ color: WHITE, fontSize: 13, margin: '2px 0' }}>
                        {p.name === 'actual' ? 'Actual' : 'Forecast'}:{' '}
                        <span style={{ color: GOLD, fontWeight: 600 }}>{p.value?.toFixed(1)}%</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function SkillForecastArea({ data, currentMonthIndex }: Props) {
    // Determine split index — first entry with only forecast (no actual)
    const splitIdx =
        currentMonthIndex ??
        data.findIndex((d) => d.actual === undefined && d.forecast !== undefined);

    const splitLabel = splitIdx >= 0 && splitIdx < data.length ? data[splitIdx].month : undefined;

    return (
        <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                    <defs>
                        <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={GOLD} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={GOLD} stopOpacity={0.03} />
                        </linearGradient>
                        <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={GOLD} stopOpacity={0.15} />
                            <stop offset="95%" stopColor={GOLD} stopOpacity={0.01} />
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
                        tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />

                    {splitLabel && (
                        <ReferenceLine
                            x={splitLabel}
                            stroke="rgba(212,168,67,0.4)"
                            strokeDasharray="6 3"
                            label={{
                                value: 'Forecast →',
                                fill: GOLD,
                                fontSize: 11,
                                position: 'insideTopRight',
                            }}
                        />
                    )}

                    <Area
                        type="monotone"
                        dataKey="actual"
                        stroke={GOLD}
                        strokeWidth={2.5}
                        fill="url(#actualGradient)"
                        dot={false}
                        connectNulls={false}
                    />
                    <Area
                        type="monotone"
                        dataKey="forecast"
                        stroke={GOLD}
                        strokeWidth={1.5}
                        strokeDasharray="6 3"
                        fill="url(#forecastGradient)"
                        dot={false}
                        connectNulls={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
