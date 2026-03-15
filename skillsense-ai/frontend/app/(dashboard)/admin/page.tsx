'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Area, AreaChart,
} from 'recharts';
import api from '../../../lib/api';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import { AdminStats, User } from '@/types/api';
import toast from 'react-hot-toast';
import { Mail, Briefcase, Users, Phone, Calendar, Clock } from 'lucide-react';

/* ── Design tokens ─────────────────────────────────────────────────────────── */
const GOLD   = '#D4A843';
const AMBER  = '#F59E0B';
const GREEN  = '#22c55e';
const RED    = '#ef4444';
const INDIGO = '#6366f1';
const PURPLE = '#8b5cf6';

/* ── Types ──────────────────────────────────────────────────────────────────── */
interface KpiData {
    totalUsers:    number;
    activeStudents: number;
    totalInstitutes: number;
    revenue:       number;
}

interface RecentUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

interface IndustryInquiry {
    _id: string;
    companyName: string;
    email: string;
    phone?: string;
    plan: string;
    teamSize: string;
    message?: string;
    status: 'new' | 'contacted' | 'converted' | 'rejected';
    createdAt: string;
}

/* ── Mock growth data (marked as mock) ──────────────────────────────────────── */
const MOCK_GROWTH = [
    { day: 'Mon', users: 12 },
    { day: 'Tue', users: 19 },
    { day: 'Wed', users: 14 },
    { day: 'Thu', users: 28 },
    { day: 'Fri', users: 34 },
    { day: 'Sat', users: 22 },
    { day: 'Sun', users: 17 },
];

const MOCK_ACTIVITY = [
    { day: 'Mon', logins: 1240, analyses: 890 },
    { day: 'Tue', logins: 1380, analyses: 1020 },
    { day: 'Wed', logins: 1560, analyses: 1180 },
    { day: 'Thu', logins: 1290, analyses: 950 },
    { day: 'Fri', logins: 1720, analyses: 1340 },
    { day: 'Sat', logins: 980,  analyses: 720 },
    { day: 'Sun', logins: 760,  analyses: 540 },
];

const ROLE_COLOR: Record<string, string> = {
    student: GOLD, institute: '#a78bfa', industry: GREEN,
    government: AMBER, admin: '#64748b',
};

/* ── Skeleton ────────────────────────────────────────────────────────────────── */
function Skeleton({ w = '100%', h = 20, r = 8 }: { w?: string | number; h?: number; r?: number }) {
    return (
        <div style={{ width: w, height: h, borderRadius: r, background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.4s ease infinite' }} />
    );
}

/* ── KPI Card ────────────────────────────────────────────────────────────────── */
function KpiCard({ label, value, icon, color, delta, loading }: { label: string; value: string | number; icon: string; color: string; delta?: string; loading: boolean }) {
    return (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}22`, borderRadius: 14, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}14`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{icon}</div>
            </div>
            {loading ? <Skeleton h={32} w="60%" r={6} /> : (
                <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1 }}>{value}</div>
            )}
            {delta && !loading && (
                <div style={{ marginTop: 8, fontSize: 11, color: GREEN, fontWeight: 600 }}>↑ {delta} this week</div>
            )}
        </div>
    );
}

