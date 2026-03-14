'use client';

import React, { useState } from 'react';

interface CohortHeatmapProps {
    data: {
        cohort: string;
        skills: { skill: string; score: number }[];
    }[];
}

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

function getColor(score: number): string {
    if (score >= 80) return 'rgba(212, 168, 67, 0.85)';
    if (score >= 65) return 'rgba(212, 168, 67, 0.55)';
    if (score >= 50) return 'rgba(212, 168, 67, 0.3)';
    return 'rgba(239, 68, 68, 0.4)';
}

function getTextColor(score: number): string {
    if (score >= 65) return '#1a1208';
    return WHITE;
}

export default function CohortHeatmap({ data }: CohortHeatmapProps) {
    const [hoveredCell, setHoveredCell] = useState<{ cohort: string; skill: string; score: number } | null>(null);

    if (!data.length) return null;

    const skills = data[0].skills.map((s) => s.skill);

    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
            {/* Tooltip */}
            {hoveredCell && (
                <div
                    style={{
                        background: 'rgba(15,15,25,0.95)',
                        border: `1px solid ${GOLD}`,
                        borderRadius: 8,
                        padding: '8px 12px',
                        marginBottom: 12,
                        display: 'inline-block',
                        fontSize: 13,
                    }}
                >
                    <span style={{ color: GOLD, fontWeight: 700 }}>{hoveredCell.cohort}</span>
                    {' — '}
                    <span style={{ color: WHITE }}>{hoveredCell.skill}:</span>{' '}
                    <span style={{ color: GOLD, fontWeight: 700 }}>{hoveredCell.score}</span>
                </div>
            )}

            <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12 }}>
                <thead>
                    <tr>
                        <th
                            style={{
                                padding: '8px 12px',
                                textAlign: 'left',
                                color: MUTED,
                                fontWeight: 600,
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            Cohort
                        </th>
                        {skills.map((skill) => (
                            <th
                                key={skill}
                                style={{
                                    padding: '8px 10px',
                                    textAlign: 'center',
                                    color: MUTED,
                                    fontWeight: 600,
                                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                                    whiteSpace: 'nowrap',
                                    maxWidth: 90,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                                title={skill}
                            >
                                {skill.length > 12 ? skill.slice(0, 10) + '…' : skill}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.cohort}>
                            <td
                                style={{
                                    padding: '7px 12px',
                                    color: WHITE,
                                    fontWeight: 500,
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {row.cohort}
                            </td>
                            {row.skills.map((cell) => (
                                <td
                                    key={cell.skill}
                                    style={{
                                        padding: '7px 10px',
                                        textAlign: 'center',
                                        background: getColor(cell.score),
                                        color: getTextColor(cell.score),
                                        fontWeight: 600,
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: 4,
                                        cursor: 'pointer',
                                        transition: 'transform 0.15s',
                                        transform: hoveredCell?.cohort === row.cohort && hoveredCell?.skill === cell.skill ? 'scale(1.1)' : 'scale(1)',
                                    }}
                                    onMouseEnter={() => setHoveredCell({ cohort: row.cohort, skill: cell.skill, score: cell.score })}
                                    onMouseLeave={() => setHoveredCell(null)}
                                >
                                    {cell.score}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                {[
                    { label: '≥ 80 (Excellent)', color: 'rgba(212, 168, 67, 0.85)' },
                    { label: '65–79 (Good)', color: 'rgba(212, 168, 67, 0.55)' },
                    { label: '50–64 (Fair)', color: 'rgba(212, 168, 67, 0.3)' },
                    { label: '< 50 (At Risk)', color: 'rgba(239, 68, 68, 0.4)' },
                ].map((item) => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div
                            style={{
                                width: 14,
                                height: 14,
                                background: item.color,
                                borderRadius: 3,
                            }}
                        />
                        <span style={{ color: MUTED, fontSize: 11 }}>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
