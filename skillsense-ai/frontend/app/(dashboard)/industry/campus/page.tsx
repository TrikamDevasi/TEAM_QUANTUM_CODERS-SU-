'use client';

import React, { useState } from 'react';
import { sampleInstitutions } from '../../../../data/sampleInstitutions';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

interface CampusRequest {
    instituteName: string;
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    preferredDate: string;
    roles: string;
    message: string;
}

export default function CampusPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedInst, setSelectedInst] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState('');
    const [form, setForm] = useState<CampusRequest>({
        instituteName: '',
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        preferredDate: '',
        roles: '',
        message: '',
    });

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 4000);
    };

    const handleRequestClick = (instName: string) => {
        setSelectedInst(instName);
        setForm(prev => ({ ...prev, instituteName: instName }));
        setSubmitted(false);
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.companyName || !form.contactPerson || !form.email) {
            showToast('Please fill all required fields');
            return;
        }
        setSubmitting(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));
        setSubmitting(false);
        setSubmitted(true);
        showToast(`Campus drive request sent to ${selectedInst}!`);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setForm({
            instituteName: '', companyName: '', contactPerson: '',
            email: '', phone: '', preferredDate: '', roles: '', message: '',
        });
        setSubmitted(false);
    };

    const inputStyle = {
        width: '100%', padding: '10px 14px', borderRadius: 10,
        background: 'rgba(212,168,67,0.04)',
        border: '1px solid rgba(212,168,67,0.15)',
        color: '#fff', fontSize: 13, outline: 'none',
        fontFamily: "'Space Grotesk', sans-serif",
    };

    return (
        <div style={{ color: WHITE, maxWidth: 1100 }}>
            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', top: 20, right: 20, zIndex: 99999,
                    background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
                    borderRadius: 12, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 8,
                    animation: 'fadeIn 0.3s ease',
                }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 600 }}>{toast}</span>
                </div>
            )}

            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                    🤝 Campus <span style={{ color: GOLD }}>Connect</span>
                </h1>
                <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                    Partner with top-performing institutions for direct campus hiring
                </p>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
                {[
                    { label: 'Partner Institutions', value: sampleInstitutions.length },
                    { label: 'Total Students', value: sampleInstitutions.reduce((s, i) => s + i.students, 0).toLocaleString('en-IN') },
                    { label: 'Avg Placement Rate', value: `${Math.round(sampleInstitutions.reduce((s, i) => s + i.placementRate, 0) / sampleInstitutions.length)}%` },
                ].map((stat) => (
                    <div key={stat.label} style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
                        <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: GOLD }}>{stat.value}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: MUTED }}>{stat.label}</p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                {sampleInstitutions.map((inst) => (
                    <div
                        key={inst.id}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(212,168,67,0.18)',
                            borderRadius: 14,
                            padding: '20px',
                            transition: 'border-color 0.2s, transform 0.2s',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,168,67,0.5)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,168,67,0.18)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: WHITE }}>{inst.name}</h3>
                                <p style={{ margin: '3px 0 0', fontSize: 12, color: MUTED }}>{inst.state} • {inst.type} • NSQF {inst.nsqfLevel}</p>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: inst.placementRate >= 80 ? 'rgba(34,197,94,0.15)' : 'rgba(212,168,67,0.15)', color: inst.placementRate >= 80 ? '#22c55e' : GOLD, border: `1px solid ${inst.placementRate >= 80 ? 'rgba(34,197,94,0.3)' : 'rgba(212,168,67,0.3)'}`, flexShrink: 0 }}>
                                {inst.placementRate}% placed
                            </span>
                        </div>

                        <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                            <div>
                                <p style={{ margin: 0, fontSize: 11, color: MUTED }}>Students</p>
                                <p style={{ margin: '2px 0 0', fontSize: 15, fontWeight: 700, color: WHITE }}>{inst.students.toLocaleString('en-IN')}</p>
                            </div>
                        </div>

                        <div style={{ marginBottom: 14 }}>
                            <p style={{ margin: '0 0 6px', fontSize: 11, color: MUTED, textTransform: 'uppercase' }}>Top Programs</p>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {inst.topPrograms.map((p) => (
                                    <span key={p} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'rgba(212,168,67,0.08)', color: GOLD, border: '1px solid rgba(212,168,67,0.2)' }}>{p}</span>
                                ))}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => handleRequestClick(inst.name)}
                            style={{
                                width: '100%',
                                padding: '9px',
                                borderRadius: 8,
                                border: `1px solid ${GOLD}`,
                                background: 'transparent',
                                color: GOLD,
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'background 0.15s, transform 0.15s',
                                fontFamily: "'Space Grotesk', sans-serif",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,168,67,0.1)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >
                            📋 Request Campus Drive
                        </button>
                    </div>
                ))}
            </div>

            {/* ── Campus Drive Request Modal ── */}
            {modalOpen && (
                <div
                    onClick={handleCloseModal}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 99998,
                        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: 'fadeIn 0.2s ease',
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: '90%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto',
                            background: '#111', border: '1px solid rgba(212,168,67,0.15)',
                            borderRadius: 20, padding: '32px',
                        }}
                    >
                        {submitted ? (
                            /* ── Success State ── */
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <div style={{
                                    width: 64, height: 64, borderRadius: '50%', margin: '0 auto 16px',
                                    background: 'rgba(34,197,94,0.1)', border: '3px solid #22c55e',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                </div>
                                <h2 className="font-display" style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
                                    Request Sent!
                                </h2>
                                <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 4 }}>
                                    Your campus drive request has been sent to
                                </p>
                                <p style={{ fontSize: 15, fontWeight: 700, color: GOLD, marginBottom: 20 }}>
                                    {selectedInst}
                                </p>
                                <p style={{ fontSize: 12, color: '#475569', marginBottom: 24 }}>
                                    The institution will review your request and get back to you within 3-5 business days.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    style={{
                                        padding: '10px 28px', borderRadius: 10,
                                        background: 'linear-gradient(135deg, #D4A843, #F0C05A)',
                                        border: 'none', color: '#08060f', fontSize: 13, fontWeight: 700,
                                        cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif",
                                    }}
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            /* ── Form ── */
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                    <div>
                                        <h2 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                                            Request Campus Drive
                                        </h2>
                                        <p style={{ fontSize: 12, color: '#64748b' }}>
                                            at <span style={{ color: GOLD, fontWeight: 600 }}>{selectedInst}</span>
                                        </p>
                                    </div>
                                    <button type="button" onClick={handleCloseModal} style={{
                                        background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8,
                                        width: 32, height: 32, cursor: 'pointer', color: '#64748b', fontSize: 18,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>✕</button>
                                </div>

                                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 14 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                        <div>
                                            <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 5 }}>Company Name *</label>
                                            <input
                                                value={form.companyName}
                                                onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
                                                placeholder="e.g. TCS, Infosys"
                                                required
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 5 }}>Contact Person *</label>
                                            <input
                                                value={form.contactPerson}
                                                onChange={e => setForm(f => ({ ...f, contactPerson: e.target.value }))}
                                                placeholder="Your full name"
                                                required
                                                style={inputStyle}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                        <div>
                                            <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 5 }}>Email *</label>
                                            <input
                                                type="email"
                                                value={form.email}
                                                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                                placeholder="email@company.com"
                                                required
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 5 }}>Phone</label>
                                            <input
                                                value={form.phone}
                                                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                                placeholder="+91 98765 43210"
                                                style={inputStyle}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                        <div>
                                            <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 5 }}>Preferred Date</label>
                                            <input
                                                type="date"
                                                value={form.preferredDate}
                                                onChange={e => setForm(f => ({ ...f, preferredDate: e.target.value }))}
                                                style={{ ...inputStyle, colorScheme: 'dark' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 5 }}>Roles to Hire</label>
                                            <input
                                                value={form.roles}
                                                onChange={e => setForm(f => ({ ...f, roles: e.target.value }))}
                                                placeholder="e.g. SDE, Data Analyst"
                                                style={inputStyle}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 5 }}>Message (optional)</label>
                                        <textarea
                                            value={form.message}
                                            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                            placeholder="Any specific requirements, expected headcount, skill preferences..."
                                            rows={3}
                                            style={{ ...inputStyle, resize: 'vertical' }}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        style={{
                                            width: '100%', padding: '12px 0', borderRadius: 10,
                                            background: submitting ? 'rgba(212,168,67,0.3)' : 'linear-gradient(135deg, #D4A843, #F0C05A)',
                                            border: 'none', color: '#08060f', fontSize: 14, fontWeight: 700,
                                            cursor: submitting ? 'wait' : 'pointer',
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {submitting ? (
                                            <>
                                                <div style={{ width: 16, height: 16, border: '2px solid #08060f', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                                Sending Request...
                                            </>
                                        ) : (
                                            '📋 Submit Campus Drive Request'
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
