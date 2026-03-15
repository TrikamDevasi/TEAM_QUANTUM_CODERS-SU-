'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { sampleStudents } from '../../../data/sampleStudents';
import { downloadPageAsPDF } from '../../../utils/downloadPDF';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { AssessmentHistory, ChatMessage } from '@/types/api';

const S = sampleStudents[0];
const GOLD   = '#D4A843';
const GOLD_L = '#F0C05A';
const AMBER  = '#F59E0B';
const ORANGE = '#F97316';
const GREEN  = '#22c55e';
const INDIGO = '#6366f1';

/* [MOCK] Recommended courses */
const COURSES = [
    { title: 'React 18 Advanced Patterns', instructor: 'Rohit Sharma', duration: '12h', level: 'Advanced', color: GOLD, progress: 68 },
    { title: 'System Design Masterclass', instructor: 'Priya Patel', duration: '18h', level: 'Advanced', color: INDIGO, progress: 0 },
    { title: 'AWS Cloud Practitioner', instructor: 'Anil Kumar', duration: '10h', level: 'Intermediate', color: '#34d399', progress: 30 },
    { title: 'Go Lang for Backend', instructor: 'Divya Mehta', duration: '8h', level: 'Intermediate', color: ORANGE, progress: 0 },
];

/* [MOCK] Activity feed */
const ACTIVITY = [
    { icon: '🎯', text: 'Completed "TypeScript Generics" lesson', time: '2h ago', color: GREEN },
    { icon: '🏅', text: 'Earned React.js Skill Badge', time: '1d ago', color: GOLD },
    { icon: '📊', text: 'AI Assessment updated your Skill Score to 74', time: '2d ago', color: INDIGO },
    { icon: '💼', text: 'Job match found: Senior Dev @ Razorpay (86%)', time: '3d ago', color: AMBER },
    { icon: '📝', text: 'Started "System Design Masterclass"', time: '4d ago', color: '#a78bfa' },
];

const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'passport', label: 'Skill Passport' },
    { key: 'analyzer', label: 'AI Analyzer' },
    { key: 'gaps', label: 'Skill Gap' },
    { key: 'assessments', label: 'Assessments' },
    { key: 'careers', label: 'Career Paths' },
];

const radarData = S.skills.map(s => ({
    subject: s.skill.split(' ')[0],
    score: s.score,
    bench: Math.min(100, s.score + 14),
}));

const progressData = [
    { month: 'Jan', score: 58 }, { month: 'Feb', score: 61 }, { month: 'Mar', score: 65 },
    { month: 'Apr', score: 63 }, { month: 'May', score: 68 }, { month: 'Jun', score: 71 },
    { month: 'Jul', score: S.overallScore },
];

const skillGaps = [
    { skill: 'Docker & Kubernetes', priority: 'High', weeks: 4 },
    { skill: 'System Design', priority: 'High', weeks: 6 },
    { skill: 'GraphQL', priority: 'Medium', weeks: 2 },
    { skill: 'Redis / Caching', priority: 'Medium', weeks: 1 },
    { skill: 'AWS Services', priority: 'High', weeks: 8 },
];

const careers = [
    { role: 'Senior Full-Stack Developer', salary: '8.0–15.0 LPA', demand: 'Very High', match: 86 },
    { role: 'DevOps Engineer', salary: '10.0–18.0 LPA', demand: 'High', match: 74 },
    { role: 'Cloud Solutions Architect', salary: '12.0–22.0 LPA', demand: 'Rising', match: 78 },
    { role: 'AI/ML Engineer', salary: '14.0–25.0 LPA', demand: 'Emerging', match: 62 },
];

const Tip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="glass-bright" style={{ padding: '8px 12px', borderRadius: 10, fontSize: 12 }}>
            <p style={{ color: '#94a3b8', marginBottom: 4 }}>{label}</p>
            {payload.map((p: any, i: number) => (
                <p key={i} style={{ color: GOLD, fontWeight: 700 }}>{p.value}</p>
            ))}
        </div>
    );
};

