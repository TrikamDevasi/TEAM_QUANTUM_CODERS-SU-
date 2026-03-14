'use client';

import React from 'react';
import type { CareerPathway } from '../../types/charts';

interface Props {
    pathway: CareerPathway;
    onSelect?: (id: string) => void;
}

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

function MatchRing({ percent }: { percent: number }) {
    const r = 22;
    const circ = 2 * Math.PI * r;
    const filled = (percent / 100) * circ;
    const color = percent >= 80 ? '#22c55e' : percent >= 60 ? GOLD : '#ef4444';

    return (
        <svg width={56} height={56} viewBox="0 0 56 56">
            <circle cx={28} cy={28} r={r} fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth={3} />
            <circle
                cx={28}
                cy={28}
                r={r}
                fill="transparent"
                stroke={color}
                strokeWidth={3}
                strokeDasharray={`${filled} ${circ - filled}`}
                strokeDashoffset={circ / 4}
                strokeLinecap="round"
            />
            <text x={28} y={33} textAnchor="middle" fill={color} fontSize={12} fontWeight={700}>
                {percent}%
            </text>
        </svg>
    );
}

export default function CareerPathwayCard({ pathway, onSelect }: Props) {
    return (
        <div
            onClick={() => onSelect?.(pathway.id)}
            style={{
                background: pathway.isRecommended
                    ? 'linear-gradient(145deg, rgba(212,168,67,0.12), rgba(10,8,2,0.97))'
                    : 'linear-gradient(145deg, rgba(255,255,255,0.03), rgba(10,8,2,0.97))',
                border: `1px solid ${pathway.isRecommended ? 'rgba(212,168,67,0.4)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 14,
                padding: '18px 20px',
                cursor: 'pointer',
                transition: 'border-color 0.2s, transform 0.2s',
                position: 'relative',
                overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,168,67,0.6)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = pathway.isRecommended
                    ? 'rgba(212,168,67,0.4)'
                    : 'rgba(255,255,255,0.1)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
            }}
        >
            {/* Recommended badge */}
            {pathway.isRecommended && (
                <div
                    style={{
                        position: 'absolute',
                        top: 12,
                        right: 16,
                        background: GOLD,
                        color: '#1a0f00',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 20,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                    }}
                >
                    ★ Recommended
                </div>
            )}

            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                {/* Match ring */}
                <div style={{ flexShrink: 0 }}>
                    <MatchRing percent={pathway.matchPercent} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: WHITE }}>
                        {pathway.title}
                    </h4>
                    <p style={{ margin: '2px 0 0', fontSize: 13, color: GOLD }}>
                        {pathway.role} @ {pathway.organization}
                    </p>

                    {/* Skills needed */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                        {pathway.requiredSkills.slice(0, 4).map((skill) => (
                            <span
                                key={skill}
                                style={{
                                    background: 'rgba(212,168,67,0.1)',
                                    border: '1px solid rgba(212,168,67,0.25)',
                                    color: GOLD,
                                    fontSize: 11,
                                    padding: '2px 8px',
                                    borderRadius: 20,
                                }}
                            >
                                {skill}
                            </span>
                        ))}
                        {pathway.requiredSkills.length > 4 && (
                            <span style={{ color: MUTED, fontSize: 11 }}>
                                +{pathway.requiredSkills.length - 4} more
                            </span>
                        )}
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            display: 'flex',
                            gap: 20,
                            marginTop: 12,
                            paddingTop: 12,
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                            flexWrap: 'wrap',
                        }}
                    >
                        <div>
                            <p style={{ margin: 0, fontSize: 10, color: MUTED, textTransform: 'uppercase' }}>
                                Salary Range
                            </p>
                            <p style={{ margin: '2px 0 0', fontSize: 13, color: WHITE, fontWeight: 600 }}>
                                ₹{(pathway.salaryRange.min / 1000).toFixed(0)}K–{(pathway.salaryRange.max / 1000).toFixed(0)}K/mo
                            </p>
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: 10, color: MUTED, textTransform: 'uppercase' }}>
                                Time to Achieve
                            </p>
                            <p style={{ margin: '2px 0 0', fontSize: 13, color: WHITE, fontWeight: 600 }}>
                                {pathway.timeToAchieve}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
