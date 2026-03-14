'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './auth.css';

/* ── SVG Icons for each role ─────────────────────────────── */
const RoleIcons: Record<string, JSX.Element> = {
    student: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1 2 3 6 3s6-2 6-3v-5" />
        </svg>
    ),
    institute: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" />
        </svg>
    ),
    industry: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><path d="M12 12v.01" />
        </svg>
    ),
    government: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    ),
    admin: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    ),
};

const ROLES = [
    { key: 'student', label: 'Student', desc: 'Skill passport, AI analysis, career paths', href: '/student' },
    { key: 'institute', label: 'Institute', desc: 'Analytics, placement trends, curriculum gaps', href: '/institute' },
    { key: 'industry', label: 'Industry', desc: 'Talent pool, skill matching, market trends', href: '/industry' },
    { key: 'government', label: 'Government', desc: 'National insights, workforce forecasting', href: '/government' },
    { key: 'admin', label: 'Admin', desc: 'System oversight, user management, fairness', href: '/admin' },
];

const RINGS = [1, 2, 3, 4, 5, 6, 7];

function Particles() {
    const colors = ['rgba(234,179,8,0.7)', 'rgba(253,224,71,0.6)', 'rgba(217,119,6,0.65)', 'rgba(251,191,36,0.5)'];
    const particles = Array.from({ length: 22 }, (_, i) => {
        const size = 1.5 + Math.random() * 2.5;
        return (
            <div key={i} className="auth-particle" style={{
                width: size, height: size,
                left: `${2 + Math.random() * 96}%`,
                bottom: -6,
                background: colors[Math.floor(Math.random() * colors.length)],
                animationDuration: `${6 + Math.random() * 7}s`,
                animationDelay: `-${Math.random() * 12}s`,
                filter: `blur(${Math.random()}px)`,
            }} />
        );
    });
    return <>{particles}</>;
}

