'use client';

import React from 'react';
import type { SampleStudent } from '../../types/charts';
import SkillGapRadar from '../charts/SkillGapRadar';

interface Props {
    student: SampleStudent;
    industryRequirements?: { skill: string; industryReq: number }[];
}

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';
const DARK = '#0f0f18';

const STATUS_COLORS: Record<string, string> = {
    placed: '#22c55e',
    studying: '#3b82f6',
    seeking: '#f59e0b',
};

const NSQF_LABELS: Record<number, string> = {
    1: 'Level 1 – Entry',
    2: 'Level 2 – Semi-Skilled',
    3: 'Level 3 – Skilled',
    4: 'Level 4 – Advanced Skilled',
    5: 'Level 5 – Supervisory',
    6: 'Level 6 – Managerial',
};

function ScoreBadge({ score }: { score: number }) {
    const color = score >= 80 ? '#22c55e' : score >= 65 ? GOLD : '#ef4444';
    return (
        <div
            style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                border: `3px solid ${color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `rgba(${color === GOLD ? '212,168,67' : color === '#22c55e' ? '34,197,94' : '239,68,68'},0.1)`,
                flexShrink: 0,
            }}
        >
            <span style={{ color, fontSize: 14, fontWeight: 700 }}>{score}</span>
        </div>
    );
}

export default function SkillPassport({ student, industryRequirements }: Props) {
    const radarData = student.skills.map((s) => {
        const req = industryRequirements?.find((r) => r.skill === s.skill);
        return {
            skill: s.skill,
            myLevel: s.score,
            industryReq: req?.industryReq ?? 75,
        };
    });

    return (
        <div
            style={{
                background: 'linear-gradient(145deg, rgba(212,168,67,0.06) 0%, rgba(10,8,2,0.98) 100%)',
                border: `1px solid rgba(212,168,67,0.25)`,
                borderRadius: 16,
                padding: '24px',
                color: WHITE,
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: 20,
                    gap: 12,
                    flexWrap: 'wrap',
                }}
            >
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    {/* Avatar */}
                    <div
                        style={{
                            width: 52,
                            height: 52,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${GOLD}, #8b6512)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            fontSize: 20,
                            fontWeight: 700,
                            color: DARK,
                        }}
                    >
                        {student.name.charAt(0)}
                    </div>

                    {/* Info */}
                    <div>
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: WHITE }}>
                            {student.name}
                        </h3>
                        <p style={{ margin: '2px 0 0', fontSize: 13, color: MUTED }}>
                            {student.program} • {student.state}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: MUTED }}>
                            Batch {student.batch} •{' '}
                            <span style={{ color: GOLD }}>
                                {NSQF_LABELS[student.nsqfLevel] ?? `NSQF ${student.nsqfLevel}`}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Overall score + status */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <ScoreBadge score={student.overallScore} />
                    <div>
                        <p style={{ margin: 0, fontSize: 11, color: MUTED, textTransform: 'uppercase' }}>
                            Overall
                        </p>
                        <div
                            style={{
                                display: 'inline-block',
                                marginTop: 4,
                                padding: '3px 10px',
                                borderRadius: 20,
                                background: `${STATUS_COLORS[student.placementStatus]}22`,
                                border: `1px solid ${STATUS_COLORS[student.placementStatus]}`,
                                color: STATUS_COLORS[student.placementStatus],
                                fontSize: 12,
                                fontWeight: 600,
                                textTransform: 'capitalize',
                            }}
                        >
                            {student.placementStatus}
                        </div>
                    </div>
                </div>
            </div>

            {/* Placement info */}
            {student.placementStatus === 'placed' && (
                <div
                    style={{
                        display: 'flex',
                        gap: 20,
                        padding: '12px 16px',
                        background: 'rgba(34,197,94,0.06)',
                        borderRadius: 10,
                        border: '1px solid rgba(34,197,94,0.2)',
                        marginBottom: 20,
                        flexWrap: 'wrap',
                    }}
                >
                    <div>
                        <p style={{ margin: 0, fontSize: 11, color: MUTED }}>Company</p>
                        <p style={{ margin: '2px 0 0', fontSize: 14, color: WHITE, fontWeight: 600 }}>
                            {student.company}
                        </p>
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: 11, color: MUTED }}>Role</p>
                        <p style={{ margin: '2px 0 0', fontSize: 14, color: WHITE, fontWeight: 600 }}>
                            {student.role}
                        </p>
                    </div>
                    {student.salary && (
                        <div>
                            <p style={{ margin: 0, fontSize: 11, color: MUTED }}>Salary</p>
                            <p style={{ margin: '2px 0 0', fontSize: 14, color: GOLD, fontWeight: 700 }}>
                                ₹{student.salary.toLocaleString('en-IN')}/mo
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Skill bars */}
            <div style={{ marginBottom: 20 }}>
                <p
                    style={{
                        fontSize: 12,
                        color: MUTED,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: 10,
                    }}
                >
                    Skill Scores
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {student.skills.map((s) => (
                        <div key={s.skill}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: 4,
                                    fontSize: 13,
                                }}
                            >
                                <span style={{ color: WHITE }}>{s.skill}</span>
                                <span style={{ color: GOLD, fontWeight: 600 }}>{s.score}</span>
                            </div>
                            <div
                                style={{
                                    height: 4,
                                    background: 'rgba(255,255,255,0.08)',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        height: '100%',
                                        width: `${s.score}%`,
                                        background: `linear-gradient(90deg, ${GOLD}, rgba(212,168,67,0.5))`,
                                        borderRadius: 2,
                                        transition: 'width 1s ease',
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Radar chart */}
            <div>
                <p
                    style={{
                        fontSize: 12,
                        color: MUTED,
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: 8,
                    }}
                >
                    Skill Gap Analysis
                </p>
                <SkillGapRadar data={radarData} />
            </div>
        </div>
    );
}
