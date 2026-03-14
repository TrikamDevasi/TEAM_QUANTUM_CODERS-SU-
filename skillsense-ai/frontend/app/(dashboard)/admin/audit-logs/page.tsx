'use client';

import React from 'react';
import AuditLogViewer from '../../../../components/dashboard/AuditLogViewer';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

export default function AuditLogsPage() {
    return (
        <div style={{ color: WHITE, maxWidth: 1100 }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                    📜 Audit <span style={{ color: GOLD }}>Logs</span>
                </h1>
                <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                    Immutable system event log — all user actions recorded
                </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                {[
                    { label: 'Events (24h)', value: '47', color: WHITE },
                    { label: 'Failures', value: '3', color: '#ef4444' },
                    { label: 'Warnings', value: '5', color: '#f59e0b' },
                    { label: 'Unique Actors', value: '12', color: GOLD },
                ].map((s) => (
                    <div key={s.label} style={{ padding: '12px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
                        <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: MUTED }}>{s.label}</p>
                    </div>
                ))}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,168,67,0.18)', borderRadius: 14, padding: '20px 20px 14px' }}>
                <AuditLogViewer />
            </div>
        </div>
    );
}
