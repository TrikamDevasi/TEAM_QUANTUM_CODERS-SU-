'use client';

import React, { useState } from 'react';
import ProgramROIBar from '../../../../components/charts/ProgramROIBar';
import { sampleInstitutions } from '../../../../data/sampleInstitutions';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

export default function ROIPage() {
    const [selected, setSelected] = useState(sampleInstitutions[0].id);
    const institute = sampleInstitutions.find((i) => i.id === selected) ?? sampleInstitutions[0];

    const avgROI = Math.round(institute.programROI.reduce((s, p) => s + p.roi, 0) / institute.programROI.length);
    const topROI = [...institute.programROI].sort((a, b) => b.roi - a.roi)[0];

    return (
        <div style={{ color: WHITE, maxWidth: 1000 }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                    Program <span style={{ color: GOLD }}>ROI</span>
                </h1>
                <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>Return on investment by program — institutional view</p>
            </div>

            {/* Institution selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                {sampleInstitutions.map((inst) => (
                    <button
                        key={inst.id}
                        onClick={() => setSelected(inst.id)}
                        style={{
                            padding: '7px 14px',
                            borderRadius: 8,
                            border: `1px solid ${selected === inst.id ? GOLD : 'rgba(255,255,255,0.12)'}`,
                            background: selected === inst.id ? 'rgba(212,168,67,0.15)' : 'rgba(255,255,255,0.03)',
                            color: selected === inst.id ? GOLD : MUTED,
                            fontSize: 12,
                            fontWeight: selected === inst.id ? 700 : 400,
                            cursor: 'pointer',
                        }}
                    >
                        {inst.name.split(' ').slice(0, 2).join(' ')}
                    </button>
                ))}
            </div>

            {/* Summary cards */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                {[
                    { label: 'Avg ROI', value: `${avgROI}%`, color: GOLD },
                    { label: 'Top Program', value: topROI.program, color: WHITE },
                    { label: 'Best ROI', value: `${topROI.roi}%`, color: '#22c55e' },
                    { label: 'Programs', value: `${institute.programROI.length}`, color: MUTED },
                ].map((s) => (
                    <div key={s.label} style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, minWidth: 140 }}>
                        <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: MUTED }}>{s.label}</p>
                    </div>
                ))}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,168,67,0.18)', borderRadius: 14, padding: '24px' }}>
                <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700 }}>
                    Program ROI — {institute.name}
                </h3>
                <p style={{ margin: '0 0 16px', fontSize: 12, color: MUTED }}>ROI % = Net economic benefit / Training cost × 100</p>
                <ProgramROIBar data={institute.programROI} />
            </div>

            {/* ROI breakdown table */}
            <div style={{ marginTop: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                        <tr style={{ background: 'rgba(212,168,67,0.08)' }}>
                            {['Program', 'ROI %', 'Tier'].map((h) => (
                                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[...institute.programROI].sort((a, b) => b.roi - a.roi).map((prog, i) => (
                            <tr key={prog.program}>
                                <td style={{ padding: '10px 14px', color: WHITE, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{prog.program}</td>
                                <td style={{ padding: '10px 14px', fontWeight: 700, color: prog.roi >= 400 ? '#22c55e' : prog.roi >= 280 ? GOLD : MUTED, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{prog.roi}%</td>
                                <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20, background: i === 0 ? 'rgba(34,197,94,0.15)' : i === 1 ? 'rgba(212,168,67,0.15)' : 'rgba(255,255,255,0.06)', color: i === 0 ? '#22c55e' : i === 1 ? GOLD : MUTED, border: `1px solid ${i === 0 ? 'rgba(34,197,94,0.3)' : i === 1 ? 'rgba(212,168,67,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                                        {i === 0 ? '🥇 Best' : i === 1 ? '🥈 Strong' : '🥉 Good'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
