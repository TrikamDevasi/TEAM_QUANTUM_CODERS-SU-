'use client';

import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area,
} from 'recharts';
import { sampleInstitutions } from '../../../data/sampleInstitutions';
import { samplePlacements } from '../../../data/samplePlacements';

const inst = sampleInstitutions[0];
const GOLD = '#D4A843';
const GOLD_L = '#F0C05A';
const AMBER = '#F59E0B';
const ORANGE = '#F97316';

const Tip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="glass-bright" style={{ padding: '8px 12px', borderRadius: 10, fontSize: 12 }}>
            <p style={{ color: '#94a3b8', marginBottom: 4 }}>{label}</p>
            {payload.map((p: any, i: number) => (
                <p key={i} style={{ color: GOLD, fontWeight: 700 }}>{p.name}: {p.value}</p>
            ))}
        </div>
    );
};

const deptPerformance = [
    { dept: 'Frontend', score: 81, students: 124 },
    { dept: 'Backend', score: 73, students: 98 },
    { dept: 'DevOps', score: 68, students: 76 },
    { dept: 'Data Science', score: 88, students: 112 },
    { dept: 'Cybersecurity', score: 76, students: 89 },
];

const curriculumGaps = [
    { area: 'Cloud Computing', gap: 72, priority: 'Critical' },
    { area: 'AI / ML Basics', gap: 65, priority: 'High' },
    { area: 'Soft Skills', gap: 48, priority: 'High' },
    { area: 'Industry 4.0', gap: 55, priority: 'Medium' },
    { area: 'Data Analytics', gap: 40, priority: 'Medium' },
];

const skillDistribution = [
    { skill: 'React.js', students: 420 },
    { skill: 'Python', students: 376 },
    { skill: 'Node.js', students: 318 },
    { skill: 'AWS / Cloud', students: 294 },
    { skill: 'Docker / K8s', students: 248 },
    { skill: 'SQL Databases', students: 180 },
];

export default function InstitutePage() {
    const recentPlacements = samplePlacements.slice(-8);

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>Institute Analytics</h1>
                <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                    {inst.name} — {inst.type} · {inst.state}
                </p>
            </div>

            {/* KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                {[
                    { label: 'Total Students', value: inst.students.toLocaleString(), color: '#a78bfa' },
                    { label: 'Placement Rate', value: `${inst.placementRate}%`, color: '#22c55e' },
                    { label: 'Avg Skill Score', value: '76 / 100', color: GOLD },
                    { label: 'Employer Satisfaction', value: '91%', color: AMBER },
                ].map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div style={{ width: 4, height: 28, borderRadius: 2, background: stat.color, marginBottom: 14 }} />
                        <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{stat.value}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Charts row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                        <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Skill Distribution</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={skillDistribution} layout="vertical" barSize={12}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,168,67,0.07)" horizontal={false} />
                            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis dataKey="skill" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} width={110} />
                            <Tooltip content={<Tip />} />
                            <Bar dataKey="students" radius={[0, 4, 4, 0]} fill={GOLD} fillOpacity={0.85} name="Students" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <div style={{ width: 4, height: 18, borderRadius: 2, background: AMBER }} />
                        <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Monthly Placement Trends</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={recentPlacements}>
                            <defs>
                                <linearGradient id="placG" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={GOLD} stopOpacity={0.30} />
                                    <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,168,67,0.07)" />
                            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<Tip />} />
                            <Area type="monotone" dataKey="placedCount" stroke={GOLD} fill="url(#placG)" strokeWidth={2.5} name="Placed" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Department Heatmap */}
            <div className="stat-card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                    <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                    <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Department Performance Heatmap</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
                    {deptPerformance.map((dept, i) => (
                        <div key={i} style={{ textAlign: 'center', cursor: 'default' }}>
                            <div style={{
                                borderRadius: 12, padding: '18px 8px', marginBottom: 10,
                                transition: 'transform 0.2s',
                                background: `rgba(212,168,67,${(dept.score / 100) * 0.35 + 0.05})`,
                                border: `1px solid rgba(212,168,67,${(dept.score / 100) * 0.35})`,
                            }}
                                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.04)')}
                                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}>
                                <div className="font-display" style={{ fontSize: 28, fontWeight: 800, color: '#fff' }}>{dept.score}</div>
                                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>/100</div>
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#cbd5e1' }}>{dept.dept}</div>
                            <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{dept.students} students</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Curriculum Gaps */}
            <div className="stat-card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                    <div style={{ width: 4, height: 18, borderRadius: 2, background: ORANGE }} />
                    <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Curriculum Gaps — AI Identified</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                    {curriculumGaps.map((gap, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <span style={{ fontSize: 13, color: '#94a3b8', width: 140, flexShrink: 0 }}>{gap.area}</span>
                            <div style={{ flex: 1, height: 8, background: 'rgba(212,168,67,0.07)', borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%', width: `${gap.gap}%`, borderRadius: 4,
                                    background: gap.priority === 'Critical' ? '#ef4444' : gap.priority === 'High' ? AMBER : GOLD,
                                }} />
                            </div>
                            <span style={{ fontSize: 11, color: '#64748b', width: 28, textAlign: 'right' }}>{gap.gap}%</span>
                            <span style={{
                                fontSize: 11, padding: '3px 10px', borderRadius: 99, width: 68, textAlign: 'center', fontWeight: 700,
                                background: gap.priority === 'Critical' ? 'rgba(239,68,68,0.12)' : gap.priority === 'High' ? 'rgba(245,158,11,0.12)' : 'rgba(212,168,67,0.12)',
                                color: gap.priority === 'Critical' ? '#ef4444' : gap.priority === 'High' ? AMBER : GOLD,
                            }}>{gap.priority}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Program ROI + Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 18 }}>
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                        <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Program ROI</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {inst.programROI.map((p, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontSize: 12, color: '#94a3b8', width: 170 }}>{p.program}</span>
                                <div style={{ flex: 1, height: 7, background: 'rgba(212,168,67,0.07)', borderRadius: 3, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${Math.min(100, p.roi / 6)}%`, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_L})`, borderRadius: 3 }} />
                                </div>
                                <span className="font-display" style={{ fontSize: 13, fontWeight: 700, color: GOLD, width: 44, textAlign: 'right' }}>{p.roi}%</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 200 }}>
                    {[
                        { label: 'Employer Satisfaction', value: '91%', color: AMBER },
                        { label: 'Alumni Salary Growth', value: '2.8x', color: GOLD },
                        { label: 'NSQF Level', value: `Level ${inst.nsqfLevel}`, color: '#a78bfa' },
                    ].map((m, i) => (
                        <div key={i} className="stat-card" style={{ padding: '14px 18px' }}>
                            <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: m.color }}>{m.value}</div>
                            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{m.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
