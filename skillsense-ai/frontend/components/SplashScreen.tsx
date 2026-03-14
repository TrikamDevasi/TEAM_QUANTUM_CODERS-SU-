'use client';

import React, { useState, useEffect } from 'react';

export default function SplashScreen({ children }: { children: React.ReactNode }) {
    const [visible, setVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => setFadeOut(true), 2400);
        const timer2 = setTimeout(() => setVisible(false), 3000);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    if (!visible) return <>{children}</>;

    return (
        <>
            {/* Splash overlay */}
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 99999,
                    background: '#050a14',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: fadeOut ? 0 : 1,
                    transition: 'opacity 0.6s ease-out',
                    pointerEvents: fadeOut ? 'none' : 'all',
                }}
            >
                {/* Glowing background rings */}
                <div style={{
                    position: 'absolute',
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(212,168,67,0.12) 0%, transparent 70%)',
                    animation: 'splashPulse 2s ease-in-out infinite',
                }} />
                <div style={{
                    position: 'absolute',
                    width: 600,
                    height: 600,
                    borderRadius: '50%',
                    border: '1px solid rgba(212,168,67,0.06)',
                    animation: 'splashRing 2.5s ease-in-out infinite',
                }} />

                {/* Logo */}
                <img
                    src="/logo.png"
                    alt="SkillSense AI"
                    style={{
                        width: 300,
                        height: 300,
                        objectFit: 'contain',
                        animation: 'splashLogo 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                        filter: 'drop-shadow(0 0 40px rgba(212,168,67,0.3))',
                        position: 'relative',
                        zIndex: 1,
                    }}
                />

                {/* Loading bar */}
                <div style={{
                    width: 160,
                    height: 3,
                    background: 'rgba(212,168,67,0.12)',
                    borderRadius: 2,
                    overflow: 'hidden',
                    marginTop: 32,
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <div style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #D4A843, #F0C05A)',
                        borderRadius: 2,
                        animation: 'splashBar 2.4s ease-in-out forwards',
                    }} />
                </div>
            </div>

            {/* Page content hidden behind */}
            <div style={{ opacity: fadeOut ? 1 : 0, transition: 'opacity 0.6s ease-in' }}>
                {children}
            </div>

            <style>{`
                @keyframes splashLogo {
                    0% { opacity: 0; transform: scale(0.5) rotate(-10deg); }
                    60% { opacity: 1; transform: scale(1.05) rotate(0deg); }
                    100% { opacity: 1; transform: scale(1) rotate(0deg); }
                }
                @keyframes splashPulse {
                    0%, 100% { transform: scale(1); opacity: 0.6; }
                    50% { transform: scale(1.15); opacity: 1; }
                }
                @keyframes splashRing {
                    0%, 100% { transform: scale(0.9); opacity: 0.3; }
                    50% { transform: scale(1.1); opacity: 0.7; }
                }
                @keyframes splashBar {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
            `}</style>
        </>
    );
}
