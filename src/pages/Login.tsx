import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, User, Eye, EyeOff, Shield, Sparkles } from 'lucide-react';
import { adminLogin, clearError } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes gradientShift {
        0%, 100% { transform: translate(0, 0) scale(1); }
        25% { transform: translate(2%, 2%) scale(1.05); }
        50% { transform: translate(-1%, 3%) scale(1); }
        75% { transform: translate(-2%, -2%) scale(1.05); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.6; }
      }
      
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
        20%, 40%, 60%, 80% { transform: translateX(4px); }
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }

      @media (max-width: 640px) {
        .login-card { padding: 2rem !important; }
        .login-title { font-size: 1.75rem !important; }
        .login-subtitle { font-size: 0.875rem !important; }
        .login-input { font-size: 1rem !important; padding: 0.75rem 1rem 0.75rem 2.5rem !important; }
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    const result = await dispatch(adminLogin({ username, password }));

    if (adminLogin.fulfilled.match(result)) {
      navigate('/');
    }
  };

  // Styles
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    width: '100%',
    backgroundColor: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    position: 'relative',
    overflow: 'hidden',
  };

  const bgGradient1Style: React.CSSProperties = {
    position: 'absolute',
    top: '-10%',
    left: '-10%',
    width: '40%',
    height: '40%',
    background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(100px)',
    animation: 'gradientShift 15s ease-in-out infinite',
    pointerEvents: 'none',
  };

  const bgGradient2Style: React.CSSProperties = {
    position: 'absolute',
    bottom: '-10%',
    right: '-10%',
    width: '40%',
    height: '40%',
    background: 'radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(100px)',
    animation: 'gradientShift 15s ease-in-out infinite reverse',
    pointerEvents: 'none',
  };

  const bgGradient3Style: React.CSSProperties = {
    position: 'absolute',
    top: '20%',
    right: '10%',
    width: '30%',
    height: '30%',
    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
    borderRadius: '50%',
    filter: 'blur(80px)',
    animation: 'pulse 8s ease-in-out infinite',
    pointerEvents: 'none',
  };

  const cardWrapperStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '440px',
    position: 'relative',
    zIndex: 10,
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(24px)',
    borderRadius: '1.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    padding: '2.5rem',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '2.5rem',
  };

  const logoWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  };

  const logoGlowStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, #ec4899 0%, #9333ea 50%, #2563eb 100%)',
    borderRadius: '1rem',
    filter: 'blur(20px)',
    opacity: 0.5,
    animation: 'pulse 3s ease-in-out infinite',
  };

  const logoStyle: React.CSSProperties = {
    position: 'relative',
    width: '5rem',
    height: '5rem',
    background: 'linear-gradient(135deg, #ec4899 0%, #9333ea 50%, #2563eb 100%)',
    borderRadius: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
    transition: 'transform 0.5s ease',
    transform: isHovered ? 'rotate(6deg) scale(1.05)' : 'rotate(0deg) scale(1)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '2.25rem',
    fontWeight: 800,
    color: '#ffffff',
    letterSpacing: '-0.025em',
    marginBottom: '0.75rem',
    marginTop: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '1rem',
    fontWeight: 500,
    color: 'rgba(147, 197, 253, 0.7)',
    margin: 0,
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  };

  const fieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'rgba(147, 197, 253, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginLeft: '0.25rem',
  };

  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
  };

  const getIconStyle = (fieldName: string): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    paddingLeft: '1rem',
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
    color: isFocused === fieldName ? (fieldName === 'username' ? '#f472b6' : '#60a5fa') : 'rgba(147, 197, 253, 0.5)',
    transition: 'all 0.3s ease',
    transform: isFocused === fieldName ? 'scale(1.1)' : 'scale(1)',
  });

  const getInputStyle = (fieldName: string): React.CSSProperties => ({
    width: '100%',
    padding: '1rem 1rem 1rem 3rem',
    backgroundColor: isFocused === fieldName ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${isFocused === fieldName ? (fieldName === 'username' ? 'rgba(244, 114, 182, 0.5)' : 'rgba(96, 165, 250, 0.5)') : 'rgba(255, 255, 255, 0.1)'}`,
    borderRadius: '1rem',
    color: '#ffffff',
    fontSize: '1.125rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: isFocused === fieldName ? `0 0 0 4px ${fieldName === 'username' ? 'rgba(244, 114, 182, 0.1)' : 'rgba(96, 165, 250, 0.1)'}` : 'none',
    boxSizing: 'border-box',
  });

  const eyeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    paddingRight: '1rem',
    display: 'flex',
    alignItems: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'rgba(147, 197, 253, 0.3)',
    transition: 'color 0.3s ease',
  };

  const errorStyle: React.CSSProperties = {
    animation: 'shake 0.5s ease-in-out',
  };

  const errorBoxStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '1rem',
  };

  const errorIconStyle: React.CSSProperties = {
    flexShrink: 0,
    width: '2rem',
    height: '2rem',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const errorTextStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#fecaca',
    margin: 0,
  };

  const submitButtonStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    borderRadius: '1rem',
    background: 'linear-gradient(135deg, #ec4899 0%, #9333ea 50%, #2563eb 100%)',
    padding: '1px',
    border: 'none',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
    transition: 'all 0.3s ease',
    transform: 'scale(1)',
  };

  const submitButtonInnerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem 1.5rem',
    backgroundColor: '#0f172a',
    borderRadius: '15px',
    transition: 'all 0.3s ease',
  };

  const submitTextStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: 700,
    color: '#ffffff',
    letterSpacing: '0.025em',
  };

  const spinnerStyle: React.CSSProperties = {
    animation: 'spin 1s linear infinite',
    width: '1.25rem',
    height: '1.25rem',
  };

  const footerStyle: React.CSSProperties = {
    marginTop: '2rem',
    textAlign: 'center',
  };

  const statusBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const statusDotStyle: React.CSSProperties = {
    width: '0.375rem',
    height: '0.375rem',
    backgroundColor: '#22c55e',
    borderRadius: '50%',
    animation: 'pulse 2s ease-in-out infinite',
  };

  const statusTextStyle: React.CSSProperties = {
    fontSize: '0.65rem',
    fontWeight: 700,
    color: 'rgba(147, 197, 253, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    margin: 0,
  };

  const sparklesStyle: React.CSSProperties = {
    width: '1.25rem',
    height: '1.25rem',
    color: '#facc15',
    animation: isHovered ? 'bounce 0.6s ease-in-out infinite' : 'none',
  };

  return (
    <div style={containerStyle}>
      {/* Dynamic Background Gradients */}
      <div style={bgGradient1Style} />
      <div style={bgGradient2Style} />
      <div style={bgGradient3Style} />

      <div style={cardWrapperStyle}>
        {/* Main Card with Glassmorphism */}
        <div className="login-card" style={cardStyle}>
          {/* Header section */}
          <div style={headerStyle}>
            <div style={logoWrapperStyle}>
              <div style={logoGlowStyle} />
              <div
                style={logoStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Shield size={40} color="#ffffff" strokeWidth={2.5} />
              </div>
            </div>
            <h1 className="login-title" style={titleStyle}>Maatrika Admin</h1>
            <p className="login-subtitle" style={subtitleStyle}>Secure access to your store management</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={formStyle}>
            {/* Username field */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Username</label>
              <div style={inputWrapperStyle}>
                <div style={getIconStyle('username')}>
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setIsFocused('username')}
                  onBlur={() => setIsFocused(null)}
                  className="login-input"
                  style={getInputStyle('username')}
                  placeholder="admin_user"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Password</label>
              <div style={inputWrapperStyle}>
                <div style={getIconStyle('password')}>
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused('password')}
                  onBlur={() => setIsFocused(null)}
                  className="login-input"
                  style={{ ...getInputStyle('password'), paddingRight: '3rem' }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(147, 197, 253, 0.3)';
                  }}
                  style={eyeButtonStyle}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div style={errorStyle}>
                <div style={errorBoxStyle}>
                  <div style={errorIconStyle}>
                    <div style={{ width: '0.5rem', height: '0.5rem', backgroundColor: '#ef4444', borderRadius: '50%', animation: 'pulse 1s ease-in-out infinite' }} />
                  </div>
                  <p style={errorTextStyle}>{error}</p>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              onMouseEnter={(e) => {
                const inner = e.currentTarget.querySelector('div') as HTMLDivElement;
                if (inner) {
                  inner.style.backgroundColor = 'transparent';
                }
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onMouseLeave={(e) => {
                const inner = e.currentTarget.querySelector('div') as HTMLDivElement;
                if (inner) {
                  inner.style.backgroundColor = '#0f172a';
                }
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.96)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
              style={submitButtonStyle}
            >
              <div style={submitButtonInnerStyle}>
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <svg style={spinnerStyle} viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                      <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span style={submitTextStyle}>Authenticating...</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={submitTextStyle}>Sign In to Dashboard</span>
                    <Sparkles style={sparklesStyle} />
                  </div>
                )}
              </div>
            </button>
          </form>

          {/* Footer */}
          <div style={footerStyle}>
            <div style={statusBadgeStyle}>
              <div style={statusDotStyle} />
              <p style={statusTextStyle}>System Status: Operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
