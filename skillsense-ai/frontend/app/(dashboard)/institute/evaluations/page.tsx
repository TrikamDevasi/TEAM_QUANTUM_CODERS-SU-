'use client';

import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
    sampleAssignments, sampleProjects, samplePracticalExams,
    sampleSkillAssessments,
    type AssignmentSubmission, type ProjectEvaluation,
} from '../../../../data/sampleSubmissions';

const GOLD = '#D4A843';
const GOLD_L = '#F0C05A';
const AMBER = '#F59E0B';

const TABS = [
    { key: 'pending', label: 'Pending Review' },
    { key: 'graded', label: 'Graded' },
    { key: 'exams', label: 'Exam Scores' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'grade', label: 'Grade Submission' },
];

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

export default function InstructorEvaluationsPage() {
    const [active, setActive] = useState('pending');
    const [gradeScore, setGradeScore] = useState('');
    const [gradeFeedback, setGradeFeedback] = useState('');
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [gradeSuccess, setGradeSuccess] = useState(false);

    const pendingAssignments = sampleAssignments.filter(a => a.status === 'submitted' || a.status === 'under-review');
    const pendingProjects = sampleProjects.filter(p => p.status === 'pending');
    const gradedAssignments = sampleAssignments.filter(a => a.status === 'graded');
    const evaluatedProjects = sampleProjects.filter(p => p.status === 'evaluated');

    const pendingTotal = pendingAssignments.length + pendingProjects.length;
    const gradedTotal = gradedAssignments.length + evaluatedProjects.length;

    // Student performance data for analytics
    const studentPerformance = Array.from(new Set(sampleSkillAssessments.map(a => a.studentName))).map(name => {
        const assessments = sampleSkillAssessments.filter(a => a.studentName === name);
        const avg = Math.round(assessments.reduce((s, a) => s + a.score, 0) / assessments.length);
        return { name: name.split(' ')[0], score: avg };
    }).sort((a, b) => b.score - a.score).slice(0, 8);

    const handleGrade = (e: React.FormEvent) => {
        e.preventDefault();
        setGradeSuccess(true);
        setTimeout(() => { setGradeSuccess(false); setSelectedItem(null); setGradeScore(''); setGradeFeedback(''); }, 2000);
    };

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>
                    Instructor <span style={{ color: '#a78bfa' }}>Evaluations</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                    Review, grade, and track student submissions and performance
                </p>
            </div>

            {/* KPI Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                {[
                    { label: 'Pending Review', value: pendingTotal, color: AMBER },
                    { label: 'Graded / Evaluated', value: gradedTotal, color: '#22c55e' },
                    { label: 'Avg Exam Score', value: `${Math.round(samplePracticalExams.reduce((s, e) => s + e.score, 0) / samplePracticalExams.length)}%`, color: GOLD },
                    { label: 'Total Students', value: new Set([...sampleAssignments.map(a => a.studentId), ...sampleProjects.map(p => p.studentId)]).size, color: '#a78bfa' },
                ].map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div style={{ width: 4, height: 28, borderRadius: 2, background: stat.color, marginBottom: 14 }} />
                        <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{stat.value}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 28, overflowX: 'auto', paddingBottom: 2 }}>
                {TABS.map(t => (
                    <button key={t.key} onClick={() => setActive(t.key)} style={{
                        padding: '7px 16px', borderRadius: 9,
                        border: `1px solid ${active === t.key ? 'rgba(167,139,250,0.38)' : 'transparent'}`,
                        background: active === t.key ? 'rgba(167,139,250,0.1)' : 'transparent',
                        color: active === t.key ? '#a78bfa' : '#64748b',
                        fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                        fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.2s',
                    }}>
                        {t.label}
                        {t.key === 'pending' && pendingTotal > 0 && (
                            <span style={{ marginLeft: 6, fontSize: 10, padding: '2px 6px', borderRadius: 99, background: 'rgba(245,158,11,0.2)', color: AMBER }}>
                                {pendingTotal}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── PENDING ── */}
            {active === 'pending' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {pendingAssignments.length === 0 && pendingProjects.length === 0 && (
                        <div className="stat-card" style={{ textAlign: 'center', padding: '40px' }}>
                            <div className="font-display" style={{ fontSize: 16, color: '#22c55e', fontWeight: 700, marginBottom: 8 }}>All caught up</div>
                            <p style={{ color: '#64748b', fontSize: 13 }}>No pending submissions to review</p>
                        </div>
                    )}
                    {pendingAssignments.map(a => (
                        <div key={a.id} className="stat-card" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: 'rgba(212,168,67,0.12)', color: GOLD, fontWeight: 700 }}>Assignment</span>
                                        <span className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{a.title}</span>
                                    </div>
                                    <div style={{ fontSize: 12, color: '#64748b' }}>
                                        {a.studentName} · {a.course} · {new Date(a.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    </div>
                                </div>
                                <button onClick={() => { setActive('grade'); setSelectedItem(a.id); }} className="btn-ghost" style={{ fontSize: 12, padding: '6px 14px' }}>
                                    Grade
                                </button>
                            </div>
                        </div>
                    ))}
                    {pendingProjects.map(p => (
                        <div key={p.id} className="stat-card" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: 'rgba(167,139,250,0.12)', color: '#a78bfa', fontWeight: 700 }}>Project</span>
                                        <span className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{p.projectTitle}</span>
                                    </div>
                                    <div style={{ fontSize: 12, color: '#64748b' }}>
                                        {p.studentName} · {p.technology.join(', ')}
                                    </div>
                                </div>
                                <button onClick={() => { setActive('grade'); setSelectedItem(p.id); }} className="btn-ghost" style={{ fontSize: 12, padding: '6px 14px' }}>
                                    Evaluate
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── GRADED ── */}
            {active === 'graded' && (
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <div style={{ width: 4, height: 18, borderRadius: 2, background: '#22c55e' }} />
                        <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Graded Submissions</h3>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(212,168,67,0.1)' }}>
                                {['Type', 'Title', 'Student', 'Score', 'Feedback'].map(h => (
                                    <th key={h} style={{ textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', padding: '8px 12px 8px 0' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {gradedAssignments.map(a => (
                                <tr key={a.id} style={{ borderBottom: '1px solid rgba(212,168,67,0.05)' }}
                                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(212,168,67,0.03)')}
                                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                                    <td style={{ padding: '12px 12px 12px 0' }}>
                                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: 'rgba(212,168,67,0.12)', color: GOLD }}>Asgn</span>
                                    </td>
                                    <td style={{ padding: '12px 12px 12px 0', fontSize: 13, fontWeight: 600, color: '#fff' }}>{a.title}</td>
                                    <td style={{ padding: '12px 12px 12px 0', fontSize: 13, color: '#94a3b8' }}>{a.studentName}</td>
                                    <td style={{ padding: '12px 12px 12px 0' }}>
                                        <span className="font-display" style={{ fontSize: 14, fontWeight: 800, color: (a.score ?? 0) >= 80 ? '#22c55e' : AMBER }}>{a.score}%</span>
                                    </td>
                                    <td style={{ padding: '12px 0', fontSize: 12, color: '#64748b', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.feedback}</td>
                                </tr>
                            ))}
                            {evaluatedProjects.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid rgba(212,168,67,0.05)' }}
                                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(212,168,67,0.03)')}
                                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                                    <td style={{ padding: '12px 12px 12px 0' }}>
                                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: 'rgba(167,139,250,0.12)', color: '#a78bfa' }}>Proj</span>
                                    </td>
                                    <td style={{ padding: '12px 12px 12px 0', fontSize: 13, fontWeight: 600, color: '#fff' }}>{p.projectTitle}</td>
                                    <td style={{ padding: '12px 12px 12px 0', fontSize: 13, color: '#94a3b8' }}>{p.studentName}</td>
                                    <td style={{ padding: '12px 12px 12px 0' }}>
                                        <span className="font-display" style={{ fontSize: 14, fontWeight: 800, color: (p.score ?? 0) >= 80 ? '#22c55e' : AMBER }}>{p.score}%</span>
                                    </td>
                                    <td style={{ padding: '12px 0', fontSize: 12, color: '#64748b', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.feedback}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── EXAM SCORES ── */}
            {active === 'exams' && (
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <div style={{ width: 4, height: 18, borderRadius: 2, background: AMBER }} />
                        <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Practical Exam Scoreboard</h3>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(212,168,67,0.1)' }}>
                                {['Student', 'Exam', 'Skill', 'Score', 'Grade', 'Date', 'Evaluator'].map(h => (
                                    <th key={h} style={{ textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', padding: '8px 12px 8px 0' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {samplePracticalExams.map(e => (
                                <tr key={e.id} style={{ borderBottom: '1px solid rgba(212,168,67,0.05)' }}
                                    onMouseEnter={ev => ((ev.currentTarget as HTMLElement).style.background = 'rgba(212,168,67,0.03)')}
                                    onMouseLeave={ev => ((ev.currentTarget as HTMLElement).style.background = 'transparent')}>
                                    <td style={{ padding: '12px 12px 12px 0', fontSize: 13, fontWeight: 600, color: '#fff' }}>{e.studentName}</td>
                                    <td style={{ padding: '12px 12px 12px 0', fontSize: 13, color: '#94a3b8' }}>{e.examTitle}</td>
                                    <td style={{ padding: '12px 12px 12px 0', fontSize: 12, color: '#64748b' }}>{e.skillTested}</td>
                                    <td style={{ padding: '12px 12px 12px 0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 50, height: 5, background: 'rgba(212,168,67,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${e.score}%`, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_L})`, borderRadius: 3 }} />
                                            </div>
                                            <span className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{e.score}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 12px 12px 0' }}>
                                        <span className="font-display" style={{ fontSize: 13, fontWeight: 800, color: e.grade.startsWith('A') ? '#22c55e' : e.grade.startsWith('B') ? GOLD : '#ef4444' }}>{e.grade}</span>
                                    </td>
                                    <td style={{ padding: '12px 12px 12px 0', fontSize: 12, color: '#64748b' }}>
                                        {new Date(e.conductedOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    </td>
                                    <td style={{ padding: '12px 0', fontSize: 12, color: '#94a3b8' }}>{e.evaluator}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── ANALYTICS ── */}
            {active === 'analytics' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div className="stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                            <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Student Performance Ranking</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={studentPerformance} barSize={24}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,168,67,0.07)" />
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                                <Tooltip content={<Tip />} />
                                <Bar dataKey="score" radius={[4, 4, 0, 0]} fill={GOLD} fillOpacity={0.85} name="Avg Score" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Score distribution */}
                    <div className="stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <div style={{ width: 4, height: 18, borderRadius: 2, background: '#a78bfa' }} />
                            <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Score Distribution</h3>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                            {[
                                { range: '90-100', count: samplePracticalExams.filter(e => e.score >= 90).length, color: '#22c55e' },
                                { range: '80-89', count: samplePracticalExams.filter(e => e.score >= 80 && e.score < 90).length, color: GOLD },
                                { range: '70-79', count: samplePracticalExams.filter(e => e.score >= 70 && e.score < 80).length, color: AMBER },
                                { range: '60-69', count: samplePracticalExams.filter(e => e.score >= 60 && e.score < 70).length, color: '#F97316' },
                                { range: 'Below 60', count: samplePracticalExams.filter(e => e.score < 60).length, color: '#ef4444' },
                            ].map((d, i) => (
                                <div key={i} className="glass" style={{ padding: '14px', borderRadius: 10, textAlign: 'center' }}>
                                    <div className="font-display" style={{ fontSize: 24, fontWeight: 800, color: d.color, marginBottom: 4 }}>{d.count}</div>
                                    <div style={{ fontSize: 11, color: '#64748b' }}>{d.range}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── GRADE SUBMISSION ── */}
            {active === 'grade' && (
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                        <div style={{ width: 4, height: 18, borderRadius: 2, background: '#a78bfa' }} />
                        <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Grade a Submission</h3>
                    </div>

                    <form onSubmit={handleGrade} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Select Submission</label>
                            <select
                                value={selectedItem || ''}
                                onChange={e => setSelectedItem(e.target.value)}
                                style={{
                                    width: '100%', padding: '10px 14px', borderRadius: 10,
                                    border: '1px solid rgba(212,168,67,0.15)', background: '#0d0b18',
                                    color: '#fff', fontSize: 13, outline: 'none',
                                }}>
                                <option value="">Select a submission...</option>
                                {[...pendingAssignments, ...pendingProjects].map(item => (
                                    <option key={item.id} value={item.id}>
                                        {'title' in item ? item.title : (item as ProjectEvaluation).projectTitle} — {item.studentName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <div>
                                <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Score (0-100)</label>
                                <input required type="number" min="0" max="100" value={gradeScore} onChange={e => setGradeScore(e.target.value)} placeholder="85" style={{
                                    width: '100%', padding: '10px 14px', borderRadius: 10,
                                    border: '1px solid rgba(212,168,67,0.15)', background: 'rgba(212,168,67,0.03)',
                                    color: '#fff', fontSize: 13, outline: 'none',
                                }} />
                            </div>
                            <div>
                                <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Evaluator Name</label>
                                <input type="text" placeholder="Dr. Rajan Shah" style={{
                                    width: '100%', padding: '10px 14px', borderRadius: 10,
                                    border: '1px solid rgba(212,168,67,0.15)', background: 'rgba(212,168,67,0.03)',
                                    color: '#fff', fontSize: 13, outline: 'none',
                                }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Feedback / Comments</label>
                            <textarea required rows={3} value={gradeFeedback} onChange={e => setGradeFeedback(e.target.value)} placeholder="Provide detailed feedback..." style={{
                                width: '100%', padding: '10px 14px', borderRadius: 10,
                                border: '1px solid rgba(212,168,67,0.15)', background: 'rgba(212,168,67,0.03)',
                                color: '#fff', fontSize: 13, outline: 'none', resize: 'vertical',
                            }} />
                        </div>

                        <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                            {gradeSuccess ? (
                                <>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                                    Graded Successfully
                                </>
                            ) : 'Submit Grade'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
