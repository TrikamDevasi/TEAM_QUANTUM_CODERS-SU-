'use client';

import React, { useState } from 'react';
import { sampleStudents } from '../../../../data/sampleStudents';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

export default function TalentPage() {
    const [search, setSearch] = useState('');
    const placed = sampleStudents.filter((s) => s.placementStatus === 'placed');
    const seeking = sampleStudents.filter((s) => s.placementStatus === 'seeking');

    const pool = sampleStudents.filter((s) => {
        const q = search.toLowerCase();
        return q === '' || s.name.toLowerCase().includes(q) || s.program.toLowerCase().includes(q) || s.state.toLowerCase().includes(q);
    });

    return (
        <div style={{ color: WHITE, maxWidth: 1100 }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                    👔 Talent <span style={{ color: GOLD }}>Pool</span>
                </h1>
                <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                    Browse verified, NSQF-certified candidates
                </p>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                {[
                    { label: 'Total Profiles', value: sampleStudents.length, color: WHITE },
                    { label: 'Seeking Jobs', value: seeking.length, color: GOLD },
                    { label: 'Placed', value: placed.length, color: '#22c55e' },
                ].map((s) => (
                    <div key={s.label} style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
                        <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: MUTED }}>{s.label}</p>
                    </div>
                ))}
            </div>

            <input
                type="text"
                placeholder="Search talent by name, program, state…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '10px 14px', color: WHITE, fontSize: 13, outline: 'none', marginBottom: 20, boxSizing: 'border-box' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
                {pool.map((s) => (
                    <div
                        key={s.id}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${s.placementStatus === 'seeking' ? 'rgba(212,168,67,0.3)' : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: 12,
                            padding: '16px',
                            transition: 'border-color 0.2s, transform 0.2s',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,168,67,0.5)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = s.placementStatus === 'seeking' ? 'rgba(212,168,67,0.3)' : 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
                    >
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${GOLD}, #8b6512)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#1a0f00', flexShrink: 0 }}>
                                {s.name.charAt(0)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: WHITE }}>{s.name}</p>
                                <p style={{ margin: '2px 0', fontSize: 12, color: MUTED }}>{s.program} • {s.state}</p>
                                <p style={{ margin: '2px 0', fontSize: 12, color: MUTED }}>NSQF {s.nsqfLevel} • Score: <span style={{ color: GOLD, fontWeight: 600 }}>{s.overallScore}</span></p>
                            </div>
                            {s.placementStatus === 'seeking' && (
                                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: 'rgba(212,168,67,0.15)', color: GOLD, border: '1px solid rgba(212,168,67,0.4)' }}>AVAILABLE</span>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                            {s.skills.slice(0, 3).map((sk) => (
                                <span key={sk.skill} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(255,255,255,0.06)', color: MUTED, border: '1px solid rgba(255,255,255,0.1)' }}>{sk.skill} ({sk.score})</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
