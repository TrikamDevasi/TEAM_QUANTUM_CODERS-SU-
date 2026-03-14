'use client';

import React, { useState } from 'react';
import { sampleInternshipFeedback } from '../../../../data/sampleEmployers';

const GOLD = '#D4A843';
const CYAN = '#06b6d4';
const AMBER = '#F59E0B';

const renderStars = (rating: number) => (
    <div style={{ display: 'flex', gap: 2 }}>
        {[1, 2, 3, 4, 5].map(s => (
            <div key={s} style={{
                width: 14, height: 14, borderRadius: 3,
                background: s <= rating ? GOLD : 'rgba(212,168,67,0.1)',
                transition: 'background 0.2s',
            }} />
        ))}
    </div>
);

export default function EmployerFeedbackPage() {
    const [showForm, setShowForm] = useState(false);
    const [formSuccess, setFormSuccess] = useState(false);

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
                        Internship <span style={{ color: CYAN }}>Feedback</span>
                    </h1>
                    <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                        Submit and review internship performance evaluations
                    </p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ fontSize: 13 }}>
                    {showForm ? 'Cancel' : 'Submit Feedback'}
                </button>
            </div>

            {/* Submit form */}
            {showForm && (
                <div className="stat-card" style={{ marginBottom: 20, borderColor: 'rgba(6,182,212,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                        <div style={{ width: 4, height: 18, borderRadius: 2, background: CYAN }} />
                        <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>New Internship Feedback</h3>
                    </div>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                            {[
                                { label: 'Student Name', placeholder: 'Arjun Mehta' },
                                { label: 'Role / Position', placeholder: 'Software Developer Intern' },
                                { label: 'Department', placeholder: 'Product Engineering' },
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
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
                            {['Overall', 'Technical', 'Communication', 'Teamwork', 'Punctuality'].map(r => (
                                <div key={r}>
                                    <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>{r} (1-5)</label>
                                    <input required type="number" min="1" max="5" placeholder="4" style={{
                                        width: '100%', padding: '10px 14px', borderRadius: 10,
                                        border: '1px solid rgba(6,182,212,0.15)', background: 'rgba(6,182,212,0.03)',
                                        color: '#fff', fontSize: 13, outline: 'none',
                                    }} />
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <div>
                                <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Strengths (comma separated)</label>
                                <input type="text" placeholder="React.js, Problem Solving, Team Work" style={{
                                    width: '100%', padding: '10px 14px', borderRadius: 10,
                                    border: '1px solid rgba(6,182,212,0.15)', background: 'rgba(6,182,212,0.03)',
                                    color: '#fff', fontSize: 13, outline: 'none',
                                }} />
                            </div>
                            <div>
                                <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Areas for Improvement</label>
                                <input type="text" placeholder="Time Management, Documentation" style={{
                                    width: '100%', padding: '10px 14px', borderRadius: 10,
                                    border: '1px solid rgba(6,182,212,0.15)', background: 'rgba(6,182,212,0.03)',
                                    color: '#fff', fontSize: 13, outline: 'none',
                                }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Detailed Feedback</label>
                            <textarea required rows={3} placeholder="Provide detailed evaluation..." style={{
                                width: '100%', padding: '10px 14px', borderRadius: 10,
                                border: '1px solid rgba(6,182,212,0.15)', background: 'rgba(6,182,212,0.03)',
                                color: '#fff', fontSize: 13, outline: 'none', resize: 'vertical',
                            }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <label style={{ fontSize: 13, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                <input type="checkbox" style={{ accentColor: CYAN }} /> Would hire this student
                            </label>
                            <button type="submit" className="btn-primary" style={{ marginLeft: 'auto', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                                {formSuccess ? (
                                    <><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} /> Submitted</>
                                ) : 'Submit Feedback'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Feedback list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {sampleInternshipFeedback.map(f => (
                    <div key={f.id} className="stat-card" style={{ transition: 'border-color 0.2s' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(6,182,212,0.25)')}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.1)')}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                    <span className="font-display" style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{f.studentName}</span>
                                    <span style={{
                                        fontSize: 10, padding: '2px 8px', borderRadius: 99, fontWeight: 700,
                                        background: f.status === 'completed' ? 'rgba(34,197,94,0.12)' : f.status === 'ongoing' ? 'rgba(6,182,212,0.12)' : 'rgba(239,68,68,0.12)',
                                        color: f.status === 'completed' ? '#22c55e' : f.status === 'ongoing' ? CYAN : '#ef4444',
                                    }}>{f.status}</span>
                                    {f.wouldHire && (
                                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: 'rgba(34,197,94,0.12)', color: '#22c55e', fontWeight: 700 }}>
                                            Would Hire
                                        </span>
                                    )}
                                </div>
                                <div style={{ fontSize: 13, color: '#94a3b8' }}>{f.role} at <span style={{ color: CYAN, fontWeight: 600 }}>{f.companyName}</span></div>
                                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{f.department} · {f.startDate} to {f.endDate}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div className="font-display" style={{ fontSize: 28, fontWeight: 800, color: f.overallRating >= 4 ? '#22c55e' : f.overallRating >= 3 ? AMBER : '#ef4444' }}>
                                    {f.overallRating}<span style={{ fontSize: 14, color: '#64748b' }}>/5</span>
                                </div>
                            </div>
                        </div>

                        {/* Ratings grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 14 }}>
                            {[
                                { label: 'Technical', value: f.technicalRating },
                                { label: 'Communication', value: f.communicationRating },
                                { label: 'Teamwork', value: f.teamworkRating },
                                { label: 'Punctuality', value: f.punctualityRating },
                                { label: 'Overall', value: f.overallRating },
                            ].map(r => (
                                <div key={r.label} className="glass" style={{ padding: '8px', borderRadius: 8, textAlign: 'center' }}>
                                    <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{r.label}</div>
                                    {renderStars(r.value)}
                                </div>
                            ))}
                        </div>

                        {/* Strengths & Improvements */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                            <div>
                                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>Strengths</div>
                                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                    {f.strengths.map(s => (
                                        <span key={s} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>{s}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>Areas to Improve</div>
                                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                    {f.areasOfImprovement.map(a => (
                                        <span key={a} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, background: 'rgba(245,158,11,0.1)', color: AMBER }}>{a}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Feedback text */}
                        <div className="glass" style={{ padding: '10px 14px', borderRadius: 8, fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
                            {f.feedback}
                        </div>
                        <div style={{ fontSize: 11, color: '#475569', marginTop: 8 }}>
                            Supervisor: {f.supervisorName} · Submitted {new Date(f.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
