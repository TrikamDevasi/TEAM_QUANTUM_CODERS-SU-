'use client';

import React, { useState } from 'react';
import { sampleStudents } from '../../../../data/sampleStudents';

const GOLD = '#D4A843';
const GOLD_L = '#F0C05A';
const AMBER = '#F59E0B';
const ORANGE = '#F97316';
const S = sampleStudents[0];

export default function AIAnalyzerPage() {
    const [analyzing, setAnalyzing] = useState(false);
    const [done, setDone] = useState(false);

    const run = () => {
        setAnalyzing(true);
        setTimeout(() => { setAnalyzing(false); setDone(true); }, 2200);
    };

    const dims = [
        { label: 'Problem Solving', score: 85, color: GOLD },
        { label: 'Technical Skills', score: 88, color: GOLD_L },
        { label: 'Communication', score: 72, color: AMBER },
        { label: 'Project Experience', score: 79, color: ORANGE },
        { label: 'Industry Readiness', score: 74, color: '#a78bfa' },
    ];

    return (
        <div style={{ color: '#fff', maxWidth: 900 }}>
            <div style={{ marginBottom: 24 }}>
                <h1 className="font-display" style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>
                    AI Skill <span style={{ color: GOLD }}>Analyzer</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                    Upload your resume, projects, or link GitHub to get an AI-powered skill analysis
                </p>
            </div>

            {/* Upload cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
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

            {/* AI analysis button */}
            <div className="stat-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                    <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>AI Skill Analyzer</h3>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: GOLD }}>Powered by Gemini AI</span>
                </div>
                <p style={{ color: '#64748b', fontSize: 13, marginBottom: 18, lineHeight: 1.7 }}>
                    Our AI analyses your resume, GitHub repositories, and projects to extract real skills and generate a comprehensive
                    competency score across 50+ dimensions relevant to <strong style={{ color: '#94a3b8' }}>{S.program}</strong>.
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 20 }}>
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
