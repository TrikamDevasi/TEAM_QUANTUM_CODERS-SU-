'use client';

import React, { useState, useEffect, useRef } from 'react';

const GOLD = '#D4A843';
const API = process.env.NEXT_PUBLIC_API_URL || 'https://skillsense-backend.onrender.com/api/v1';

interface UserProfile {
    name: string;
    email: string;
    bio: string;
    location: string;
    skills: string[];
    avatar: string;
    role: string;
    lastLogin?: string;
    createdAt?: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile>({
        name: '', email: '', bio: '', location: '', skills: [], avatar: '', role: 'student',
    });
    const [newSkill, setNewSkill] = useState('');
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');
    const [editing, setEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Load from localStorage first
        try {
            const stored = localStorage.getItem('ss_user');
            if (stored) {
                const parsed = JSON.parse(stored);
                setProfile(prev => ({
                    ...prev,
                    name: parsed.name || 'Arjun Mehta',
                    email: parsed.email || 'arjun.mehta@example.com',
                    role: parsed.role || 'student',
                    bio: parsed.bio || 'Full-stack developer passionate about building scalable web applications. Currently pursuing B.Tech in Computer Science.',
                    location: parsed.location || 'Bangalore, India',
                    skills: parsed.skills || ['React.js', 'Node.js', 'TypeScript', 'Python', 'MongoDB', 'Next.js', 'Docker', 'AWS'],
                    avatar: parsed.avatar || '',
                    lastLogin: parsed.lastLogin || new Date().toISOString(),
                    createdAt: parsed.createdAt || '2025-09-15T00:00:00',
                }));
            } else {
                // Demo fallback
                setProfile({
                    name: 'Arjun Mehta',
                    email: 'arjun.mehta@example.com',
                    bio: 'Full-stack developer passionate about building scalable web applications. Currently pursuing B.Tech in Computer Science.',
                    location: 'Bangalore, India',
                    skills: ['React.js', 'Node.js', 'TypeScript', 'Python', 'MongoDB', 'Next.js', 'Docker', 'AWS'],
                    avatar: '',
                    role: 'student',
                    lastLogin: new Date().toISOString(),
                    createdAt: '2025-09-15T00:00:00',
                });
            }
        } catch { /* fallback */ }

        // Try fetching from API
        fetch(`${API}/profile`, { credentials: 'include' })
            .then(r => r.ok ? r.json() : null)
            .then(data => { if (data?.user) setProfile(prev => ({ ...prev, ...data.user })); })
            .catch(() => { /* use local data */ });
    }, []);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`${API}/profile/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: profile.name,
                    bio: profile.bio,
                    location: profile.location,
                    skills: profile.skills,
                }),
            });
            if (res.ok) {
                // Also update localStorage
                const stored = localStorage.getItem('ss_user');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    localStorage.setItem('ss_user', JSON.stringify({ ...parsed, ...profile }));
                }
                showToast('Profile updated successfully!');
                setEditing(false);
            } else {
                // Still save locally for demo
                const stored = localStorage.getItem('ss_user');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    localStorage.setItem('ss_user', JSON.stringify({ ...parsed, ...profile }));
                } else {
                    localStorage.setItem('ss_user', JSON.stringify(profile));
                }
                showToast('Profile saved locally!');
                setEditing(false);
            }
        } catch {
            // Save locally as fallback
            localStorage.setItem('ss_user', JSON.stringify(profile));
            showToast('Profile saved locally!');
            setEditing(false);
        }
        setSaving(false);
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);

        const saveAvatarLocally = (avatarData: string) => {
            setProfile(prev => ({ ...prev, avatar: avatarData }));
            // Persist to localStorage and notify header
            try {
                const stored = localStorage.getItem('ss_user');
                const parsed = stored ? JSON.parse(stored) : {};
                localStorage.setItem('ss_user', JSON.stringify({ ...parsed, avatar: avatarData }));
                window.dispatchEvent(new Event('avatar-updated'));
            } catch { }
            showToast('Avatar uploaded!');
        };

        try {
            const formData = new FormData();
            formData.append('avatar', file);
            const res = await fetch(`${API}/profile/avatar`, {
                method: 'POST', credentials: 'include', body: formData,
            });
            if (res.ok) {
                const data = await res.json();
                saveAvatarLocally(data.avatarUrl || data.avatar);
            } else {
                const reader = new FileReader();
                reader.onload = (ev) => saveAvatarLocally(ev.target?.result as string);
                reader.readAsDataURL(file);
            }
        } catch {
            const reader = new FileReader();
            reader.onload = (ev) => saveAvatarLocally(ev.target?.result as string);
            reader.readAsDataURL(e.target.files![0]);
        }
        setUploading(false);
    };

    const skillInputRef = useRef<HTMLInputElement>(null);

    const addSkill = () => {
        const skill = newSkill.trim();
        if (!skill) return;
        if (profile.skills.includes(skill)) {
            showToast('Skill already exists!');
            return;
        }
        setProfile(prev => ({ ...prev, skills: [...prev.skills, skill] }));
        setNewSkill('');
        showToast(`"${skill}" added!`);
        // Re-focus input for quick multi-add
        setTimeout(() => skillInputRef.current?.focus(), 50);
    };

    const removeSkill = (s: string) => {
        setProfile(prev => ({ ...prev, skills: prev.skills.filter(x => x !== s) }));
        showToast(`"${s}" removed`);
    };

    const getTimeAgo = (date: string) => {
        const diff = Date.now() - new Date(date).getTime();
        const hours = Math.floor(diff / 3600000);
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours} hours ago`;
        return `${Math.floor(hours / 24)} days ago`;
    };

    const initials = profile.name ? profile.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'U';

    return (
        <div>
            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', top: 20, right: 20, zIndex: 9999,
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
                <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>
                    My <span style={{ color: GOLD }}>Profile</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                    Manage your personal information and skills
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
                {/* Left: Avatar card */}
                <div className="stat-card" style={{ textAlign: 'center' }}>
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
                        {profile.avatar ? (
                            <img src={profile.avatar} alt="Avatar" style={{
                                width: 100, height: 100, borderRadius: '50%', objectFit: 'cover',
                                border: `3px solid ${GOLD}`,
                            }} />
                        ) : (
                            <div style={{
                                width: 100, height: 100, borderRadius: '50%',
                                background: `linear-gradient(135deg, ${GOLD}, #F0C05A)`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 32, fontWeight: 800, color: '#08060f',
                                border: '3px solid rgba(212,168,67,0.3)',
                            }}>
                                {initials}
                            </div>
                        )}
                        <button
                            onClick={() => fileRef.current?.click()}
                            style={{
                                position: 'absolute', bottom: 0, right: 0,
                                width: 32, height: 32, borderRadius: '50%',
                                background: GOLD, border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            {uploading ? (
                                <div style={{ width: 14, height: 14, border: '2px solid #08060f', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                            ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#08060f" strokeWidth="2">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                            )}
                        </button>
                        <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                    </div>

                    <h2 className="font-display" style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                        {profile.name}
                    </h2>
                    <span style={{
                        fontSize: 10, fontWeight: 700, padding: '3px 12px', borderRadius: 99,
                        background: 'rgba(212,168,67,0.1)', color: GOLD, textTransform: 'uppercase',
                    }}>
                        {profile.role}
                    </span>

                    <div style={{ marginTop: 20, textAlign: 'left' }}>
                        <div style={{ fontSize: 12, color: '#475569', marginBottom: 6 }}>Email</div>
                        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 16 }}>{profile.email}</div>

                        <div style={{ fontSize: 12, color: '#475569', marginBottom: 6 }}>Location</div>
                        <div style={{ fontSize: 13, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                            </svg>
                            {profile.location || 'Not set'}
                        </div>

                        <div style={{ fontSize: 12, color: '#475569', marginBottom: 6 }}>Last Active</div>
                        <div style={{ fontSize: 13, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                            {profile.lastLogin ? getTimeAgo(profile.lastLogin) : 'Unknown'}
                        </div>

                        <div style={{ fontSize: 12, color: '#475569', marginBottom: 6 }}>Member Since</div>
                        <div style={{ fontSize: 13, color: '#94a3b8' }}>
                            {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'N/A'}
                        </div>
                    </div>
                </div>

                {/* Right: Edit Form */}
                <div>
                    {/* Edit card */}
                    <div className="stat-card" style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                                <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Personal Information</h3>
                            </div>
                            {!editing && (
                                <button onClick={() => setEditing(true)} className="btn-ghost" style={{ fontSize: 12, padding: '6px 14px' }}>
                                    Edit
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'grid', gap: 16 }}>
                            <div>
                                <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Full Name</label>
                                <input
                                    value={profile.name}
                                    onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                                    disabled={!editing}
                                    style={{
                                        width: '100%', padding: '10px 14px', borderRadius: 10,
                                        background: editing ? 'rgba(212,168,67,0.04)' : 'rgba(212,168,67,0.02)',
                                        border: `1px solid ${editing ? 'rgba(212,168,67,0.2)' : 'rgba(212,168,67,0.08)'}`,
                                        color: '#fff', fontSize: 14, outline: 'none',
                                        fontFamily: "'Space Grotesk', sans-serif",
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Email (read-only)</label>
                                <input
                                    value={profile.email} disabled
                                    style={{
                                        width: '100%', padding: '10px 14px', borderRadius: 10,
                                        background: 'rgba(212,168,67,0.02)',
                                        border: '1px solid rgba(212,168,67,0.06)',
                                        color: '#475569', fontSize: 14, outline: 'none',
                                        fontFamily: "'Space Grotesk', sans-serif",
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Bio</label>
                                <textarea
                                    value={profile.bio}
                                    onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                                    disabled={!editing}
                                    rows={3}
                                    style={{
                                        width: '100%', padding: '10px 14px', borderRadius: 10,
                                        background: editing ? 'rgba(212,168,67,0.04)' : 'rgba(212,168,67,0.02)',
                                        border: `1px solid ${editing ? 'rgba(212,168,67,0.2)' : 'rgba(212,168,67,0.08)'}`,
                                        color: '#fff', fontSize: 14, outline: 'none', resize: 'vertical',
                                        fontFamily: "'Space Grotesk', sans-serif",
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Location</label>
                                <input
                                    value={profile.location}
                                    onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}
                                    disabled={!editing}
                                    style={{
                                        width: '100%', padding: '10px 14px', borderRadius: 10,
                                        background: editing ? 'rgba(212,168,67,0.04)' : 'rgba(212,168,67,0.02)',
                                        border: `1px solid ${editing ? 'rgba(212,168,67,0.2)' : 'rgba(212,168,67,0.08)'}`,
                                        color: '#fff', fontSize: 14, outline: 'none',
                                        fontFamily: "'Space Grotesk', sans-serif",
                                    }}
                                />
                            </div>
                        </div>

                        {editing && (
                            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                                <button onClick={() => setEditing(false)} className="btn-ghost" style={{ fontSize: 13, padding: '9px 20px' }}>
                                    Cancel
                                </button>
                                <button onClick={handleSave} className="btn-primary" style={{
                                    fontSize: 13, padding: '9px 20px', display: 'flex', alignItems: 'center', gap: 6,
                                    opacity: saving ? 0.6 : 1,
                                }} disabled={saving}>
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Skills card */}
                    <div className="stat-card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <div style={{ width: 4, height: 18, borderRadius: 2, background: '#22c55e' }} />
                            <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Skills</h3>
                            <span style={{ fontSize: 11, color: '#64748b', marginLeft: 'auto' }}>{profile.skills.length} skills</span>
                        </div>

                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                            {profile.skills.map(s => (
                                <span key={s} style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    fontSize: 12, padding: '5px 12px', borderRadius: 99,
                                    background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.15)',
                                    color: '#cbd5e1',
                                }}>
                                    {s}
                                    <button type="button" onClick={() => removeSkill(s)} style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: '#ef4444', fontSize: 14, lineHeight: 1, padding: 0,
                                    }}>×</button>
                                </span>
                            ))}
                            {profile.skills.length === 0 && (
                                <p style={{ color: '#475569', fontSize: 12 }}>No skills added yet. Add your first skill below!</p>
                            )}
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); addSkill(); }} style={{ display: 'flex', gap: 8 }}>
                            <input
                                ref={skillInputRef}
                                value={newSkill}
                                onChange={e => setNewSkill(e.target.value)}
                                placeholder="Add a skill (e.g. React, Python, Docker)..."
                                style={{
                                    flex: 1, padding: '9px 14px', borderRadius: 10,
                                    background: 'rgba(212,168,67,0.04)',
                                    border: '1px solid rgba(212,168,67,0.12)',
                                    color: '#fff', fontSize: 13, outline: 'none',
                                    fontFamily: "'Space Grotesk', sans-serif",
                                }}
                            />
                            <button type="submit" style={{
                                padding: '9px 20px', borderRadius: 10,
                                background: newSkill.trim() ? 'linear-gradient(135deg, #D4A843, #F0C05A)' : 'rgba(212,168,67,0.15)',
                                border: 'none',
                                color: newSkill.trim() ? '#08060f' : '#64748b',
                                fontSize: 12, fontWeight: 700, cursor: newSkill.trim() ? 'pointer' : 'default',
                                fontFamily: "'Space Grotesk', sans-serif",
                                transition: 'all 0.2s',
                            }}>
                                + Add
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
