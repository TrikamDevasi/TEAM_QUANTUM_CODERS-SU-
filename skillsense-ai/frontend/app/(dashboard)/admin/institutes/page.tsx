'use client';

import React from 'react';
import { sampleInstitutions } from '../../../../data/sampleInstitutions';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

const TYPE_COLORS = { ITI: '#3b82f6', Polytechnic: '#8b5cf6', Vocational: '#10b981' };

export default function InstitutesPage() {
    return (
        <div style={{ color: WHITE, maxWidth: 1100 }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                    🏫 Institute <span style={{ color: GOLD }}>Registry</span>
                </h1>
                <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                    {sampleInstitutions.length} registered institutions
                </p>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                {(['ITI', 'Polytechnic', 'Vocational'] as const).map((type) => {
                    const count = sampleInstitutions.filter((i) => i.type === type).length;
                    return (
                        <div key={type} style={{ padding: '12px 18px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${TYPE_COLORS[type]}30`, borderRadius: 12 }}>
                            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: TYPE_COLORS[type] }}>{count}</p>
                            <p style={{ margin: '2px 0 0', fontSize: 12, color: MUTED }}>{type}</p>
                        </div>
                    );
                })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                {sampleInstitutions.map((inst) => (
                    <div
                        key={inst.id}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(212,168,67,0.18)',
                            borderRadius: 14,
                            padding: '18px 20px',
                            transition: 'border-color 0.2s',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,168,67,0.45)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,168,67,0.18)'; }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: WHITE }}>{inst.name}</h3>
                                <p style={{ margin: '3px 0 0', fontSize: 12, color: MUTED }}>{inst.state}</p>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: `${TYPE_COLORS[inst.type]}18`, color: TYPE_COLORS[inst.type], border: `1px solid ${TYPE_COLORS[inst.type]}40` }}>
                                {inst.type}
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
                            <div>
                                <p style={{ margin: 0, fontSize: 11, color: MUTED }}>Students</p>
                                <p style={{ margin: '2px 0 0', fontSize: 16, fontWeight: 700, color: WHITE }}>{inst.students.toLocaleString('en-IN')}</p>
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: 11, color: MUTED }}>Placement</p>
                                <p style={{ margin: '2px 0 0', fontSize: 16, fontWeight: 700, color: inst.placementRate >= 80 ? '#22c55e' : GOLD }}>{inst.placementRate}%</p>
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: 11, color: MUTED }}>NSQF</p>
                                <p style={{ margin: '2px 0 0', fontSize: 16, fontWeight: 700, color: MUTED }}>{inst.nsqfLevel}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 6 }}>
                            <button style={{ flex: 1, padding: '7px', borderRadius: 8, border: `1px solid ${GOLD}`, background: 'transparent', color: GOLD, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>View Details</button>
                            <button style={{ flex: 1, padding: '7px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: MUTED, fontSize: 11, cursor: 'pointer' }}>Edit</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
