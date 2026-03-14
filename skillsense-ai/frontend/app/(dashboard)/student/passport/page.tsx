'use client';

import React, { useState } from 'react';
import SkillPassport from '../../../../components/dashboard/SkillPassport';
import { sampleStudents } from '../../../../data/sampleStudents';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

export default function PassportPage() {
    const [selectedId, setSelectedId] = useState(sampleStudents[0].id);
    const student = sampleStudents.find((s) => s.id === selectedId) ?? sampleStudents[0];

    return (
        <div style={{ color: WHITE, maxWidth: 900 }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                    🪪 Skill <span style={{ color: GOLD }}>Passport</span>
                </h1>
                <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                    NSQF-aligned verified skill credentials
                </p>
            </div>

            {/* Student selector */}
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {sampleStudents.slice(0, 8).map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setSelectedId(s.id)}
                            style={{
                                padding: '6px 14px',
                                borderRadius: 20,
                                border: `1px solid ${selectedId === s.id ? GOLD : 'rgba(255,255,255,0.15)'}`,
                                background: selectedId === s.id ? 'rgba(212,168,67,0.15)' : 'rgba(255,255,255,0.03)',
                                color: selectedId === s.id ? GOLD : MUTED,
                                fontSize: 12,
                                fontWeight: selectedId === s.id ? 700 : 400,
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                            }}
                        >
                            {s.name}
                        </button>
                    ))}
                </div>
            </div>

            <SkillPassport student={student} />
        </div>
    );
}
