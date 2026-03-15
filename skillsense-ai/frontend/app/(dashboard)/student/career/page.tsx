'use client';

import { useState, useEffect } from 'react';
import api from '../../../../lib/api';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const GOLD   = '#D4A843';
const AMBER  = '#F59E0B';
const INDIGO = '#6366f1';
const GREEN  = '#22c55e';
const ORANGE = '#f97316';
const PURPLE = '#8b5cf6';

const SKILL_OPTIONS = ['JavaScript', 'React', 'Python', 'Node.js', 'TypeScript', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Machine Learning', 'UI/UX Design', 'Java'];
const INTEREST_OPTIONS = ['Web Development', 'Data Science', 'DevOps / Cloud', 'Mobile Apps', 'AI / ML', 'Cybersecurity', 'Game Dev', 'Blockchain', 'IoT', 'Product Management'];
const EDUCATION_OPTIONS = ['10th Pass', '12th Pass', 'Diploma', 'B.Tech / B.E', 'BCA / BSc IT', 'MCA / M.Tech', 'MBA', 'Other'];

interface Career {
    title: string;
    match: number;
    salaryRange: string;
    growth: string;
    missingSkills: string[];
    timeToReady: string;
    roadmap: string[];
}

export default function CareerPage() {
    const { user, isLoading } = useAuth();
    const [step, setStep]         = useState<1 | 2 | 3>(1);
    const [skills, setSkills]     = useState<string[]>([]);
    const [interests, setInterests] = useState<string[]>([]);
    const [education, setEducation] = useState('');
    const [careers, setCareers]   = useState<Career[]>([]);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState<string | null>(null);
    const [expanded, setExpanded] = useState<number | null>(0);

    if (isLoading) return <div style={{ padding: 40, color: '#64748b' }}>Loading...</div>;

    function toggleSkill(s: string) { setSkills(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s].slice(0, 8)); }
    function toggleInterest(i: string) { setInterests(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i].slice(0, 5)); }

    async function predict() {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/ai/predict-career', { skills, interests, education });
            if (!data.data?.careers?.length) throw new Error('No predictions');
            setCareers(data.data.careers);
            setStep(3);
        } catch {
            setError('Career prediction failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const growthColor = (g: string) => g === 'Very High' || g === 'High' ? GREEN : g === 'Medium' ? AMBER : ORANGE;

    // ── STEP 1: Skills ────────────────────────────────────────────────────────
    if (step === 1) return (
        <div style={{ color: '#fff', maxWidth: 720 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>AI Career Predictor</h1>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Tell us your skills, interests & background — get AI-powered career paths.</p>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '24px', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg, ${INDIGO}, ${PURPLE})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>1</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Your Skills <span style={{ color: '#64748b', fontWeight: 400, fontSize: 12 }}>(max 8)</span></div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {SKILL_OPTIONS.map(s => (
                        <button key={s} onClick={() => toggleSkill(s)} style={{
                            padding: '7px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                            background: skills.includes(s) ? `${GOLD}18` : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${skills.includes(s) ? `${GOLD}50` : 'rgba(255,255,255,0.08)'}`,
                            color: skills.includes(s) ? GOLD : '#64748b',
                        }}>{skills.includes(s) ? '✓ ' : ''}{s}</button>
                    ))}
                </div>
            </div>

            <button onClick={() => skills.length > 0 && setStep(2)} disabled={skills.length === 0} style={{
                padding: '10px 24px', borderRadius: 9, border: 'none', fontSize: 13, fontWeight: 700,
                background: skills.length > 0 ? `linear-gradient(135deg, ${INDIGO}, ${PURPLE})` : 'rgba(255,255,255,0.06)',
                color: skills.length > 0 ? '#fff' : '#475569', cursor: skills.length > 0 ? 'pointer' : 'not-allowed',
            }}>
                Next: Interests →
            </button>
        </div>
    );

    // ── STEP 2: Interests + Education ─────────────────────────────────────────
    if (step === 2) return (
        <div style={{ color: '#fff', maxWidth: 720 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 24 }}>AI Career Predictor</h1>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '24px', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg, ${GOLD}, #8b6512)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#1a0f00' }}>2</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Interests <span style={{ color: '#64748b', fontWeight: 400, fontSize: 12 }}>(max 5)</span></div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                    {INTEREST_OPTIONS.map(i => (
                        <button key={i} onClick={() => toggleInterest(i)} style={{
                            padding: '7px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                            background: interests.includes(i) ? `${GOLD}18` : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${interests.includes(i) ? `${GOLD}50` : 'rgba(255,255,255,0.08)'}`,
                            color: interests.includes(i) ? GOLD : '#64748b',
                        }}>{interests.includes(i) ? '✓ ' : ''}{i}</button>
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: `linear-gradient(135deg, #22c55e, #16a34a)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff' }}>3</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Education Level</div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {EDUCATION_OPTIONS.map(e => (
                        <button key={e} onClick={() => setEducation(e)} style={{
                            padding: '7px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                            background: education === e ? `${INDIGO}18` : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${education === e ? `${INDIGO}50` : 'rgba(255,255,255,0.08)'}`,
                            color: education === e ? '#a5b4fc' : '#64748b',
                        }}>{education === e ? '✓ ' : ''}{e}</button>
                    ))}
                </div>
            </div>

            {error && <div style={{ color: '#ef4444', fontSize: 13, marginBottom: 16, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8 }}>{error}</div>}

            <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(1)} style={{ padding: '10px 20px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>← Back</button>
                <button onClick={predict} disabled={loading || interests.length === 0 || !education} style={{
                    padding: '10px 24px', borderRadius: 9, border: 'none', fontSize: 13, fontWeight: 700,
                    background: interests.length > 0 && education ? `linear-gradient(135deg, ${INDIGO}, ${PURPLE})` : 'rgba(255,255,255,0.06)',
                    color: interests.length > 0 && education ? '#fff' : '#475569', cursor: interests.length > 0 && education ? 'pointer' : 'not-allowed',
                }}>
                    {loading ? '🔮 AI is predicting your career...' : '✨ Predict My Career'}
                </button>
            </div>

            {loading && (
                <div style={{ marginTop: 16, padding: '14px 16px', background: `${INDIGO}08`, border: `1px solid ${INDIGO}20`, borderRadius: 10 }}>
                    <div style={{ fontSize: 13, color: '#a5b4fc', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 16, height: 16, border: '2px solid rgba(99,102,241,0.3)', borderTopColor: INDIGO, borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
                        Analysing your profile with AI... This takes 5-10 seconds.
                    </div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            )}
        </div>
    );

    // ── STEP 3: Results ───────────────────────────────────────────────────────
    return (
        <div style={{ color: '#fff', maxWidth: 720 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', margin: 0 }}>Your Career Predictions</h1>
                    <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Based on your skills and interests — powered by GPT-4o-mini</p>
                </div>
                <button onClick={() => { setStep(1); setCareers([]); setSkills([]); setInterests([]); setEducation(''); }} style={{
                    padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#94a3b8', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                }}>Start Over</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {careers.map((c, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${i === 0 ? `${GOLD}30` : 'rgba(255,255,255,0.07)'}`, borderRadius: 14, overflow: 'hidden' }}>
                        {/* Career header */}
                        <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }} onClick={() => setExpanded(expanded === i ? null : i)}>
                            <div style={{ width: 46, height: 46, borderRadius: 12, background: `${i === 0 ? GOLD : i === 1 ? INDIGO : PURPLE}18`, border: `1px solid ${i === 0 ? GOLD : i === 1 ? INDIGO : PURPLE}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                                {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                    <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{c.title}</span>
                                    {i === 0 && <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 99, background: `${GOLD}18`, color: GOLD, border: `1px solid ${GOLD}30` }}>BEST MATCH</span>}
                                </div>
                                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#64748b' }}>
                                    <span>💰 {c.salaryRange}</span>
                                    <span style={{ color: growthColor(c.growth) }}>📈 {c.growth} demand</span>
                                    <span>⏱ {c.timeToReady}</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'center', flexShrink: 0 }}>
                                <div style={{ fontSize: 24, fontWeight: 900, color: i === 0 ? GOLD : i === 1 ? INDIGO : PURPLE, fontFamily: 'Space Grotesk, sans-serif' }}>{c.match}%</div>
                                <div style={{ fontSize: 9, color: '#64748b', marginTop: 2 }}>Match</div>
                                {/* Match bar */}
                                <div style={{ width: 60, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden', marginTop: 4 }}>
                                    <div style={{ height: '100%', width: `${c.match}%`, background: i === 0 ? GOLD : i === 1 ? INDIGO : PURPLE, borderRadius: 2 }} />
                                </div>
                            </div>
                            <div style={{ fontSize: 14, color: '#475569' }}>{expanded === i ? '▲' : '▼'}</div>
                        </div>

                        {/* Expanded roadmap */}
                        {expanded === i && (
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px' }}>
                                {c.missingSkills?.length > 0 && (
                                    <div style={{ marginBottom: 16 }}>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: AMBER, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Skills to Acquire</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                            {c.missingSkills.map((s, j) => (
                                                <span key={j} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 99, background: `${AMBER}10`, border: `1px solid ${AMBER}25`, color: AMBER }}>{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {c.roadmap?.length > 0 && (
                                    <div>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Roadmap</div>
                                        {c.roadmap.map((step, k) => (
                                            <div key={k} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                                                <div style={{ width: 20, height: 20, borderRadius: '50%', background: `${INDIGO}20`, border: `1px solid ${INDIGO}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#a5b4fc', flexShrink: 0, marginTop: 1 }}>{k + 1}</div>
                                                <span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{step}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
