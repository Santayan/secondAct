import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Quote } from 'lucide-react';
import { AppContext } from '../../context/AppContext';

export default function Signup() {
    const location = useLocation();
    const navigate = useNavigate();
    const { signup } = useContext(AppContext);

    const queryParams = new URLSearchParams(location.search);
    const initialRole = queryParams.get('role') || 'mentee';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: initialRole, // 'mentee' or 'mentor'
        originIndustry: '',
        targetIndustry: '',
        yearsExperience: '',
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await signup(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="split-auth-layout">
            <div className="split-form-side scrollable">
                <div className="auth-topbar" style={{ padding: '2rem 3rem' }}>
                    <Link to="/" className="back-link" aria-label="Go back to home page" style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                        <ArrowLeft size={20} aria-hidden="true" /> Home
                    </Link>
                </div>

                <main className="split-form-container">
                    <div className="split-form-content">
                        <header style={{ textAlign: 'left', marginBottom: '3rem' }}>
                            <img src="/logo.png" alt="SecondAct Logo" style={{ height: '36px', marginBottom: '2rem' }} />
                            <h1 style={{ fontSize: '2.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem', fontWeight: '800', letterSpacing: '-1px' }}>Join SecondAct.</h1>
                            <p style={{ color: '#4b5563', fontSize: '1.1rem' }}>Enter your details to create your account and meet your mentor.</p>
                        </header>

                        <form className="auth-form" onSubmit={handleSignup} noValidate>
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    type="text" id="name" name="name" required
                                    aria-required="true"
                                    value={formData.name} onChange={handleChange}
                                    style={{ backgroundColor: '#F9FAFB' }}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email" id="email" name="email" required
                                    aria-required="true"
                                    autoComplete="email"
                                    value={formData.email} onChange={handleChange}
                                    style={{ backgroundColor: '#F9FAFB' }}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password" id="password" name="password" required
                                    aria-required="true"
                                    value={formData.password} onChange={handleChange}
                                    style={{ backgroundColor: '#F9FAFB' }}
                                />
                            </div>

                            <div className="form-section-divider">
                                <span style={{ color: 'var(--color-primary)', backgroundColor: '#fff', padding: '0 1rem' }}>Professional Details</span>
                            </div>

                            <div className="form-group">
                                <label htmlFor="originIndustry">Current / Previous Industry</label>
                                <input
                                    type="text" id="originIndustry" name="originIndustry" placeholder="e.g. Teaching, Accounting..." required
                                    aria-required="true"
                                    value={formData.originIndustry} onChange={handleChange}
                                    style={{ backgroundColor: '#F9FAFB' }}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="targetIndustry">Target Industry</label>
                                <input
                                    type="text" id="targetIndustry" name="targetIndustry" placeholder="e.g. UX Design, Software Engineering..." required
                                    aria-required="true"
                                    value={formData.targetIndustry} onChange={handleChange}
                                    style={{ backgroundColor: '#F9FAFB' }}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="yearsExperience">Years of Experience</label>
                                <select id="yearsExperience" name="yearsExperience" required aria-required="true" value={formData.yearsExperience} onChange={handleChange} style={{ backgroundColor: '#F9FAFB' }}>
                                    <option value="" disabled>Select experience level...</option>
                                    <option value="10-15">10-15 years</option>
                                    <option value="15-20">15-20 years</option>
                                    <option value="20-25">20-25 years</option>
                                    <option value="25+">25+ years</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-block"
                                disabled={loading}
                                aria-busy={loading}
                                style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '1rem', borderRadius: '50px', fontSize: '1.1rem', marginTop: '1.5rem', fontWeight: 'bold' }}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>

                            {error && (
                                <div role="alert" className="text-danger" style={{ marginTop: '1.5rem', textAlign: 'center', padding: '0.75rem', backgroundColor: '#FEF2F2', border: '1px solid #F87171', borderRadius: '8px' }}>
                                    {error}
                                </div>
                            )}
                        </form>

                        <footer style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                            <p style={{ color: '#4b5563' }}>Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'underline', fontWeight: 'bold' }}>Sign in</Link></p>
                        </footer>
                    </div>
                </main>
            </div>

            <div className="split-brand-side">
                <div className="brand-content-wrapper">
                    <div className="quote-badge">
                        <Quote size={24} color="var(--color-accent)" />
                    </div>
                    <blockquote className="brand-quote">
                        "SecondAct completely changed my trajectory. I transitioned from teaching to a Senior UX role in just 4 months using their actionable roadmaps."
                    </blockquote>
                    <div className="quote-author">
                        <div className="author-avatar-placeholder">SK</div>
                        <div>
                            <strong>Sarah K.</strong>
                            <span>Former Teacher → Product Designer</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
