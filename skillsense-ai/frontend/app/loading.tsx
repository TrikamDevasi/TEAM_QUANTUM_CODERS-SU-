export default function Loading() {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#08060f',
                flexDirection: 'column',
                gap: 16,
            }}
        >
            <div
                style={{
                    width: 40,
                    height: 40,
                    border: '3px solid rgba(212,168,67,0.2)',
                    borderTopColor: '#D4A843',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                }}
            />
            <p style={{ color: '#A0A0A0', fontSize: 14, fontFamily: 'Inter, sans-serif' }}>
                Loading…
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
