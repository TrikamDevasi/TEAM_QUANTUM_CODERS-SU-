'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToken, checkAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (token) {
      setToken(token);
      // Fetch user info then redirect to dashboard
      checkAuth().then(() => {
        router.push('/student');
      }).catch(() => {
        router.push('/student');
      });
    } else if (error) {
      router.push('/auth?error=' + error);
    } else {
      router.push('/auth');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0a0a1a' }}>
      <div style={{ textAlign: 'center', color: '#fbbf24' }}>
        <div style={{
          width: 48, height: 48, border: '3px solid rgba(251,191,36,0.2)',
          borderTop: '3px solid #fbbf24', borderRadius: '50%',
          animation: 'spin 1s linear infinite', margin: '0 auto 16px',
        }} />
        <p style={{ fontSize: 14, color: 'rgba(253,230,138,0.6)' }}>Completing sign in...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
