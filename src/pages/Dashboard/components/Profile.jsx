import React, { useState, useContext } from 'react';
import { AppContext } from '../../../context/AppContext';
import { Save, Edit2, X, Briefcase, Target, Clock, Mail, User as UserIcon } from 'lucide-react';

const fieldStyle = (editing) => ({
    backgroundColor: editing ? 'var(--color-bg)' : 'transparent',
    opacity: editing ? 1 : 0.85,
    border: editing ? '1px solid var(--color-border)' : '1px solid transparent',
    transition: 'all 0.2s',
});

function InfoCard({ icon: Icon, label, value }) {
    return (
        <div style={{
            background: 'var(--color-surface, #fff)',
            border: '1px solid var(--color-border)',
            borderRadius: '14px',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
        }}>
            <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                backgroundColor: 'rgba(0, 91, 106, 0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
            }}>
                <Icon size={20} style={{ color: 'var(--color-primary)' }} />
            </div>
            <div>
                <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted, #6b7280)' }}>
                    {label}
                </p>
                <p style={{ margin: '0.2rem 0 0', fontSize: '1rem', fontWeight: '600', color: 'var(--color-text)' }}>
                    {value || <span style={{ opacity: 0.45, fontStyle: 'italic', fontWeight: 400 }}>Not set</span>}
                </p>
            </div>
        </div>
    );
}

