'use client';

import React, { useState } from 'react';

const GOLD = '#D4A843';

interface StudentRanking {
    rank: number;
    name: string;
    avatar: string;
    institute: string;
    totalScore: number;
    testsCompleted: number;
    avgPercentage: number;
    topSubject: string;
    streak: number;
    badge: string;
}

const leaderboardData: StudentRanking[] = [
    { rank: 1, name: 'Priya Sharma', avatar: 'PS', institute: 'IIT Bombay', totalScore: 4850, testsCompleted: 28, avgPercentage: 96, topSubject: 'Data Structures', streak: 14, badge: '🏆' },
    { rank: 2, name: 'Rahul Verma', avatar: 'RV', institute: 'IIT Delhi', totalScore: 4720, testsCompleted: 26, avgPercentage: 94, topSubject: 'React.js', streak: 11, badge: '🥈' },
    { rank: 3, name: 'Ananya Iyer', avatar: 'AI', institute: 'BITS Pilani', totalScore: 4680, testsCompleted: 30, avgPercentage: 93, topSubject: 'Machine Learning', streak: 9, badge: '🥉' },
    { rank: 4, name: 'Arjun Mehta', avatar: 'AM', institute: 'NIIT University', totalScore: 4520, testsCompleted: 24, avgPercentage: 91, topSubject: 'TypeScript', streak: 8, badge: '⭐' },
    { rank: 5, name: 'Sneha Reddy', avatar: 'SR', institute: 'VIT Vellore', totalScore: 4410, testsCompleted: 25, avgPercentage: 90, topSubject: 'System Design', streak: 7, badge: '⭐' },
    { rank: 6, name: 'Vikram Nair', avatar: 'VN', institute: 'IIIT Hyderabad', totalScore: 4350, testsCompleted: 22, avgPercentage: 89, topSubject: 'Node.js', streak: 6, badge: '' },
    { rank: 7, name: 'Kavita Gupta', avatar: 'KG', institute: 'NIT Trichy', totalScore: 4280, testsCompleted: 23, avgPercentage: 88, topSubject: 'Python', streak: 5, badge: '' },
    { rank: 8, name: 'Deepak Singh', avatar: 'DS', institute: 'IIT Kanpur', totalScore: 4200, testsCompleted: 21, avgPercentage: 87, topSubject: 'Cloud Computing', streak: 10, badge: '' },
    { rank: 9, name: 'Meera Patel', avatar: 'MP', institute: 'DTU Delhi', totalScore: 4150, testsCompleted: 20, avgPercentage: 86, topSubject: 'DevOps', streak: 4, badge: '' },
    { rank: 10, name: 'Rohan Joshi', avatar: 'RJ', institute: 'COEP Pune', totalScore: 4080, testsCompleted: 19, avgPercentage: 85, topSubject: 'React.js', streak: 3, badge: '' },
    { rank: 11, name: 'Aisha Khan', avatar: 'AK', institute: 'Manipal IT', totalScore: 4010, testsCompleted: 22, avgPercentage: 84, topSubject: 'MongoDB', streak: 6, badge: '' },
    { rank: 12, name: 'Sanjay Rao', avatar: 'SR', institute: 'IIIT Bangalore', totalScore: 3950, testsCompleted: 20, avgPercentage: 83, topSubject: 'Docker', streak: 2, badge: '' },
    { rank: 13, name: 'Nisha Kumari', avatar: 'NK', institute: 'Amity University', totalScore: 3880, testsCompleted: 18, avgPercentage: 82, topSubject: 'SQL', streak: 4, badge: '' },
    { rank: 14, name: 'Aditya Saxena', avatar: 'AS', institute: 'SRM Chennai', totalScore: 3820, testsCompleted: 19, avgPercentage: 81, topSubject: 'JavaScript', streak: 5, badge: '' },
    { rank: 15, name: 'Pooja Menon', avatar: 'PM', institute: 'IIT Madras', totalScore: 3760, testsCompleted: 17, avgPercentage: 80, topSubject: 'AWS', streak: 3, badge: '' },
    { rank: 16, name: 'Kunal Desai', avatar: 'KD', institute: 'NIT Warangal', totalScore: 3700, testsCompleted: 18, avgPercentage: 79, topSubject: 'Express.js', streak: 2, badge: '' },
    { rank: 17, name: 'Ritu Agarwal', avatar: 'RA', institute: 'LPU Jalandhar', totalScore: 3640, testsCompleted: 16, avgPercentage: 78, topSubject: 'Next.js', streak: 1, badge: '' },
    { rank: 18, name: 'Harsh Pandey', avatar: 'HP', institute: 'IIT Kharagpur', totalScore: 3580, testsCompleted: 15, avgPercentage: 77, topSubject: 'Git', streak: 3, badge: '' },
    { rank: 19, name: 'Sakshi Jain', avatar: 'SJ', institute: 'LNMIIT Jaipur', totalScore: 3520, testsCompleted: 17, avgPercentage: 76, topSubject: 'CSS', streak: 2, badge: '' },
    { rank: 20, name: 'Omkar Bhatt', avatar: 'OB', institute: 'IIT Roorkee', totalScore: 3460, testsCompleted: 16, avgPercentage: 75, topSubject: 'HTML', streak: 4, badge: '' },
];

