import React from 'react';
import { Link } from 'react-router-dom';

const LAST_UPDATED = 'February 20, 2026';
const CONTACT_EMAIL = 'the.foundry.tower@gmail.com';
const APP_NAME = 'SecondAct';
const COMPANY = 'SecondAct, Inc.';

function Section({ title, children }) {
    return (
        <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{
                fontSize: '1.15rem', fontWeight: '700',
                color: 'var(--color-primary, #005b6a)',
                marginBottom: '0.75rem', paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--color-border, #e5e7eb)'
            }}>
                {title}
            </h2>
            <div style={{ fontSize: '0.95rem', lineHeight: '1.8', color: '#374151' }}>
                {children}
            </div>
        </section>
    );
}

export default function PrivacyPolicy() {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {/* Nav */}
            <nav style={{
                backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb',
                padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <Link to="/" style={{ fontWeight: '800', fontSize: '1.25rem', color: '#005b6a', textDecoration: 'none' }}>
                    {APP_NAME}
                </Link>
                <Link to="/" style={{ fontSize: '0.875rem', color: '#6b7280', textDecoration: 'none' }}>← Back to Home</Link>
            </nav>

            {/* Content */}
            <main
                id="main-content"
                style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 2rem 5rem' }}
                role="main"
            >
                {/* Header */}
                <header style={{ marginBottom: '3rem' }}>
                    <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b7280', marginBottom: '0.5rem' }}>
                        Legal
                    </p>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#111827', margin: '0 0 0.75rem' }}>
                        Privacy Policy
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Last updated: <time dateTime="2026-02-20">{LAST_UPDATED}</time>
                    </p>
                    <div style={{
                        backgroundColor: '#eff6ff', border: '1px solid #bfdbfe',
                        borderRadius: '10px', padding: '1rem 1.25rem', marginTop: '1.5rem',
                        fontSize: '0.875rem', color: '#1e40af', lineHeight: '1.6'
                    }} role="note" aria-label="Summary">
                        <strong>Summary:</strong> {APP_NAME} collects only the information you give us to match you with career mentors and power community features.
                        We do not sell your data. You can request deletion at any time by emailing us.
                    </div>
                </header>

                <Section title="1. Who We Are">
                    <p>
                        {APP_NAME} ("{COMPANY}", "we", "us", or "our") operates the {APP_NAME} web application at <Link to="/" style={{ color: '#005b6a' }}>secondact.app</Link>.
                        We are committed to protecting the personal information of our users.
                    </p>
                    <p style={{ marginTop: '0.75rem' }}>
                        If you have any questions about this policy, contact us at{' '}
                        <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#005b6a' }}>{CONTACT_EMAIL}</a>.
                    </p>
                </Section>

                <Section title="2. Information We Collect">
                    <p><strong>Information you provide:</strong></p>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                        <li>Full name and email address (at signup)</li>
                        <li>Hashed password (we never store your raw password)</li>
                        <li>Career information: previous industry, target industry, years of experience</li>
                        <li>Optional bio you add to your profile</li>
                        <li>Community posts, comments, and likes you create</li>
                        <li>Messages you exchange with your mentors</li>
                    </ul>
                    <p style={{ marginTop: '1rem' }}><strong>Information collected automatically:</strong></p>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                        <li>Your user session ID stored in <code>localStorage</code> to keep you logged in</li>
                        <li>Standard server logs (IP address, browser type, pages visited) retained for 30 days</li>
                    </ul>
                </Section>

                <Section title="3. How We Use Your Information">
                    <p>We use the information we collect to:</p>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                        <li>Create and manage your account</li>
                        <li>Match you with mentor personas tailored to your career transition</li>
                        <li>Deliver and personalise the community experience</li>
                        <li>Provide personalised mentor chat services</li>
                        <li>Improve the security and performance of the platform</li>
                        <li>Respond to your support requests</li>
                    </ul>
                    <p style={{ marginTop: '1rem' }}>
                        We do <strong>not</strong> use your information for advertising, nor do we sell or rent your data to third parties.
                    </p>
                </Section>

                <Section title="4. Data Storage and Security">
                    <p>
                        Your data is stored in <strong>Supabase</strong>, a secure cloud database platform hosted on AWS infrastructure in the United States.
                        Supabase encrypts data at rest and in transit using TLS 1.2+.
                    </p>
                    <p style={{ marginTop: '0.75rem' }}>
                        Passwords are hashed using <strong>bcrypt</strong> with a work factor of 10 before storage.
                        We never store or log your raw password.
                    </p>
                    <p style={{ marginTop: '0.75rem' }}>
                        While we take security seriously, no system is 100% secure. We encourage you to use a strong, unique password.
                    </p>
                </Section>

                <Section title="5. Third-Party Services">
                    <p>We use the following third-party services that may process your data:</p>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                        <li><strong>Supabase</strong> — database and authentication infrastructure (<a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#005b6a' }}>Privacy Policy</a>)</li>
                        <li><strong>MiniMax</strong> — our mentor chat technology provider. Your career context and messages are sent to MiniMax to generate responses (<a href="https://www.minimaxi.com/protocol" target="_blank" rel="noopener noreferrer" style={{ color: '#005b6a' }}>Terms</a>)</li>
                    </ul>
                </Section>

                <Section title="6. Your Rights">
                    <p>You have the right to:</p>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                        <li><strong>Access</strong> — request a copy of the personal data we hold about you</li>
                        <li><strong>Correction</strong> — update your name, bio, and career details directly from your Profile tab</li>
                        <li><strong>Deletion</strong> — request permanent deletion of your account and all associated data</li>
                        <li><strong>Data portability</strong> — request your data in a machine-readable format</li>
                    </ul>
                    <p style={{ marginTop: '1rem' }}>
                        To exercise any of these rights, email us at{' '}
                        <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#005b6a' }}>{CONTACT_EMAIL}</a>.
                        We will respond within 30 days.
                    </p>
                </Section>

                <Section title="7. Cookies and Local Storage">
                    <p>
                        {APP_NAME} does not use tracking cookies. We store a single session identifier in your browser's <code>localStorage</code>
                        to keep you logged in. Clearing your browser data will log you out.
                    </p>
                </Section>

                <Section title="8. Children's Privacy">
                    <p>
                        {APP_NAME} is designed for adults aged 18 and over. We do not knowingly collect personal information
                        from children under 13. If we become aware that a child has provided us with personal information,
                        we will delete it promptly.
                    </p>
                </Section>

                <Section title="9. Changes to This Policy">
                    <p>
                        We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top
                        of this page. Continued use of {APP_NAME} after changes constitutes acceptance of the revised policy.
                    </p>
                </Section>

                <Section title="10. Contact Us">
                    <p>
                        If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:
                    </p>
                    <address style={{ fontStyle: 'normal', marginTop: '0.75rem', lineHeight: '2' }}>
                        <strong>{COMPANY}</strong><br />
                        Email: <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#005b6a' }}>{CONTACT_EMAIL}</a>
                    </address>
                </Section>
            </main>

            {/* Footer */}
            <footer style={{
                borderTop: '1px solid #e5e7eb', backgroundColor: '#fff',
                padding: '1.5rem 2rem', textAlign: 'center',
                fontSize: '0.85rem', color: '#6b7280'
            }} role="contentinfo">
                © {new Date().getFullYear()} {COMPANY}. All rights reserved. ·{' '}
                <Link to="/privacy" style={{ color: '#005b6a' }}>Privacy Policy</Link>
            </footer>
        </div>
    );
}
