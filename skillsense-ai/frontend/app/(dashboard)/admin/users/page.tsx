'use client';

import React, { useState } from 'react';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

interface User {
    id: string; name: string; email: string; role: string; institute: string; status: string; lastLogin: string;
}

const INITIAL_USERS: User[] = [
    { id: 'U001', name: 'Ravi Kumar', email: 'ravi@niit.edu', role: 'Institute Admin', institute: 'NIIT University', status: 'active', lastLogin: '2026-03-14' },
    { id: 'U002', name: 'Priya Sharma', email: 'priya@aptech.edu', role: 'Student', institute: 'Aptech Delhi', status: 'active', lastLogin: '2026-03-13' },
    { id: 'U003', name: 'Anjali Verma', email: 'anjali@meity.gov', role: 'Government Official', institute: 'MeitY', status: 'active', lastLogin: '2026-03-12' },
    { id: 'U004', name: 'Suresh Patel', email: 'suresh@razorpay.com', role: 'Industry Partner', institute: 'Razorpay', status: 'inactive', lastLogin: '2026-02-28' },
    { id: 'U005', name: 'Meena Nair', email: 'meena@iiit.ac.in', role: 'Student', institute: 'IIIT Kochi', status: 'active', lastLogin: '2026-03-14' },
    { id: 'U006', name: 'Deepak Singh', email: 'deepak@skilldev.in', role: 'Institute Admin', institute: 'Rajasthan Skill Dev', status: 'suspended', lastLogin: '2026-03-01' },
];

const STATUS_COLORS: Record<string, string> = { active: '#22c55e', inactive: MUTED, suspended: '#ef4444' };
const ROLE_COLORS: Record<string, string> = { 'Institute Admin': '#8b5cf6', Student: '#3b82f6', 'Government Official': '#10b981', 'Industry Partner': '#f59e0b', 'Super Admin': GOLD };
const ROLE_OPTIONS = ['Student', 'Institute Admin', 'Industry Partner', 'Government Official', 'Super Admin'];

export default function UsersPage() {
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState<User[]>(INITIAL_USERS);
    const [showModal, setShowModal] = useState(false);
    const [fName, setFName] = useState('');
    const [fEmail, setFEmail] = useState('');
    const [fRole, setFRole] = useState(ROLE_OPTIONS[0]);
    const [fInstitute, setFInstitute] = useState('');

    const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search) || u.role.toLowerCase().includes(search.toLowerCase()));

    const handleAdd = () => {
        if (!fName.trim() || !fEmail.trim()) return;
        const newUser: User = {
            id: `U${String(users.length + 1).padStart(3, '0')}`,
            name: fName.trim(),
            email: fEmail.trim(),
            role: fRole,
            institute: fInstitute.trim() || '—',
            status: 'active',
            lastLogin: new Date().toISOString().split('T')[0],
        };
        setUsers(prev => [newUser, ...prev]);
        setShowModal(false);
        setFName(''); setFEmail(''); setFInstitute(''); setFRole(ROLE_OPTIONS[0]);
    };

    const inputStyle = {
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 8, padding: '9px 12px', color: WHITE, fontSize: 13, outline: 'none', width: '100%' as const,
    };
    const labelStyle = { fontSize: 11, color: MUTED, fontWeight: 600 as const, marginBottom: 4, display: 'block' as const };

    return (
        <div style={{ color: WHITE, maxWidth: 1100 }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                    User <span style={{ color: GOLD }}>Management</span>
                </h1>
                <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>{users.length} registered users</p>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
                <input type="text" placeholder="Search by name, email, role..." value={search} onChange={(e) => setSearch(e.target.value)}
                    style={{ flex: 1, ...inputStyle }} />
                <button onClick={() => setShowModal(true)} style={{
                    padding: '9px 18px', borderRadius: 8, border: 'none',
                    background: `linear-gradient(135deg, ${GOLD}, #8b6512)`,
                    color: '#1a0f00', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                }}>+ Add User</button>
            </div>

            {/* Add User Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
                    onClick={() => setShowModal(false)}>
                    <div onClick={e => e.stopPropagation()} style={{
                        width: 440, background: '#0f0d18', border: '1px solid rgba(212,168,67,0.15)',
                        borderRadius: 16, padding: 28,
                    }}>
                        <h2 className="font-display" style={{ fontSize: 18, fontWeight: 800, color: WHITE, marginBottom: 20 }}>Add New User</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div>
                                <label style={labelStyle}>Full Name *</label>
                                <input type="text" placeholder="Enter name" value={fName} onChange={e => setFName(e.target.value)} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Email *</label>
                                <input type="email" placeholder="Enter email" value={fEmail} onChange={e => setFEmail(e.target.value)} style={inputStyle} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div>
                                    <label style={labelStyle}>Role</label>
                                    <select value={fRole} onChange={e => setFRole(e.target.value)} style={{ ...inputStyle, appearance: 'auto' as any }}>
                                        {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Institution</label>
                                    <input type="text" placeholder="Institution name" value={fInstitute} onChange={e => setFInstitute(e.target.value)} style={inputStyle} />
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowModal(false)} style={{
                                padding: '9px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)',
                                background: 'transparent', color: MUTED, fontSize: 13, cursor: 'pointer',
                            }}>Cancel</button>
                            <button onClick={handleAdd} className="btn-primary" style={{ padding: '9px 24px', fontSize: 13, borderRadius: 8 }}>Add User</button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                        <tr style={{ background: 'rgba(212,168,67,0.08)' }}>
                            {['Name', 'Email', 'Role', 'Institution', 'Status', 'Last Login', 'Actions'].map((h) => (
                                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: MUTED, fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((user, i) => (
                            <tr key={user.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                                <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg, ${GOLD}, #8b6512)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#1a0f00' }}>{user.name.charAt(0)}</div>
                                        <span style={{ color: WHITE, fontWeight: 500 }}>{user.name}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '10px 14px', color: MUTED, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{user.email}</td>
                                <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20, background: `${ROLE_COLORS[user.role] ?? MUTED}18`, color: ROLE_COLORS[user.role] ?? MUTED, border: `1px solid ${ROLE_COLORS[user.role] ?? MUTED}40` }}>{user.role}</span>
                                </td>
                                <td style={{ padding: '10px 14px', color: MUTED, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{user.institute}</td>
                                <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLORS[user.status] ?? MUTED }} />
                                        <span style={{ color: STATUS_COLORS[user.status] ?? MUTED, fontSize: 12, textTransform: 'capitalize' }}>{user.status}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '10px 14px', color: MUTED, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{new Date(user.lastLogin).toLocaleDateString('en-IN')}</td>
                                <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        <button style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: MUTED, fontSize: 11, cursor: 'pointer' }}>Edit</button>
                                        <button style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: 11, cursor: 'pointer' }}>Suspend</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
