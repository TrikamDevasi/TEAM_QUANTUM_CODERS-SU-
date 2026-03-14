'use client';

import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
} from 'recharts';
import { sampleEmployers, samplePlacementRecords, sampleInternshipFeedback, sampleSkillValidations } from '../../../data/sampleEmployers';

const GOLD = '#D4A843';
const GOLD_L = '#F0C05A';
const AMBER = '#F59E0B';
const CYAN = '#06b6d4';

const Tip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="glass-bright" style={{ padding: '8px 12px', borderRadius: 10, fontSize: 12 }}>
            <p style={{ color: '#94a3b8', marginBottom: 4 }}>{label}</p>
            {payload.map((p: any, i: number) => (
                <p key={i} style={{ color: CYAN, fontWeight: 700 }}>{p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</p>
            ))}
        </div>
    );
};

const activeEmployers = sampleEmployers.filter(e => e.status === 'active');
const totalHired = samplePlacementRecords.length;
const totalValidated = sampleSkillValidations.filter(v => v.isVerified).length;
const avgSalary = Math.round(samplePlacementRecords.reduce((s, r) => s + r.salary, 0) / samplePlacementRecords.length);
const hireRate = Math.round((sampleInternshipFeedback.filter(f => f.wouldHire).length / sampleInternshipFeedback.length) * 100);

// Company hired chart
const companyHires = Array.from(new Set(samplePlacementRecords.map(r => r.companyName))).map(c => ({
    company: c.length > 14 ? c.slice(0, 14) + '…' : c,
    hires: samplePlacementRecords.filter(r => r.companyName === c).length,
})).sort((a, b) => b.hires - a.hires);

// Source pie
const sourceData = [
    { name: 'Campus Drive', value: samplePlacementRecords.filter(r => r.source === 'campus-drive').length, color: CYAN },
    { name: 'Referral', value: samplePlacementRecords.filter(r => r.source === 'referral').length, color: GOLD },
    { name: 'Direct', value: samplePlacementRecords.filter(r => r.source === 'direct-application').length, color: AMBER },
    { name: 'Off-Campus', value: samplePlacementRecords.filter(r => r.source === 'off-campus').length, color: '#a78bfa' },
];

export default function EmployerDashboardPage() {
    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>
                    Employer <span style={{ color: CYAN }}>Portal</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                    Manage partnerships, validate skills, and track placements
                </p>
            </div>

            {/* KPI Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 20 }}>
                {[
                    { label: 'Active Partners', value: activeEmployers.length, color: CYAN },
                    { label: 'Students Hired', value: totalHired, color: '#22c55e' },
                    { label: 'Skills Validated', value: totalValidated, color: GOLD },
                    { label: 'Avg Salary', value: `Rs. ${avgSalary.toLocaleString()}`, color: AMBER },
                    { label: 'Hire Rate', value: `${hireRate}%`, color: '#a78bfa' },
                ].map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div style={{ width: 4, height: 28, borderRadius: 2, background: stat.color, marginBottom: 14 }} />
                        <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{stat.value}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <div style={{ width: 4, height: 18, borderRadius: 2, background: CYAN }} />
                        <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Hires by Company</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={companyHires} barSize={18}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.07)" />
                            <XAxis dataKey="company" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<Tip />} />
                            <Bar dataKey="hires" radius={[4, 4, 0, 0]} fill={CYAN} fillOpacity={0.85} name="Hires" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                        <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Placement Source</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={sourceData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                                {sourceData.map((d, i) => <Cell key={i} fill={d.color} />)}
                            </Pie>
                            <Tooltip content={<Tip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8 }}>
                        {sourceData.map(d => (
                            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                                <span style={{ fontSize: 11, color: '#64748b' }}>{d.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Partner Companies */}
            <div className="stat-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 4, height: 18, borderRadius: 2, background: CYAN }} />
                    <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Partner Companies</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 12 }}>
                    {sampleEmployers.map(emp => (
                        <div key={emp.id} className="glass" style={{ padding: '16px', borderRadius: 12, transition: 'border-color 0.2s', cursor: 'pointer' }}
                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(6,182,212,0.3)')}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.1)')}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                <div>
                                    <div className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{emp.companyName}</div>
                                    <div style={{ fontSize: 12, color: '#64748b' }}>{emp.industry} · {emp.location}</div>
                                </div>
                                <span style={{
                                    fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                                    background: emp.status === 'active' ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                                    color: emp.status === 'active' ? '#22c55e' : '#ef4444',
                                }}>{emp.status}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#94a3b8' }}>
                                <span>{emp.studentsHired} hired</span>
                                <span>{emp.openPositions} open</span>
                                <span style={{ color: GOLD }}>{emp.avgRating.toFixed(1)} rating</span>
                            </div>
                            <div style={{ marginTop: 8, fontSize: 11, color: '#475569' }}>
                                Contact: {emp.contactPerson}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
