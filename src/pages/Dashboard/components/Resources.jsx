import React, { useState, useContext } from 'react';
import { BookOpen, Video, ExternalLink, Sparkles, X, Filter, ChevronDown } from 'lucide-react';
import { AppContext } from '../../../context/AppContext';
import { RESOURCES, ALL_TAGS } from '../../../data/curatedResources';
import { generateCareerGuide } from '../../../utils/minimaxClient';

// Minimal markdown renderer (bold, headings, bullets)
function SimpleMarkdown({ text }) {
    if (!text) return null;
    const lines = text.split('\n');
    return (
        <div style={{ lineHeight: '1.8', fontSize: '0.95rem', color: 'var(--color-text)' }}>
            {lines.map((line, i) => {
                if (line.startsWith('## ')) {
                    return <h3 key={i} style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>{line.replace('## ', '')}</h3>;
                }
                if (line.startsWith('### ')) {
                    return <h4 key={i} style={{ fontSize: '1rem', fontWeight: '600', marginTop: '1rem', marginBottom: '0.4rem' }}>{line.replace('### ', '')}</h4>;
                }
                if (line.startsWith('- ') || line.startsWith('* ')) {
                    return <li key={i} style={{ marginLeft: '1.5rem', marginBottom: '0.3rem' }}>{renderInline(line.replace(/^[-*] /, ''))}</li>;
                }
                if (/^\d+\. /.test(line)) {
                    return <li key={i} style={{ marginLeft: '1.5rem', marginBottom: '0.4rem' }}>{renderInline(line.replace(/^\d+\. /, ''))}</li>;
                }
                if (line.trim() === '') return <br key={i} />;
                return <p key={i} style={{ marginBottom: '0.4rem' }}>{renderInline(line)}</p>;
            })}
        </div>
    );
}

function renderInline(text) {
    // Bold: **text**
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
}

