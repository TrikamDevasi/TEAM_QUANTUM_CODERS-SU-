'use client';

import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
} from 'recharts';
import {
    sampleAssignments, sampleProjects, samplePracticalExams,
    sampleSkillAssessments, sampleEmployerFeedback,
} from '../../../../data/sampleSubmissions';

const GOLD = '#D4A843';
const GOLD_L = '#F0C05A';
const AMBER = '#F59E0B';
const ORANGE = '#F97316';

const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'assignments', label: 'Assignments' },
    { key: 'projects', label: 'Projects' },
    { key: 'exams', label: 'Practical Exams' },
    { key: 'assessments', label: 'Skill Tests' },
    { key: 'submit', label: 'Submit New' },
];

const statusColors: Record<string, string> = {
    graded: '#22c55e', submitted: GOLD, 'under-review': AMBER, resubmit: '#ef4444',
    evaluated: '#22c55e', pending: GOLD, revision: '#ef4444',
};

const gradeColors: Record<string, string> = {
    'A+': '#22c55e', A: '#22c55e', 'B+': GOLD, B: AMBER, C: ORANGE, D: '#ef4444', F: '#ef4444',
};

const levelColors: Record<string, string> = {
    expert: '#22c55e', advanced: GOLD, intermediate: AMBER, beginner: '#ef4444',
};

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