const rankColors: Record<number, { bg: string; border: string; text: string; glow: string }> = {
    1: { bg: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(212,168,67,0.06))', border: 'rgba(255,215,0,0.4)', text: '#FFD700', glow: '0 0 20px rgba(255,215,0,0.15)' },
    2: { bg: 'linear-gradient(135deg, rgba(192,192,192,0.1), rgba(148,163,184,0.04))', border: 'rgba(192,192,192,0.3)', text: '#C0C0C0', glow: '0 0 15px rgba(192,192,192,0.1)' },
    3: { bg: 'linear-gradient(135deg, rgba(205,127,50,0.1), rgba(205,127,50,0.04))', border: 'rgba(205,127,50,0.3)', text: '#CD7F32', glow: '0 0 15px rgba(205,127,50,0.1)' },
};

const filters = ['All Time', 'This Month', 'This Week'];

export default function LeaderboardPage() {
    const [activeFilter, setActiveFilter] = useState('All Time');
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    // Find current user (Arjun Mehta) rank for highlight
    const currentUserRank = 4;

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h1 className="font-display" style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>
                    🏅 <span style={{ color: GOLD }}>Leaderboard</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
                    Top performers across all assessments
                </p>
            </div>

            {/* Top 3 Podium */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 32, alignItems: 'flex-end' }}>
                {[leaderboardData[1], leaderboardData[0], leaderboardData[2]].map((student, podiumIdx) => {
                    const isGold = podiumIdx === 1;
                    const rc = rankColors[student.rank];
                    const podiumHeight = isGold ? 160 : podiumIdx === 0 ? 130 : 110;
                    return (
                        <div key={student.rank} style={{ textAlign: 'center', width: 180 }}>
                            {/* Avatar */}
                            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 10 }}>
                                <div style={{
                                    width: isGold ? 72 : 60, height: isGold ? 72 : 60, borderRadius: '50%',
                                    background: rc.bg, border: `3px solid ${rc.border}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: isGold ? 22 : 18, fontWeight: 800, color: rc.text,
                                    boxShadow: rc.glow,
                                }}>
                                    {student.avatar}
                                </div>
                                <span style={{
                                    position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
                                    fontSize: 18,
                                }}>{student.badge}</span>
                            </div>
                            <div className="font-display" style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{student.name}</div>
                            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>{student.institute}</div>

                            {/* Podium bar */}
                            <div style={{
                                height: podiumHeight, borderRadius: '12px 12px 0 0',
                                background: rc.bg, border: `1px solid ${rc.border}`,
                                borderBottom: 'none',
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                justifyContent: 'center', gap: 4,
                                boxShadow: rc.glow,
                            }}>
                                <span className="font-display" style={{ fontSize: 28, fontWeight: 800, color: rc.text }}>
                                    #{student.rank}
                                </span>
                                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                                    {student.totalScore.toLocaleString()} pts
                                </span>
                                <span style={{ fontSize: 10, color: '#64748b' }}>
                                    {student.avgPercentage}% avg
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filter tabs + KPIs */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 4 }}>
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            style={{
                                padding: '7px 16px', borderRadius: 8,
                                background: activeFilter === f ? 'rgba(212,168,67,0.1)' : 'transparent',
                                border: `1px solid ${activeFilter === f ? 'rgba(212,168,67,0.2)' : 'transparent'}`,
                                color: activeFilter === f ? GOLD : '#64748b',
                                fontSize: 12, fontWeight: activeFilter === f ? 700 : 500,
                                cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif",
                                transition: 'all 0.15s',
                            }}
                        >{f}</button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                    {[
                        { label: 'Your Rank', value: `#${currentUserRank}`, color: GOLD },
                        { label: 'Your Score', value: '4,520', color: '#22c55e' },
                    ].map((stat, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 3, height: 20, borderRadius: 2, background: stat.color }} />
                            <div>
                                <div style={{ fontSize: 10, color: '#475569' }}>{stat.label}</div>
                                <div className="font-display" style={{ fontSize: 16, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rankings Table */}
            <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(212,168,67,0.1)' }}>
                            {['Rank', 'Student', 'Institute', 'Total Score', 'Tests', 'Avg %', 'Top Subject', 'Streak'].map(h => (
                                <th key={h} style={{
                                    textAlign: h === 'Rank' ? 'center' : 'left',
                                    fontSize: 11, color: '#64748b', padding: '14px 16px', fontWeight: 600,
                                }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {leaderboardData.map((student) => {
                            const isCurrentUser = student.rank === currentUserRank;
                            const isTop3 = student.rank <= 3;
                            const rc = rankColors[student.rank];
                            const isHovered = hoveredRow === student.rank;

                            return (
                                <tr
                                    key={student.rank}
                                    onMouseEnter={() => setHoveredRow(student.rank)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    style={{
                                        borderBottom: '1px solid rgba(212,168,67,0.06)',
                                        background: isCurrentUser
                                            ? 'rgba(212,168,67,0.06)'
                                            : isHovered
                                                ? 'rgba(212,168,67,0.03)'
                                                : 'transparent',
                                        transition: 'background 0.15s',
                                    }}
                                >
                                    {/* Rank */}
                                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                                        {isTop3 ? (
                                            <div style={{
                                                width: 32, height: 32, borderRadius: 8, margin: '0 auto',
                                                background: rc?.bg, border: `1px solid ${rc?.border}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 13, fontWeight: 800, color: rc?.text,
                                            }}>{student.rank}</div>
                                        ) : (
                                            <span style={{
                                                fontSize: 14, fontWeight: 700,
                                                color: isCurrentUser ? GOLD : '#64748b',
                                            }}>#{student.rank}</span>
                                        )}
                                    </td>

                                    {/* Student */}
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{
                                                width: 34, height: 34, borderRadius: 8,
                                                background: isTop3
                                                    ? rc?.bg
                                                    : isCurrentUser
                                                        ? 'linear-gradient(135deg, #D4A843, #F0C05A)'
                                                        : 'rgba(212,168,67,0.08)',
                                                border: isTop3 ? `1px solid ${rc?.border}` : isCurrentUser ? '1px solid rgba(212,168,67,0.3)' : '1px solid rgba(212,168,67,0.1)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 11, fontWeight: 800,
                                                color: isCurrentUser ? '#08060f' : isTop3 ? (rc?.text || '#fff') : '#94a3b8',
                                            }}>
                                                {student.avatar}
                                            </div>
                                            <div>
                                                <span style={{
                                                    fontSize: 13, fontWeight: 600,
                                                    color: isCurrentUser ? GOLD : '#fff',
                                                }}>
                                                    {student.name}
                                                    {isCurrentUser && <span style={{ fontSize: 10, color: GOLD, marginLeft: 6 }}>(You)</span>}
                                                </span>
                                                {student.badge && <span style={{ marginLeft: 6 }}>{student.badge}</span>}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Institute */}
                                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#64748b' }}>{student.institute}</td>

                                    {/* Total Score */}
                                    <td style={{ padding: '14px 16px' }}>
                                        <span className="font-display" style={{
                                            fontSize: 14, fontWeight: 700,
                                            color: isTop3 ? (rc?.text || '#fff') : '#fff',
                                        }}>
                                            {student.totalScore.toLocaleString()}
                                        </span>
                                    </td>

                                    {/* Tests Completed */}
                                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#94a3b8' }}>
                                        {student.testsCompleted}
                                    </td>

                                    {/* Avg Percentage */}
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ width: 50, height: 5, background: 'rgba(212,168,67,0.08)', borderRadius: 3 }}>
                                                <div style={{
                                                    height: '100%', borderRadius: 3,
                                                    width: `${student.avgPercentage}%`,
                                                    background: student.avgPercentage >= 90
                                                        ? '#22c55e'
                                                        : student.avgPercentage >= 80
                                                            ? GOLD
                                                            : '#F59E0B',
                                                    transition: 'width 0.5s ease',
                                                }} />
                                            </div>
                                            <span style={{
                                                fontSize: 12, fontWeight: 600,
                                                color: student.avgPercentage >= 90
                                                    ? '#22c55e'
                                                    : student.avgPercentage >= 80
                                                        ? GOLD
                                                        : '#F59E0B',
                                            }}>{student.avgPercentage}%</span>
                                        </div>
                                    </td>

                                    {/* Top Subject */}
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{
                                            fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 99,
                                            background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.12)',
                                            color: '#cbd5e1',
                                        }}>{student.topSubject}</span>
                                    </td>

                                    {/* Streak */}
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <span style={{ fontSize: 14 }}>🔥</span>
                                            <span style={{
                                                fontSize: 13, fontWeight: 700,
                                                color: student.streak >= 10 ? '#ef4444' : student.streak >= 5 ? '#F59E0B' : '#64748b',
                                            }}>{student.streak}</span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Footer stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 20 }}>
                {[
                    { label: 'Total Participants', value: '2,847', color: GOLD, sub: '+126 this week' },
                    { label: 'Tests Conducted', value: '384', color: '#a78bfa', sub: '+18 this week' },
                    { label: 'Avg Score', value: '78.4%', color: '#22c55e', sub: '↑ 2.1% from last month' },
                    { label: 'Perfect Scores', value: '23', color: '#F59E0B', sub: '100% accuracy' },
                ].map((s, i) => (
                    <div key={i} className="stat-card">
                        <div style={{ width: 4, height: 24, borderRadius: 2, background: s.color, marginBottom: 12 }} />
                        <div className="font-display" style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{s.value}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 11, color: '#22c55e', marginTop: 4 }}>{s.sub}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
