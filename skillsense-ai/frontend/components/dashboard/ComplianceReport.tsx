'use client';

import React from 'react';
import type { ComplianceStatus } from '../../types/charts';

interface Props {
    data?: ComplianceStatus[];
}

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

const SAMPLE_COMPLIANCE: ComplianceStatus[] = [
    {
        framework: 'NSQF Alignment (NCVET)',
        totalRequirements: 28,
        met: 24,
        partial: 3,
        notMet: 1,
        lastChecked: '2026-03-01',
        score: 88,
    },
    {
        framework: 'DGFT / MoLE Reporting',
        totalRequirements: 12,
        met: 10,
        partial: 1,
        notMet: 1,
        lastChecked: '2026-02-15',
        score: 79,
    },
    {
        framework: 'PMKVY 4.0 Guidelines',
        totalRequirements: 20,
        met: 16,
        partial: 3,
        notMet: 1,
        lastChecked: '2026-03-10',
        score: 83,
    },
    {
        framework: 'Data Privacy (IT Act)',
        totalRequirements: 10,
        met: 9,
        partial: 1,
        notMet: 0,
        lastChecked: '2026-03-05',
        score: 95,
    },
    {
        framework: 'AI Fairness Thresholds',
        totalRequirements: 8,
        met: 5,
        partial: 2,
        notMet: 1,
        lastChecked: '2026-03-12',
        score: 72,
    },
];

function ScoreGauge({ score }: { score: number }) {
    const color = score >= 90 ? '#22c55e' : score >= 75 ? GOLD : '#ef4444';
    return (
        <div
            style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                border: `3px solid ${color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `${color}18`,
                flexShrink: 0,
            }}
        >
            <span style={{ fontSize: 12, fontWeight: 700, color }}>{score}</span>
        </div>
    );
}

export default function ComplianceReport({ data }: Props) {
    const items = data ?? SAMPLE_COMPLIANCE;
    const avgScore = Math.round(items.reduce((s, i) => s + i.score, 0) / items.length);

    return (
        <div>
            {/* Overall score */}
            <div
                style={{
                    display: 'flex',
                    gap: 16,
                    alignItems: 'center',
                    padding: '14px 18px',
                    background: 'rgba(212,168,67,0.07)',
                    border: '1px solid rgba(212,168,67,0.25)',
                    borderRadius: 12,
                    marginBottom: 16,
                }}
            >
                <div
                    style={{
                        fontSize: 36,
                        fontWeight: 800,
                        color: avgScore >= 85 ? '#22c55e' : avgScore >= 70 ? GOLD : '#ef4444',
                    }}
                >
                    {avgScore}
                </div>
                <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: WHITE }}>
                        Overall Compliance Score
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: MUTED }}>
                        Across {items.length} regulatory frameworks
                    </p>
                </div>
            </div>

            {/* Framework rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {items.map((item) => (
                    <div
                        key={item.framework}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: 10,
                            padding: '14px 16px',
                        }}
                    >
                        <div
                            style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}
                        >
                            <ScoreGauge score={item.score} />
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: WHITE }}>
                                    {item.framework}
                                </p>
                                <p style={{ margin: '2px 0 0', fontSize: 11, color: MUTED }}>
                                    Last checked: {new Date(item.lastChecked).toLocaleDateString('en-IN')}
                                </p>
                            </div>
                        </div>

                        {/* Segment bar */}
                        <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', gap: 1 }}>
                            <div
                                style={{
                                    flex: item.met,
                                    background: '#22c55e',
                                    transition: 'flex 0.5s',
                                }}
                            />
                            <div
                                style={{
                                    flex: item.partial,
                                    background: GOLD,
                                    transition: 'flex 0.5s',
                                }}
                            />
                            <div
                                style={{
                                    flex: item.notMet,
                                    background: '#ef4444',
                                    transition: 'flex 0.5s',
                                }}
                            />
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                            {[
                                { label: 'Met', count: item.met, color: '#22c55e' },
                                { label: 'Partial', count: item.partial, color: GOLD },
                                { label: 'Not Met', count: item.notMet, color: '#ef4444' },
                            ].map((seg) => (
                                <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <div
                                        style={{ width: 8, height: 8, borderRadius: 2, background: seg.color }}
                                    />
                                    <span style={{ fontSize: 11, color: MUTED }}>
                                        {seg.label}: {seg.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
