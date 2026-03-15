'use client';

import { useState } from 'react';
import api from '../../../../lib/api';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { AssessmentHistory } from '@/types/api';
import toast from 'react-hot-toast';

const GOLD   = '#D4A843';
const AMBER  = '#F59E0B';
const INDIGO = '#6366f1';
const GREEN  = '#22c55e';
const RED    = '#ef4444';

const TOPICS = [
    { id: 'JavaScript',    icon: '🟨', desc: 'Variables, functions, async/await, ES6+' },
    { id: 'React',         icon: '⚛️',  desc: 'Components, hooks, state management' },
    { id: 'Python',        icon: '🐍',  desc: 'Syntax, OOP, libraries, data handling' },
    { id: 'Node.js',       icon: '🟩',  desc: 'Express, REST APIs, file system' },
    { id: 'SQL',           icon: '🗄️',  desc: 'Queries, joins, aggregations, indexes' },
    { id: 'System Design', icon: '🏗️',  desc: 'Architecture, scalability, databases' },
];

interface Question {
    question: string;
    options: string[];
    correct: string;
}

interface EvalResult {
    score: number;
    correct: number;
    total: number;
    level: string;
    weakAreas: string[];
    strengths: string[];
    improvementPlan: string;
    nextSteps: string[];
}

