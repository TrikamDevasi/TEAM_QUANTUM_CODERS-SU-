'use client';

import React from 'react';
import ComplianceReport from '../../../../components/dashboard/ComplianceReport';
import ReportGenerator from '../../../../components/dashboard/ReportGenerator';

const GOLD = '#D4A843';
const MUTED = '#A0A0A0';
const WHITE = '#FFFFFF';

export default function CompliancePage() {
    return (
        <div style={{ color: WHITE, maxWidth: 1000 }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>
                    Compliance <span style={{ color: GOLD }}>Monitor</span>
                </h1>
                <p style={{ margin: '4px 0 0', color: MUTED, fontSize: 14 }}>
                    Regulatory framework adherence — NSQF, PMKVY, IT Act & more
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
                <ComplianceReport />
                <ReportGenerator onGenerate={(c) => { console.log('Generating compliance report', c); }} />
            </div>
        </div>
    );
}
