import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Heart, Share2, Filter, X, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { supabase } from '../../../utils/supabaseClient';

const TAGS = ['All', 'Finances', 'Resume Translation', 'Interviews', 'Tech', 'UX Design', 'Career Change'];

function timeAgo(dateStr) {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

export default function Community({ user }) {
    const [posts, setPosts] = useState([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [expandedPost, setExpandedPost] = useState(null);
    const [commentInputs, setCommentInputs] = useState({});
    const [likedPosts, setLikedPosts] = useState(new Set());

    // New post form state
    const [form, setForm] = useState({ title: '', content: '', tags: [] });
    const [submitting, setSubmitting] = useState(false);

    const loadPosts = useCallback(async () => {
        setLoading(true);
        let query = supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        const { data, error } = await query;
        if (!error) setPosts(data || []);
        setLoading(false);
    }, []);

    const loadLikes = useCallback(async () => {
        if (!user?.id) return;
        const { data } = await supabase
            .from('post_likes')
            .select('post_id')
            .eq('user_id', user.id);
        if (data) setLikedPosts(new Set(data.map(l => l.post_id)));
    }, [user]);

    useEffect(() => {
        loadPosts();
        loadLikes();
    }, [loadPosts, loadLikes]);

    const filteredPosts = activeFilter === 'All'
        ? posts
        : posts.filter(p => p.tags?.includes(activeFilter));

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.content.trim()) return;
        setSubmitting(true);

        const transition = user.origin_industry && user.target_industry
            ? `${user.origin_industry} → ${user.target_industry}`
            : '';

        const { data, error } = await supabase.from('posts').insert([{
            user_id: user.id,
            author_name: user.name,
            author_role: user.role,
            transition,
            title: form.title,
            content: form.content,
            tags: form.tags,
        }]).select().single();

        if (!error && data) {
            setPosts(prev => [data, ...prev]);
            setForm({ title: '', content: '', tags: [] });
            setShowCreateModal(false);
        }
        setSubmitting(false);
    };

    const handleLike = async (post) => {
        const alreadyLiked = likedPosts.has(post.id);

        if (alreadyLiked) {
            await supabase.from('post_likes').delete().eq('post_id', post.id).eq('user_id', user.id);
            await supabase.from('posts').update({ likes_count: post.likes_count - 1 }).eq('id', post.id);
            setLikedPosts(prev => { const s = new Set(prev); s.delete(post.id); return s; });
            setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes_count: p.likes_count - 1 } : p));
        } else {
            await supabase.from('post_likes').insert([{ post_id: post.id, user_id: user.id }]);
            await supabase.from('posts').update({ likes_count: post.likes_count + 1 }).eq('id', post.id);
            setLikedPosts(prev => new Set([...prev, post.id]));
            setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes_count: p.likes_count + 1 } : p));
        }
    };

    const handleComment = async (postId) => {
        const text = (commentInputs[postId] || '').trim();
        if (!text) return;

        const { error } = await supabase.from('comments').insert([{
            post_id: postId,
            user_id: user.id,
            author_name: user.name,
            content: text,
        }]);

        if (!error) {
            await supabase.from('posts').update({
                comments_count: (posts.find(p => p.id === postId)?.comments_count || 0) + 1
            }).eq('id', postId);

            setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments_count: (p.comments_count || 0) + 1 } : p));
            setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        }
    };

    const toggleTag = (tag) => {
        setForm(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    return (
        <section className="dashboard-section section-community">
            {/* Header */}
            <div className="community-header">
                <div>
                    <h2>Community Hub</h2>
                    <p>Connect with peers navigating similar mid-career pivots, share stories, and ask questions.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>+ Create Post</button>
            </div>

            {/* Filters */}
            <div className="community-filters">
                <div className="filter-group">
                    <Filter size={16} className="filter-icon" />
                    {TAGS.map(tag => (
                        <button
                            key={tag}
                            className={`filter-btn ${activeFilter === tag ? 'active' : ''}`}
                            onClick={() => setActiveFilter(tag)}
                        >
                            {tag === 'All' ? 'All Discussions' : tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Feed */}
            <div className="community-feed">
                {loading && <p style={{ color: '#888', padding: '1rem' }}>Loading posts...</p>}
                {!loading && filteredPosts.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>
                        <p>No posts yet. Be the first to start a conversation!</p>
                    </div>
                )}
                {filteredPosts.map(post => (
                    <div key={post.id} className="forum-post">
                        <div className="post-meta">
                            <div className="post-author-info">
                                <span className="post-author">{post.author_name}</span>
                                <span className="post-badge">{post.author_role}</span>
                                {post.transition && <span className="post-transition">• {post.transition}</span>}
                            </div>
                            <span className="post-time">{timeAgo(post.created_at)}</span>
                        </div>

                        <h3 className="post-title">{post.title}</h3>
                        <p className="post-content">{post.content}</p>

                        {post.tags?.length > 0 && (
                            <div className="post-tags">
                                {post.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                            </div>
                        )}

                        <div className="post-actions">
                            <button
                                className={`action-btn ${likedPosts.has(post.id) ? 'liked' : ''}`}
                                onClick={() => handleLike(post)}
                                style={{ color: likedPosts.has(post.id) ? 'var(--color-primary)' : '' }}
                            >
                                <Heart size={18} fill={likedPosts.has(post.id) ? 'currentColor' : 'none'} />
                                {post.likes_count || 0} Likes
                            </button>
                            <button
                                className="action-btn"
                                onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                            >
                                <MessageSquare size={18} /> {post.comments_count || 0} Replies
                                {expandedPost === post.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </button>
                        </div>

                        {/* Inline comment box */}
                        {expandedPost === post.id && (
                            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        placeholder={`Reply as ${user.name}...`}
                                        value={commentInputs[post.id] || ''}
                                        onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                        onKeyDown={e => e.key === 'Enter' && handleComment(post.id)}
                                        style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}
                                    />
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleComment(post.id)}
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Create Post Modal */}
            {showCreateModal && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: 'var(--color-surface)', borderRadius: '16px', padding: '2rem',
                        width: '100%', maxWidth: '560px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Create a Post</h3>
                            <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                                <X size={22} />
                            </button>
                        </div>
                        <form onSubmit={handleCreatePost}>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label>Title</label>
                                <input
                                    type="text"
                                    placeholder="What's on your mind?"
                                    value={form.title}
                                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                    required
                                    style={{ backgroundColor: 'var(--color-bg)' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label>Content</label>
                                <textarea
                                    rows={5}
                                    placeholder="Share your experience, ask a question, or offer advice..."
                                    value={form.content}
                                    onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.95rem' }}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>Tags</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {TAGS.filter(t => t !== 'All').map(tag => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => toggleTag(tag)}
                                            className={form.tags.includes(tag) ? 'filter-btn active' : 'filter-btn'}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-outline" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