/* ── Custom Tooltip ─────────────────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChartTip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: '#0f0d18', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
            <p style={{ color: '#94a3b8', marginBottom: 6, fontWeight: 600 }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color, fontWeight: 700 }}>{p.name}: {p.value.toLocaleString('en-IN')}</p>
            ))}
        </div>
    );
};

/* ── Page ────────────────────────────────────────────────────────────────────── */
export default function AdminDashboardPage() {
    const { user: authUser } = useAuth();
    const { data: stats, isLoading: statsLoading, error: statsError } = useApi<AdminStats>('/admin/stats');
    const { data: usersData, isLoading: usersLoading, error: usersError, refetch: refetchUsers } = useApi<User[]>('/admin/users?limit=5');
    const { data: inquiriesData, isLoading: inquiriesLoading, refetch: refetchInquiries } = useApi<IndustryInquiry[]>('/contact/industry');
    
    const [activeTab, setActiveTab] = useState<'overview' | 'inquiries'>('overview');
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const h = new Date().getHours();
        setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
    }, []);

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Are you sure you want to permanently delete this user?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            toast.success('User permanently deleted');
            refetchUsers();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleUpdateInquiryStatus = async (id: string, status: string) => {
        try {
            await api.put(`/contact/industry/${id}`, { status });
            toast.success(`Status updated to ${status}`);
            refetchInquiries();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to update status');
        }
    };

    const loading = statsLoading || usersLoading;
    const error = statsError || usersError;
    const recentUsers = usersData || [];

    return (
        <div style={{ color: '#fff', maxWidth: 1100, padding: '0 4px' }}>
            <style>{`@keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:.3} }`}</style>

            {/* ── Header ── */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>
                    {greeting}, <span style={{ color: GOLD }}>{authUser?.name?.split(' ')[0] || 'Admin'}!</span> 👋
                </h1>
                <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
                    Here&apos;s what&apos;s happening on SkillSense AI today.
                </p>
            </div>

            {/* ── Tabs ── */}
            <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 28, paddingBottom: 2 }}>
                {[
                    { id: 'overview', label: 'Dashboard Overview', icon: '📊' },
                    { id: 'inquiries', label: 'Industry Inquiries', icon: '💼' }
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id as any)}
                        style={{
                            background: 'none', border: 'none', padding: '8px 4px',
                            color: activeTab === t.id ? GOLD : '#64748b',
                            fontSize: 14, fontWeight: 700, cursor: 'pointer',
                            borderBottom: activeTab === t.id ? `2px solid ${GOLD}` : '2px solid transparent',
                            display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
                            marginBottom: -2
                        }}
                    >
                        <span>{t.icon}</span>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ── Error ── */}
            {error && (
                <div style={{ padding: '14px 20px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: RED, fontSize: 13, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {error}
                </div>
            )}

            {/* ── Content ── */}
            {activeTab === 'overview' ? (
                <>
                    {/* ── KPI Cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
                <KpiCard label="Total Users"      value={stats?.totalUsers ?? 0}      icon="👥" color={GOLD}   delta={`${stats?.newThisMonth ?? 0} new`} loading={loading} />
                <KpiCard label="Total Students"   value={stats?.totalStudents ?? 0}   icon="🎓" color={INDIGO} loading={loading} />
                <KpiCard label="Institutes"       value={stats?.totalInstitutes ?? 0} icon="🏫" color={PURPLE} loading={loading} />
                <KpiCard label="Admin Users"      value={stats?.totalAdmins ?? 0}     icon="🛡️" color={GREEN}  loading={loading} />
            </div>

            {/* ── Quick Actions ── */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
                {[
                    { label: '+ Add User', href: '/admin/users', color: GOLD },
                    { label: '📊 View Reports', href: '/admin/reports', color: INDIGO },
                    { label: '🔒 Audit Logs', href: '/admin/audit-logs', color: '#64748b' },
                    { label: '⚖️ Fairness', href: '/admin/fairness', color: PURPLE },
                ].map(a => (
                    <Link key={a.label} href={a.href} style={{
                        padding: '9px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                        background: `${a.color}14`, border: `1px solid ${a.color}30`,
                        color: a.color, textDecoration: 'none',
                    }}>
                        {a.label}
                    </Link>
                ))}
            </div>

            {/* ── Charts Row ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
                {/* User growth — 7 days [MOCK] */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>User Registrations</div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>Last 7 days <span style={{ color: AMBER }}>[MOCK DATA]</span></div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={160}>
                        <AreaChart data={MOCK_GROWTH} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                            <defs>
                                <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={GOLD} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<ChartTip />} />
                            <Area type="monotone" dataKey="users" name="New Users" stroke={GOLD} strokeWidth={2} fill="url(#gUsers)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Platform activity [MOCK] */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px' }}>
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Platform Activity</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>Logins & AI analyses <span style={{ color: AMBER }}>[MOCK DATA]</span></div>
                    </div>
                    <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={MOCK_ACTIVITY} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
                            <Tooltip content={<ChartTip />} />
                            <Bar dataKey="logins"   name="Logins"   fill={INDIGO} radius={[4,4,0,0]} />
                            <Bar dataKey="analyses" name="Analyses" fill={GOLD}   radius={[4,4,0,0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── Recent Registrations ── */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', marginBottom: 28 }}>
                <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Recent Registrations</div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Latest 5 users from MongoDB</div>
                    </div>
                    <Link href="/admin/users" style={{ fontSize: 11, color: GOLD, textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
                </div>

                {loading ? (
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[1,2,3].map(i => <Skeleton key={i} h={40} />)}
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                                {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {recentUsers.length === 0 ? (
                                <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No users found</td></tr>
                            ) : recentUsers.map((u, i) => (
                                <tr key={u._id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${ROLE_COLOR[u.role] ?? GOLD}, ${ROLE_COLOR[u.role] ?? GOLD}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ color: '#fff', fontWeight: 500 }}>{u.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{u.email}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: `${ROLE_COLOR[u.role] ?? GOLD}18`, color: ROLE_COLOR[u.role] ?? GOLD, border: `1px solid ${ROLE_COLOR[u.role] ?? GOLD}35` }}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: u.isActive ? GREEN : RED }} />
                                            <span style={{ fontSize: 12, color: u.isActive ? GREEN : RED }}>{u.isActive ? 'Active' : 'Suspended'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 12 }}>
                                        {new Date(u.createdAt).toLocaleDateString('en-IN')}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <button 
                                            onClick={() => handleDeleteUser(u._id || (u as any).id)}
                                            style={{ background: 'none', border: 'none', color: RED, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* ── System Health [MOCK] ── */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>System Health <span style={{ fontSize: 10, color: AMBER, fontWeight: 600 }}>[MOCK]</span></div>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 16 }}>All services operational</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                    {[
                        { name: 'AI Analysis Engine',     uptime: '99.9%', ok: true },
                        { name: 'Authentication API',      uptime: '100%',  ok: true },
                        { name: 'Database Cluster',        uptime: '99.8%', ok: true },
                        { name: 'Resume Parser',           uptime: '99.7%', ok: true },
                        { name: 'GitHub Analyzer',         uptime: '99.5%', ok: true },
                        { name: 'Notification Service',    uptime: '97.2%', ok: false },
                    ].map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: s.ok ? GREEN : AMBER, boxShadow: `0 0 6px ${s.ok ? GREEN : AMBER}` }} />
                                <span style={{ fontSize: 12, color: '#94a3b8' }}>{s.name}</span>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: s.ok ? GREEN : AMBER }}>{s.uptime}</span>
                        </div>
                    ))}
                </div>
                </div>
                </>
            ) : (
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
                    <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Industry Access Inquiries</div>
                            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>Manage B2B and institutional interest from the landing page</div>
                        </div>
                        <button onClick={refetchInquiries} style={{ background: 'none', border: `1px solid ${GOLD}40`, color: GOLD, padding: '4px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Refresh</button>
                    </div>

                    {inquiriesLoading ? (
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[1, 2, 3].map(i => <Skeleton key={i} h={40} />)}
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                                        {['Company', 'Plan', 'Team Size', 'Contact', 'Date', 'Status', 'Actions'].map(h => (
                                            <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {!inquiriesData?.length ? (
                                        <tr><td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No inquiries yet</td></tr>
                                    ) : inquiriesData.map((inq, i) => (
                                        <tr key={inq._id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <Briefcase size={14} style={{ color: GOLD }} />
                                                    {inq.companyName}
                                                </div>
                                                {inq.message && <div style={{ fontSize: 10, color: '#64748b', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} /> Message: {inq.message.substring(0, 30)}...</div>}
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: inq.plan === 'Enterprise' ? `${PURPLE}18` : `${GOLD}18`, color: inq.plan === 'Enterprise' ? PURPLE : GOLD, border: `1px solid ${inq.plan === 'Enterprise' ? PURPLE : GOLD}30` }}>
                                                    {inq.plan}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px', color: '#94a3b8' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <Users size={12} />
                                                    {inq.teamSize}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontSize: 12 }}>
                                                    <Mail size={12} style={{ color: INDIGO }} />
                                                    {inq.email}
                                                </div>
                                                {inq.phone && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 11, marginTop: 4 }}>
                                                        <Phone size={10} />
                                                        {inq.phone}
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: '16px', color: '#64748b', fontSize: 12 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                    <Calendar size={12} />
                                                    {new Date(inq.createdAt).toLocaleDateString('en-IN')}
                                                </div>
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <StatusBadge status={inq.status} />
                                            </td>
                                            <td style={{ padding: '16px' }}>
                                                <select 
                                                    value={inq.status}
                                                    onChange={(e) => handleUpdateInquiryStatus(inq._id, e.target.value as any)}
                                                    style={{ background: '#08060f', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: 11, borderRadius: 6, padding: '4px 8px', outline: 'none' }}
                                                >
                                                    <option value="new">New</option>
                                                    <option value="contacted">Contacted</option>
                                                    <option value="converted">Convert</option>
                                                    <option value="rejected">Reject</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: IndustryInquiry['status'] }) {
    const config = {
        new:       { color: AMBER,  label: 'NEW' },
        contacted: { color: INDIGO, label: 'CONTACTED' },
        converted: { color: GREEN,  label: 'CONVERTED' },
        rejected:  { color: RED,    label: 'REJECTED' },
    }[status] || { color: '#64748b', label: status };

    return (
        <span style={{ 
            fontSize: 9, 
            fontWeight: 800, 
            padding: '2px 6px', 
            borderRadius: 6, 
            background: `${config.color}15`, 
            color: config.color, 
            border: `1px solid ${config.color}30` 
        }}>
            {config.label}
        </span>
    );
}
