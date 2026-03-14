import Link from 'next/link';

export default function NotFound() {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#08060f',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                gap: 12,
            }}
        >
            <p style={{ fontSize: 64, fontWeight: 900, color: '#D4A843', lineHeight: 1 }}>404</p>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Page not found</h2>
            <p style={{ color: '#A0A0A0', fontSize: 14, margin: 0 }}>
                The page you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
                href="/student"
                style={{
                    marginTop: 12,
                    padding: '10px 24px',
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #D4A843, #8b6512)',
                    color: '#1a0f00',
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: 'none',
                }}
            >
                Go to Dashboard
            </Link>
        </div>
    );
}
