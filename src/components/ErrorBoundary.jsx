import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            const isChunkError = this.state.error?.toString().includes('Importing a module script failed') ||
                this.state.error?.toString().includes('Loading chunk') ||
                this.state.error?.name === 'ChunkLoadError';

            if (isChunkError) {
                // Auto-reload if it's a version mismatch
                setTimeout(() => window.location.reload(), 2000);
            }

            return (
                <div style={{
                    padding: '20px', color: '#ff3333', background: '#1a0505', height: '100vh',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'monospace', textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>
                        {isChunkError ? 'UPDATE DETECTED 🚀' : 'SYSTEM CRASH 💥'}
                    </h1>
                    <p style={{ marginBottom: '20px', fontSize: '1.2rem', color: '#fff' }}>
                        {isChunkError ? 'Refuelling the ship... (Reloading)' : 'The navigation system encountered a glitch.'}
                    </p>

                    {!isChunkError && (
                        <div style={{ maxWidth: '800px', overflow: 'auto', background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #330000' }}>
                            <p style={{ color: '#ff6666' }}>{this.state.error && this.state.error.toString()}</p>
                            <pre style={{ fontSize: '0.8rem', color: '#994444' }}>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                        </div>
                    )}

                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '15px 30px', fontSize: '1.2rem', fontWeight: 'bold',
                            background: '#ff0055', color: 'white', border: 'none', borderRadius: '50px',
                            cursor: 'pointer', boxShadow: '0 0 20px rgba(255, 0, 85, 0.5)'
                        }}
                    >
                        REBOOT SYSTEM 🔄
                    </button>
                    <p style={{ marginTop: '20px', fontSize: '0.8rem', color: '#666' }}>
                        Error ID: {Date.now().toString(36)}
                    </p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
