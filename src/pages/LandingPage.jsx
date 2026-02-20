import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function useIntersectionObserver(options = {}) {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const targetRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsIntersecting(true);
                if (targetRef.current) {
                    observer.unobserve(targetRef.current);
                }
            }
        }, { threshold: 0.1, ...options });

        const currentTarget = targetRef.current;
        if (currentTarget) observer.observe(currentTarget);

        return () => {
            if (currentTarget) observer.unobserve(currentTarget);
        };
    }, [options]);

    return [targetRef, isIntersecting];
}

function FadeInSection({ children, delay = 0, className = "" }) {
    const [ref, isVisible] = useIntersectionObserver();
    return (
        <div
            ref={ref}
            className={`fade-in-section ${isVisible ? 'is-visible' : ''} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

function HeroChatAnimation() {
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const sequence = async () => {
            // User message
            await new Promise(r => setTimeout(r, 1000));
            setMessages([{ id: 1, sender: 'user', text: "How do I translate my 10 years of classroom teaching to UX Design?" }]);
            setIsTyping(true);

            // Mentor typing
            await new Promise(r => setTimeout(r, 1500));
            setIsTyping(false);
            setMessages(prev => [...prev, { id: 2, sender: 'ai', text: "Great question! Let's frame your 'lesson planning' as 'user journey mapping', and your 'classroom management' as 'stakeholder alignment'. Here is a plan..." }]);
        };
        sequence();
    }, []);

    return (
        <div className="hero-chat-widget">
            <div className="hero-chat-header">
                <div className="chat-dot red"></div>
                <div className="chat-dot yellow"></div>
                <div className="chat-dot green"></div>
                <span className="chat-title">Mentor Match</span>
            </div>
            <div className="hero-chat-body">
                {messages.map(msg => (
                    <div key={msg.id} className={`hero-chat-msg ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
                {isTyping && (
                    <div className="hero-chat-msg ai typing-indicator">
                        <span>.</span><span>.</span><span>.</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function LandingPage() {
    return (
        <>
            <a href="#main-content" className="skip-link">Skip to main content</a>
            <div className="app-layout landing-modern">
                <header className="header floating-header" role="banner">
                    <div className="container header-container">
                        <div className="logo-area">
                            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <img src="/logo.png" alt="SecondAct Logo" className="logo" />
                                <span className="logo-text">SecondAct</span>
                            </Link>
                        </div>
                        <nav className="nav-links modern-nav" aria-label="Main navigation">
                            <a href="#how-it-works">How It Works</a>
                            <a href="#success">Success Stories</a>
                            <Link to="/login" className="login-link btn-pill outline-pill">Sign In</Link>
                        </nav>
                    </div>
                </header>

                <main id="main-content">
                    <section className="hero hero-modern">
                        <div className="container hero-container-modern split-hero">
                            <div className="hero-content">
                                <span className="hero-badge">✨ Expert Career Coaching</span>
                                <h1>Transform Career Development With <span className="highlight">Expert Mentorship</span></h1>
                                <p className="hero-subtitle">
                                    Meet your new career mentor. Connect with experienced professionals to close skill gaps and guide your successful industry pivot.
                                </p>
                                <div className="hero-actions modern-actions">
                                    <Link to="/signup?role=mentee" className="btn btn-primary btn-pill btn-lg">
                                        Try SecondAct for Free
                                    </Link>
                                    <a href="#about" className="btn btn-secondary btn-pill btn-lg">
                                        Explore Features
                                    </a>
                                </div>
                            </div>
                            <div className="hero-visual">
                                <HeroChatAnimation />
                            </div>
                        </div>
                    </section>

                    <section id="impact" className="stats-section">
                        <div className="container">
                            <div className="stats-grid">
                                <FadeInSection delay={100} className="stat-card">
                                    <h2>85%</h2>
                                    <p>of users report improved career readiness after utilizing our transition plans.</p>
                                </FadeInSection>
                                <FadeInSection delay={200} className="stat-card">
                                    <h2>24/7</h2>
                                    <p>On-demand guidance tailoring insights to your specific origin and target industries.</p>
                                </FadeInSection>
                                <FadeInSection delay={300} className="stat-card">
                                    <h2>10k+</h2>
                                    <p>Mentorship conversations driving real-world pivot success.</p>
                                </FadeInSection>
                            </div>
                        </div>
                    </section>

                    <section id="how-it-works" className="steps-section section-light">
                        <div className="container text-center">
                            <FadeInSection>
                                <h2 className="section-title">How It Works</h2>
                                <p className="section-subtitle">Your personalized roadmap to a new career in 3 simple steps.</p>
                            </FadeInSection>

                            <div className="steps-grid modern-grid">
                                <FadeInSection delay={100} className="step-card">
                                    <div className="step-number">1</div>
                                    <h3>Share Your Goals</h3>
                                    <p>Tell us your current industry, your target industry, and years of experience.</p>
                                </FadeInSection>
                                <FadeInSection delay={200} className="step-card">
                                    <div className="step-number">2</div>
                                    <h3>Meet Your Mentors</h3>
                                    <p>We dynamically match you with highly-relevant mentors who have made your exact pivot.</p>
                                </FadeInSection>
                                <FadeInSection delay={300} className="step-card">
                                    <div className="step-number">3</div>
                                    <h3>Execute the Plan</h3>
                                    <p>Chat with your mentors to translate your skills, prep for interviews, and build your confidence.</p>
                                </FadeInSection>
                            </div>
                        </div>
                    </section>

                    <section id="about" className="section-dark">
                        <div className="container text-center">
                            <FadeInSection>
                                <h2 className="section-title text-white">Platform Features</h2>
                                <p className="section-subtitle opacity-80 text-white">Everything you need to confidently make your career jump.</p>
                            </FadeInSection>

                            <div className="modern-grid">
                                <FadeInSection delay={100} className="modern-card dark-card">
                                    <div className="card-icon">🧠</div>
                                    <h3>Personalized Matching</h3>
                                    <p>Instantly connect with mentors who have made the exact career jump you are planning.</p>
                                </FadeInSection>
                                <FadeInSection delay={200} className="modern-card dark-card">
                                    <div className="card-icon">🗺️</div>
                                    <h3>Structured Transition Plans</h3>
                                    <p>Generates step-by-step roadmaps from your current skills to your desired role.</p>
                                </FadeInSection>
                                <FadeInSection delay={300} className="modern-card dark-card">
                                    <div className="card-icon">💬</div>
                                    <h3>Actionable Chat Guidance</h3>
                                    <p>Safe, responsive, and highly contextual chat to translate your unique experiences.</p>
                                </FadeInSection>
                            </div>
                        </div>
                    </section>

                    <section id="success" className="testimonials-section section-light">
                        <div className="container text-center">
                            <FadeInSection>
                                <h2 className="section-title">Success Stories</h2>
                                <p className="section-subtitle">Join thousands who have successfully pivoted.</p>
                            </FadeInSection>

                            <div className="testimonials-grid modern-grid">
                                <FadeInSection delay={100} className="testimonial-card">
                                    <p className="testimonial-quote">"SecondAct helped me realize my project management skills in construction translated perfectly to Tech Product Management."</p>
                                    <div className="testimonial-author">
                                        <div className="author-avatar">J</div>
                                        <div className="author-info">
                                            <h4>James T.</h4>
                                            <p>Construction to Tech PM</p>
                                        </div>
                                    </div>
                                </FadeInSection>
                                <FadeInSection delay={200} className="testimonial-card">
                                    <p className="testimonial-quote">"My mentor gave me the exact vocabulary I needed to pass my interviews for UX research."</p>
                                    <div className="testimonial-author">
                                        <div className="author-avatar">S</div>
                                        <div className="author-info">
                                            <h4>Sarah L.</h4>
                                            <p>Teaching to UX Research</p>
                                        </div>
                                    </div>
                                </FadeInSection>
                                <FadeInSection delay={300} className="testimonial-card">
                                    <p className="testimonial-quote">"I felt stuck after 15 years in finance. My mentor gave me the confidence to pivot into sustainable tech."</p>
                                    <div className="testimonial-author">
                                        <div className="author-avatar">M</div>
                                        <div className="author-info">
                                            <h4>Michael R.</h4>
                                            <p>Finance to Green Tech</p>
                                        </div>
                                    </div>
                                </FadeInSection>
                            </div>
                        </div>
                    </section>

                    <section className="cta-banner">
                        <div className="container text-center">
                            <FadeInSection>
                                <h2>Your Next Chapter Deserves The Best Guidance.</h2>
                                <Link to="/signup?role=mentee" className="btn btn-primary btn-pill btn-lg mt-4">
                                    Start Your Pivot Today
                                </Link>
                            </FadeInSection>
                        </div>
                    </section>
                </main>

                <footer className="footer modern-footer">
                    <div className="container footer-content">
                        <div className="footer-brand">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                                <img src="/logo.png" alt="SecondAct Footer Logo" className="footer-logo m-0" />
                                <span className="logo-text text-white">SecondAct</span>
                            </div>
                            <p>Designed for professionals. Built for impact.</p>
                        </div>
                        <div className="footer-links">
                            <div>
                                <h4>Connect</h4>
                                <a href="mailto:the.foundry.tower@gmail.com">Contact Us</a>
                            </div>
                            <div>
                                <h4>Legal</h4>
                                <a href="/privacy">Privacy Policy</a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; {new Date().getFullYear()} SecondAct. All rights reserved. · <a href="/privacy" style={{ color: 'inherit', opacity: 0.7 }}>Privacy Policy</a></p>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default LandingPage;
