'use client';

import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area,
} from 'recharts';

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

const stateData = [
    { state: 'Maharashtra', employed: 74, score: 78 },
    { state: 'Karnataka', employed: 78, score: 80 },
    { state: 'Tamil Nadu', employed: 75, score: 76 },
    { state: 'Delhi', employed: 80, score: 82 },
    { state: 'Telangana', employed: 76, score: 77 },
    { state: 'Gujarat', employed: 72, score: 74 },
];

const sectorDemand = [
    { sector: 'Software Dev', demand: 420, supply: 280 },
    { sector: 'Cloud / DevOps', demand: 280, supply: 140 },
    { sector: 'AI / Data Science', demand: 240, supply: 95 },
    { sector: 'Cybersecurity', demand: 195, supply: 80 },
    { sector: 'FinTech', demand: 180, supply: 110 },
];

const forecastData = [
    { year: '2025', demand: 1.8, supply: 1.5 },
    { year: '2026', demand: 2.2, supply: 1.7 },
    { year: '2027', demand: 2.7, supply: 2.0 },
    { year: '2028', demand: 3.1, supply: 2.3 },
    { year: '2029', demand: 3.6, supply: 2.5 },
];

const programEffectiveness = [
    { program: 'Full-Stack Bootcamp', enrolled: 42000, completed: 36000, employed: 78 },
    { program: 'Cloud Certification', enrolled: 28000, completed: 22000, employed: 72 },
    { program: 'AI/ML Training', enrolled: 35000, completed: 28000, employed: 68 },
    { program: 'NSDC Digital Skills', enrolled: 65000, completed: 58000, employed: 81 },
    { program: 'Cybersecurity Program', enrolled: 19000, completed: 15000, employed: 74 },
];

const topDemandSkills = ['React / Next.js', 'Python / Django', 'AWS Cloud', 'Docker & K8s', 'Data Science', 'Cybersecurity', 'Generative AI'];

export default function GovernmentPage() {
    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>National Skill Intelligence</h1>
                <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Ministry of Skill Development — Workforce Analytics Platform</p>
            </div>

            {/* KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                {[
                    { label: 'Total Students Tracked', value: '4.2M', color: AMBER, change: '+8.2%', up: true },
                    { label: 'Employment Rate', value: '68.4%', color: '#22c55e', change: '+2.1%', up: true },
                    { label: 'Skill Gap Index', value: '32.1%', color: '#ef4444', change: '-1.8%', up: false },
                    { label: 'States Covered', value: '28', color: GOLD, change: '+3', up: true },
                ].map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                            <div style={{ width: 4, height: 28, borderRadius: 2, background: stat.color }} />
                            <span style={{ fontSize: 11, fontWeight: 600, color: stat.up ? '#22c55e' : '#ef4444' }}>
                                {stat.change}
                            </span>
                        </div>
                        <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{stat.value}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* State bar chart */}
            <div className="stat-card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 4, height: 18, borderRadius: 2, background: AMBER }} />
                    <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>State-wise Employment and Skill Scores</h3>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={stateData} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,168,67,0.07)" />
                        <XAxis dataKey="state" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<Tip />} />
                        <Bar dataKey="employed" fill={AMBER} radius={[4, 4, 0, 0]} name="Employment %" />
                        <Bar dataKey="score" fill="rgba(245,158,11,0.25)" radius={[4, 4, 0, 0]} name="Skill Score" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Sector demand + Forecast */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <div style={{ width: 4, height: 18, borderRadius: 2, background: ORANGE }} />
                        <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Sector Demand vs Supply (2025)</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={sectorDemand} layout="vertical" barSize={11}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,168,67,0.07)" horizontal={false} />
                            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                            <YAxis dataKey="sector" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} width={100} />
                            <Tooltip content={<Tip />} />
                            <Bar dataKey="demand" fill={AMBER} radius={[0, 4, 4, 0]} name="Demand (K)" />
                            <Bar dataKey="supply" fill="rgba(245,158,11,0.25)" radius={[0, 4, 4, 0]} name="Supply (K)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                        <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Workforce Demand Forecast 2025–2029</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={forecastData}>
                            <defs>
                                <linearGradient id="demG" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={AMBER} stopOpacity={0.30} />
                                    <stop offset="95%" stopColor={AMBER} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="supG" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={GOLD} stopOpacity={0.22} />
                                    <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,168,67,0.07)" />
                            <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<Tip />} />
                            <Area type="monotone" dataKey="demand" stroke={AMBER} fill="url(#demG)" strokeWidth={2} name="Demand (M)" />
                            <Area type="monotone" dataKey="supply" stroke={GOLD} fill="url(#supG)" strokeWidth={2} name="Supply (M)" />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                        {[{ label: 'Demand', color: AMBER }, { label: 'Supply', color: GOLD }].map(l => (
                            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 12, height: 3, background: l.color, borderRadius: 2 }} />
                                <span style={{ fontSize: 11, color: '#64748b' }}>{l.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Program effectiveness */}
            <div className="stat-card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                    <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Training Program Effectiveness</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(212,168,67,0.1)' }}>
                            {['Program', 'Enrolled', 'Completed', 'Employed %', 'Effectiveness'].map(h => (
                                <th key={h} style={{ textAlign: 'left', fontSize: 11, color: '#64748b', padding: '8px 20px 8px 0', fontWeight: 600 }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {programEffectiveness.map((prog, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(212,168,67,0.05)', transition: 'background 0.15s' }}
                                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(212,168,67,0.03)')}
                                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                                <td style={{ padding: '12px 20px 12px 0', fontSize: 13, fontWeight: 600, color: '#fff' }}>{prog.program}</td>
                                <td style={{ padding: '12px 20px 12px 0', fontSize: 13, color: '#64748b' }}>{(prog.enrolled / 1000).toFixed(0)}K</td>
                                <td style={{ padding: '12px 20px 12px 0', fontSize: 13, color: '#64748b' }}>{(prog.completed / 1000).toFixed(0)}K</td>
                                <td style={{ padding: '12px 20px 12px 0' }}>
                                    <span className="font-display" style={{ fontSize: 13, fontWeight: 700, color: prog.employed >= 70 ? '#22c55e' : AMBER }}>{prog.employed}%</span>
                                </td>
                                <td style={{ padding: '12px 20px 12px 0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 80, height: 6, background: 'rgba(212,168,67,0.07)', borderRadius: 3, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${prog.employed}%`, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_L})`, borderRadius: 3 }} />
                                        </div>
                                        <span style={{ fontSize: 11, color: '#64748b' }}>{prog.employed >= 70 ? 'Good' : 'Fair'}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Top demand skills */}
            <div className="stat-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                    <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>National Top Demand Skills</h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {topDemandSkills.map((skill, i) => (
                        <div key={i} className="glass" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 99 }}>
                            <span className="font-display" style={{ fontSize: 12, color: '#64748b', fontWeight: 700 }}>#{i + 1}</span>
                            <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 600 }}>{skill}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
