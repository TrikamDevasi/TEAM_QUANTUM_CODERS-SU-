'use client';

import Link from 'next/link';
import { useRef, useState, useEffect, useCallback } from 'react';
import IndustryPlans from '@/components/IndustryPlans';
import api from '@/lib/api';

/* ─────────────────────────── helpers ───────────────────────────────────── */

function useInView(ref: React.RefObject<HTMLElement | null>) {
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { rootMargin: '-60px' });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [ref]);
    return inView;
}

function FadeIn({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref as React.RefObject<HTMLElement>);
    return (
        <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(28px)', transition: `opacity 0.6s ${delay}s ease, transform 0.6s ${delay}s ease`, ...style }}>
            {children}
        </div>
    );
}

function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref as React.RefObject<HTMLElement>);
    const started = useRef(false);

    useEffect(() => {
        if (!inView || started.current) return;
        started.current = true;
        const start = Date.now();
        const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(ease * target));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [inView, target, duration]);

    return <span ref={ref}>{count.toLocaleString('en-IN')}{suffix}</span>;
}

/* ─────────────────────────── design tokens ─────────────────────────────── */

const GOLD = '#D4A843';
const GOLD_L = '#F0C05A';
const AMBER = '#F59E0B';
const ORANGE = '#F97316';
const INDIGO = '#6366f1';
const PURPLE = '#8b5cf6';
const BG = '#050a14';

/* ─────────────────────────── data ──────────────────────────────────────── */

const DEFAULT_STATS = [
    { target: 1450, suffix: '+', label: 'Students Enrolled' },
    { target: 542, suffix: '+', label: 'Courses Available' },
    { target: 200, suffix: '+', label: 'Industry Partners' },
    { target: 94, suffix: '%', label: 'Prediction Accuracy' },
];

const FEATURES = [
    { icon: '🧠', title: 'AI Skill Assessment', desc: 'Deep analysis of resumes, GitHub profiles, and projects to extract 50+ real competencies.', color: GOLD },
    { icon: '🎯', title: 'Career Prediction', desc: 'Predicts best-fit career paths with salary benchmarks tailored to India\'s job market.', color: INDIGO },
    { icon: '🏭', title: 'Industry Connect', desc: 'Direct bridge to 200+ industry partners for internships, jobs, and skill validation.', color: '#34d399' },
    { icon: '🏛️', title: 'Government Integration', desc: 'NSQF-aligned credentials reported to MSDE for national workforce policy intelligence.', color: AMBER },
    { icon: '🎓', title: 'Live Mentorship', desc: '1:1 sessions with domain experts from top IITs, NITs, and Fortune 500 companies.', color: PURPLE },
    { icon: '🏅', title: 'Verified Certificates', desc: 'Tamper-proof SHA-256 blockchain-anchored Skill Passports accepted by 200+ employers.', color: ORANGE },
];

const STEPS = [
    { num: '01', icon: '📝', title: 'Register', desc: 'Create your free account in under 2 minutes with your email.' },
    { num: '02', icon: '⚡', title: 'Assess', desc: 'Upload your profile — our AI analyses 50+ skill dimensions instantly.' },
    { num: '03', icon: '📈', title: 'Learn', desc: 'Follow a personalised roadmap from curated courses and mentors.' },
    { num: '04', icon: '💼', title: 'Get Hired', desc: 'Apply to matched roles with your verified Skill Passport.' },
];

