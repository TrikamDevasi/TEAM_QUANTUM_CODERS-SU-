'use client';

import React, { useState } from 'react';
import { sampleStudents, SampleStudent } from '../../../../data/sampleStudents';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

const STATUS_COLORS = { placed: '#22c55e', studying: '#3b82f6', seeking: '#f59e0b' };

const PROGRAMS = ['Full-Stack Development', 'Data Science & Analytics', 'Cloud & DevOps Engineering', 'UI/UX Design & Frontend', 'Backend Development', 'Mobile App Development', 'Cybersecurity', 'AI & Machine Learning', 'Software Testing & QA'];
const STATES = ['Maharashtra', 'Delhi', 'Tamil Nadu', 'Gujarat', 'Uttar Pradesh', 'Karnataka', 'Kerala', 'Rajasthan', 'West Bengal', 'Andhra Pradesh', 'Telangana', 'Punjab', 'Bihar', 'Madhya Pradesh', 'Haryana'];

export default function StudentsPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'placed' | 'studying' | 'seeking'>('all');
    const [students, setStudents] = useState<SampleStudent[]>(sampleStudents);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [fName, setFName] = useState('');
    const [fProgram, setFProgram] = useState(PROGRAMS[0]);
    const [fState, setFState] = useState(STATES[0]);
    const [fBatch, setFBatch] = useState('2024-25');
    const [fScore, setFScore] = useState('75');
    const [fNsqf, setFNsqf] = useState('5');
    const [fStatus, setFStatus] = useState<'placed' | 'studying' | 'seeking'>('studying');
    const [fCompany, setFCompany] = useState('');

    const filtered = students.filter((s) => {
        const matchSearch = search === '' || s.name.toLowerCase().includes(search.toLowerCase()) || s.program.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || s.placementStatus === statusFilter;
        return matchSearch && matchStatus;
    });

    const handleAdd = () => {
        if (!fName.trim()) return;
        const newStudent: SampleStudent = {
            id: `STU${String(students.length + 1).padStart(3, '0')}`,
            name: fName.trim(),
            program: fProgram,
            state: fState,
            batch: fBatch,
            nsqfLevel: parseInt(fNsqf) || 4,
            gender: 'male',
            skills: [
                { skill: 'Core Skill 1', score: Math.floor(Math.random() * 30) + 60 },
                { skill: 'Core Skill 2', score: Math.floor(Math.random() * 30) + 55 },
                { skill: 'Core Skill 3', score: Math.floor(Math.random() * 30) + 65 },
            ],
            overallScore: parseInt(fScore) || 75,
            placementStatus: fStatus,
            ...(fStatus === 'placed' && fCompany.trim() ? { company: fCompany.trim(), role: 'Software Developer', salary: 45000 } : {}),
        };
        setStudents(prev => [newStudent, ...prev]);
        setShowModal(false);
        setFName(''); setFCompany(''); setFScore('75'); setFStatus('studying');
    };

    const inputStyle = {
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 8, padding: '9px 12px', color: WHITE, fontSize: 13, outline: 'none', width: '100%',
    };

    const labelStyle = { fontSize: 11, color: MUTED, fontWeight: 600 as const, marginBottom: 4, display: 'block' as const };

    return (
        <div style={{ color: WHITE, maxWidth: 1100 }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                    Student <span style={{ color: GOLD }}>Registry</span>
                </h1>
                <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                    {students.length} enrolled students
                </p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                    type="text" placeholder="Search name or program..." value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ flex: 1, minWidth: 200, ...inputStyle }}
                />
                {(['all', 'placed', 'studying', 'seeking'] as const).map((f) => (
                    <button key={f} onClick={() => setStatusFilter(f)} style={{
                        padding: '7px 14px', borderRadius: 8,
                        border: `1px solid ${statusFilter === f ? GOLD : 'rgba(255,255,255,0.12)'}`,
                        background: statusFilter === f ? 'rgba(212,168,67,0.15)' : 'rgba(255,255,255,0.03)',
                        color: statusFilter === f ? GOLD : MUTED, fontSize: 12,
                        fontWeight: statusFilter === f ? 700 : 400, cursor: 'pointer', textTransform: 'capitalize',
                    }}>
                        {f} {f !== 'all' && `(${students.filter((s) => s.placementStatus === f).length})`}
                    </button>
                ))}
                <button onClick={() => setShowModal(true)} style={{
                    padding: '8px 18px', borderRadius: 8, border: 'none',
                    background: `linear-gradient(135deg, ${GOLD}, #8b6512)`,
                    color: '#1a0f00', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                }}>
                    + Add Student
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
                    onClick={() => setShowModal(false)}>
                    <div onClick={e => e.stopPropagation()} style={{
                        width: 480, background: '#0f0d18', border: '1px solid rgba(212,168,67,0.15)',
                        borderRadius: 16, padding: 28,
                    }}>
                        <h2 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: WHITE, marginBottom: 20 }}>
                            Add New Student
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div>
                                <label style={labelStyle}>Full Name *</label>
                                <input type="text" placeholder="Enter student name" value={fName} onChange={e => setFName(e.target.value)} style={inputStyle} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label style={labelStyle}>Program</label>
                                    <select value={fProgram} onChange={e => setFProgram(e.target.value)} style={{ ...inputStyle, appearance: 'auto' as any }}>
                                        {PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>State</label>
                                    <select value={fState} onChange={e => setFState(e.target.value)} style={{ ...inputStyle, appearance: 'auto' as any }}>
                                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                                <div>
                                    <label style={labelStyle}>Batch</label>
                                    <select value={fBatch} onChange={e => setFBatch(e.target.value)} style={{ ...inputStyle, appearance: 'auto' as any }}>
                                        <option value="2024-25">2024-25</option>
                                        <option value="2023-24">2023-24</option>
                                        <option value="2025-26">2025-26</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Score</label>
                                    <input type="number" min="0" max="100" value={fScore} onChange={e => setFScore(e.target.value)} style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>NSQF Level</label>
                                    <select value={fNsqf} onChange={e => setFNsqf(e.target.value)} style={{ ...inputStyle, appearance: 'auto' as any }}>
                                        {[3, 4, 5, 6].map(n => <option key={n} value={n}>Level {n}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Status</label>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    {(['placed', 'studying', 'seeking'] as const).map(s => (
                                        <button key={s} onClick={() => setFStatus(s)} style={{
                                            flex: 1, padding: '8px', borderRadius: 8, cursor: 'pointer',
                                            border: `1px solid ${fStatus === s ? STATUS_COLORS[s] : 'rgba(255,255,255,0.12)'}`,
                                            background: fStatus === s ? `${STATUS_COLORS[s]}18` : 'transparent',
                                            color: fStatus === s ? STATUS_COLORS[s] : MUTED,
                                            fontSize: 12, fontWeight: 600, textTransform: 'capitalize',
                                        }}>{s}</button>
                                    ))}
                                </div>
                            </div>
                            {fStatus === 'placed' && (
                                <div>
                                    <label style={labelStyle}>Company Name</label>
                                    <input type="text" placeholder="Enter company name" value={fCompany} onChange={e => setFCompany(e.target.value)} style={inputStyle} />
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowModal(false)} style={{
                                padding: '9px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)',
                                background: 'transparent', color: MUTED, fontSize: 13, cursor: 'pointer',
                            }}>Cancel</button>
                            <button onClick={handleAdd} className="btn-primary" style={{ padding: '9px 24px', fontSize: 13, borderRadius: 8 }}>
                                Add Student
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                        <tr style={{ background: 'rgba(212,168,67,0.08)' }}>
                            {['Name', 'Program', 'State', 'Batch', 'Score', 'NSQF', 'Status', 'Company'].map((h) => (
                                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((student, i) => (
                            <tr key={student.id}
                                style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)', transition: 'background 0.15s', cursor: 'pointer' }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(212,168,67,0.06)'; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'; }}>
                                <td style={{ padding: '11px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${GOLD}, #8b6512)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#1a0f00', flexShrink: 0 }}>
                                            {student.name.charAt(0)}
                                        </div>
                                        <span style={{ color: WHITE, fontWeight: 500 }}>{student.name}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '11px 14px', color: MUTED, borderBottom: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap' }}>{student.program}</td>
                                <td style={{ padding: '11px 14px', color: MUTED, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{student.state}</td>
                                <td style={{ padding: '11px 14px', color: MUTED, borderBottom: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap' }}>{student.batch}</td>
                                <td style={{ padding: '11px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ color: student.overallScore >= 80 ? '#22c55e' : student.overallScore >= 65 ? GOLD : '#ef4444', fontWeight: 700 }}>{student.overallScore}</span>
                                </td>
                                <td style={{ padding: '11px 14px', color: MUTED, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{student.nsqfLevel}</td>
                                <td style={{ padding: '11px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: `${STATUS_COLORS[student.placementStatus]}18`, border: `1px solid ${STATUS_COLORS[student.placementStatus]}40`, color: STATUS_COLORS[student.placementStatus], textTransform: 'capitalize' }}>
                                        {student.placementStatus}
                                    </span>
                                </td>
                                <td style={{ padding: '11px 14px', color: MUTED, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{student.company ?? '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
