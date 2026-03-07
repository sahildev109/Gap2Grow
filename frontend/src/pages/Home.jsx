import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, LogIn } from 'lucide-react';
import './Home.css';

export default function Home() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    return (
        <div className="auth-bg">
            {/* Subtle arc decoration */}
            <div className="auth-arc" />

            <div className="auth-card-wrapper">
                <div className="auth-card">

                    {/* Icon */}
                    <div className="auth-icon-box">
                        <LogIn size={22} color="#1a1a2e" strokeWidth={2.2} />
                    </div>

                    {/* Title */}
                    <h2 className="auth-title">
                        {isLogin ? 'Sign in with email' : 'Create your account'}
                    </h2>
                    <p className="auth-subtitle">
                        {isLogin
                            ? 'Analyze your resume, close the skill gap,\nand grow your career. For free'
                            : 'Start your upskilling journey with Gap2Grow.\nNo credit card needed.'}
                    </p>

                    <form onSubmit={handleSubmit} className="auth-form">

                        {/* Name field — Sign Up only */}
                        {!isLogin && (
                            <div className="auth-input-wrap">
                                <User size={16} className="auth-input-icon" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="auth-input"
                                    required
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div className="auth-input-wrap">
                            <Mail size={16} className="auth-input-icon" />
                            <input
                                type="email"
                                placeholder="Email"
                                className="auth-input"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="auth-input-wrap">
                            <Lock size={16} className="auth-input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                className="auth-input"
                                required
                            />
                            <button
                                type="button"
                                className="auth-eye-btn"
                                onClick={() => setShowPassword(v => !v)}
                                tabIndex={-1}
                            >
                                {showPassword
                                    ? <EyeOff size={16} />
                                    : <Eye size={16} />}
                            </button>
                        </div>

                        {/* Forgot password */}
                        {isLogin && (
                            <div className="auth-forgot-row">
                                <span className="auth-forgot">Forgot password?</span>
                            </div>
                        )}

                        <button type="submit" className="auth-cta-btn">
                            Get Started
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="auth-divider">
                        <span>Or sign in with</span>
                    </div>

                    {/* Social buttons */}
                    <div className="auth-social-row">
                        {/* Google */}
                        <button className="auth-social-btn" aria-label="Sign in with Google">
                            <svg width="20" height="20" viewBox="0 0 48 48">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            </svg>
                        </button>

                        {/* Facebook */}
                        <button className="auth-social-btn" aria-label="Sign in with Facebook">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.234 2.686.234v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
                            </svg>
                        </button>

                        {/* Apple */}
                        <button className="auth-social-btn" aria-label="Sign in with Apple">
                            <svg width="20" height="20" viewBox="0 0 814 1000" fill="#000">
                                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-107.1-51.4-155.2-124.5C67.2 716 0 548.5 0 389c0-149.9 98.3-228.5 194.6-228.5 51.4 0 94.2 33.9 126.2 33.9 30.6 0 78.3-35.8 136.7-35.8 52.6 0 108.2 21.6 144.3 63.9zm-194.3-185.5c26.3-31.7 44.9-75.7 44.9-119.7 0-6.1-.5-12.2-1.6-17.2-42.8 1.6-94.3 28.5-126.1 63.9-23.7 26.9-46.9 70.7-46.9 115.4 0 6.7 1.1 13.4 1.6 15.6 2.7.5 7 1.1 11.3 1.1 38.1 0 85.8-25.3 116.8-59.1z" />
                            </svg>
                        </button>
                    </div>

                    {/* Toggle Login / Sign Up */}
                    <p className="auth-toggle-text">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span className="auth-toggle-link" onClick={() => setIsLogin(v => !v)}>
                            {isLogin ? 'Sign up' : 'Log in'}
                        </span>
                    </p>

                </div>
            </div>
        </div>
    );
}
