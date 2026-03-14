'use client';

import React, { useState } from 'react';
import type { AuditLog } from '../../types/charts';

interface Props {
    logs?: AuditLog[];
    compact?: boolean;
}

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

const STATUS_COLORS = {
    success: '#22c55e',
    failure: '#ef4444',
    warning: '#f59e0b',
};

const SAMPLE_LOGS: AuditLog[] = [
    {
        id: 'AL001',
        action: 'Student Data Upload',
        actor: 'admin@nagpur.iti',
        role: 'Institute Admin',
        resourceType: 'StudentRecord',
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        ipAddress: '192.168.1.45',
        status: 'success',
        details: '128 records uploaded successfully',
    },
    {
        id: 'AL002',
        action: 'Fairness Report Export',
        actor: 'analyst@nsdc.gov.in',
        role: 'Government Official',
        resourceType: 'Report',
        resourceId: 'RPT-2026-Q4',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        ipAddress: '10.0.0.22',
        status: 'success',
        details: 'FY 2025-26 fairness report downloaded as PDF',
    },
    {
        id: 'AL003',
        action: 'Unauthorized API Access',
        actor: 'unknown',
        role: 'External',
        resourceType: 'API',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        ipAddress: '41.73.88.192',
        status: 'failure',
        details: 'JWT token expired — access denied to /api/students',
    },
    {
        id: 'AL004',
        action: 'AI Model Inference',
        actor: 'system@skillsense.ai',
        role: 'System',
        resourceType: 'AIService',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        ipAddress: '127.0.0.1',
        status: 'success',
        details: 'Skill gap analysis completed for 421 students',
    },
    {
        id: 'AL005',
        action: 'User Role Update',
        actor: 'superadmin@skillsense.ai',
        role: 'Super Admin',
        resourceType: 'User',
        resourceId: 'USR-0042',
        timestamp: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
        ipAddress: '10.0.0.1',
        status: 'success',
        details: 'Role changed: Student → Institute Manager',
    },
    {
        id: 'AL006',
        action: 'Bulk Delete Attempt',
        actor: 'intern@partner.edu',
        role: 'Partner',
        resourceType: 'StudentRecord',
        timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        ipAddress: '203.0.113.47',
        status: 'warning',
        details: 'Bulk delete blocked — insufficient permissions',
    },
];

function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export default function AuditLogViewer({ logs, compact = false }: Props) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failure' | 'warning'>('all');

    const displayLogs = (logs ?? SAMPLE_LOGS).filter((log) => {
        const matchesSearch =
            search === '' ||
            log.action.toLowerCase().includes(search.toLowerCase()) ||
            log.actor.toLowerCase().includes(search.toLowerCase()) ||
            log.resourceType.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div>
            {/* Filters */}
            {!compact && (
                <div
                    style={{
                        display: 'flex',
                        gap: 10,
                        marginBottom: 14,
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}
                >
                    <input
                        type="text"
                        placeholder="Search logs…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            flex: 1,
                            minWidth: 180,
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: 8,
                            padding: '8px 12px',
                            color: WHITE,
                            fontSize: 13,
                            outline: 'none',
                        }}
                    />
                    {(['all', 'success', 'failure', 'warning'] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            style={{
                                background: statusFilter === s ? 'rgba(212,168,67,0.15)' : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${statusFilter === s ? GOLD : 'rgba(255,255,255,0.12)'}`,
                                borderRadius: 8,
                                padding: '6px 12px',
                                color: statusFilter === s ? GOLD : MUTED,
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {/* Log rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {displayLogs.map((log) => (
                    <div
                        key={log.id}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: compact ? '1fr auto' : '20px 1fr 120px 80px',
                            gap: 10,
                            alignItems: 'center',
                            padding: compact ? '8px 12px' : '10px 14px',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: 8,
                            transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLDivElement).style.background = 'rgba(212,168,67,0.05)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)';
                        }}
                    >
                        {/* Status dot */}
                        {!compact && (
                            <div
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    background: STATUS_COLORS[log.status],
                                    flexShrink: 0,
                                }}
                            />
                        )}

                        {/* Main info */}
                        <div>
                            <p style={{ margin: 0, fontSize: 13, color: WHITE, fontWeight: 500 }}>
                                {log.action}
                            </p>
                            <p style={{ margin: '2px 0 0', fontSize: 11, color: MUTED }}>
                                {log.actor} • {log.role} • {log.ipAddress}
                                {log.details && !compact && ` • ${log.details}`}
                            </p>
                        </div>

                        {/* Time */}
                        {!compact && (
                            <span style={{ fontSize: 11, color: MUTED, textAlign: 'right' }}>
                                {timeAgo(log.timestamp)}
                            </span>
                        )}

                        {/* Status badge */}
                        <div
                            style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: 20,
                                background: `${STATUS_COLORS[log.status]}18`,
                                border: `1px solid ${STATUS_COLORS[log.status]}40`,
                                color: STATUS_COLORS[log.status],
                                fontSize: 10,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                textAlign: 'center',
                            }}
                        >
                            {log.status}
                        </div>
                    </div>
                ))}

                {displayLogs.length === 0 && (
                    <div style={{ textAlign: 'center', color: MUTED, fontSize: 13, padding: 24 }}>
                        No logs match your filter.
                    </div>
                )}
            </div>
        </div>
    );
}