function ResourceCard({ resource }) {
    const isVideo = resource.type === 'video';
    return (
        <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mentor-card"
            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
            aria-label={`${resource.title} — ${resource.source}`}
        >
            {/* Card Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{
                    width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
                    backgroundColor: isVideo ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 91, 106, 0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem'
                }}>
                    {resource.emoji}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                        {isVideo
                            ? <Video size={12} style={{ color: '#ef4444' }} />
                            : <BookOpen size={12} style={{ color: 'var(--color-primary)' }} />
                        }
                        <span style={{ fontSize: '0.72rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: isVideo ? '#ef4444' : 'var(--color-primary)' }}>
                            {isVideo ? 'Video' : 'Article'}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted, #6b7280)', marginLeft: 'auto' }}>
                            {resource.readTime}
                        </span>
                    </div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: '700', margin: 0, color: 'var(--color-text)', lineHeight: '1.3' }}>
                        {resource.title}
                    </h3>
                </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted, #6b7280)', margin: '0 0 0.75rem', lineHeight: '1.5', flex: 1 }}>
                {resource.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-muted, #6b7280)' }}>
                    {resource.source}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: '600' }}>
                    Read <ExternalLink size={12} />
                </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
                {resource.tags.map(tag => (
                    <span key={tag} className="tag" style={{ fontSize: '0.7rem' }}>{tag}</span>
                ))}
            </div>
        </a>
    );
}

export default function Resources({ user }) {
    const [activeTag, setActiveTag] = useState('All');
    const [showGuide, setShowGuide] = useState(false);
    const [guide, setGuide] = useState(null);
    const [generatingGuide, setGeneratingGuide] = useState(false);
    const [typeFilter, setTypeFilter] = useState('All');

    const filteredResources = RESOURCES.filter(r => {
        const tagMatch = activeTag === 'All' || r.tags.includes(activeTag);
        const typeMatch = typeFilter === 'All' || r.type === typeFilter.toLowerCase();
        return tagMatch && typeMatch;
    });

    const handleGenerateGuide = async () => {
        if (guide) { setShowGuide(true); return; }
        setShowGuide(true);
        setGeneratingGuide(true);
        const result = await generateCareerGuide(
            user.origin_industry || 'your previous industry',
            user.target_industry || 'your target industry',
            user.years_experience || 'several years'
        );
        setGuide(result || '# No guide generated\n\nPlease check your API key and try again.');
        setGeneratingGuide(false);
    };

    return (
        <section className="dashboard-section" style={{ maxWidth: '1100px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ margin: '0 0 0.25rem' }}>Expert Resources</h2>
                    <p style={{ margin: 0, color: 'var(--color-text-muted, #6b7280)' }}>
                        Curated articles &amp; videos to guide your career transition.
                    </p>
                </div>

                {/* Custom Guide Button */}
                <button
                    className="btn btn-primary"
                    onClick={handleGenerateGuide}
                    disabled={generatingGuide}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}
                    aria-label="Generate a personalised career guide"
                >
                    <Sparkles size={16} />
                    {guide ? 'View My Guide' : 'Generate My Custom Guide'}
                </button>
            </div>

            {/* Filters row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                {/* Type toggle */}
                <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--color-surface, #fff)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '0.25rem' }}>
                    {['All', 'Article', 'Video'].map(t => (
                        <button
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            style={{
                                padding: '0.35rem 0.85rem', borderRadius: '7px', border: 'none', cursor: 'pointer',
                                fontSize: '0.82rem', fontWeight: '600', transition: 'all 0.15s',
                                background: typeFilter === t ? 'var(--color-primary)' : 'transparent',
                                color: typeFilter === t ? '#fff' : 'var(--color-text-muted, #6b7280)'
                            }}
                        >
                            {t === 'Video' ? '▶ Video' : t === 'Article' ? '📄 Article' : 'All'}
                        </button>
                    ))}
                </div>

                {/* Tag filter */}
                <div className="community-filters" style={{ margin: 0, padding: 0, background: 'transparent', border: 'none' }}>
                    <div className="filter-group" style={{ flexWrap: 'wrap' }}>
                        <Filter size={14} style={{ color: 'var(--color-text-muted, #6b7280)' }} />
                        <button className={`filter-btn ${activeTag === 'All' ? 'active' : ''}`} onClick={() => setActiveTag('All')}>All Topics</button>
                        {ALL_TAGS.map(tag => (
                            <button key={tag} className={`filter-btn ${activeTag === tag ? 'active' : ''}`} onClick={() => setActiveTag(tag)}>
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Resource count */}
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted, #6b7280)', marginBottom: '1.25rem' }}>
                Showing {filteredResources.length} of {RESOURCES.length} resources
            </p>

            {/* Grid */}
            <div className="mentor-grid">
                {filteredResources.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                ))}
                {filteredResources.length === 0 && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted, #6b7280)' }}>
                        No resources match the selected filters.
                    </div>
                )}
            </div>

            {/* Custom Guide Modal */}
            {showGuide && (
                <div
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, overflowY: 'auto', padding: '2rem 1rem' }}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Your Personalised Career Guide"
                >
                    <div style={{ background: 'var(--color-surface, #fff)', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '700px', boxShadow: '0 24px 72px rgba(0,0,0,0.25)', position: 'relative' }}>
                        <button
                            onClick={() => setShowGuide(false)}
                            style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted, #6b7280)' }}
                            aria-label="Close guide"
                        >
                            <X size={22} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0,91,106,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Sparkles size={20} style={{ color: 'var(--color-primary)' }} />
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Your Personalised Career Guide</h2>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted, #6b7280)' }}>
                                    {user.origin_industry} → {user.target_industry}
                                </p>
                            </div>
                        </div>

                        {generatingGuide ? (
                            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'spin 1s linear infinite' }}>✨</div>
                                <p style={{ color: 'var(--color-text-muted, #6b7280)', fontStyle: 'italic' }}>
                                    Writing your personalised guide for {user.origin_industry} → {user.target_industry}...
                                </p>
                            </div>
                        ) : (
                            <SimpleMarkdown text={guide} />
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
