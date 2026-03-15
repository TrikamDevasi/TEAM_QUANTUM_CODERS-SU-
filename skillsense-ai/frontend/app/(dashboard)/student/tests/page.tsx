'use client';

import React, { useState } from 'react';

const GOLD = '#D4A843';
const AMBER = '#F59E0B';

interface TestInfo {
    id: string;
    title: string;
    subject: string;
    duration: number; // minutes
    questions: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    status: 'available' | 'completed' | 'upcoming';
    score?: number;
    maxScore?: number;
    completedAt?: string;
    scheduledAt?: string;
    description: string;
    skills: string[];
}

const sampleTests: TestInfo[] = [
    {
        id: 'TEST001', title: 'React.js Fundamentals', subject: 'Frontend Development',
        duration: 30, questions: 20, difficulty: 'Medium', status: 'available',
        description: 'Test your knowledge of React hooks, state management, JSX, and component lifecycle.',
        skills: ['React.js', 'JavaScript', 'Hooks'],
    },
    {
        id: 'TEST002', title: 'Data Structures & Algorithms', subject: 'Computer Science',
        duration: 45, questions: 25, difficulty: 'Hard', status: 'available',
        description: 'Solve problems on arrays, linked lists, trees, graphs, and dynamic programming.',
        skills: ['DSA', 'Problem Solving', 'Algorithms'],
    },
    {
        id: 'TEST003', title: 'Python for Data Science', subject: 'Data Science',
        duration: 35, questions: 20, difficulty: 'Medium', status: 'available',
        description: 'Covers NumPy, Pandas, Matplotlib, and basic statistical analysis with Python.',
        skills: ['Python', 'Pandas', 'Statistics'],
    },
    {
        id: 'TEST004', title: 'Node.js & Express API Design', subject: 'Backend Development',
        duration: 30, questions: 18, difficulty: 'Medium', status: 'available',
        description: 'RESTful API design, middleware, authentication, and error handling with Express.js.',
        skills: ['Node.js', 'Express.js', 'REST APIs'],
    },
    {
        id: 'TEST005', title: 'HTML & CSS Mastery', subject: 'Web Fundamentals',
        duration: 20, questions: 15, difficulty: 'Easy', status: 'available',
        description: 'Modern HTML5 semantics, CSS Grid, Flexbox, animations, and responsive design.',
        skills: ['HTML5', 'CSS3', 'Responsive Design'],
    },
    {
        id: 'TEST006', title: 'SQL & Database Design', subject: 'Database Management',
        duration: 40, questions: 22, difficulty: 'Hard', status: 'completed',
        score: 86, maxScore: 100, completedAt: '2026-03-10T14:30:00',
        description: 'Complex queries, joins, indexing, normalization, and database design principles.',
        skills: ['SQL', 'PostgreSQL', 'DB Design'],
    },
    {
        id: 'TEST007', title: 'TypeScript Advanced Patterns', subject: 'Frontend Development',
        duration: 25, questions: 15, difficulty: 'Hard', status: 'completed',
        score: 92, maxScore: 100, completedAt: '2026-03-08T10:00:00',
        description: 'Generics, utility types, discriminated unions, and advanced type inference.',
        skills: ['TypeScript', 'Type Safety', 'Generics'],
    },
    {
        id: 'TEST008', title: 'Cloud Computing Basics', subject: 'Cloud & DevOps',
        duration: 30, questions: 20, difficulty: 'Easy', status: 'upcoming',
        scheduledAt: '2026-03-20T09:00:00',
        description: 'AWS core services, cloud architecture patterns, and deployment strategies.',
        skills: ['AWS', 'Cloud', 'DevOps'],
    },
];

const difficultyColors: Record<string, string> = {
    Easy: '#22c55e', Medium: AMBER, Hard: '#ef4444',
};

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
    available: { bg: 'rgba(34,197,94,0.1)', color: '#22c55e', label: 'Available' },
    completed: { bg: 'rgba(212,168,67,0.1)', color: GOLD, label: 'Completed' },
    upcoming: { bg: 'rgba(167,139,250,0.1)', color: '#a78bfa', label: 'Upcoming' },
};

