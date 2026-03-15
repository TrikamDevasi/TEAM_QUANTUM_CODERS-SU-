'use client';

import React, { useState, useEffect } from 'react';

const GOLD = '#D4A843';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: 'full-time' | 'part-time' | 'internship' | 'remote';
    industry: string;
    requiredSkills: string[];
    description: string;
    salary: { min: number; max: number };
    applyUrl: string;
    postedAt: string;
    matchScore?: number;
}

const demoJobs: Job[] = [
    { id: '1', title: 'Senior React Developer', company: 'Flipkart', location: 'Bangalore', type: 'full-time', industry: 'Web Development', requiredSkills: ['React.js', 'TypeScript', 'Next.js', 'Node.js', 'Redux'], description: 'Build high-performance e-commerce interfaces with React and Next.js for Flipkart\'s web platform.', salary: { min: 1800000, max: 3000000 }, applyUrl: 'https://flipkart.com/careers', postedAt: '2026-03-12T10:00:00' },
    { id: '2', title: 'Full Stack Engineer', company: 'Razorpay', location: 'Bangalore', type: 'full-time', industry: 'Web Development', requiredSkills: ['React.js', 'Node.js', 'MongoDB', 'TypeScript', 'AWS'], description: 'Build and maintain payment solutions powering millions of businesses across India.', salary: { min: 2000000, max: 3500000 }, applyUrl: 'https://razorpay.com/careers', postedAt: '2026-03-11T10:00:00' },
    { id: '3', title: 'Frontend Developer', company: 'Zerodha', location: 'Bangalore', type: 'full-time', industry: 'Web Development', requiredSkills: ['React.js', 'JavaScript', 'CSS', 'HTML', 'Webpack'], description: 'Create elegant trading interfaces for India\'s largest stock broker platform.', salary: { min: 1500000, max: 2800000 }, applyUrl: 'https://zerodha.com/careers', postedAt: '2026-03-10T10:00:00' },
    { id: '4', title: 'Backend Developer (Node.js)', company: 'Swiggy', location: 'Bangalore', type: 'full-time', industry: 'Web Development', requiredSkills: ['Node.js', 'Express.js', 'MongoDB', 'Redis', 'Docker'], description: 'Build scalable microservices for India\'s leading food delivery platform.', salary: { min: 1600000, max: 2800000 }, applyUrl: 'https://swiggy.com/careers', postedAt: '2026-03-13T10:00:00' },
    { id: '5', title: 'Data Scientist', company: 'PhonePe', location: 'Bangalore', type: 'full-time', industry: 'Data Science', requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Statistics'], description: 'Apply ML models to analyze payment trends and optimize user experiences.', salary: { min: 2200000, max: 4000000 }, applyUrl: 'https://phonepe.com/careers', postedAt: '2026-03-09T10:00:00' },
    { id: '6', title: 'ML Engineer', company: 'Ola', location: 'Bangalore', type: 'full-time', industry: 'Data Science', requiredSkills: ['Python', 'Machine Learning', 'PyTorch', 'Deep Learning', 'NLP'], description: 'Build ML pipelines for demand forecasting and dynamic pricing at scale.', salary: { min: 2500000, max: 4500000 }, applyUrl: 'https://ola.com/careers', postedAt: '2026-03-08T10:00:00' },
    { id: '7', title: 'React Native Developer', company: 'Cred', location: 'Bangalore', type: 'full-time', industry: 'Mobile Development', requiredSkills: ['React Native', 'JavaScript', 'TypeScript', 'iOS', 'Android'], description: 'Build beautiful cross-platform mobile experiences for India\'s top fintech app.', salary: { min: 2000000, max: 3600000 }, applyUrl: 'https://cred.club/careers', postedAt: '2026-03-07T10:00:00' },
    { id: '8', title: 'DevOps Engineer', company: 'Freshworks', location: 'Chennai', type: 'full-time', industry: 'DevOps', requiredSkills: ['Docker', 'AWS', 'Kubernetes', 'CI/CD', 'Terraform'], description: 'Manage cloud infrastructure and deployment pipelines for SaaS products.', salary: { min: 1800000, max: 3200000 }, applyUrl: 'https://freshworks.com/careers', postedAt: '2026-03-06T10:00:00' },
    { id: '9', title: 'UI/UX Designer', company: 'Dream11', location: 'Mumbai', type: 'full-time', industry: 'Design', requiredSkills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems'], description: 'Design engaging sports gaming experiences for 150M+ users.', salary: { min: 1200000, max: 2400000 }, applyUrl: 'https://dream11.com/careers', postedAt: '2026-03-05T10:00:00' },
    { id: '10', title: 'Next.js Developer', company: 'Meesho', location: 'Bangalore', type: 'remote', industry: 'Web Development', requiredSkills: ['Next.js', 'React.js', 'TypeScript', 'Tailwind CSS', 'GraphQL'], description: 'Build server-rendered e-commerce pages for India\'s social commerce leader.', salary: { min: 1600000, max: 2800000 }, applyUrl: 'https://meesho.com/careers', postedAt: '2026-03-14T10:00:00' },
    { id: '11', title: 'Python Developer Intern', company: 'Infosys', location: 'Hyderabad', type: 'internship', industry: 'Data Science', requiredSkills: ['Python', 'SQL', 'Pandas', 'Flask'], description: '6-month internship working on enterprise data analytics solutions.', salary: { min: 300000, max: 500000 }, applyUrl: 'https://infosys.com/careers', postedAt: '2026-03-13T10:00:00' },
    { id: '12', title: 'SDE Intern — Frontend', company: 'Google India', location: 'Gurgaon', type: 'internship', industry: 'Web Development', requiredSkills: ['React.js', 'JavaScript', 'HTML', 'CSS', 'Git'], description: 'Summer internship building Google\'s internal tools and dashboards.', salary: { min: 600000, max: 1000000 }, applyUrl: 'https://careers.google.com', postedAt: '2026-03-12T10:00:00' },
    { id: '13', title: 'Cloud Architect', company: 'TCS', location: 'Mumbai', type: 'full-time', industry: 'DevOps', requiredSkills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Microservices'], description: 'Design and implement cloud solutions for enterprise clients.', salary: { min: 2200000, max: 4000000 }, applyUrl: 'https://tcs.com/careers', postedAt: '2026-03-04T10:00:00' },
    { id: '14', title: 'Data Analyst (Part-time)', company: 'Zomato', location: 'Delhi', type: 'part-time', industry: 'Data Science', requiredSkills: ['Python', 'SQL', 'Excel', 'Tableau', 'Statistics'], description: 'Analyze food delivery patterns and customer behavior data.', salary: { min: 500000, max: 900000 }, applyUrl: 'https://zomato.com/careers', postedAt: '2026-03-03T10:00:00' },
    { id: '15', title: 'Product Designer', company: 'Unacademy', location: 'Bangalore', type: 'remote', industry: 'Design', requiredSkills: ['Figma', 'Sketch', 'User Research', 'Design Thinking', 'Prototyping'], description: 'Design education experiences that help millions of students learn better.', salary: { min: 1400000, max: 2600000 }, applyUrl: 'https://unacademy.com/careers', postedAt: '2026-03-02T10:00:00' },
];

const typeColors: Record<string, { bg: string; color: string }> = {
    'full-time': { bg: 'rgba(34,197,94,0.1)', color: '#22c55e' },
    'part-time': { bg: 'rgba(167,139,250,0.1)', color: '#a78bfa' },
    'internship': { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B' },
    'remote': { bg: 'rgba(6,182,212,0.1)', color: '#06b6d4' },
};

const industries = ['All', 'Web Development', 'Data Science', 'Mobile Development', 'DevOps', 'Design'];
const types = ['All', 'full-time', 'part-time', 'internship', 'remote'];

export default function FindJobsPage() {
    const [search, setSearch] = useState('');
    const [industry, setIndustry] = useState('All');
    const [type, setType] = useState('All');
    const [userSkills, setUserSkills] = useState<string[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('ss_user');
            if (stored) {
                const parsed = JSON.parse(stored);
                setUserSkills(parsed.skills || ['React.js', 'Node.js', 'TypeScript', 'Python', 'MongoDB', 'Next.js', 'Docker', 'AWS']);
            } else {
                setUserSkills(['React.js', 'Node.js', 'TypeScript', 'Python', 'MongoDB', 'Next.js', 'Docker', 'AWS']);
            }
        } catch {
            setUserSkills(['React.js', 'Node.js', 'TypeScript', 'Python', 'MongoDB', 'Next.js', 'Docker', 'AWS']);
        }
    }, []);

    const getMatchScore = (job: Job) => {
        if (!userSkills.length) return 0;
        const matches = job.requiredSkills.filter(s =>
            userSkills.some(us => us.toLowerCase() === s.toLowerCase())
        ).length;
        return Math.round((matches / job.requiredSkills.length) * 100);
    };

    const jobsWithMatch = demoJobs.map(j => ({ ...j, matchScore: getMatchScore(j) }));

    const filtered = jobsWithMatch.filter(j => {
        if (search && !j.title.toLowerCase().includes(search.toLowerCase()) && !j.company.toLowerCase().includes(search.toLowerCase())) return false;
        if (industry !== 'All' && j.industry !== industry) return false;
        if (type !== 'All' && j.type !== type) return false;
        return true;
    }).sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));

    const recommended = jobsWithMatch
        .filter(j => (j.matchScore ?? 0) >= 40)
        .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
        .slice(0, 3);

    const formatSalary = (s: { min: number; max: number }) =>
        `₹${(s.min / 100000).toFixed(1)}L – ₹${(s.max / 100000).toFixed(1)}L/yr`;

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>
                    💼 Find <span style={{ color: GOLD }}>Jobs</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                    Discover opportunities matched to your skills
                </p>
            </div>

            {/* Search & Filters */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"
                        style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Search jobs, companies..."
                        style={{
                            width: '100%', padding: '10px 14px 10px 34px', borderRadius: 10,
                            background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.1)',
                            color: '#fff', fontSize: 13, outline: 'none',
                            fontFamily: "'Space Grotesk', sans-serif",
                        }}
                    />
                </div>
                <select value={industry} onChange={e => setIndustry(e.target.value)} style={{
                    padding: '10px 14px', borderRadius: 10,
                    background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.1)',
                    color: '#fff', fontSize: 13, outline: 'none', cursor: 'pointer',
                    fontFamily: "'Space Grotesk', sans-serif",
                }}>
                    {industries.map(i => <option key={i} value={i} style={{ background: '#111' }}>{i}</option>)}
                </select>
                <select value={type} onChange={e => setType(e.target.value)} style={{
                    padding: '10px 14px', borderRadius: 10,
                    background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.1)',
                    color: '#fff', fontSize: 13, outline: 'none', cursor: 'pointer',
                    fontFamily: "'Space Grotesk', sans-serif",
                }}>
                    {types.map(t => <option key={t} value={t} style={{ background: '#111' }}>{t === 'All' ? 'All Types' : t}</option>)}
                </select>
            </div>

            {/* Recommended */}
            {recommended.length > 0 && search === '' && industry === 'All' && type === 'All' && (
                <div style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <div style={{ width: 4, height: 18, borderRadius: 2, background: '#22c55e' }} />
                        <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Recommended for You</h3>
                        <span style={{ fontSize: 11, color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '2px 8px', borderRadius: 99, fontWeight: 600 }}>
                            Based on your skills
                        </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 14 }}>
                        {recommended.map(job => (
                            <JobCard key={job.id} job={job} userSkills={userSkills} formatSalary={formatSalary} highlighted />
                        ))}
                    </div>
                </div>
            )}

            {/* All Jobs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 4, height: 18, borderRadius: 2, background: GOLD }} />
                <h3 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
                    {search || industry !== 'All' || type !== 'All' ? 'Filtered Results' : 'All Openings'}
                </h3>
                <span style={{ fontSize: 11, color: '#64748b' }}>{filtered.length} jobs</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 14 }}>
                {filtered.map(job => (
                    <JobCard key={job.id} job={job} userSkills={userSkills} formatSalary={formatSalary} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="stat-card" style={{ textAlign: 'center', padding: 40 }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                    <p style={{ color: '#64748b', fontSize: 14 }}>No jobs match your search. Try different filters.</p>
                </div>
            )}
        </div>
    );
}

function JobCard({ job, userSkills, formatSalary, highlighted = false }: {
    job: Job; userSkills: string[]; formatSalary: (s: { min: number; max: number }) => string; highlighted?: boolean;
}) {
    const tc = typeColors[job.type] || typeColors['full-time'];
    const match = job.matchScore ?? 0;
    const matchColor = match >= 70 ? '#22c55e' : match >= 40 ? '#F59E0B' : '#ef4444';

    return (
        <div className="stat-card" style={{
            display: 'flex', flexDirection: 'column',
            borderColor: highlighted ? 'rgba(34,197,94,0.2)' : undefined,
            transition: 'transform 0.2s, border-color 0.2s',
        }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,168,67,0.2)';
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.borderColor = highlighted ? 'rgba(34,197,94,0.2)' : 'rgba(212,168,67,0.1)';
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                    <h4 className="font-display" style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{job.title}</h4>
                    <div style={{ fontSize: 13, color: GOLD, fontWeight: 600 }}>{job.company}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: tc.bg, color: tc.color, whiteSpace: 'nowrap' }}>
                    {job.type}
                </span>
            </div>

            <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    {job.location}
                </span>
                <span style={{ background: 'rgba(212,168,67,0.08)', padding: '2px 8px', borderRadius: 99, fontSize: 10, color: '#94a3b8' }}>
                    {job.industry}
                </span>
            </div>

            <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.6, marginBottom: 12, flex: 1 }}>{job.description}</p>

            {/* Skills */}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                {job.requiredSkills.map(s => {
                    const has = userSkills.some(us => us.toLowerCase() === s.toLowerCase());
                    return (
                        <span key={s} style={{
                            fontSize: 10, padding: '3px 8px', borderRadius: 99,
                            background: has ? 'rgba(34,197,94,0.1)' : 'rgba(100,116,139,0.1)',
                            color: has ? '#22c55e' : '#64748b',
                            border: `1px solid ${has ? 'rgba(34,197,94,0.2)' : 'transparent'}`,
                        }}>{s}</span>
                    );
                })}
            </div>

            {/* Match bar */}
            <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: '#64748b' }}>Skill Match</span>
                    <span style={{ fontSize: 11, color: matchColor, fontWeight: 700 }}>{match}%</span>
                </div>
                <div style={{ height: 4, background: 'rgba(212,168,67,0.08)', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${match}%`, background: matchColor, borderRadius: 2, transition: 'width 0.5s ease' }} />
                </div>
            </div>

            {/* Salary & Apply */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{formatSalary(job.salary)}</span>
                <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{
                    fontSize: 12, padding: '7px 16px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
                }}>
                    Apply Now
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                </a>
            </div>
        </div>
    );
}
