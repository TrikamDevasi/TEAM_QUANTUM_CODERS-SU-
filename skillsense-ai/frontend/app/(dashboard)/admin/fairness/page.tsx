'use client';

import React from 'react';
import FairnessDistribution from '../../../../components/charts/FairnessDistribution';
import { sampleFairnessMetrics, sampleFairnessHistory } from '../../../../data/sampleFairnessMetrics';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

export default function FairnessPage() {
    const { overallFairnessScore, genderGap, regionGap, flags, lastAuditDate, period } = sampleFairnessMetrics;

    return (
        <div style={{ color: WHITE, maxWidth: 1100 }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                    Fairness <span style={{ color: GOLD }}>Monitoring</span>
                </h1>
                <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                    {period} • Last audit: {new Date(lastAuditDate).toLocaleDateString('en-IN')}
                </p>
            </div>

            {/* Overall score */}
            <div style={{ display: 'flex', gap: 20, marginBottom: 28, flexWrap: 'wrap', alignItems: 'stretch' }}>
                <div style={{ padding: '20px 28px', background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.3)', borderRadius: 14, minWidth: 180 }}>
                    <p style={{ margin: '0 0 4px', fontSize: 12, color: MUTED, textTransform: 'uppercase' }}>Overall Score</p>
                    <p style={{ margin: 0, fontSize: 44, fontWeight: 800, color: overallFairnessScore >= 80 ? '#22c55e' : overallFairnessScore >= 65 ? GOLD : '#ef4444', lineHeight: 1 }}>
                        {overallFairnessScore}
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: 12, color: MUTED }}>/ 100</p>
                </div>

                <div style={{ flex: 1, padding: '18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <p style={{ margin: '0 0 6px', fontSize: 12, color: MUTED, textTransform: 'uppercase' }}>Historical Trend</p>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 50 }}>
                        {sampleFairnessHistory.map((h) => (
                            <div key={h.period} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: '100%', height: `${((h.score - 60) / 40) * 100}%`, background: GOLD, borderRadius: '2px 2px 0 0', minHeight: 4, transition: 'height 0.5s ease' }} />
                                <span style={{ fontSize: 9, color: MUTED, whiteSpace: 'nowrap' }}>{h.period.split(' ')[0]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, marginBottom: 24 }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,168,67,0.18)', borderRadius: 14, padding: '20px' }}>
                    <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700 }}>Score Distribution</h3>
                    <p style={{ margin: '0 0 14px', fontSize: 12, color: MUTED }}>Gender & region breakdown</p>
                    <FairnessDistribution data={sampleFairnessMetrics} />
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,168,67,0.18)', borderRadius: 14, padding: '20px' }}>
                    <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700 }}>Equity Flags</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {flags.map((flag) => {
                            const color = flag.severity === 'high' ? '#ef4444' : flag.severity === 'medium' ? GOLD : '#22c55e';
                            return (
                                <div key={flag.dimension} style={{ padding: '10px 14px', background: `${color}08`, border: `1px solid ${color}30`, borderRadius: 8 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <p style={{ margin: 0, fontSize: 12, color: WHITE }}>{flag.dimension}</p>
                                        <span style={{ fontSize: 11, fontWeight: 700, color }}>{flag.gapPercent}% gap</span>
                                    </div>
                                    <p style={{ margin: '4px 0 0', fontSize: 10, color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{flag.severity} severity</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
