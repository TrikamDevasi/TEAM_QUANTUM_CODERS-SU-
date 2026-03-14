'use client';

import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { sampleIndustryDemand } from '../../../data/sampleIndustryDemand';

const GOLD = '#D4A843';
const GOLD_L = '#F0C05A';
const AMBER = '#F59E0B';

const Tip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="glass-bright" style={{ padding: '8px 12px', borderRadius: 10, fontSize: 12 }}>
            <p style={{ color: '#94a3b8', marginBottom: 4 }}>{label}</p>
            {payload.map((p: any, i: number) => (
                <p key={i} style={{ color: GOLD, fontWeight: 700 }}>{p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</p>
            ))}
        </div>
    );
};

const critical = sampleIndustryDemand.filter(d => d.supplyGap === 'critical');
const totalJobs = sampleIndustryDemand.reduce((s, d) => s + d.currentDemand, 0);
const avgSalary = Math.round(sampleIndustryDemand.reduce((s, d) => s + d.avgSalary, 0) / sampleIndustryDemand.length);

const top10 = [...sampleIndustryDemand].sort((a, b) => b.currentDemand - a.currentDemand).slice(0, 10).map(d => ({
    skill: d.skill.length > 18 ? d.skill.slice(0, 18) + '…' : d.skill,
    demand: d.currentDemand / 1000,
}));

const gapColor: Record<string, string> = { critical: '#ef4444', moderate: AMBER, stable: '#22c55e' };

export default function IndustryOverviewPage() {
    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>
                    Industry <span style={{ color: GOLD }}>Intelligence</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>Skill demand signals, talent pipeline and hiring analytics</p>
            </div>

            {/* KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                {[
                    { label: 'Total Skill Demand', value: totalJobs.toLocaleString(), color: GOLD, sub: '+18% vs last period' },
                    { label: 'Critical Gaps', value: `${critical.length} skills`, color: '#ef4444', sub: 'Requires attention' },
                    { label: 'Tracked Domains', value: `${sampleIndustryDemand.length}`, color: AMBER, sub: 'Across sectors' },
                    { label: 'Avg Salary', value: `Rs. ${avgSalary.toLocaleString()}`, color: '#22c55e', sub: '+7% growth' },
                ].map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div style={{ width: 4, height: 28, borderRadius: 2, background: stat.color, marginBottom: 14 }} />
                        <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{stat.value}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>{stat.label}</div>
                        <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>{stat.sub}</div>
                    </div>
                ))}
            </div>

            {/* Demand bar chart */}
            <div className="stat-card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                    <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Current Skill Demand — Top 10</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={top10} layout="vertical" barSize={14}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,168,67,0.07)" horizontal={false} />
                        <XAxis type="number" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis dataKey="skill" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} width={130} />
                        <Tooltip content={<Tip />} />
                        <Bar dataKey="demand" radius={[0, 4, 4, 0]} fill={GOLD} fillOpacity={0.85} name="Demand (K)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Supply gap table */}
            <div className="stat-card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 4, height: 18, borderRadius: 2, background: AMBER }} />
                    <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Skill Supply Gap Overview</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(212,168,67,0.1)' }}>
                            {['Skill', 'Domain', 'Demand Now', '2026 Projected', 'Growth', 'Gap Status'].map(h => (
                                <th key={h} style={{ textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', padding: '8px 16px 8px 0' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sampleIndustryDemand.slice(0, 8).map((d, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(212,168,67,0.05)', transition: 'background 0.15s' }}
                                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(212,168,67,0.03)')}
                                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                                <td style={{ padding: '12px 16px 12px 0', fontSize: 13, fontWeight: 600, color: '#fff' }}>{d.skill}</td>
                                <td style={{ padding: '12px 16px 12px 0', fontSize: 13, color: '#64748b' }}>{d.domain}</td>
                                <td style={{ padding: '12px 16px 12px 0', fontSize: 13, color: '#94a3b8' }}>{(d.currentDemand / 1000).toFixed(0)}K</td>
                                <td style={{ padding: '12px 16px 12px 0', fontSize: 13, color: '#94a3b8' }}>{(d.projectedDemand2026 / 1000).toFixed(0)}K</td>
                                <td style={{ padding: '12px 16px 12px 0' }}>
                                    <span className="font-display" style={{ fontSize: 13, fontWeight: 700, color: d.growthPercent >= 0 ? '#22c55e' : '#ef4444' }}>
                                        {d.growthPercent >= 0 ? '+' : ''}{d.growthPercent}%
                                    </span>
                                </td>
                                <td style={{ padding: '12px 16px 12px 0' }}>
                                    <span style={{
                                        fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                                        background: `${gapColor[d.supplyGap]}14`,
                                        color: gapColor[d.supplyGap],
                                    }}>{d.supplyGap.charAt(0).toUpperCase() + d.supplyGap.slice(1)}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Critical gap alerts */}
            <div className="stat-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 4, height: 18, borderRadius: 2, background: '#ef4444' }} />
                    <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Critical Supply Gaps</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                    {critical.map(d => (
                        <div key={d.skill} className="glass" style={{ padding: '14px 16px', borderRadius: 10, borderColor: 'rgba(239,68,68,0.2)' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{d.skill}</div>
                            <div style={{ fontSize: 12, color: '#64748b' }}>{d.domain}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                                <span className="font-display" style={{ fontSize: 15, fontWeight: 800, color: '#ef4444' }}>+{d.growthPercent}%</span>
                                <span style={{ fontSize: 11, color: '#64748b' }}>Rs. {d.avgSalary.toLocaleString()}/mo</span>
                            </div>
                            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                {d.topHiringCompanies.slice(0, 2).map(c => (
                                    <span key={c} style={{ fontSize: 10, color: '#475569', background: 'rgba(212,168,67,0.08)', padding: '2px 8px', borderRadius: 99 }}>{c}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
