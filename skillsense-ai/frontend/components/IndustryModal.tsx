'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import api from '@/lib/api';

interface IndustryModalProps {
    isOpen: boolean;
    onClose: () => void;
    planName: string;
}

const GOLD = '#D4A843';

export default function IndustryModal({ isOpen, onClose, planName }: IndustryModalProps) {
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        phone: '',
        teamSize: '50-200',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/contact/industry', {
                ...formData,
                plan: planName
            });
            setSubmitted(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'rgba(5, 3, 10, 0.85)',
            backdropFilter: 'blur(8px)'
        }}>
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '500px',
                background: '#111',
                border: `1px solid ${GOLD}33`,
                borderRadius: '24px',
                padding: '40px',
                boxShadow: `0 20px 80px rgba(0,0,0,0.5), 0 0 20px ${GOLD}11`,
                animation: 'modalSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
                <button 
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'rgba(255,255,255,0.05)',
                        border: 'none',
                        color: '#94a3b8',
                        padding: '8px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    <X size={20} />
                </button>

                {!submitted ? (
                    <>
                        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '8px', fontFamily: 'Space Grotesk, sans-serif' }}>
                            Industry Access
                        </h2>
                        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '32px' }}>
                            Request inquiry for the <span style={{ color: GOLD, fontWeight: '700' }}>{planName}</span> plan.
                        </p>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Company Name</label>
                                <input 
                                    required
                                    type="text" 
                                    placeholder="e.g. Acme Corp"
                                    value={formData.companyName}
                                    onChange={e => setFormData({...formData, companyName: e.target.value})}
                                    style={inputStyle}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Work Email</label>
                                    <input 
                                        required
                                        type="email" 
                                        placeholder="you@company.com"
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Team Size</label>
                                    <select 
                                        value={formData.teamSize}
                                        onChange={e => setFormData({...formData, teamSize: e.target.value})}
                                        style={inputStyle}
                                    >
                                        <option value="1-50">1-50 employees</option>
                                        <option value="51-200">51-200 employees</option>
                                        <option value="201-500">201-500 employees</option>
                                        <option value="500+">500+ employees</option>
                                        <option value="Government">Government / Public Body</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>Message (Optional)</label>
                                <textarea 
                                    rows={3}
                                    placeholder="Tell us about your organization's needs..."
                                    value={formData.message}
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                    style={{ ...inputStyle, resize: 'none' }}
                                />
                            </div>

                            {error && <div style={{ color: '#f87171', fontSize: '14px', background: 'rgba(248,113,113,0.1)', padding: '12px', borderRadius: '12px' }}>{error}</div>}

                            <button 
                                type="submit" 
                                disabled={loading}
                                style={{
                                    marginTop: '12px',
                                    background: GOLD,
                                    color: '#08060f',
                                    border: 'none',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    fontWeight: '800',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    transition: 'all 0.3s ease',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? 'Sending...' : 'Submit Inquiry'}
                                <Send size={18} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{ 
                            width: '80px', 
                            height: '80px', 
                            background: `${GOLD}22`, 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            color: GOLD
                        }}>
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '16px', fontFamily: 'Space Grotesk, sans-serif' }}>
                            Thank You!
                        </h2>
                        <p style={{ color: '#94a3b8', lineHeight: '1.6', marginBottom: '32px' }}>
                            We've received your inquiry for the {planName} plan. Our team will review your details and get back to you within 24 hours.
                        </p>
                        <button 
                            onClick={onClose}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '12px 32px',
                                borderRadius: '14px',
                                fontWeight: '700',
                                cursor: 'pointer'
                            }}
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes modalSlideIn {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '14px',
    padding: '14px 16px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box'
};
