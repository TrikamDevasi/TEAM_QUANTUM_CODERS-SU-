'use client';

import React from 'react';
import CareerPathwayCard from '../../../../components/dashboard/CareerPathwayCard';
import type { CareerPathway } from '../../../../types/charts';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

const pathways: CareerPathway[] = [
    {
        id: 'CP1',
        title: 'Senior Full-Stack Developer',
        role: 'Lead Software Engineer',
        organization: 'Razorpay',
        requiredSkills: ['React.js', 'Node.js', 'System Design', 'TypeScript'],
        matchPercent: 86,
        salaryRange: { min: 80000, max: 150000 },
        timeToAchieve: '6–12 months',
        isRecommended: true,
    },
    {
        id: 'CP2',
        title: 'DevOps / SRE Engineer',
        role: 'Site Reliability Engineer',
        organization: 'Google India',
        requiredSkills: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
        matchPercent: 68,
        salaryRange: { min: 100000, max: 180000 },
        timeToAchieve: '12–18 months',
        isRecommended: false,
    },
    {
        id: 'CP3',
        title: 'Cloud Solutions Architect',
        role: 'AWS / Azure Architect',
        organization: 'Amazon Web Services',
        requiredSkills: ['AWS', 'Microservices', 'Serverless', 'Infrastructure as Code'],
        matchPercent: 78,
        salaryRange: { min: 120000, max: 220000 },
        timeToAchieve: '3–6 months',
        isRecommended: true,
    },
    {
        id: 'CP4',
        title: 'AI / ML Engineer',
        role: 'Machine Learning Engineer',
        organization: 'Microsoft India',
        requiredSkills: ['Python', 'TensorFlow', 'MLOps', 'Data Engineering'],
        matchPercent: 55,
        salaryRange: { min: 140000, max: 250000 },
        timeToAchieve: '18–24 months',
        isRecommended: false,
    },
];

export default function CareerPage() {
    return (
        <div style={{ color: WHITE, maxWidth: 960 }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                    🚀 Career <span style={{ color: GOLD }}>Pathways</span>
                </h1>
                <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                    AI-matched career trajectories based on your skill profile
                </p>
            </div>

            {/* AI insight banner */}
            <div
                style={{
                    padding: '14px 18px',
                    background: 'rgba(212,168,67,0.07)',
                    border: '1px solid rgba(212,168,67,0.3)',
                    borderRadius: 12,
                    marginBottom: 24,
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                }}
            >
                <span style={{ fontSize: 22, fontWeight: 800, color: '#D4A843' }}>AI</span>
                <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: WHITE }}>
                        AI Recommendation
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: MUTED, lineHeight: 1.5 }}>
                        Based on your current skill profile (Score: 76/100), you are closest to a{' '}
                        <strong style={{ color: GOLD }}>Senior Full-Stack Developer</strong> role. Upskilling
                        in <strong style={{ color: WHITE }}>System Design</strong> by just 19 points would
                        open the top 3 pathways simultaneously.
                    </p>
                </div>
            </div>

            {/* Pathways */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {pathways.map((pathway) => (
                    <CareerPathwayCard key={pathway.id} pathway={pathway} />
                ))}
            </div>

            {/* Skills to develop */}
            <div
                style={{
                    marginTop: 28,
                    padding: '20px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 14,
                }}
            >
                <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: WHITE }}>
                    Priority Upskilling Areas
                </h3>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {[
                        { skill: 'System Design', gap: '+19', urgency: 'high' },
                        { skill: 'Kubernetes', gap: 'New', urgency: 'medium' },
                        { skill: 'Machine Learning', gap: 'New', urgency: 'medium' },
                        { skill: 'GraphQL', gap: '+8', urgency: 'low' },
                    ].map((item) => (
                        <div
                            key={item.skill}
                            style={{
                                padding: '10px 14px',
                                background: 'rgba(255,255,255,0.04)',
                                border: `1px solid ${item.urgency === 'high' ? 'rgba(239,68,68,0.3)' : item.urgency === 'medium' ? 'rgba(212,168,67,0.3)' : 'rgba(255,255,255,0.1)'}`,
                                borderRadius: 10,
                                minWidth: 140,
                            }}
                        >
                            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: WHITE }}>
                                {item.skill}
                            </p>
                            <p style={{ margin: '4px 0 0', fontSize: 12, color: item.urgency === 'high' ? '#ef4444' : GOLD }}>
                                {item.gap} points needed
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
