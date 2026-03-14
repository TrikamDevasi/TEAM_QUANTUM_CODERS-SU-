'use client';

import React, { useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { samplePlacementRecords } from '../../../../data/sampleEmployers';

const GOLD = '#D4A843';
const GOLD_L = '#F0C05A';
const CYAN = '#06b6d4';
const AMBER = '#F59E0B';

const statusColors: Record<string, string> = {
    confirmed: '#22c55e', active: CYAN, probation: AMBER, resigned: '#ef4444',
};

const sourceLabels: Record<string, string> = {
    'campus-drive': 'Campus Drive', 'referral': 'Referral',
    'direct-application': 'Direct', 'off-campus': 'Off-Campus',
};

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

// Monthly placement trend
const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const trendData = months.map(m => ({
    month: m,
    placements: samplePlacementRecords.filter(r => {
        const d = new Date(r.joiningDate);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthNames[d.getMonth()] === m;
    }).length,
}));

export default function PlacementsPage() {
    const [filter, setFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);

    const filtered = filter === 'all' ? samplePlacementRecords
        : samplePlacementRecords.filter(r => r.status === filter);

    const totalSalary = samplePlacementRecords.reduce((s, r) => s + r.salary, 0);
    const avgSalary = Math.round(totalSalary / samplePlacementRecords.length);
    const maxSalary = Math.max(...samplePlacementRecords.map(r => r.salary));
    const confirmedCount = samplePlacementRecords.filter(r => r.status === 'confirmed').length;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormSuccess(true);
        setTimeout(() => { setFormSuccess(false); setShowForm(false); }, 2000);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                    <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>
                        Placement <span style={{ color: CYAN }}>Tracking</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                        Monitor job placements, salaries, and hiring outcomes
                    </p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ fontSize: 13 }}>
                    {showForm ? 'Cancel' : 'Add Placement'}
                </button>
            </div>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                {[
                    { label: 'Total Placements', value: samplePlacementRecords.length, color: CYAN },
                    { label: 'Confirmed', value: confirmedCount, color: '#22c55e' },
                    { label: 'Avg Salary', value: `Rs. ${avgSalary.toLocaleString()}`, color: GOLD },
                    { label: 'Highest Salary', value: `Rs. ${maxSalary.toLocaleString()}`, color: '#a78bfa' },
                ].map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div style={{ width: 4, height: 28, borderRadius: 2, background: stat.color, marginBottom: 14 }} />
                        <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{stat.value}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Trend chart */}
            <div className="stat-card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 4, height: 18, borderRadius: 2, background: CYAN }} />
                    <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Monthly Placement Trend</h3>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={trendData}>
                        <defs>
                            <linearGradient id="placementG" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CYAN} stopOpacity={0.28} />
                                <stop offset="95%" stopColor={CYAN} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.07)" />
                        <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<Tip />} />
                        <Area type="monotone" dataKey="placements" stroke={CYAN} fill="url(#placementG)" strokeWidth={2.5}
                            dot={{ fill: CYAN, r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: CYAN }} name="Placements" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Add form */}
            {showForm && (
                <div className="stat-card" style={{ marginBottom: 20, borderColor: 'rgba(6,182,212,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                        <div style={{ width: 4, height: 18, borderRadius: 2, background: CYAN }} />
                        <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Record New Placement</h3>
                    </div>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                            {[
                                { label: 'Student Name', placeholder: 'Arjun Mehta', type: 'text' },
                                { label: 'Company', placeholder: 'Infosys', type: 'text' },
                                { label: 'Role', placeholder: 'Software Developer', type: 'text' },
                            ].map(f => (
                                <div key={f.label}>
                                    <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>{f.label}</label>
                                    <input required type={f.type} placeholder={f.placeholder} style={{
                                        width: '100%', padding: '10px 14px', borderRadius: 10,
                                        border: '1px solid rgba(6,182,212,0.15)', background: 'rgba(6,182,212,0.03)',
                                        color: '#fff', fontSize: 13, outline: 'none',
                                    }} />
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                            <div>
                                <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Salary (Rs./mo)</label>
                                <input required type="number" placeholder="45000" style={{
                                    width: '100%', padding: '10px 14px', borderRadius: 10,
                                    border: '1px solid rgba(6,182,212,0.15)', background: 'rgba(6,182,212,0.03)',
                                    color: '#fff', fontSize: 13, outline: 'none',
                                }} />
                            </div>
                            <div>
                                <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Location</label>
                                <input type="text" placeholder="Bangalore" style={{
                                    width: '100%', padding: '10px 14px', borderRadius: 10,
                                    border: '1px solid rgba(6,182,212,0.15)', background: 'rgba(6,182,212,0.03)',
                                    color: '#fff', fontSize: 13, outline: 'none',
                                }} />
                            </div>
                            <div>
                                <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Type</label>
                                <select style={{
                                    width: '100%', padding: '10px 14px', borderRadius: 10,
                                    border: '1px solid rgba(6,182,212,0.15)', background: '#0d0b18',
                                    color: '#fff', fontSize: 13, outline: 'none',
                                }}>
                                    <option value="full-time">Full-Time</option>
                                    <option value="contract">Contract</option>
                                    <option value="part-time">Part-Time</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Source</label>
                                <select style={{
                                    width: '100%', padding: '10px 14px', borderRadius: 10,
                                    border: '1px solid rgba(6,182,212,0.15)', background: '#0d0b18',
                                    color: '#fff', fontSize: 13, outline: 'none',
                                }}>
                                    <option value="campus-drive">Campus Drive</option>
                                    <option value="referral">Referral</option>
                                    <option value="direct-application">Direct Application</option>
                                    <option value="off-campus">Off-Campus</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                            {formSuccess ? (
                                <><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} /> Placement Recorded</>
                            ) : 'Record Placement'}
                        </button>
                    </form>
                </div>
            )}

            {/* Filter */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {['all', 'confirmed', 'probation', 'active'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                        padding: '6px 14px', borderRadius: 8,
                        border: `1px solid ${filter === f ? 'rgba(6,182,212,0.38)' : 'transparent'}`,
                        background: filter === f ? 'rgba(6,182,212,0.1)' : 'transparent',
                        color: filter === f ? CYAN : '#64748b',
                        fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif',
                    }}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="stat-card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(212,168,67,0.1)' }}>
                            {['Student', 'Company', 'Role', 'Salary', 'Location', 'Type', 'Source', 'Status'].map(h => (
                                <th key={h} style={{ textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', padding: '8px 10px 8px 0' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(r => (
                            <tr key={r.id} style={{ borderBottom: '1px solid rgba(212,168,67,0.05)', transition: 'background 0.15s' }}
                                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(6,182,212,0.03)')}
                                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                                <td style={{ padding: '12px 10px 12px 0', fontSize: 13, fontWeight: 600, color: '#fff' }}>{r.studentName}</td>
                                <td style={{ padding: '12px 10px 12px 0', fontSize: 13, color: CYAN, fontWeight: 600 }}>{r.companyName}</td>
                                <td style={{ padding: '12px 10px 12px 0', fontSize: 13, color: '#94a3b8' }}>{r.role}</td>
                                <td style={{ padding: '12px 10px 12px 0' }}>
                                    <span className="font-display" style={{ fontSize: 13, fontWeight: 700, color: GOLD }}>Rs. {r.salary.toLocaleString()}</span>
                                </td>
                                <td style={{ padding: '12px 10px 12px 0', fontSize: 12, color: '#64748b' }}>{r.location}</td>
                                <td style={{ padding: '12px 10px 12px 0' }}>
                                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: 'rgba(212,168,67,0.08)', color: '#94a3b8' }}>
                                        {r.type}
                                    </span>
                                </td>
                                <td style={{ padding: '12px 10px 12px 0', fontSize: 12, color: '#64748b' }}>
                                    {sourceLabels[r.source]}
                                </td>
                                <td style={{ padding: '12px 0' }}>
                                    <span style={{
                                        fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                                        background: `${statusColors[r.status]}14`,
                                        color: statusColors[r.status],
                                    }}>
                                        {r.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