export default function StudentPage() {
    const { user, isLoading: authLoading } = useAuth();
    const { data: assessmentHistory, isLoading: assessmentsLoading } = useApi<AssessmentHistory[]>('/assessments/history');
    const { data: chatHistory, isLoading: chatLoading } = useApi<{ messages: ChatMessage[] }>('/ai/history');
    
    const [active, setActive] = useState<string>('overview');
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const h = new Date().getHours();
        setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
    }, []);

    const firstName = user?.name?.split(' ')[0] || 'Student';
    const lastLoginFormatted = user?.lastLogin ? new Date(user.lastLogin).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    }) : 'First time login';

    if (authLoading) return <div style={{ padding: 40, color: '#64748b' }}>Loading your dashboard...</div>;

    return (
        <div>
            {/* ── Welcome Banner ── */}
            <div style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.08), rgba(99,102,241,0.06))', border: '1px solid rgba(212,168,67,0.15)', borderRadius: 16, padding: '24px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>
                        {greeting}, <span style={{ color: GOLD }}>{firstName}!</span> 👋
                    </h1>
                    <p style={{ color: '#64748b', fontSize: 13, marginTop: 6 }}>
                        Last login: <span style={{ color: AMBER, fontWeight: 600 }}>{lastLoginFormatted}</span>
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {/* Circular AI Skill Score */}
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ position: 'relative', width: 80, height: 80 }}>
                            <svg viewBox="0 0 36 36" style={{ width: 80, height: 80, transform: 'rotate(-90deg)' }}>
                                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(212,168,67,0.12)" strokeWidth="3" />
                                <circle cx="18" cy="18" r="15" fill="none" stroke={GOLD} strokeWidth="3"
                                    strokeDasharray={`${S.overallScore * 0.942} 94.2`} strokeLinecap="round"
                                    style={{ transition: 'stroke-dasharray 1s ease' }} />
                            </svg>
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{S.overallScore}</span>
                                <span style={{ fontSize: 8, color: '#64748b' }}>/100</span>
                            </div>
                        </div>
                        <div style={{ fontSize: 10, color: '#64748b', marginTop: 4, fontWeight: 600 }}>AI SKILL SCORE</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ fontSize: 12, color: '#94a3b8' }}><span style={{ color: GREEN, fontWeight: 700 }}>↑ Top 15%</span> of your batch</div>
                        <div style={{ fontSize: 12, color: '#94a3b8' }}>NSQF Level <span style={{ color: GOLD, fontWeight: 700 }}>{S.nsqfLevel}</span></div>
                        <div style={{ fontSize: 12, color: '#94a3b8' }}>Career Match <span style={{ color: INDIGO, fontWeight: 700 }}>86%</span></div>
                    </div>
                </div>
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
                    {/* Progress cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
                        {[
                            { label: 'Courses Enrolled', value: '4', icon: '📚', color: GOLD, sub: '2 in progress' },
                            { label: 'Completed', value: '2', icon: '✅', color: GREEN, sub: 'this month' },
                            { label: 'Certificates', value: '3', icon: '🏅', color: INDIGO, sub: 'verified' },
                            { label: 'Skill Score', value: `${S.overallScore}/100`, icon: '🧠', color: AMBER, sub: '↑ +3 this week' },
                        ].map((stat, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${stat.color}22`, borderRadius: 12, padding: '18px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                                    <span style={{ fontSize: 18 }}>{stat.icon}</span>
                                </div>
                                <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>{stat.value}</div>
                                <div style={{ fontSize: 11, color: stat.color, marginTop: 6, fontWeight: 600 }}>{stat.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Charts */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                        <div className="stat-card">
                            <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 16 }}>
                                Skill Radar
                            </h3>
                            <ResponsiveContainer width="100%" height={240}>
                                <RadarChart data={radarData}>
                                    <PolarGrid stroke="rgba(212,168,67,0.1)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                                    <Radar name="You" dataKey="score" stroke={GOLD} fill={GOLD} fillOpacity={0.15} strokeWidth={2} />
                                    <Radar name="Benchmark" dataKey="bench" stroke={AMBER} fill="transparent" strokeWidth={2} strokeDasharray="4 4" />
                                </RadarChart>
                            </ResponsiveContainer>
                            <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
                                {[{ label: 'Your Score', color: GOLD }, { label: 'Industry Benchmark', color: AMBER }].map(l => (
                                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <div style={{ width: 10, height: 3, background: l.color, borderRadius: 2 }} />
                                        <span style={{ fontSize: 11, color: '#64748b' }}>{l.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="stat-card">
                            <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 16 }}>
                                Personal Score Progress
                            </h3>
                            <ResponsiveContainer width="100%" height={240}>
                                <AreaChart data={progressData}>
                                    <defs>
                                        <linearGradient id="scoreG" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={GOLD} stopOpacity={0.28} />
                                            <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,168,67,0.07)" />
                                    <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} domain={[50, 85]} />
                                    <Tooltip content={<Tip />} />
                                    <Area type="monotone" dataKey="score" stroke={GOLD} fill="url(#scoreG)" strokeWidth={2.5}
                                        dot={{ fill: GOLD, r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: GOLD }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* AI Insights */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div style={{ width: 4, height: 20, borderRadius: 2, background: GOLD }} />
                            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>AI Insights</h3>
                            <span style={{ marginLeft: 'auto', fontSize: 11, color: GOLD, background: 'rgba(212,168,67,0.1)', padding: '3px 10px', borderRadius: 99, fontWeight: 600 }}>Gemini AI</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[
                                `Your ${S.skills.sort((a, b) => a.score - b.score)[0]?.skill} score (${S.skills[0]?.score}/100) is below the 75-point threshold — prioritise targeted practice.`,
                                `With ${S.overallScore}/100 overall and NSQF Level ${S.nsqfLevel}, you qualify for premium industry openings in ${S.state}.`,
                                `AI/ML Engineer roles are seeing 220% demand surge — consider an upskilling certification aligned to your ${S.program} background.`,
                            ].map((insight, i) => (
                                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '12px 14px', borderRadius: 10, display: 'flex', gap: 10 }}>
                                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(212,168,67,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: GOLD, flexShrink: 0 }}>
                                        {i + 1}
                                    </div>
                                    <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.65, margin: 0 }}>{insight}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommended courses [MOCK] */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>Recommended Courses <span style={{ fontSize: 10, color: AMBER, fontWeight: 600 }}>[MOCK]</span></div>
                                <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Personalized for your skill gaps</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8 }}>
                            {COURSES.map((c, i) => (
                                <div key={i} style={{ minWidth: 200, background: 'rgba(255,255,255,0.03)', border: `1px solid ${c.color}22`, borderRadius: 12, padding: 16, flexShrink: 0 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${c.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 10 }}>📘</div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 4, lineHeight: 1.4 }}>{c.title}</div>
                                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 10 }}>{c.instructor} · {c.duration} · {c.level}</div>
                                    {c.progress > 0 ? (
                                        <>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b', marginBottom: 4 }}>
                                                <span>Progress</span><span style={{ color: c.color }}>{c.progress}%</span>
                                            </div>
                                            <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${c.progress}%`, background: c.color, borderRadius: 2 }} />
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ fontSize: 11, color: c.color, fontWeight: 600 }}>Start learning →</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity + Career Match */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 16 }}>Recent Activity <span style={{ fontSize: 10, color: AMBER }}>[MOCK]</span></div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {ACTIVITY.map((a, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                        <div style={{ width: 30, height: 30, borderRadius: 8, background: `${a.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{a.icon}</div>
                                        <div>
                                            <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5 }}>{a.text}</div>
                                            <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{a.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>Career Match <span style={{ fontSize: 10, color: AMBER }}>[MOCK]</span></div>
                            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 16 }}>Top roles that match your current skills</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {[
                                    { role: 'AI/ML Engineer', match: 62, color: ORANGE },
                                ].map((c, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                                            <span style={{ color: '#94a3b8' }}>{c.role}</span>
                                            <span style={{ color: c.color, fontWeight: 700 }}>{c.match}%</span>
                                        </div>
                                        <div style={{ height: 5, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${c.match}%`, background: `linear-gradient(90deg, ${c.color}, ${c.color}88)`, borderRadius: 3, transition: 'width 1s ease' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Real Assessment History */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 16 }}>Assessment History</div>
                        {assessmentsLoading ? <div style={{ color: '#64748b', fontSize: 12 }}>Loading history...</div> : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {assessmentHistory?.length === 0 ? (
                                    <p style={{ color: '#64748b', fontSize: 12 }}>No assessments taken yet. <Link href="/student/assessment" style={{ color: GOLD }}>Take one now</Link></p>
                                ) : assessmentHistory?.map((as, i) => (
                                    <div key={as._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{as.category}</div>
                                            <div style={{ fontSize: 11, color: '#64748b' }}>{new Date(as.completedAt).toLocaleDateString()}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: 14, fontWeight: 800, color: GOLD }}>{as.score}/{as.totalQuestions}</div>
                                            <div style={{ fontSize: 10, color: GREEN }}>Completed</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── PASSPORT ── */}
            {active === 'passport' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div className="glass-bright" style={{ borderRadius: 18, padding: 28, position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(212,168,67,0.04), rgba(249,115,22,0.04))', pointerEvents: 'none' }} />
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
                                <div style={{ display: 'flex', gap: 14 }}>
                                    <div style={{ width: 58, height: 58, borderRadius: 16, background: 'linear-gradient(135deg, #D4A843, #F0C05A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#08060f' }}>
                                        {S.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h2 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{S.name}</h2>
                                        <p style={{ color: '#64748b', fontSize: 13 }}>{S.program}</p>
                                        <p style={{ color: '#475569', fontSize: 12 }}>NSQF Level {S.nsqfLevel} · {S.state} · {S.batch}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Skill Score</div>
                                    <div className="font-display gradient-text" style={{ fontSize: 40, fontWeight: 800 }}>{S.overallScore}</div>
                                    <div style={{ fontSize: 11, color: '#64748b' }}>/100</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
                                {['Top Performer', 'Quick Learner', S.state, S.gender === 'female' ? 'Female Scholar' : 'Merit Student'].map(b => (
                                    <span key={b} className="glass" style={{ fontSize: 12, padding: '5px 12px', borderRadius: 99, color: '#94a3b8' }}>{b}</span>
                                ))}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                {S.skills.map((s, i) => (
                                    <div key={i}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                                            <span style={{ color: '#94a3b8' }}>{s.skill}</span>
                                            <span style={{ color: '#fff', fontWeight: 700 }}>{s.score}%</span>
                                        </div>
                                        <div style={{ height: 7, background: 'rgba(212,168,67,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${s.score}%`, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_L})`, borderRadius: 4 }} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {S.placementStatus === 'placed' && S.company && (
                                <div className="glass" style={{ marginTop: 20, padding: '14px 18px', borderRadius: 10, display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                                    <div>
                                        <div style={{ fontSize: 12, color: '#64748b' }}>Currently placed at</div>
                                        <div className="font-display" style={{ fontSize: 15, fontWeight: 700, color: '#22c55e' }}>{S.company}</div>
                                        {S.role && <div style={{ fontSize: 12, color: '#94a3b8' }}>{S.role}{S.salary ? ` · Rs. ${S.salary.toLocaleString()}/mo` : ''}</div>}
                                    </div>
                                </div>
                            )}

                            <button onClick={() => downloadPageAsPDF('Skill-Passport-' + S.name)} className="btn-primary" style={{ marginTop: 20, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                                Download Skill Passport PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── AI ANALYZER ── */}
            {active === 'analyzer' && <AIAnalyzerTab program={S.program} />}

            {/* ── SKILL GAP ── */}
            {active === 'gaps' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <div className="stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <div style={{ width: 4, height: 18, borderRadius: 2, background: AMBER }} />
                            <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Skill Gap Analysis</h3>
                        </div>
                        <p style={{ color: '#64748b', fontSize: 12, marginBottom: 18 }}>
                            Skills to acquire for your target role in {S.program} industry
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                            {skillGaps.map((g, i) => (
                                <div key={i} className="glass" style={{ padding: '12px 16px', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#cbd5e1', fontSize: 13 }}>{g.skill}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <span style={{
                                            fontSize: 11, padding: '3px 10px', borderRadius: 99,
                                            background: g.priority === 'High' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                                            color: g.priority === 'High' ? '#ef4444' : AMBER,
                                        }}>{g.priority}</span>
                                        <span style={{ fontSize: 12, color: '#64748b', width: 52, textAlign: 'right' }}>{g.weeks} weeks</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                            <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Skills vs Industry Benchmark</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={240}>
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="rgba(212,168,67,0.1)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                                <Radar name="Your Score" dataKey="score" stroke={GOLD} fill={GOLD} fillOpacity={0.15} strokeWidth={2} />
                                <Radar name="Benchmark" dataKey="bench" stroke={AMBER} fill="transparent" strokeDasharray="4 4" strokeWidth={2} />
                                <Tooltip content={<Tip />} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* ── CAREERS ── */}
            {active === 'careers' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="stat-card" style={{ background: 'rgba(212,168,67,0.05)', borderColor: 'rgba(212,168,67,0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                            <div>
                                <div className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>AI Career Recommendations</div>
                                <div style={{ fontSize: 12, color: '#64748b' }}>Based on your profile and NSQF Level {S.nsqfLevel}</div>
                            </div>
                            <span style={{ marginLeft: 'auto', fontSize: 11, color: GOLD, background: 'rgba(212,168,67,0.1)', padding: '3px 10px', borderRadius: 99 }}>Gemini AI</span>
                        </div>
                    </div>
                    {careers.map((c, i) => (
                        <div key={i} className="glass" style={{ padding: '18px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', transition: 'border-color 0.2s' }}
                            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.3)')}
                            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.1)')}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                                    <span className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{c.role}</span>
                                    {i === 0 && <span style={{ fontSize: 10, background: 'rgba(34,197,94,0.14)', color: '#22c55e', padding: '2px 8px', borderRadius: 99, fontWeight: 700 }}>Best Match</span>}
                                </div>
                                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#64748b' }}>
                                    <span>Rs. {c.salary}</span><span>Demand: {c.demand}</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div className="font-display gradient-text" style={{ fontSize: 22, fontWeight: 800 }}>{c.match}%</div>
                                <div style={{ fontSize: 10, color: '#64748b' }}>match</div>
                            </div>
                            <div style={{ width: 80 }}>
                                <div style={{ height: 6, background: 'rgba(212,168,67,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${c.match}%`, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_L})`, borderRadius: 3 }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function AIAnalyzerTab({ program }: { program: string }) {
    const [analyzing, setAnalyzing] = useState(false);
    const [done, setDone] = useState(false);
    const run = () => { setAnalyzing(true); setTimeout(() => { setAnalyzing(false); setDone(true); }, 2600); };

    const dims = [
        { label: 'Problem Solving', score: 85, color: GOLD },
        { label: 'Technical Skills', score: 88, color: GOLD_L },
        { label: 'Communication', score: 72, color: AMBER },
        { label: 'Project Experience', score: 79, color: ORANGE },
        { label: 'Industry Readiness', score: 74, color: '#a78bfa' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {[
                    { label: 'Upload Resume', desc: 'PDF or Word document' },
                    { label: 'Upload Project', desc: 'ZIP file or GitHub URL' },
                    { label: 'Link GitHub', desc: 'github.com/username' },
                ].map((item, i) => (
                    <div key={i} className="stat-card" style={{ textAlign: 'center', cursor: 'pointer' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.35)')}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.1)')}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(212,168,67,0.1)', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <polyline points="14,2 14,8 20,8" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{item.label}</h3>
                        <p style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>{item.desc}</p>
                        <div style={{ width: 32, height: 3, background: 'rgba(212,168,67,0.25)', borderRadius: 2, margin: '0 auto' }} />
                    </div>
                ))}
            </div>

            <div className="stat-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                    <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>AI Skill Analyzer</h3>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: GOLD }}>Powered by Gemini AI</span>
                </div>
                <p style={{ color: '#64748b', fontSize: 13, marginBottom: 18, lineHeight: 1.7 }}>
                    Our AI analyses your resume, GitHub repositories, and projects to extract real skills and generate a comprehensive
                    competency score across 50+ dimensions relevant to <strong style={{ color: '#94a3b8' }}>{program}</strong>.
                </p>
                <button onClick={run} disabled={analyzing} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                    {analyzing ? (
                        <>
                            <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#08060f', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                            Analysing...
                        </>
                    ) : 'Run AI Analysis'}
                </button>
            </div>

            {done && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="stat-card" style={{ borderColor: 'rgba(34,197,94,0.22)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
                            <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Analysis Complete</h3>
                            <span style={{ marginLeft: 'auto', fontSize: 11, color: '#22c55e' }}>Just now</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
                            {dims.map((d, i) => (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <div style={{ position: 'relative', width: 64, height: 64, margin: '0 auto 10px' }}>
                                        <svg viewBox="0 0 36 36" style={{ width: 64, height: 64, transform: 'rotate(-90deg)' }}>
                                            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(212,168,67,0.1)" strokeWidth="3" />
                                            <circle cx="18" cy="18" r="15" fill="none" stroke={d.color} strokeWidth="3"
                                                strokeDasharray={`${d.score * 0.942} 94.2`} strokeLinecap="round" />
                                        </svg>
                                        <span className="font-display" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff' }}>{d.score}</span>
                                    </div>
                                    <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>{d.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                            <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                            <h3 className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Extracted Skills</h3>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {['React.js', 'Node.js', 'TypeScript', 'REST APIs', 'MongoDB', 'Git & GitHub', 'Docker', 'AWS Services', 'System Design', 'Agile/Scrum'].map(skill => (
                                <span key={skill} className="glass" style={{ fontSize: 12, padding: '5px 12px', borderRadius: 99, color: '#94a3b8' }}>{skill}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