const STAKEHOLDERS = [
    {
        role: 'Students', emoji: '🎓', color: GOLD, bg: 'rgba(212,168,67,0.06)', border: 'rgba(212,168,67,0.2)',
        benefits: ['Know your real skill level', 'Personalised career roadmap', 'Portable verified Skill Passport', 'AI-powered job matching'],
        cta: 'Start Free', href: '/auth',
    },
    {
        role: 'Instructors', emoji: '👨‍🏫', color: INDIGO, bg: 'rgba(99,102,241,0.06)', border: 'rgba(99,102,241,0.2)',
        benefits: ['Publish courses to 10K+ students', 'Track learner outcomes live', 'Evidence-based curriculum tools', 'Earn from skill certifications'],
        cta: 'Become Instructor', href: '/auth',
    },
    {
        role: 'Industry', emoji: '🏭', color: '#34d399', bg: 'rgba(52,211,153,0.06)', border: 'rgba(52,211,153,0.2)',
        benefits: ['Access verified talent pools', 'AI-powered candidate matching', 'Forecast talent supply gaps', 'Reduce hiring time by 60%'],
        cta: 'Post a Role', href: '/industry',
    },
    {
        role: 'Government', emoji: '🏛️', color: AMBER, bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)',
        benefits: ['National skill intelligence dashboard', 'Policy impact measurement', 'Fairness & equity monitoring', 'Workforce demand forecasting'],
        cta: 'View Dashboard', href: '/government',
    },
];

const TESTIMONIALS = [
    { name: 'Priya Sharma', role: 'Software Engineer @ Infosys', avatar: 'PS', stars: 5, quote: 'SkillSense AI helped me identify my exact skill gaps and gave me a roadmap to bridge them. I got placed within 3 months of using the platform!', color: GOLD },
    { name: 'Rajesh Kumar', role: 'Head of Placement, IIIT Hyderabad', avatar: 'RK', stars: 5, quote: 'Our placement rates improved by 23% after using the institute dashboard. The AI predictions are remarkably accurate for our students.', color: INDIGO },
    { name: 'Ananya Patel', role: 'HR Director @ TCS', avatar: 'AP', stars: 5, quote: 'The verified Skill Passports save us enormous screening time. We\'ve reduced our hiring cycle from 6 weeks to under 2 weeks.', color: '#34d399' },
];

const PRICING = [
    {
        tier: 'Free', price: '₹0', period: '/month', color: '#64748b', highlight: false,
        features: ['AI Skill Assessment (1x/month)', 'Basic Skill Passport', 'Course recommendations', 'Job matching (5/month)', 'Email support'],
        cta: 'Get Started Free',
    },
    {
        tier: 'Premium', price: '₹499', period: '/month', color: INDIGO, highlight: true,
        features: ['Unlimited AI Assessments', 'Verified Skill Passport', 'Personalised roadmap', 'Unlimited job matching', '1:1 Mentor sessions (2/mo)', 'Priority support'],
        cta: 'Start Premium',
    },
    {
        tier: 'Enterprise', price: 'Custom', period: '', color: AMBER, highlight: false,
        features: ['Everything in Premium', 'Bulk student management', 'Institute analytics dashboard', 'API access & integrations', 'Dedicated success manager', 'SLA guarantee'],
        cta: 'Contact Sales',
    },
];

