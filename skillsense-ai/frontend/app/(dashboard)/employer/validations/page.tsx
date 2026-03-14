'use client';

import React, { useState } from 'react';
import { sampleSkillValidations } from '../../../../data/sampleEmployers';

const GOLD = '#D4A843';
const CYAN = '#06b6d4';
const AMBER = '#F59E0B';

const levelColors: Record<string, string> = {
    expert: '#22c55e', advanced: GOLD, intermediate: AMBER, beginner: '#ef4444',
};

const methodLabels: Record<string, string> = {
    'interview': 'Interview', 'project-review': 'Project Review',
    'practical-test': 'Practical Test', 'reference-check': 'Reference Check',
};

export default function SkillValidationsPage() {
    const [showForm, setShowForm] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all' ? sampleSkillValidations
        : filter === 'verified' ? sampleSkillValidations.filter(v => v.isVerified)
            : sampleSkillValidations.filter(v => !v.isVerified);

    const verifiedCount = sampleSkillValidations.filter(v => v.isVerified).length;
    const matchCount = sampleSkillValidations.filter(v => v.claimedLevel === v.validatedLevel).length;
    const upgradedCount = sampleSkillValidations.filter(v => {
        const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
        return levels.indexOf(v.validatedLevel) > levels.indexOf(v.claimedLevel);
    }).length;

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
                        Skill <span style={{ color: CYAN }}>Validation</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                        Verify and validate student skills through employer assessments
                    </p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ fontSize: 13 }}>
                    {showForm ? 'Cancel' : 'Validate Skill'}
                </button>
            </div>

            {/* KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                {[
                    { label: 'Total Validations', value: sampleSkillValidations.length, color: CYAN },
                    { label: 'Verified', value: verifiedCount, color: '#22c55e' },
                    { label: 'Level Match', value: `${Math.round((matchCount / sampleSkillValidations.length) * 100)}%`, color: GOLD },
                    { label: 'Upgraded', value: upgradedCount, color: '#a78bfa' },
                ].map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div style={{ width: 4, height: 28, borderRadius: 2, background: stat.color, marginBottom: 14 }} />
                        <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{stat.value}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Validation form */}
            {showForm && (
                <div className="stat-card" style={{ marginBottom: 20, borderColor: 'rgba(6,182,212,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                        <div style={{ width: 4, height: 18, borderRadius: 2, background: CYAN }} />
                        <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Validate a Student Skill</h3>
                    </div>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                            {[
                                { label: 'Student Name', placeholder: 'Arjun Mehta' },
                                { label: 'Skill', placeholder: 'React.js' },
                                { label: 'Verifier Name', placeholder: 'Ravi Desai' },
                            ].map(f => (
                                <div key={f.label}>
                                    <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>{f.label}</label>
                                    <input required type="text" placeholder={f.placeholder} style={{
                                        width: '100%', padding: '10px 14px', borderRadius: 10,
                                        border: '1px solid rgba(6,182,212,0.15)', background: 'rgba(6,182,212,0.03)',
                                        color: '#fff', fontSize: 13, outline: 'none',
                                    }} />
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                            {[
                                { label: 'Claimed Level', options: ['beginner', 'intermediate', 'advanced', 'expert'] },
                                { label: 'Validated Level', options: ['beginner', 'intermediate', 'advanced', 'expert'] },
                                { label: 'Method', options: ['interview', 'project-review', 'practical-test', 'reference-check'] },
                            ].map(f => (
                                <div key={f.label}>
                                    <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>{f.label}</label>
                                    <select required style={{
                                        width: '100%', padding: '10px 14px', borderRadius: 10,
                                        border: '1px solid rgba(6,182,212,0.15)', background: '#0d0b18',
                                        color: '#fff', fontSize: 13, outline: 'none',
                                    }}>
                                        {f.options.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1).replace('-', ' ')}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                        <div>
                            <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Notes (optional)</label>
                            <input type="text" placeholder="Additional notes about this validation..." style={{
                                width: '100%', padding: '10px 14px', borderRadius: 10,
                                border: '1px solid rgba(6,182,212,0.15)', background: 'rgba(6,182,212,0.03)',
                                color: '#fff', fontSize: 13, outline: 'none',
                            }} />
                        </div>
                        <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                            {formSuccess ? (
                                <><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} /> Validation Recorded</>
                            ) : 'Submit Validation'}
                        </button>
                    </form>
                </div>
            )}

            {/* Filter */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                {['all', 'verified', 'pending'].map(f => (
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

            {/* Validations table */}
            <div className="stat-card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(212,168,67,0.1)' }}>
                            {['Student', 'Skill', 'Claimed', 'Validated', 'Status', 'Method', 'Verifier', 'Date'].map(h => (
                                <th key={h} style={{ textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', padding: '8px 10px 8px 0' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(v => {
                            const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
                            const claimedIdx = levels.indexOf(v.claimedLevel);
                            const validatedIdx = levels.indexOf(v.validatedLevel);
                            const match = claimedIdx === validatedIdx;
                            const upgraded = validatedIdx > claimedIdx;

                            return (
                                <tr key={v.id} style={{ borderBottom: '1px solid rgba(212,168,67,0.05)', transition: 'background 0.15s' }}
                                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(6,182,212,0.03)')}
                                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                                    <td style={{ padding: '12px 10px 12px 0', fontSize: 13, fontWeight: 600, color: '#fff' }}>{v.studentName}</td>
                                    <td style={{ padding: '12px 10px 12px 0', fontSize: 13, color: '#94a3b8' }}>{v.skill}</td>
                                    <td style={{ padding: '12px 10px 12px 0' }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: `${levelColors[v.claimedLevel]}14`, color: levelColors[v.claimedLevel] }}>
                                            {v.claimedLevel}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 10px 12px 0' }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: `${levelColors[v.validatedLevel]}14`, color: levelColors[v.validatedLevel] }}>
                                            {v.validatedLevel}
                                        </span>
                                        {upgraded && <span style={{ fontSize: 10, color: '#22c55e', marginLeft: 4 }}>↑</span>}
                                        {!match && !upgraded && <span style={{ fontSize: 10, color: '#ef4444', marginLeft: 4 }}>↓</span>}
                                    </td>
                                    <td style={{ padding: '12px 10px 12px 0' }}>
                                        <span style={{
                                            fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99,
                                            background: v.isVerified ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
                                            color: v.isVerified ? '#22c55e' : AMBER,
                                        }}>{v.isVerified ? 'Verified' : 'Pending'}</span>
                                    </td>
                                    <td style={{ padding: '12px 10px 12px 0', fontSize: 12, color: '#64748b' }}>{methodLabels[v.method]}</td>
                                    <td style={{ padding: '12px 10px 12px 0', fontSize: 12, color: '#94a3b8' }}>{v.verifierName}</td>
                                    <td style={{ padding: '12px 0', fontSize: 12, color: '#64748b' }}>
                                        {new Date(v.verifiedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