export default function StudentTestsPage() {
    const [filter, setFilter] = useState('all');
    const [confirmTest, setConfirmTest] = useState<TestInfo | null>(null);

    const filtered = filter === 'all'
        ? sampleTests
        : sampleTests.filter(t => t.status === filter);

    const availableCount = sampleTests.filter(t => t.status === 'available').length;
    const completedCount = sampleTests.filter(t => t.status === 'completed').length;
    const avgScore = sampleTests.filter(t => t.score).length
        ? Math.round(sampleTests.filter(t => t.score).reduce((s, t) => s + (t.score ?? 0), 0) / sampleTests.filter(t => t.score).length)
        : 0;

    const handleStartTest = (test: TestInfo) => {
        setConfirmTest(test);
    };

    const launchExam = () => {
        if (!confirmTest) return;
        const params = new URLSearchParams({
            testId: confirmTest.id,
            title: confirmTest.title,
            duration: String(confirmTest.duration),
            questions: String(confirmTest.questions),
            subject: confirmTest.subject,
        });
        window.open(`/exam?${params.toString()}`, '_blank', 'width=1920,height=1080,menubar=no,toolbar=no,location=no,status=no');
        setConfirmTest(null);
    };

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>
                    Skill <span style={{ color: GOLD }}>Tests</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                    Take proctored skill assessments to validate your knowledge
                </p>
            </div>

            {/* KPI Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
                {[
                    { label: 'Available Tests', value: availableCount, color: '#22c55e' },
                    { label: 'Completed', value: completedCount, color: GOLD },
                    { label: 'Average Score', value: `${avgScore}%`, color: AMBER },
                    { label: 'Total Tests', value: sampleTests.length, color: '#a78bfa' },
                ].map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div style={{ width: 4, height: 28, borderRadius: 2, background: stat.color, marginBottom: 14 }} />
                        <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{stat.value}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Important notice */}
            <div className="stat-card" style={{ borderColor: 'rgba(239,68,68,0.2)', marginBottom: 20, padding: '14px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444' }}>Proctored Environment</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                            Tests open in fullscreen mode. Switching tabs more than 2 times will auto-submit your test.
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
                {['all', 'available', 'completed', 'upcoming'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                        padding: '7px 16px', borderRadius: 9,
                        border: `1px solid ${filter === f ? 'rgba(212,168,67,0.38)' : 'transparent'}`,
                        background: filter === f ? 'rgba(212,168,67,0.1)' : 'transparent',
                        color: filter === f ? GOLD : '#64748b',
                        fontSize: 13, fontWeight: 700, cursor: 'pointer',
                        fontFamily: 'Space Grotesk, sans-serif', transition: 'all 0.2s',
                    }}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Test Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
                {filtered.map(test => {
                    const sc = statusConfig[test.status];
                    return (
                        <div key={test.id} className="stat-card" style={{
                            transition: 'border-color 0.2s, transform 0.2s',
                            display: 'flex', flexDirection: 'column',
                        }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.25)';
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.1)';
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                                <div>
                                    <h3 className="font-display" style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                                        {test.title}
                                    </h3>
                                    <div style={{ fontSize: 12, color: '#64748b' }}>{test.subject}</div>
                                </div>
                                <span style={{
                                    fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                                    background: sc.bg, color: sc.color,
                                }}>{sc.label}</span>
                            </div>

                            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 14, flex: 1 }}>
                                {test.description}
                            </p>

                            {/* Skills */}
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 14 }}>
                                {test.skills.map(s => (
                                    <span key={s} style={{
                                        fontSize: 10, padding: '3px 10px', borderRadius: 99,
                                        background: 'rgba(212,168,67,0.08)', color: '#94a3b8',
                                    }}>{s}</span>
                                ))}
                            </div>

                            {/* Meta row */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                                <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#64748b' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                        {test.duration} min
                                    </span>
                                    <span>{test.questions} questions</span>
                                    <span style={{ color: difficultyColors[test.difficulty], fontWeight: 700 }}>
                                        {test.difficulty}
                                    </span>
                                </div>
                            </div>

                            {/* Score or Action */}
                            {test.status === 'completed' && test.score != null && (
                                <div className="glass" style={{ padding: '10px 14px', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ fontSize: 11, color: '#64748b' }}>Score</span>
                                        <div className="font-display" style={{ fontSize: 20, fontWeight: 800, color: test.score >= 80 ? '#22c55e' : AMBER }}>
                                            {test.score}/{test.maxScore}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: 11, color: '#475569', textAlign: 'right' }}>
                                        Completed on<br />
                                        {new Date(test.completedAt!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </div>
                                </div>
                            )}

                            {test.status === 'available' && (
                                <button onClick={() => handleStartTest(test)} className="btn-primary" style={{
                                    width: '100%', fontSize: 13, padding: '10px 0', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', gap: 8,
                                }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polygon points="5 3 19 12 5 21 5 3" />
                                    </svg>
                                    Start Test
                                </button>
                            )}

                            {test.status === 'upcoming' && (
                                <div className="glass" style={{ padding: '10px 14px', borderRadius: 8, textAlign: 'center' }}>
                                    <span style={{ fontSize: 12, color: '#a78bfa' }}>
                                        Scheduled: {new Date(test.scheduledAt!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Confirmation Modal */}
            {confirmTest && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }} onClick={() => setConfirmTest(null)}>
                    <div className="stat-card" style={{
                        maxWidth: 480, width: '90%', padding: '28px',
                        borderColor: 'rgba(212,168,67,0.2)',
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: '50%', margin: '0 auto 16px',
                                background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                            </div>
                            <h2 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
                                Start Proctored Test?
                            </h2>
                            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
                                You are about to start <strong style={{ color: GOLD }}>{confirmTest.title}</strong>
                            </p>
                        </div>

                        <div className="glass" style={{ padding: '14px', borderRadius: 10, marginBottom: 16 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, textAlign: 'center', fontSize: 12 }}>
                                <div>
                                    <div style={{ color: '#64748b', marginBottom: 4 }}>Duration</div>
                                    <div className="font-display" style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{confirmTest.duration} min</div>
                                </div>
                                <div>
                                    <div style={{ color: '#64748b', marginBottom: 4 }}>Questions</div>
                                    <div className="font-display" style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{confirmTest.questions}</div>
                                </div>
                                <div>
                                    <div style={{ color: '#64748b', marginBottom: 4 }}>Difficulty</div>
                                    <div className="font-display" style={{ color: difficultyColors[confirmTest.difficulty], fontWeight: 700, fontSize: 16 }}>{confirmTest.difficulty}</div>
                                </div>
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
                            borderRadius: 10, padding: '12px 14px', marginBottom: 20,
                        }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', marginBottom: 6 }}>Rules</div>
                            <ul style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.8, paddingLeft: 16, margin: 0 }}>
                                <li>The test will open in <strong style={{ color: '#fff' }}>fullscreen mode</strong></li>
                                <li>Switching tabs will trigger a <strong style={{ color: '#ef4444' }}>warning alert</strong></li>
                                <li>You get <strong style={{ color: '#ef4444' }}>only 2 warnings</strong> — after that the test <strong style={{ color: '#ef4444' }}>auto-submits</strong></li>
                                <li>You cannot return to this window during the test</li>
                                <li>Timer starts immediately when the test begins</li>
                            </ul>
                        </div>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setConfirmTest(null)} className="btn-ghost" style={{ flex: 1, fontSize: 13 }}>
                                Cancel
                            </button>
                            <button onClick={launchExam} className="btn-primary" style={{
                                flex: 1, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                                Launch Test
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