export default function StudentSubmissionsPage() {
    const [active, setActive] = useState('overview');
    const [showModal, setShowModal] = useState(false);
    const [submitType, setSubmitType] = useState('assignment');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Stats for overview
    const totalAssignments = sampleAssignments.length;
    const gradedAssignments = sampleAssignments.filter(a => a.status === 'graded');
    const avgAssignmentScore = gradedAssignments.length
        ? Math.round(gradedAssignments.reduce((s, a) => s + (a.score ?? 0), 0) / gradedAssignments.length)
        : 0;
    const totalProjects = sampleProjects.length;
    const evaluatedProjects = sampleProjects.filter(p => p.status === 'evaluated');
    const avgProjectScore = evaluatedProjects.length
        ? Math.round(evaluatedProjects.reduce((s, p) => s + (p.score ?? 0), 0) / evaluatedProjects.length)
        : 0;
    const avgExamScore = Math.round(samplePracticalExams.reduce((s, e) => s + e.score, 0) / samplePracticalExams.length);
    const avgAssessmentScore = Math.round(sampleSkillAssessments.reduce((s, a) => s + a.score, 0) / sampleSkillAssessments.length);

    const pieData = [
        { name: 'Assignments', value: totalAssignments, color: GOLD },
        { name: 'Projects', value: totalProjects, color: GOLD_L },
        { name: 'Practical Exams', value: samplePracticalExams.length, color: AMBER },
        { name: 'Skill Tests', value: sampleSkillAssessments.length, color: ORANGE },
    ];

    const scoreCompData = [
        { category: 'Assignments', score: avgAssignmentScore },
        { category: 'Projects', score: avgProjectScore },
        { category: 'Exams', score: avgExamScore },
        { category: 'Assessments', score: avgAssessmentScore },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitSuccess(true);
        setTimeout(() => { setSubmitSuccess(false); setShowModal(false); }, 2000);
    };

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>
                    My <span style={{ color: GOLD }}>Submissions</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                    Track all your assignments, projects, exams, and skill assessments
                </p>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 28, overflowX: 'auto', paddingBottom: 2 }}>
                {TABS.map(t => (
                    <button key={t.key} onClick={() => setActive(t.key)} style={{
                        padding: '7px 16px', borderRadius: 9,
                        border: `1px solid ${active === t.key ? 'rgba(212,168,67,0.38)' : 'transparent'}`,
                        background: active === t.key ? 'rgba(212,168,67,0.1)' : 'transparent',
                        color: active === t.key ? GOLD : '#64748b',
                        fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                        fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.2s',
                    }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ── OVERVIEW ── */}
            {active === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* KPI cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                        {[
                            { label: 'Total Submissions', value: totalAssignments + totalProjects, color: GOLD },
                            { label: 'Avg Assignment Score', value: `${avgAssignmentScore}%`, color: '#22c55e' },
                            { label: 'Avg Project Score', value: `${avgProjectScore}%`, color: AMBER },
                            { label: 'Assessments Passed', value: `${sampleSkillAssessments.filter(a => a.score >= 70).length}/${sampleSkillAssessments.length}`, color: ORANGE },
                        ].map((stat, i) => (
                            <div key={i} className="stat-card">
                                <div style={{ width: 4, height: 28, borderRadius: 2, background: stat.color, marginBottom: 14 }} />
                                <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{stat.value}</div>
                                <div style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Charts */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                        <div className="stat-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                                <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Score Comparison</h3>
                            </div>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={scoreCompData} barSize={28}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,168,67,0.07)" />
                                    <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                                    <Tooltip content={<Tip />} />
                                    <Bar dataKey="score" radius={[4, 4, 0, 0]} fill={GOLD} fillOpacity={0.85} name="Avg Score" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="stat-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                <div style={{ width: 4, height: 18, borderRadius: 2, background: AMBER }} />
                                <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Submission Distribution</h3>
                            </div>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                                        {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                                    </Pie>
                                    <Tooltip content={<Tip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 8 }}>
                                {pieData.map(d => (
                                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                                        <span style={{ fontSize: 11, color: '#64748b' }}>{d.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent activity feed */}
                    <div className="stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                            <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Recent Feedback</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {sampleEmployerFeedback.slice(0, 3).map(f => (
                                <div key={f.id} className="glass" style={{ padding: '12px 16px', borderRadius: 10 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <span className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{f.companyName}</span>
                                        <span style={{ fontSize: 11, color: '#64748b' }}>{f.role}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                                        <span style={{ color: '#94a3b8' }}>Technical: <span style={{ color: GOLD, fontWeight: 700 }}>{f.technicalScore}%</span></span>
                                        <span style={{ color: '#94a3b8' }}>Soft Skills: <span style={{ color: AMBER, fontWeight: 700 }}>{f.softSkillScore}%</span></span>
                                        <span style={{
                                            fontSize: 11, padding: '2px 8px', borderRadius: 99, fontWeight: 700,
                                            background: f.recommendation === 'hire' ? 'rgba(34,197,94,0.12)' : f.recommendation === 'consider' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)',
                                            color: f.recommendation === 'hire' ? '#22c55e' : f.recommendation === 'consider' ? AMBER : '#ef4444',
                                        }}>{f.recommendation}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── ASSIGNMENTS ── */}
            {active === 'assignments' && (
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                            <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Assignment Submissions</h3>
                        </div>
                        <span style={{ fontSize: 12, color: '#64748b' }}>{sampleAssignments.length} total</span>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(212,168,67,0.1)' }}>
                                {['Title', 'Course', 'Submitted', 'Status', 'Score', 'Skills'].map(h => (
                                    <th key={h} style={{ textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', padding: '8px 12px 8px 0' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sampleAssignments.map((a) => (
                                <tr key={a.id} style={{ borderBottom: '1px solid rgba(212,168,67,0.05)', transition: 'background 0.15s' }}
                                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(212,168,67,0.03)')}
                                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                                    <td style={{ padding: '12px 12px 12px 0', fontSize: 13, fontWeight: 600, color: '#fff' }}>{a.title}</td>
                                    <td style={{ padding: '12px 12px 12px 0', fontSize: 13, color: '#94a3b8' }}>{a.course}</td>
                                    <td style={{ padding: '12px 12px 12px 0', fontSize: 12, color: '#64748b' }}>
                                        {new Date(a.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    </td>
                                    <td style={{ padding: '12px 12px 12px 0' }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: `${statusColors[a.status]}14`, color: statusColors[a.status] }}>
                                            {a.status.replace('-', ' ')}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 12px 12px 0' }}>
                                        {a.score != null && (
                                            <span className="font-display" style={{ fontSize: 14, fontWeight: 800, color: a.score >= 80 ? '#22c55e' : a.score >= 60 ? AMBER : '#ef4444' }}>
                                                {a.score}/{a.maxScore}
                                            </span>
                                        )}
                                        {a.score == null && <span style={{ fontSize: 12, color: '#475569' }}>—</span>}
                                    </td>
                                    <td style={{ padding: '12px 0' }}>
                                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                            {a.skills.slice(0, 2).map(sk => (
                                                <span key={sk} style={{ fontSize: 10, color: '#475569', background: 'rgba(212,168,67,0.08)', padding: '2px 8px', borderRadius: 99 }}>{sk}</span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── PROJECTS ── */}
            {active === 'projects' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {sampleProjects.map(p => (
                        <div key={p.id} className="stat-card" style={{ cursor: 'pointer', transition: 'border-color 0.2s' }}
                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.25)')}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.1)')}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                <div>
                                    <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{p.projectTitle}</h3>
                                    <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{p.description}</p>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: `${statusColors[p.status]}14`, color: statusColors[p.status] }}>
                                        {p.status}
                                    </span>
                                    {p.score != null && (
                                        <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: p.score >= 80 ? '#22c55e' : AMBER, marginTop: 8 }}>{p.score}%</div>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                                {p.technology.map(t => (
                                    <span key={t} className="glass" style={{ fontSize: 11, padding: '4px 10px', borderRadius: 99, color: '#94a3b8' }}>{t}</span>
                                ))}
                            </div>
                            {p.evaluatorName && (
                                <div style={{ fontSize: 12, color: '#64748b' }}>
                                    Evaluated by <span style={{ color: '#94a3b8', fontWeight: 600 }}>{p.evaluatorName}</span>
                                </div>
                            )}
                            {p.feedback && (
                                <div className="glass" style={{ padding: '10px 14px', borderRadius: 8, marginTop: 10, fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
                                    {p.feedback}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* ── PRACTICAL EXAMS ── */}
            {active === 'exams' && (
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <div style={{ width: 4, height: 18, borderRadius: 2, background: AMBER }} />
                        <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Practical Exam Results</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                        {samplePracticalExams.map(e => (
                            <div key={e.id} className="glass" style={{ padding: '16px', borderRadius: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                    <div>
                                        <div className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{e.examTitle}</div>
                                        <div style={{ fontSize: 12, color: '#64748b' }}>{e.skillTested}</div>
                                    </div>
                                    <span className="font-display" style={{
                                        fontSize: 18, fontWeight: 800,
                                        color: gradeColors[e.grade] || GOLD,
                                        background: `${gradeColors[e.grade] || GOLD}14`,
                                        padding: '4px 12px', borderRadius: 8,
                                    }}>{e.grade}</span>
                                </div>
                                <div style={{ height: 6, background: 'rgba(212,168,67,0.08)', borderRadius: 3, overflow: 'hidden', marginBottom: 10 }}>
                                    <div style={{ height: '100%', width: `${e.score}%`, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_L})`, borderRadius: 3, transition: 'width 0.8s ease' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b' }}>
                                    <span>Score: <span style={{ color: '#fff', fontWeight: 700 }}>{e.score}/{e.maxScore}</span></span>
                                    <span>{new Date(e.conductedOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                                {e.remarks && (
                                    <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 8, fontStyle: 'italic' }}>{e.remarks}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── SKILL ASSESSMENTS ── */}
            {active === 'assessments' && (
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                        <div style={{ width: 4, height: 18, borderRadius: 2, background: ORANGE }} />
                        <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Skill Assessment Results</h3>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(212,168,67,0.1)' }}>
                                {['Assessment', 'Skill', 'Level', 'Score', 'Percentile', 'Duration', 'Badge'].map(h => (
                                    <th key={h} style={{ textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#64748b', padding: '8px 12px 8px 0' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {sampleSkillAssessments.map(a => (
                                <tr key={a.id} style={{ borderBottom: '1px solid rgba(212,168,67,0.05)', transition: 'background 0.15s' }}
                                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(212,168,67,0.03)')}
                                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}>
                                    <td style={{ padding: '12px 12px 12px 0', fontSize: 13, fontWeight: 600, color: '#fff' }}>{a.assessmentTitle}</td>
                                    <td style={{ padding: '12px 12px 12px 0', fontSize: 13, color: '#94a3b8' }}>{a.skill}</td>
                                    <td style={{ padding: '12px 12px 12px 0' }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: `${levelColors[a.level]}14`, color: levelColors[a.level] }}>
                                            {a.level}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 12px 12px 0' }}>
                                        <span className="font-display" style={{ fontSize: 14, fontWeight: 800, color: a.score >= 80 ? '#22c55e' : a.score >= 60 ? AMBER : '#ef4444' }}>
                                            {a.score}%
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 12px 12px 0', fontSize: 12, color: '#94a3b8' }}>Top {100 - a.percentile}%</td>
                                    <td style={{ padding: '12px 12px 12px 0', fontSize: 12, color: '#64748b' }}>{a.duration} min</td>
                                    <td style={{ padding: '12px 0' }}>
                                        {a.badge && (
                                            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, background: 'rgba(212,168,67,0.12)', color: GOLD, fontWeight: 700 }}>
                                                {a.badge}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── SUBMIT NEW ── */}
            {active === 'submit' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div className="stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                            <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                            <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Submit New Work</h3>
                        </div>

                        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                            {['assignment', 'project'].map(t => (
                                <button key={t} onClick={() => setSubmitType(t)} style={{
                                    padding: '8px 18px', borderRadius: 9,
                                    border: `1px solid ${submitType === t ? 'rgba(212,168,67,0.38)' : 'rgba(212,168,67,0.1)'}`,
                                    background: submitType === t ? 'rgba(212,168,67,0.1)' : 'transparent',
                                    color: submitType === t ? GOLD : '#64748b',
                                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                                    fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.2s',
                                }}>
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                <div>
                                    <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Title</label>
                                    <input required type="text" placeholder={submitType === 'assignment' ? 'Assignment title...' : 'Project title...'} style={{
                                        width: '100%', padding: '10px 14px', borderRadius: 10,
                                        border: '1px solid rgba(212,168,67,0.15)', background: 'rgba(212,168,67,0.03)',
                                        color: '#fff', fontSize: 13, outline: 'none',
                                    }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Course / Program</label>
                                    <input required type="text" placeholder="e.g. Full-Stack Development" style={{
                                        width: '100%', padding: '10px 14px', borderRadius: 10,
                                        border: '1px solid rgba(212,168,67,0.15)', background: 'rgba(212,168,67,0.03)',
                                        color: '#fff', fontSize: 13, outline: 'none',
                                    }} />
                                </div>
                            </div>

                            {submitType === 'project' && (
                                <>
                                    <div>
                                        <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Description</label>
                                        <textarea required placeholder="Describe your project..." rows={3} style={{
                                            width: '100%', padding: '10px 14px', borderRadius: 10,
                                            border: '1px solid rgba(212,168,67,0.15)', background: 'rgba(212,168,67,0.03)',
                                            color: '#fff', fontSize: 13, outline: 'none', resize: 'vertical',
                                        }} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>GitHub / Demo URL</label>
                                        <input type="url" placeholder="https://github.com/..." style={{
                                            width: '100%', padding: '10px 14px', borderRadius: 10,
                                            border: '1px solid rgba(212,168,67,0.15)', background: 'rgba(212,168,67,0.03)',
                                            color: '#fff', fontSize: 13, outline: 'none',
                                        }} />
                                    </div>
                                </>
                            )}

                            <div>
                                <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Upload File</label>
                                <div className="glass" style={{
                                    padding: '28px', borderRadius: 12, textAlign: 'center', cursor: 'pointer',
                                    borderStyle: 'dashed', transition: 'border-color 0.2s',
                                }}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 10px' }}>
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <polyline points="14,2 14,8 20,8" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <line x1="12" y1="18" x2="12" y2="12" stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
                                        <polyline points="9,15 12,12 15,15" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p style={{ fontSize: 13, color: '#94a3b8' }}>Click to upload or drag and drop</p>
                                    <p style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>PDF, ZIP, DOCX up to 50MB</p>
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Skills (comma separated)</label>
                                <input type="text" placeholder="React.js, TypeScript, Node.js" style={{
                                    width: '100%', padding: '10px 14px', borderRadius: 10,
                                    border: '1px solid rgba(212,168,67,0.15)', background: 'rgba(212,168,67,0.03)',
                                    color: '#fff', fontSize: 13, outline: 'none',
                                }} />
                            </div>

                            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                                {submitSuccess ? (
                                    <>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                                        Submitted Successfully
                                    </>
                                ) : 'Submit for Review'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