export default function AuthPage() {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(null);
    const [tab, setTab] = useState<'signin' | 'signup'>('signin');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [overlayOut, setOverlayOut] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const redirectRef = useRef<NodeJS.Timeout | null>(null);

    const selectedRole = ROLES.find(r => r.key === selected);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        const role = selectedRole?.key || 'student';
        const userName = name.trim() || email.split('@')[0] || 'User';
        localStorage.setItem('ss_user', JSON.stringify({ name: userName, role, email }));
        setShowOverlay(true);
        redirectRef.current = setTimeout(() => {
            setOverlayOut(true);
            setTimeout(() => {
                setShowOverlay(false);
                setOverlayOut(false);
                setToast('Signed in successfully');
                setTimeout(() => setToast(null), 3000);
                router.push(selectedRole?.href || '/student');
            }, 400);
        }, 3000);
    };

    useEffect(() => () => { if (redirectRef.current) clearTimeout(redirectRef.current); }, []);

    return (
        <>
            <div className="auth-bg-canvas" aria-hidden="true">
                <div className="auth-bg-orb auth-bg-orb--1" />
                <div className="auth-bg-orb auth-bg-orb--2" />
                <div className="auth-bg-orb auth-bg-orb--3" />
                <div className="auth-bg-orb auth-bg-orb--4" />
                <div className="auth-bg-grid" />
            </div>

            <main className="auth-page">
                <div className="auth-card">
                    {/* Logo */}
                    <div className="auth-logo">
                        <img src="/logo.png" alt="SkillSense AI" />
                    </div>

                    <h1 className="auth-title">
                        {tab === 'signin' ? 'Welcome back' : 'Create Account'}
                    </h1>
                    <p className="auth-subtitle">
                        {tab === 'signin' ? 'Sign in to continue to SkillSense AI' : 'Get started with SkillSense AI'}
                    </p>

                    {/* Tabs */}
                    <div className="auth-tabs">
                        <button className={`auth-tab ${tab === 'signin' ? 'auth-tab--active' : ''}`} onClick={() => setTab('signin')}>Sign In</button>
                        <button className={`auth-tab ${tab === 'signup' ? 'auth-tab--active' : ''}`} onClick={() => setTab('signup')}>Sign Up</button>
                    </div>

                    {/* Role Selector */}
                    <p className="auth-role-label">Select your role</p>
                    <div className="auth-roles">
                        {ROLES.map(role => (
                            <button
                                key={role.key}
                                type="button"
                                className={`auth-role-btn ${selected === role.key ? 'auth-role-btn--active' : ''} ${role.key === 'admin' ? 'auth-role-btn--admin' : ''}`}
                                onClick={() => setSelected(role.key)}
                            >
                                <div className="auth-role-icon">{RoleIcons[role.key]}</div>
                                <div>
                                    <div className="auth-role-name">{role.label}</div>
                                    <div className="auth-role-desc">{role.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <form className="auth-form" onSubmit={handleSubmit} noValidate>
                        {tab === 'signup' && (
                            <div>
                                <label className="auth-field-label" htmlFor="name">Full name</label>
                                <div className="auth-input-wrap">
                                    <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                    </svg>
                                    <input className="auth-input" type="text" id="name" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="auth-field-label" htmlFor="email">Email address</label>
                            <div className="auth-input-wrap">
                                <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" />
                                </svg>
                                <input className="auth-input" type="email" id="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" spellCheck={false} />
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label className="auth-field-label" htmlFor="password">Password</label>
                                {tab === 'signin' && <span style={{ fontSize: 12, color: '#fbbf24', cursor: 'pointer' }}>Forgot password?</span>}
                            </div>
                            <div className="auth-input-wrap">
                                <svg className="auth-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <input className="auth-input" type={showPw ? 'text' : 'password'} id="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
                                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 14, background: 'transparent', border: 'none', color: 'rgba(253,230,138,0.28)', cursor: 'pointer', padding: 4 }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        {showPw ? (
                                            <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
                                        ) : (
                                            <><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></>
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {tab === 'signin' && (
                            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
                                <input type="checkbox" style={{ accentColor: '#eab308' }} />
                                <span style={{ fontSize: 13, color: 'rgba(253,230,138,0.5)' }}>Keep me signed in</span>
                            </label>
                        )}

                        <button type="submit" className="auth-btn">
                            <span>{tab === 'signin' ? `Sign In${selectedRole ? ` as ${selectedRole.label}` : ''}` : 'Create Account'}</span>
                            <span style={{ display: 'flex', alignItems: 'center', transition: 'transform 0.2s' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </span>
                            <span className="auth-btn-shimmer" />
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="auth-divider"><span>or continue with</span></div>

                    {/* Social */}
                    <div className="auth-socials">
                        <button type="button" className="auth-social-btn" onClick={handleSubmit}>
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                        <button type="button" className="auth-social-btn" onClick={handleSubmit}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.58v-2.03c-3.34.72-4.04-1.6-4.04-1.6-.54-1.38-1.33-1.74-1.33-1.74-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.04.138 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                            GitHub
                        </button>
                    </div>

                    {/* Footer */}
                    <p className="auth-footer">
                        {tab === 'signin' ? "Don\u2019t have an account?\u00a0" : 'Already have an account?\u00a0'}
                        <button className="auth-footer-link" onClick={() => setTab(tab === 'signin' ? 'signup' : 'signin')}>
                            {tab === 'signin' ? 'Create one' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </main>

            {/* ── Sign-In Overlay ── */}
            {showOverlay && (
                <div className={`auth-overlay ${overlayOut ? 'auth-overlay--out' : ''}`}>
                    <Particles />
                    <div className="auth-ring-stack" aria-hidden="true">
                        {RINGS.map(i => (
                            <div key={i} className="auth-ring-wrapper">
                                <div className={`auth-ring auth-ring-${i}`} />
                            </div>
                        ))}
                        <div className="auth-orb" />
                    </div>
                    <div className="auth-signin-label" role="status">
                        <div className="auth-spinner" />
                        Signing in...
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast && (
                <div className="auth-toast">{toast}</div>
            )}
        </>
    );
}
