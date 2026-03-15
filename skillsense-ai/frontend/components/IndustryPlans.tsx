'use client';

import React, { useState } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import IndustryModal from './IndustryModal';

const GOLD = '#D4A843';

const PLANS = [
    {
        name: 'Starter',
        price: 'Γé╣9,999',
        period: '/month',
        tag: 'For Growing Teams',
        features: [
            'Skill gap analysis for teams',
            'AI candidate screening',
            'Basic workforce insights',
            'Company dashboard',
            'Up to 50 employees',
            'Email support'
        ],
        highlight: false
    },
    {
        name: 'Professional',
        price: 'Γé╣24,999',
        period: '/month',
        tag: 'Most Popular',
        features: [
            'Everything in Starter',
            'Advanced AI skill analysis',
            'Industry benchmarking',
            'Smart hiring recommendations',
            'Team performance analytics',
            'Skill Passport verification',
            'Up to 500 employees',
            'Priority support'
        ],
        highlight: true
    },
    {
        name: 'Enterprise',
        price: 'Custom Pricing',
        period: '',
        tag: 'For Governments & Institutions',
        features: [
            'Everything in Professional',
            'National-level workforce intelligence',
            'Government / institutional integrations',
            'AI predictive workforce analytics',
            'Custom dashboards & white-labeling',
            'Unlimited employees',
            'Dedicated account manager',
            'SLA guarantee'
        ],
        highlight: false
    }
];

export default function IndustryPlans() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    return (
        <section id="industry" style={{ 
            background: '#08060f', 
            padding: '120px 24px', 
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Modal */}
            <IndustryModal 
                isOpen={!!selectedPlan} 
                onClose={() => setSelectedPlan(null)} 
                planName={selectedPlan || ''} 
            />
            {/* Subtle Gold Glow Background */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '600px',
                height: '400px',
                background: `radial-gradient(circle, ${GOLD}11 0%, transparent 70%)`,
                filter: 'blur(60px)',
                pointerEvents: 'none',
                zIndex: 0
            }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <span style={{ 
                        color: GOLD, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.2em', 
                        fontSize: '12px', 
                        fontWeight: '800',
                        display: 'block',
                        marginBottom: '16px'
                    }}>
                        REVENUE MODEL
                    </span>
                    <h2 style={{ 
                        fontSize: 'clamp(32px, 5vw, 48px)', 
                        fontWeight: '800', 
                        color: '#fff', 
                        fontFamily: 'Space Grotesk, sans-serif',
                        marginBottom: '20px'
                    }}>
                        Industry Solutions
                    </h2>
                    <p style={{ 
                        color: '#94a3b8', 
                        maxWidth: '640px', 
                        margin: '0 auto', 
                        fontSize: '16px',
                        lineHeight: '1.6'
                    }}>
                        AI-powered skill intelligence for companies, institutions, and governments.
                    </p>
                </div>

                <div className="plans-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                    gap: '32px',
                    maxWidth: '1150px',
                    margin: '0 auto'
                }}>
                    {PLANS.map((plan, i) => (
                        <div 
                            key={plan.name} 
                            className={`plan-card ${plan.highlight ? 'plan-card--highlight' : ''}`}
                            style={{
                                background: plan.highlight 
                                    ? `linear-gradient(145deg, #1c1505 0%, #111 70%)` 
                                    : '#111111',
                                border: plan.highlight 
                                    ? `1px solid ${GOLD}80` 
                                    : '1px solid rgba(212,168,67,0.08)',
                                borderRadius: '1.5rem',
                                padding: '2.5rem 2rem',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                boxShadow: plan.highlight ? `0 0 80px ${GOLD}33` : 'none',
                                transform: plan.highlight ? 'scale(1.05)' : 'none',
                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            }}
                        >
                            {plan.highlight && (
                                <div style={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '20px',
                                    background: GOLD,
                                    color: '#08060f',
                                    fontSize: '10px',
                                    fontWeight: '900',
                                    padding: '4px 12px',
                                    borderRadius: '99px',
                                    letterSpacing: '0.05em'
                                }}>
                                    MOST POPULAR
                                </div>
                            )}

                            <div style={{ marginBottom: '32px' }}>
                                <div style={{ fontSize: '14px', fontWeight: '700', color: plan.highlight ? GOLD : '#64748b', marginBottom: '12px' }}>
                                    {plan.tag}
                                </div>
                                <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '16px', fontFamily: 'Space Grotesk, sans-serif' }}>
                                    {plan.name}
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                    <span style={{ fontSize: '32px', fontWeight: '900', color: '#fff' }}>{plan.price}</span>
                                    <span style={{ fontSize: '14px', color: '#64748b' }}>{plan.period}</span>
                                </div>
                            </div>

                            <div style={{ flex: 1, marginBottom: '40px' }}>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {plan.features.map((feature, j) => (
                                        <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#cbd5e1', fontSize: '14px' }}>
                                            <Check size={16} style={{ color: GOLD, flexShrink: 0, marginTop: '2px' }} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button 
                                onClick={() => setSelectedPlan(plan.name)}
                                style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '12px',
                                background: plan.highlight ? GOLD : 'transparent',
                                border: plan.highlight ? 'none' : `1px solid ${GOLD}40`,
                                color: plan.highlight ? '#08060f' : GOLD,
                                fontWeight: '800',
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }} className="plan-btn">
                                Select {plan.name}
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .plan-card:hover {
                    transform: translateY(-10px) scale(1.02) !important;
                    box-shadow: 0 20px 60px rgba(212,168,67,0.15) !important;
                    border-color: rgba(212,168,67,0.35) !important;
                }
                .plan-card--highlight:hover {
                    transform: translateY(-10px) scale(1.07) !important;
                    box-shadow: 0 20px 80px rgba(212,168,67,0.25) !important;
                    border-color: rgba(212,168,67,0.6) !important;
                }
                .plan-btn:hover {
                    background: ${GOLD};
                    color: #08060f;
                    border-color: transparent;
                    transform: translateY(-2px);
                }
                @media (max-width: 768px) {
                    .plan-card--highlight {
                        transform: scale(1) !important;
                    }
                }
            `}</style>
        </section>
    );
}
