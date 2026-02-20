import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Users, MessageSquare, Globe, BookOpen } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import { supabase } from '../../utils/supabaseClient';
import Matches from './components/Matches';
import Messages from './components/Messages';
import Community from './components/Community';
import Profile from './components/Profile';
import Resources from './components/Resources';

export default function Dashboard() {
    const { user, loading, aiMentors, logout } = useContext(AppContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('matches');
    const [selectedMentorId, setSelectedMentorId] = useState(null);
    const [activeMentorIds, setActiveMentorIds] = useState([]);

    const handleStartConversation = (mentorId) => {
        setSelectedMentorId(mentorId);
        setActiveMentorIds(prev => prev.includes(mentorId) ? prev : [...prev, mentorId]);
        setActiveTab('messages');
    };

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
            return;
        }
        // Load which mentors the user has already messaged
        if (user?.id) {
            supabase
                .from('messages')
                .select('mentor_id')
                .eq('user_id', user.id)
                .then(({ data }) => {
                    if (data) {
                        const ids = [...new Set(data.map(m => m.mentor_id))];
                        setActiveMentorIds(ids);
                    }
                });
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--color-bg)' }}>
                <p style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>Loading your dashboard...</p>
            </div>
        );
    }

    if (!user) return null; // Avoid render till redirect

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <Link to="/">
                        <img src="/logo.png" alt="SecondAct" />
                    </Link>
                </div>
                <nav className="sidebar-nav">
                    <button
                        className={`nav-item nav-btn ${activeTab === 'matches' ? 'active' : ''}`}
                        onClick={() => setActiveTab('matches')}
                    >
                        <Users size={20} /> My Mentors
                    </button>

                    <button
                        className={`nav-item nav-btn ${activeTab === 'messages' ? 'active' : ''}`}
                        onClick={() => setActiveTab('messages')}
                    >
                        <MessageSquare size={20} /> Messages
                    </button>
                    <button
                        className={`nav-item nav-btn ${activeTab === 'community' ? 'active' : ''}`}
                        onClick={() => setActiveTab('community')}
                    >
                        <Globe size={20} /> Community
                    </button>
                    <button
                        className={`nav-item nav-btn ${activeTab === 'resources' ? 'active' : ''}`}
                        onClick={() => setActiveTab('resources')}
                    >
                        <BookOpen size={20} /> Resources
                    </button>
                    <button
                        className={`nav-item nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <User size={20} /> Profile
                    </button>

                </nav>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="nav-item nav-btn text-danger">
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>
            </aside>

            <main className="dashboard-content">
                <header className="dashboard-header">
                    <div>
                        <h1>Welcome back, {user.name}</h1>
                        <p>Your journey {user.role === 'mentee' ? `from ${user.origin_industry} to ${user.target_industry} continues here.` : `guiding transitions into ${user.target_industry}.`}</p>
                    </div>
                </header>

                {/* Content rendering based on active tab state */}
                {activeTab === 'matches' && user.role === 'mentee' && (
                    <Matches user={user} recommendedMentors={aiMentors} onStartConversation={handleStartConversation} activeMentorIds={activeMentorIds} />
                )}

                {activeTab === 'matches' && user.role === 'mentor' && (
                    <section className="dashboard-section section-matches">
                        <div className="section-header">
                            <h2>Mentee Requests</h2>
                            <p>Mentees seeking your guidance into {user.target_industry} will appear here.</p>
                        </div>
                    </section>
                )}


                {activeTab === 'messages' && (
                    <Messages user={user} initialMentorId={selectedMentorId} />
                )}

                {activeTab === 'community' && (
                    <Community user={user} />
                )}

                {activeTab === 'resources' && (
                    <Resources user={user} />
                )}

                {activeTab === 'profile' && (
                    <Profile user={user} />
                )}
            </main>
        </div>
    );
}