export default function AssessmentPage() {
    const { user } = useAuth();
    const { data: history, refetch: refetchHistory } = useApi<AssessmentHistory[]>('/assessments/history');
    
    const [phase, setPhase]       = useState<'select' | 'quiz' | 'result'>('select');
    const [topic, setTopic]       = useState('');
    const [level, setLevel]       = useState('Intermediate');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers]   = useState<{ question: string; userAnswer: string; correctAnswer: string }[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [result, setResult]     = useState<EvalResult | null>(null);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState<string | null>(null);

    async function startAssessment() {
        if (!topic) return;
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/ai/assess-skill', { topic, level });
            if (!data.data?.questions?.length) throw new Error('No questions returned');
            setQuestions(data.data.questions);
            setAnswers([]);
            setCurrentQ(0);
            setSelected(null);
            setPhase('quiz');
        } catch {
            setError('Failed to generate assessment. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    function handleAnswer(opt: string) {
        if (selected) return; // already answered
        setSelected(opt);
        const q = questions[currentQ];
        const letter = opt.charAt(0).toUpperCase();
        const correctLetter = q.correct.charAt(0).toUpperCase();
        setAnswers(prev => [...prev, { question: q.question, userAnswer: letter, correctAnswer: correctLetter }]);
    }

    async function nextOrFinish() {
        if (currentQ < questions.length - 1) {
            setCurrentQ(p => p + 1);
            setSelected(null);
        } else {
            // evaluate
            setLoading(true);
            try {
                const { data } = await api.post('/ai/assess-skill/evaluate', { topic, answers });
                const evalResult: EvalResult = data.data;
                setResult(evalResult);
                
                // Save to database
                await api.post('/assessments/submit', {
                    category: topic,
                    score: evalResult.score,
                    totalQuestions: evalResult.total,
                    aiAnalysis: evalResult.improvementPlan
                });
                
                toast.success('Assessment saved to your profile');
                refetchHistory();
                setPhase('result');
            } catch (err: any) {
                setError('Evaluation failed. Please try again.');
                toast.error('Failed to save assessment');
            } finally {
                setLoading(false);
            }
        }
    }

    // ── SELECT TOPIC ──────────────────────────────────────────────────────────
    if (phase === 'select') return (
        <div style={{ color: '#fff', maxWidth: 800 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>AI Skill Assessment</h1>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28 }}>5 AI-generated questions. Get instant score + improvement plan.</p>

            <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Choose Topic</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {TOPICS.map(t => (
                        <button key={t.id} onClick={() => setTopic(t.id)} style={{
                            background: topic === t.id ? `${INDIGO}18` : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${topic === t.id ? `${INDIGO}50` : 'rgba(255,255,255,0.07)'}`,
                            borderRadius: 12, padding: '16px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
                        }}>
                            <div style={{ fontSize: 22, marginBottom: 6 }}>{t.icon}</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{t.id}</div>
                            <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{t.desc}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Difficulty</div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                        <button key={l} onClick={() => setLevel(l)} style={{
                            padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            background: level === l ? `${GOLD}18` : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${level === l ? `${GOLD}50` : 'rgba(255,255,255,0.07)'}`,
                            color: level === l ? GOLD : '#64748b', transition: 'all 0.2s',
                        }}>{l}</button>
                    ))}
                </div>
            </div>

            {error && <div style={{ color: RED, fontSize: 13, marginBottom: 16, padding: '10px 14px', background: `${RED}12`, border: `1px solid ${RED}30`, borderRadius: 8 }}>{error}</div>}

            <button onClick={startAssessment} disabled={!topic || loading} style={{
                padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                background: topic ? `linear-gradient(135deg, ${INDIGO}, #8b5cf6)` : 'rgba(255,255,255,0.06)',
                color: topic ? '#fff' : '#475569', border: 'none', cursor: topic ? 'pointer' : 'not-allowed',
                boxShadow: topic ? '0 4px 20px rgba(99,102,241,0.35)' : 'none', transition: 'all 0.2s',
            }}>
                {loading ? '⏳ Generating questions...' : '🚀 Start Assessment'}
            </button>

            {/* History segment */}
            {history && history.length > 0 && (
                <div style={{ marginTop: 40, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Your Recent Assessments</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
                        {history.map(h => (
                            <div key={h._id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 10, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{h.category}</div>
                                    <div style={{ fontSize: 11, color: '#64748b' }}>{new Date(h.completedAt).toLocaleDateString()}</div>
                                </div>
                                <div style={{ fontSize: 16, fontWeight: 900, color: GOLD }}>{Math.round((h.score / h.totalQuestions) * 100)}%</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    // ── QUIZ ──────────────────────────────────────────────────────────────────
    if (phase === 'quiz') {
        const q = questions[currentQ];
        const progress = ((currentQ) / questions.length) * 100;
        const correctLetter = q?.correct?.charAt(0).toUpperCase();

        return (
            <div style={{ color: '#fff', maxWidth: 640 }}>
                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b', marginBottom: 8 }}>
                        <span>{topic} · {level}</span>
                        <span>Question {currentQ + 1} / {questions.length}</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${INDIGO}, #8b5cf6)`, borderRadius: 2, transition: 'width 0.4s ease' }} />
                    </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '24px', marginBottom: 16 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', lineHeight: 1.65, margin: '0 0 24px' }}>{q?.question}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {q?.options?.map((opt, i) => {
                            const letter = opt.charAt(0).toUpperCase();
                            const isSelected  = selected === opt;
                            const isCorrect   = selected && letter === correctLetter;
                            const isWrong     = selected === opt && letter !== correctLetter;
                            return (
                                <button key={i} onClick={() => handleAnswer(opt)} disabled={!!selected} style={{
                                    padding: '12px 16px', borderRadius: 9, textAlign: 'left', fontSize: 13,
                                    cursor: selected ? 'default' : 'pointer',
                                    background: isCorrect && isSelected ? `${GREEN}18` : isWrong ? `${RED}18` : selected && letter === correctLetter ? `${GREEN}18` : isSelected ? `${INDIGO}18` : 'rgba(255,255,255,0.03)',
                                    border: `1px solid ${isCorrect && isSelected ? GREEN : isWrong ? RED : selected && letter === correctLetter ? GREEN : isSelected ? INDIGO : 'rgba(255,255,255,0.07)'}`,
                                    color: isWrong ? RED : selected && letter === correctLetter ? GREEN : '#94a3b8',
                                    transition: 'all 0.2s',
                                }}>
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {selected && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={nextOrFinish} disabled={loading} style={{
                            padding: '10px 24px', borderRadius: 9, border: 'none', fontSize: 13, fontWeight: 700,
                            background: `linear-gradient(135deg, ${INDIGO}, #8b5cf6)`, color: '#fff', cursor: 'pointer',
                        }}>
                            {loading ? '⏳ Evaluating...' : currentQ < questions.length - 1 ? 'Next Question →' : '🎯 Get Results'}
                        </button>
                    </div>
                )}
            </div>
        );
    }

    // ── RESULT ────────────────────────────────────────────────────────────────
    if (phase === 'result' && result) {
        const scoreColor = result.score >= 80 ? GREEN : result.score >= 50 ? AMBER : RED;
        const circumference = 2 * Math.PI * 40;
        return (
            <div style={{ color: '#fff', maxWidth: 680 }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px', marginBottom: 20, textAlign: 'center' }}>
                    <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 16px' }}>
                        <svg viewBox="0 0 100 100" style={{ width: 100, height: 100, transform: 'rotate(-90deg)' }}>
                            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke={scoreColor} strokeWidth="8"
                                strokeDasharray={`${(result.score / 100) * circumference} ${circumference}`}
                                strokeLinecap="round" />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: 26, fontWeight: 900, color: scoreColor }}>{result.score}%</span>
                        </div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>{result.correct}/{result.total} Correct · {result.level}</div>
                    <div style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>Topic: {topic}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    {result.strengths.length > 0 && (
                        <div style={{ background: `${GREEN}08`, border: `1px solid ${GREEN}20`, borderRadius: 12, padding: '16px' }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: GREEN, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>✅ Strengths</div>
                            {result.strengths.map((s, i) => <div key={i} style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>• {s}</div>)}
                        </div>
                    )}
                    {result.weakAreas.length > 0 && (
                        <div style={{ background: `${RED}08`, border: `1px solid ${RED}20`, borderRadius: 12, padding: '16px' }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: RED, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>⚠️ Weak Areas</div>
                            {result.weakAreas.map((w, i) => <div key={i} style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>• {w}</div>)}
                        </div>
                    )}
                </div>

                <div style={{ background: `${INDIGO}08`, border: `1px solid ${INDIGO}20`, borderRadius: 12, padding: '16px', marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: INDIGO, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>📋 Improvement Plan</div>
                    <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>{result.improvementPlan}</p>
                </div>

                {result.nextSteps.length > 0 && (
                    <div style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}20`, borderRadius: 12, padding: '16px', marginBottom: 24 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: GOLD, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>🚀 Next Steps</div>
                        {result.nextSteps.map((s, i) => (
                            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                                <span style={{ color: GOLD, fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{i + 1}.</span>
                                <span style={{ fontSize: 13, color: '#94a3b8' }}>{s}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => { setPhase('select'); setResult(null); setQuestions([]); }} style={{
                        padding: '10px 20px', borderRadius: 9, border: 'none', fontSize: 13, fontWeight: 700,
                        background: `linear-gradient(135deg, ${INDIGO}, #8b5cf6)`, color: '#fff', cursor: 'pointer',
                    }}>Retake / New Topic</button>
                    <Link href="/student/career" style={{
                        padding: '10px 20px', borderRadius: 9, fontSize: 13, fontWeight: 700, textDecoration: 'none',
                        background: `${GOLD}18`, border: `1px solid ${GOLD}30`, color: GOLD,
                    }}>Predict My Career →</Link>
                </div>
            </div>
        );
    }

    return null;
}