const FOOTER_LINKS = {
    Product: ['Features', 'Pricing', 'Roadmap', 'Changelog'],
    Company: ['About', 'Blog', 'Careers', 'Press'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
    Support: ['Help Centre', 'Contact', 'Status', 'Community'],
};

/* ─────────────────────────── Navbar ────────────────────────────────────── */

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', h);
        return () => window.removeEventListener('scroll', h);
    }, []);

    const navLinks = ['Features', 'How It Works', 'Pricing', 'Testimonials'];

    return (
        <>
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                background: scrolled ? 'rgba(5,10,20,0.92)' : 'transparent',
                backdropFilter: scrolled ? 'blur(20px)' : 'none',
                borderBottom: scrolled ? '1px solid rgba(212,168,67,0.1)' : '1px solid transparent',
                transition: 'all 0.3s ease',
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#08060f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        <span style={{ fontWeight: 800, fontSize: 15, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>SkillSense AI</span>
                    </div>

                    {/* Desktop nav */}
                    <div style={{ display: 'flex', gap: 28, alignItems: 'center' }} className="desktop-nav">
                        {navLinks.map(l => (
                            <a key={l}
                                href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}
                                style={{ color: '#64748b', fontSize: 13, fontWeight: 500, textDecoration: 'none', transition: 'color 0.2s' }}
                                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                                onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>
                                {l}
                            </a>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <Link href="/auth" style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, textDecoration: 'none', padding: '8px 16px' }} className="desktop-nav">Sign In</Link>
                        <Link href="/auth" style={{ fontSize: 13, padding: '9px 20px', borderRadius: 8, background: `linear-gradient(135deg, ${GOLD}, #8b6512)`, color: '#1a0f00', fontWeight: 700, textDecoration: 'none' }}>Get Started Free</Link>
                        {/* Hamburger */}
                        <button
                            onClick={() => setMobileOpen(o => !o)}
                            style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 8 }}
                            className="mobile-menu-btn"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div style={{ background: 'rgba(5,10,20,0.98)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {navLinks.map(l => (
                            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => setMobileOpen(false)}
                                style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500, textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                {l}
                            </a>
                        ))}
                        <Link href="/auth" style={{ fontSize: 14, padding: '10px 20px', borderRadius: 8, background: `linear-gradient(135deg, ${GOLD}, #8b6512)`, color: '#1a0f00', fontWeight: 700, textDecoration: 'none', textAlign: 'center', marginTop: 4 }}>
                            Get Started Free
                        </Link>
                    </div>
                )}
            </nav>
            <style>{`
                @media (max-width: 768px) {
                    .desktop-nav { display: none !important; }
                    .mobile-menu-btn { display: flex !important; }
                }
            `}</style>
        </>
    );
}

/* ─────────────────────────── Scroll-to-top ─────────────────────────────── */

function ScrollToTop() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const h = () => setVisible(window.scrollY > 500);
        window.addEventListener('scroll', h);
        return () => window.removeEventListener('scroll', h);
    }, []);
    if (!visible) return null;
    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
                position: 'fixed', bottom: 28, right: 28, zIndex: 200,
                width: 44, height: 44, borderRadius: '50%', border: 'none',
                background: `linear-gradient(135deg, ${GOLD}, #8b6512)`,
                color: '#1a0f00', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(212,168,67,0.4)',
                transition: 'transform 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6" /></svg>
        </button>
    );
}

/* ─────────────────────────── Star Rating ───────────────────────────────── */

function Stars({ count }: { count: number }) {
    return (
        <div style={{ display: 'flex', gap: 2 }}>
            {Array.from({ length: count }).map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={AMBER} stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ))}
        </div>
    );
}

/* ─────────────────────────── Page ──────────────────────────────────────── */