export default function Profile({ user }) {
    const { updateProfile } = useContext(AppContext);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [form, setForm] = useState({
        name: user.name || '',
        bio: user.bio || '',
        origin_industry: user.origin_industry || '',
        target_industry: user.target_industry || '',
        years_experience: user.years_experience || '',
    });

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            await updateProfile(form);
            setSuccess('Profile updated successfully!');
            setEditing(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setForm({
            name: user.name || '',
            bio: user.bio || '',
            origin_industry: user.origin_industry || '',
            target_industry: user.target_industry || '',
            years_experience: user.years_experience || '',
        });
        setEditing(false);
        setError('');
    };

    const avatarLetter = (user.name || 'U').charAt(0).toUpperCase();

    return (
        <section className="dashboard-section" style={{ maxWidth: '760px' }}>

            {/* ── Page heading ── */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ margin: '0 0 0.4rem' }}>My Profile</h2>
                <p style={{ margin: 0, color: 'var(--color-text-muted, #6b7280)' }}>
                    Manage your account information and career preferences.
                </p>
            </div>

            {/* ── Avatar hero card ── */}
            <div style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, #00838f 100%)',
                borderRadius: '20px',
                padding: '2.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                marginBottom: '2rem',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* decorative circle */}
                <div style={{
                    position: 'absolute', right: '-40px', top: '-40px',
                    width: '180px', height: '180px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.07)',
                }} />
                <div style={{
                    width: '88px', height: '88px', borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    border: '3px solid rgba(255,255,255,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2.25rem', fontWeight: '800', flexShrink: 0,
                    backdropFilter: 'blur(4px)',
                }}>
                    {avatarLetter}
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.5rem', fontWeight: '700', color: '#fff' }}>
                        {user.name}
                    </h3>
                    <p style={{ margin: '0 0 0.2rem', opacity: 0.85, fontSize: '0.9rem', textTransform: 'capitalize' }}>
                        {user.role}
                    </p>
                    <p style={{ margin: 0, opacity: 0.7, fontSize: '0.85rem' }}>{user.email}</p>
                </div>
                {!editing && (
                    <button
                        className="btn btn-sm"
                        onClick={() => setEditing(true)}
                        style={{
                            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)',
                            color: '#fff', backdropFilter: 'blur(4px)',
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                        }}
                    >
                        <Edit2 size={14} /> Edit Profile
                    </button>
                )}
            </div>

            {/* ── Alerts ── */}
            {success && (
                <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', borderRadius: '10px', padding: '0.9rem 1.25rem', marginBottom: '1.75rem', color: '#15803d', fontSize: '0.9rem' }}>
                    ✓ {success}
                </div>
            )}
            {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: '10px', padding: '0.9rem 1.25rem', marginBottom: '1.75rem', color: '#dc2626', fontSize: '0.9rem' }}>
                    {error}
                </div>
            )}

            {/* ── View mode: Info cards ── */}
            {!editing && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                    <InfoCard icon={UserIcon} label="Full Name" value={user.name} />
                    <InfoCard icon={Mail} label="Email" value={user.email} />
                    <InfoCard icon={Briefcase} label="Previous Industry" value={user.origin_industry} />
                    <InfoCard icon={Target} label="Target Industry" value={user.target_industry} />
                    <InfoCard icon={Clock} label="Years of Experience" value={user.years_experience} />
                </div>
            )}

            {/* ── Bio (view mode) ── */}
            {!editing && (
                <div style={{
                    background: 'var(--color-surface, #fff)', border: '1px solid var(--color-border)',
                    borderRadius: '14px', padding: '1.5rem', marginBottom: '2rem',
                }}>
                    <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted, #6b7280)' }}>
                        Bio
                    </p>
                    <p style={{ margin: 0, lineHeight: '1.7', color: user.bio ? 'var(--color-text)' : 'var(--color-text-muted, #6b7280)', fontStyle: user.bio ? 'normal' : 'italic' }}>
                        {user.bio || 'No bio yet. Click Edit Profile to add one.'}
                    </p>
                </div>
            )}

            {/* ── Edit form — same card grid as view mode ── */}
            {editing && (
                <form onSubmit={handleSave}>
                    {/* Editable info cards grid */}
                    <style>{`
                        .edit-card-input:focus { outline: none; }
                        .edit-card:focus-within { border-color: var(--color-primary) !important; box-shadow: 0 0 0 3px rgba(0,91,106,0.10); }
                        .edit-card-input:not(:disabled) { border-bottom: 2px solid var(--color-border); padding-bottom: 2px; }
                        .edit-card-input:not(:disabled):focus { border-bottom-color: var(--color-primary); }
                    `}</style>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        {[
                            { icon: UserIcon, label: 'Full Name', name: 'name', value: form.name, disabled: false, placeholder: 'Enter your name' },
                            { icon: Mail, label: 'Email', name: 'email', value: user.email, disabled: true, placeholder: '' },
                            { icon: Briefcase, label: 'Previous Industry', name: 'origin_industry', value: form.origin_industry, disabled: true, placeholder: '' },
                            { icon: Target, label: 'Target Industry', name: 'target_industry', value: form.target_industry, disabled: true, placeholder: '' },
                            { icon: Clock, label: 'Years of Experience', name: 'years_experience', value: form.years_experience, disabled: true, placeholder: '' },
                        ].map(({ icon: Icon, label, name, value, disabled, placeholder }) => (
                            <div key={name} className="edit-card" style={{
                                background: disabled ? 'rgba(0,0,0,0.02)' : 'var(--color-surface, #fff)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '14px',
                                padding: '1.25rem 1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                transition: 'border-color 0.15s, box-shadow 0.15s',
                            }}>
                                <div style={{
                                    width: '42px', height: '42px', borderRadius: '12px',
                                    backgroundColor: disabled ? 'rgba(0,0,0,0.05)' : 'rgba(0, 91, 106, 0.08)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                }}>
                                    <Icon size={20} style={{ color: disabled ? '#9ca3af' : 'var(--color-primary)' }} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ margin: '0 0 0.4rem', fontSize: '0.72rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted, #6b7280)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        {label}
                                        {disabled && <span style={{ fontSize: '0.65rem', background: '#f3f4f6', color: '#9ca3af', borderRadius: '4px', padding: '0 5px', fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>locked</span>}
                                    </p>
                                    <input
                                        className="edit-card-input"
                                        name={name}
                                        value={value}
                                        onChange={disabled ? undefined : handleChange}
                                        disabled={disabled}
                                        placeholder={placeholder}
                                        style={{
                                            width: '100%',
                                            border: 'none',
                                            background: 'transparent',
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            color: disabled ? '#9ca3af' : 'var(--color-text)',
                                            padding: '2px 0 0',
                                            fontFamily: 'inherit',
                                            boxSizing: 'border-box',
                                            cursor: disabled ? 'not-allowed' : 'text',
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bio card — full width */}
                    <div style={{
                        background: 'var(--color-surface, #fff)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '14px',
                        padding: '1.5rem',
                        marginBottom: '2rem',
                    }}>
                        <p style={{ margin: '0 0 0.75rem', fontSize: '0.72rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted, #6b7280)' }}>
                            Bio <span style={{ textTransform: 'none', fontWeight: 400 }}>(optional)</span>
                        </p>
                        <textarea
                            name="bio"
                            rows={5}
                            value={form.bio}
                            onChange={handleChange}
                            placeholder="Tell the community a little about yourself and your career journey..."
                            style={{
                                width: '100%', border: 'none', background: 'transparent', resize: 'vertical',
                                fontFamily: 'inherit', fontSize: '0.95rem', lineHeight: '1.7',
                                color: 'var(--color-text)', padding: 0, outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button type="submit" className="btn btn-primary" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" className="btn btn-outline" onClick={handleCancel} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <X size={16} /> Cancel
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}
