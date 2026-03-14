'use client';

import React from 'react';
import { sampleInstitutions } from '../../../../data/sampleInstitutions';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

export default function CampusPage() {
    return (
        <div style={{ color: WHITE, maxWidth: 1100 }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                    🤝 Campus <span style={{ color: GOLD }}>Connect</span>
                </h1>
                <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                    Partner with top-performing institutions for direct campus hiring
                </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                {[
                    { label: 'Partner Institutions', value: sampleInstitutions.length },
                    { label: 'Total Students', value: sampleInstitutions.reduce((s, i) => s + i.students, 0).toLocaleString('en-IN') },
                    { label: 'Avg Placement Rate', value: `${Math.round(sampleInstitutions.reduce((s, i) => s + i.placementRate, 0) / sampleInstitutions.length)}%` },
                ].map((stat) => (
                    <div key={stat.label} style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
                        <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: GOLD }}>{stat.value}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: MUTED }}>{stat.label}</p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                {sampleInstitutions.map((inst) => (
                    <div
                        key={inst.id}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(212,168,67,0.18)',
                            borderRadius: 14,
                            padding: '20px',
                            transition: 'border-color 0.2s, transform 0.2s',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,168,67,0.5)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,168,67,0.18)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: WHITE }}>{inst.name}</h3>
                                <p style={{ margin: '3px 0 0', fontSize: 12, color: MUTED }}>{inst.state} • {inst.type} • NSQF {inst.nsqfLevel}</p>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: inst.placementRate >= 80 ? 'rgba(34,197,94,0.15)' : 'rgba(212,168,67,0.15)', color: inst.placementRate >= 80 ? '#22c55e' : GOLD, border: `1px solid ${inst.placementRate >= 80 ? 'rgba(34,197,94,0.3)' : 'rgba(212,168,67,0.3)'}`, flexShrink: 0 }}>
                                {inst.placementRate}% placed
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                            <div>
                                <p style={{ margin: 0, fontSize: 11, color: MUTED }}>Students</p>
                                <p style={{ margin: '2px 0 0', fontSize: 15, fontWeight: 700, color: WHITE }}>{inst.students.toLocaleString('en-IN')}</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: 14 }}>
                            <p style={{ margin: '0 0 6px', fontSize: 11, color: MUTED, textTransform: 'uppercase' }}>Top Programs</p>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {inst.topPrograms.map((p) => (
                                    <span key={p} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(212,168,67,0.08)', color: GOLD, border: '1px solid rgba(212,168,67,0.2)' }}>{p}</span>
                                ))}
                            </div>
                        </div>

                        <button
                            style={{
                                width: '100%',
                                padding: '9px',
                                borderRadius: 8,
                                border: `1px solid ${GOLD}`,
                                background: 'transparent',
                                color: GOLD,
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,168,67,0.1)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >
                            Request Campus Drive
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