export default function LandingPage() {
    const [stats, setStats] = useState(DEFAULT_STATS);

    useEffect(() => {
        api.get('/auth/stats')
            .then(res => {
                const data = res.data;
                if (data.success && data.data) {
                    const { totalUsers, coursesCount, partnersCount, accuracy } = data.data;
                    setStats([
                        { target: totalUsers, suffix: '+', label: 'Students Enrolled' },
                        { target: coursesCount, suffix: '+', label: 'Courses Available' },
                        { target: partnersCount, suffix: '+', label: 'Industry Partners' },
                        { target: accuracy, suffix: '%', label: 'Prediction Accuracy' },
                    ]);
                }
            })
            .catch(err => console.error('Error fetching stats:', err));
    }, []);

    return (
        <div style={{ minHeight: '100vh', overflowX: 'hidden', background: BG, fontFamily: 'Inter, sans-serif' }}>
            <Navbar />
            <ScrollToTop />

            <style>{`
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
                @keyframes pulse-slow { 0%,100%{opacity:1} 50%{opacity:0.4} }
                @keyframes spin-slow { to{transform:rotate(360deg)} }
                .gradient-text {
                    background: linear-gradient(135deg, ${GOLD}, ${GOLD_L}, ${AMBER});
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .card-hover {
                    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
                }
                .card-hover:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 16px 48px rgba(212,168,67,0.12);
                }
                @media (max-width: 640px) {
                    .hero-h1 { font-size: 36px !important; }
                    .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    .features-grid { grid-template-columns: 1fr !important; }
                    .section-pad { padding: 60px 16px !important; }
                    .steps-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    .stakeholder-grid { grid-template-columns: 1fr !important; }
                    .pricing-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>

            {/* ── HERO ─────────────────────────────────────────────────────── */}
            <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', position: 'relative', overflow: 'hidden' }}>
                {/* Background orbs */}
                <div style={{ position: 'absolute', top: '20%', left: '10%', width: 500, height: 500, background: 'rgba(212,168,67,0.04)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none', animation: 'float 8s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', bottom: '15%', right: '8%', width: 400, height: 400, background: 'rgba(99,102,241,0.05)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none', animation: 'float 10s ease-in-out infinite reverse' }} />
                <div style={{ position: 'absolute', top: '60%', left: '50%', width: 300, height: 300, background: 'rgba(249,115,22,0.03)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

                {/* Grid pattern overlay */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

                <div style={{ textAlign: 'center', maxWidth: 820, position: 'relative', zIndex: 1 }}>
                    {/* Badge */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.25)', borderRadius: 99, padding: '6px 16px', marginBottom: 28 }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, display: 'inline-block', animation: 'pulse-slow 2s infinite' }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: GOLD }}>India&apos;s First AI-Powered Skill Platform</span>
                    </div>

                    {/* Headline */}
                    <h1 className="hero-h1" style={{ fontSize: 'clamp(38px, 6.5vw, 72px)', fontWeight: 900, color: '#fff', lineHeight: 1.08, marginBottom: 20, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>
                        Measuring Skills,<br />
                        <span className="gradient-text">Predicting Futures</span>
                    </h1>

                    <p style={{ fontSize: 18, color: '#64748b', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.75 }}>
                        AI-powered skill gap analysis, verifiable Skill Passports, career matching, and national workforce intelligence — built for India&apos;s 600M+ workforce.
                    </p>

                    {/* CTAs */}
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
                        <Link href="/auth" style={{
                            fontSize: 15, padding: '13px 28px', borderRadius: 10,
                            background: `linear-gradient(135deg, ${GOLD}, #8b6512)`,
                            color: '#1a0f00', fontWeight: 800, textDecoration: 'none',
                            boxShadow: '0 4px 24px rgba(212,168,67,0.3)',
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                        }}>
                            🚀 Get Started Free
                        </Link>
                        <Link href="/student" style={{
                            fontSize: 15, padding: '13px 28px', borderRadius: 10,
                            border: '1px solid rgba(255,255,255,0.12)',
                            background: 'rgba(255,255,255,0.04)',
                            color: '#cbd5e1', fontWeight: 600, textDecoration: 'none',
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            backdropFilter: 'blur(8px)',
                        }}>
                            ▶ Watch Demo
                        </Link>
                    </div>

                    {/* Animated Stats */}
                    <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, maxWidth: 640, margin: '0 auto' }}>
                        {stats.map((s, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 10px', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
                                    <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: GOLD }}>
                                        <AnimatedCounter target={s.target} suffix={s.suffix} />
                                    </div>
                                    <div style={{ fontSize: 11, color: '#475569', marginTop: 4, lineHeight: 1.4 }}>{s.label}</div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>

                    {/* Floating feature pills */}
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 40 }}>
                        {['✓ No credit card', '✓ Free forever plan', '✓ NSQF certified', '✓ Govt. recognized'].map(t => (
                            <span key={t} style={{ fontSize: 11, fontWeight: 600, color: '#64748b', padding: '4px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 99 }}>{t}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── DEMO BANNER ──────────────────────────────────────────────── */}
            <section style={{ padding: '0 24px 80px' }}>
                <div style={{ maxWidth: 860, margin: '0 auto' }}>
                    <FadeIn>
                        <div style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.06), rgba(99,102,241,0.05))', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 18, padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
                            <div>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.25)', borderRadius: 99, padding: '4px 12px', marginBottom: 10 }}>
                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD, display: 'inline-block', animation: 'pulse-slow 2s infinite' }} />
                                    <span style={{ fontSize: 11, fontWeight: 700, color: GOLD }}>LIVE DEMO</span>
                                </div>
                                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 6px', fontFamily: 'Space Grotesk, sans-serif' }}>🎯 Explore SkillSense AI instantly</h3>
                                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>No signup needed. Click any role to auto-login and explore the full platform.</p>
                            </div>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                {[
                                    { role: 'Student', emoji: '🎓', color: GOLD, href: '/auth?demo=student' },
                                    { role: 'Admin', emoji: '⚙️', color: INDIGO, href: '/auth?demo=admin' },
                                    { role: 'Instructor', emoji: '👨‍🏫', color: '#34d399', href: '/auth?demo=instructor' },
                                ].map(d => (
                                    <Link key={d.role} href={d.href} style={{
                                        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 9,
                                        background: `${d.color}14`, border: `1px solid ${d.color}30`,
                                        color: d.color, fontWeight: 700, fontSize: 13, textDecoration: 'none',
                                        transition: 'all 0.2s',
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.background = `${d.color}22`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = `${d.color}14`; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                        {d.emoji} Try as {d.role}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ── FEATURES ─────────────────────────────────────────────────── */}
            <section id="features" className="section-pad" style={{ padding: '100px 24px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <FadeIn style={{ textAlign: 'center', marginBottom: 56 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 99, padding: '5px 14px', marginBottom: 16 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Platform Features</span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                            Everything You Need to <span className="gradient-text">Measure What Matters</span>
                        </h2>
                        <p style={{ color: '#64748b', fontSize: 16, marginTop: 14, maxWidth: 520, margin: '14px auto 0' }}>
                            Six core AI modules that transform raw data into career-changing intelligence.
                        </p>
                    </FadeIn>

                    <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
                        {FEATURES.map((f, i) => (
                            <FadeIn key={i} delay={i * 0.07}>
                                <div className="card-hover" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '24px', cursor: 'default', height: '100%', boxSizing: 'border-box' }}>
                                    <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                                    <div style={{ width: 3, height: 20, borderRadius: 2, background: f.color, marginBottom: 12 }} />
                                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 10, fontFamily: 'Space Grotesk, sans-serif' }}>{f.title}</h3>
                                    <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
            <section id="how-it-works" className="section-pad" style={{ padding: '100px 24px', background: 'rgba(255,255,255,0.015)' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <FadeIn style={{ textAlign: 'center', marginBottom: 56 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 99, padding: '5px 14px', marginBottom: 16 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.06em' }}>How It Works</span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                            From Sign-Up to <span className="gradient-text">Dream Job in 4 Steps</span>
                        </h2>
                    </FadeIn>

                    <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
                        {STEPS.map((step, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div style={{ position: 'relative' }}>
                                    {/* Connector line */}
                                    {i < STEPS.length - 1 && (
                                        <div style={{ position: 'absolute', top: 40, left: '65%', right: '-35%', height: 1, background: 'linear-gradient(90deg, rgba(212,168,67,0.3), transparent)', zIndex: 0 }} />
                                    )}
                                    <div className="card-hover" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '28px 20px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                                        <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(212,168,67,0.08)', border: '2px solid rgba(212,168,67,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 22 }}>
                                            {step.icon}
                                        </div>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: '0.08em', marginBottom: 8 }}>STEP {step.num}</div>
                                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 10, fontFamily: 'Space Grotesk, sans-serif' }}>{step.title}</h3>
                                        <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── STAKEHOLDERS ─────────────────────────────────────────────── */}
            <section id="stakeholders" className="section-pad" style={{ padding: '100px 24px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <FadeIn style={{ textAlign: 'center', marginBottom: 56 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 99, padding: '5px 14px', marginBottom: 16 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: AMBER, textTransform: 'uppercase', letterSpacing: '0.06em' }}>For Every Stakeholder</span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                            Built for the Entire <span className="gradient-text">Education Ecosystem</span>
                        </h2>
                    </FadeIn>

                    <div className="stakeholder-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                        {STAKEHOLDERS.map((s, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="card-hover" style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 16, padding: '28px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}18`, border: `1px solid ${s.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                                            {s.emoji}
                                        </div>
                                        <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>For {s.role}</h3>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, marginBottom: 20 }}>
                                        {s.benefits.map((b, j) => (
                                            <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                                <span style={{ color: s.color, flexShrink: 0, fontWeight: 700, fontSize: 14, marginTop: 1 }}>✓</span>
                                                <span style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.5 }}>{b}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <Link href={s.href} style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        padding: '10px 18px', borderRadius: 8,
                                        background: `${s.color}18`, border: `1px solid ${s.color}35`,
                                        color: s.color, fontWeight: 700, fontSize: 13, textDecoration: 'none',
                                        transition: 'all 0.2s', width: 'fit-content',
                                    }}>
                                        {s.cta} →
                                    </Link>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            <IndustryPlans />

            {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
            <section id="testimonials" className="section-pad" style={{ padding: '100px 24px', background: 'rgba(255,255,255,0.015)' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <FadeIn style={{ textAlign: 'center', marginBottom: 56 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 99, padding: '5px 14px', marginBottom: 16 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: PURPLE, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Testimonials</span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                            Loved by <span className="gradient-text">10,000+ Learners</span>
                        </h2>
                    </FadeIn>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                        {TESTIMONIALS.map((t, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="card-hover" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                                    {/* Quote mark */}
                                    <div style={{ fontSize: 40, color: t.color, opacity: 0.3, lineHeight: 1, marginBottom: 12, fontFamily: 'Georgia, serif' }}>&ldquo;</div>
                                    <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.75, flex: 1, margin: '0 0 20px' }}>{t.quote}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto' }}>
                                        <div style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                                            {t.avatar}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{t.name}</div>
                                            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{t.role}</div>
                                            <div style={{ marginTop: 4 }}><Stars count={t.stars} /></div>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PRICING ──────────────────────────────────────────────────── */}
            <section id="pricing" className="section-pad" style={{ padding: '100px 24px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <FadeIn style={{ textAlign: 'center', marginBottom: 56 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 99, padding: '5px 14px', marginBottom: 16 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: INDIGO, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pricing</span>
                        </div>
                        <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                            Simple, <span className="gradient-text">Transparent Pricing</span>
                        </h2>
                        <p style={{ color: '#64748b', fontSize: 16, marginTop: 14 }}>Start free, scale when you&apos;re ready.</p>
                    </FadeIn>

                    <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'start' }}>
                        {PRICING.map((p, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="card-hover" style={{
                                    background: p.highlight ? `linear-gradient(145deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))` : 'rgba(255,255,255,0.03)',
                                    border: p.highlight ? `1px solid rgba(99,102,241,0.4)` : '1px solid rgba(255,255,255,0.07)',
                                    borderRadius: 16, padding: '28px', position: 'relative', overflow: 'hidden',
                                    boxShadow: p.highlight ? '0 0 40px rgba(99,102,241,0.12)' : 'none',
                                }}>
                                    {p.highlight && (
                                        <div style={{ position: 'absolute', top: 16, right: 16, background: `linear-gradient(135deg, ${INDIGO}, ${PURPLE})`, color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 99, letterSpacing: '0.05em' }}>
                                            MOST POPULAR
                                        </div>
                                    )}
                                    <div style={{ fontSize: 13, fontWeight: 600, color: p.color, marginBottom: 12 }}>{p.tier}</div>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
                                        <span style={{ fontSize: 38, fontWeight: 900, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>{p.price}</span>
                                        {p.period && <span style={{ fontSize: 13, color: '#64748b' }}>{p.period}</span>}
                                    </div>
                                    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '20px 0' }} />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 24 }}>
                                        {p.features.map((f, j) => (
                                            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <span style={{ color: p.highlight ? INDIGO : '#22c55e', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>✓</span>
                                                <span style={{ color: '#94a3b8', fontSize: 13 }}>{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <Link href="/auth" style={{
                                        display: 'block', textAlign: 'center', padding: '11px', borderRadius: 8,
                                        background: p.highlight ? `linear-gradient(135deg, ${INDIGO}, ${PURPLE})` : `${p.color}18`,
                                        border: p.highlight ? 'none' : `1px solid ${p.color}30`,
                                        color: p.highlight ? '#fff' : p.color,
                                        fontWeight: 700, fontSize: 13, textDecoration: 'none',
                                        boxShadow: p.highlight ? '0 4px 20px rgba(99,102,241,0.3)' : 'none',
                                    }}>
                                        {p.cta}
                                    </Link>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA BANNER ───────────────────────────────────────────────── */}
            <section className="section-pad" style={{ padding: '80px 24px 100px' }}>
                <div style={{ maxWidth: 780, margin: '0 auto' }}>
                    <FadeIn>
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,168,67,0.15)', borderRadius: 24, padding: '60px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, background: `radial-gradient(circle, rgba(212,168,67,0.08) 0%, transparent 70%)`, pointerEvents: 'none' }} />
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
                                <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800, color: '#fff', marginBottom: 14, fontFamily: 'Space Grotesk, sans-serif' }}>
                                    Ready to Measure What <span className="gradient-text">Actually Matters?</span>
                                </h2>
                                <p style={{ color: '#64748b', fontSize: 16, marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
                                    Join 10,000+ students and 200+ industry partners already using SkillSense AI.
                                </p>
                                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                                    <Link href="/auth" style={{ fontSize: 15, padding: '13px 28px', borderRadius: 10, background: `linear-gradient(135deg, ${GOLD}, #8b6512)`, color: '#1a0f00', fontWeight: 800, textDecoration: 'none', boxShadow: '0 4px 24px rgba(212,168,67,0.3)' }}>
                                        Start Free Today
                                    </Link>
                                    <Link href="/institute" style={{ fontSize: 15, padding: '13px 28px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#cbd5e1', fontWeight: 600, textDecoration: 'none' }}>
                                        Book Institute Demo
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────────────────── */}
            <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '60px 24px 32px', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
                        {/* Brand col */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_L})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#08060f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                                <span style={{ fontWeight: 800, fontSize: 15, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>SkillSense AI</span>
                            </div>
                            <p style={{ color: '#475569', fontSize: 13, lineHeight: 1.7, maxWidth: 260, marginBottom: 20 }}>
                                India&apos;s first AI-powered vocational skill platform. Measuring skills, predicting futures.
                            </p>
                            {/* Social icons */}
                            <div style={{ display: 'flex', gap: 10 }}>
                                {[
                                    { icon: '𝕏', href: '#' },
                                    { icon: 'in', href: '#' },
                                    { icon: '⌥', href: '#' },
                                ].map((s, i) => (
                                    <a key={i} href={s.href} style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: 13, textDecoration: 'none', transition: 'all 0.2s' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,168,67,0.3)'; e.currentTarget.style.color = GOLD; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#475569'; }}>
                                        {s.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Link cols */}
                        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
                            <div key={title}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{title}</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {links.map(l => (
                                        <a key={l} href="#" style={{ color: '#475569', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
                                            onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
                                            onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
                                            {l}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom bar */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                        <p style={{ color: '#334155', fontSize: 12 }}>© 2026 SkillSense AI · All rights reserved · Made with ❤️ in India 🇮🇳</p>
                        <div style={{ display: 'flex', gap: 20 }}>
                            {['Privacy', 'Terms', 'Cookies', 'Sitemap'].map(l => (
                                <a key={l} href="#" style={{ color: '#334155', fontSize: 12, textDecoration: 'none' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = '#64748b')}
                                    onMouseLeave={e => (e.currentTarget.style.color = '#334155')}>
                                    {l}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
