'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/auth');
    }, [router]);

    return (
        <div style={{ minHeight: '100vh', background: '#08060f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#64748b', fontSize: 14 }}>Redirecting...</p>
        </div>
    );
}
