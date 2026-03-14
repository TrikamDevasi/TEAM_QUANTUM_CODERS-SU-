'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const GOLD = '#D4A843';
const AMBER = '#F59E0B';

const NAV = [
    {
        group: 'Student', accent: GOLD, routes: [
            { label: 'Overview', href: '/student' },
            { label: 'Skill Passport', href: '/student/passport' },
            { label: 'AI Analyzer', href: '/student/analyzer' },
            { label: 'Assessments', href: '/student/assessments' },
            { label: 'Career Path', href: '/student/career' },
        ],
    },
    {
        group: 'Institute', accent: '#a78bfa', routes: [
            { label: 'Overview', href: '/institute' },
            { label: 'Students', href: '/institute/students' },
            { label: 'Placements', href: '/institute/placement' },
            { label: 'Program ROI', href: '/institute/roi' },
            { label: 'Upload Data', href: '/institute/upload' },
        ],
    },
    {
        group: 'Industry', accent: '#34d399', routes: [
            { label: 'Overview', href: '/industry' },
            { label: 'Talent Pool', href: '/industry/talent' },
            { label: 'Demand Signals', href: '/industry/demand' },
            { label: 'Campus Connect', href: '/industry/campus' },
        ],
    },
    {
        group: 'Government', accent: AMBER, routes: [
            { label: 'Overview', href: '/government' },
            { label: 'Region Heatmap', href: '/government/heatmap' },
            { label: 'Fund Targeting', href: '/government/fund-targeting' },
            { label: 'Compliance', href: '/government/compliance' },
        ],
    },
    {
        group: 'Admin', accent: '#f87171', routes: [
            { label: 'Overview', href: '/admin' },
            { label: 'Users', href: '/admin/users' },
            { label: 'Institutes', href: '/admin/institutes' },
            { label: 'Fairness', href: '/admin/fairness' },
            { label: 'Audit Logs', href: '/admin/audit-logs' },
            { label: 'Reports', href: '/admin/reports' },
        ],
    },
];

const ROLE_GROUP_MAP: Record<string, string> = {
    student: 'Student',
    institute: 'Institute',
    industry: 'Industry',
    government: 'Government',
    admin: 'Admin',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        try {
            const stored = localStorage.getItem('ss_user');
            if (stored) {
                const parsed = JSON.parse(stored);
                setUserName(parsed.name || 'User');
                setUserRole(parsed.role || '');
            }
        } catch { }
    }, []);

    // Filter NAV based on role
    const filteredNav = userRole
        ? NAV.filter(n => n.group === ROLE_GROUP_MAP[userRole])
        : NAV;

    const [openGroups, setOpenGroups] = useState<string[]>(filteredNav.map(n => n.group));

    useEffect(() => {
        setOpenGroups(filteredNav.map(n => n.group));
    }, [userRole]);

    const toggleGroup = (g: string) =>
        setOpenGroups(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);

    const parts = pathname.split('/').filter(Boolean);
    const crumb = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ');

    const initials = userName
        ? userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : 'U';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#08060f', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

            {/* Sidebar */}
            <aside style={{
                width: collapsed ? 56 : 218, flexShrink: 0,
                background: 'rgba(212,168,67,0.02)',
                borderRight: '1px solid rgba(212,168,67,0.08)',
                display: 'flex', flexDirection: 'column',
                transition: 'width 0.25s ease', overflowX: 'hidden',
            }}>
                {/* Logo row */}
                <div style={{
                    padding: collapsed ? '18px 0' : '18px 16px',
                    display: 'flex', alignItems: 'center', gap: 10,
                    borderBottom: '1px solid rgba(212,168,67,0.08)', flexShrink: 0,
                    justifyContent: collapsed ? 'center' : undefined,
                }}>
                    <div style={{
                        width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                        background: 'linear-gradient(135deg, #D4A843, #F0C05A)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                                stroke="#08060f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    {!collapsed && (
                        <span className="font-display" style={{ fontWeight: 800, fontSize: 14, color: '#fff', whiteSpace: 'nowrap' }}>
                            SkillSense AI
                        </span>
                    )}
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '10px 0', overflowY: 'auto', overflowX: 'hidden' }}>
                    {filteredNav.map(({ group, accent, routes }) => {
                        const isOpen = openGroups.includes(group);
                        const isGroupActive = routes.some(r => pathname === r.href || pathname.startsWith(r.href + '/'));
                        return (
                            <div key={group}>
                                <button
                                    onClick={() => !collapsed && toggleGroup(group)}
                                    style={{
                                        width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                                        padding: collapsed ? '8px 0' : '7px 16px',
                                        border: 'none', background: 'transparent', cursor: 'pointer',
                                        color: isGroupActive ? accent : '#475569',
                                        justifyContent: collapsed ? 'center' : 'space-between',
                                        transition: 'color 0.15s',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{
                                            width: 6, height: 6, borderRadius: '50%',
                                            background: isGroupActive ? accent : '#334155', flexShrink: 0,
                                        }} />
                                        {!collapsed && (
                                            <span className="font-display" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                                                {group}
                                            </span>
                                        )}
                                    </div>
                                    {!collapsed && (
                                        <span style={{ fontSize: 10, opacity: 0.4, marginLeft: 'auto' }}>{isOpen ? '▾' : '▸'}</span>
                                    )}
                                </button>

                                {!collapsed && isOpen && routes.map(route => {
                                    const active = pathname === route.href;
                                    return (
                                        <Link key={route.href} href={route.href} style={{
                                            display: 'flex', alignItems: 'center',
                                            padding: '6px 16px 6px 28px', textDecoration: 'none',
                                            background: active ? `${accent}10` : 'transparent',
                                            borderRight: active ? `2px solid ${accent}` : '2px solid transparent',
                                            color: active ? accent : '#64748b',
                                            fontSize: 12, fontWeight: active ? 700 : 500,
                                            transition: 'all 0.15s', whiteSpace: 'nowrap',
                                        }}>
                                            {route.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        );
                    })}
                </nav>

                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed(c => !c)}
                    style={{
                        padding: '12px', background: 'transparent', border: 'none',
                        borderTop: '1px solid rgba(212,168,67,0.08)', cursor: 'pointer',
                        color: '#334155', fontSize: 10, display: 'flex', alignItems: 'center', gap: 8,
                        justifyContent: collapsed ? 'center' : undefined,
                        paddingLeft: collapsed ? 0 : 16, transition: 'all 0.15s',
                    }}
                >
                    <span>{collapsed ? '»' : '«'}</span>
                    {!collapsed && <span className="font-display" style={{ fontWeight: 600, fontSize: 11 }}>Collapse</span>}
                </button>
            </aside>

            {/* Main area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Sticky header */}
                <header style={{
                    position: 'sticky', top: 0, zIndex: 50,
                    background: 'rgba(8,6,15,0.85)', backdropFilter: 'blur(16px)',
                    borderBottom: '1px solid rgba(212,168,67,0.08)',
                    padding: '0 28px', height: 52,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                    <p style={{ color: '#64748b', fontSize: 12, fontWeight: 500 }}>
                        {crumb || 'Dashboard'}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        {userName && <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{userName}</span>}
                        <span style={{ fontSize: 12, color: '#475569' }}>
                            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <div style={{
                            width: 30, height: 30, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #D4A843, #F0C05A)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 11, fontWeight: 800, color: '#08060f',
                        }}>
                            {initials}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
