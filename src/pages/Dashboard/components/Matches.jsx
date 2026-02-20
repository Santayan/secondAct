import React from 'react';
import { MessageSquare } from 'lucide-react';

function MentorCard({ mentor, isActive, onStartConversation }) {
    return (
        <div
            className="mentor-card"
            style={isActive ? {
                border: '2px solid var(--color-primary)',
                boxShadow: '0 0 0 4px rgba(0, 91, 106, 0.10)',
            } : {}}
        >
            <div className="mentor-header">
                <div className="mentor-avatar" style={isActive ? { backgroundColor: 'var(--color-primary)', color: '#fff' } : {}}>
                    {mentor.avatar || (mentor.first_name || '?').charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                    <h3>{mentor.first_name} {mentor.last_name}</h3>
                    <p className="mentor-role">{mentor.job_title} at {mentor.company}</p>
                </div>
                <div className="match-score">
                    {mentor.match_percentage}% Match
                </div>
            </div>
            <div className="mentor-body">
                <div className="mentor-path">
                    <span className="path-label">Previously:</span> {mentor.origin_industry} ({mentor.years_experience} yrs)
                </div>
                <p className="mentor-bio">"{mentor.bio}"</p>
            </div>
            <div className="mentor-footer">
                <button
                    className={`btn btn-sm btn-block ${isActive ? 'btn-primary' : 'btn-accent'}`}
                    onClick={() => onStartConversation && onStartConversation(mentor.mentor_id)}
                >
                    {isActive ? 'Continue Conversation' : 'Start Conversation'}
                </button>
            </div>
        </div>
    );
}

export default function Matches({ user, recommendedMentors, onStartConversation, activeMentorIds = [] }) {
    if (!recommendedMentors || recommendedMentors.length === 0) {
        return (
            <section className="dashboard-section section-matches">
                <div className="section-header">
                    <h2>Recommended Mentors</h2>
                    <p>We are currently finding the best matches for your transition from <strong>{user.origin_industry}</strong> to <strong>{user.target_industry}</strong>. Please check back soon!</p>
                </div>
            </section>
        );
    }

    const inConversation = recommendedMentors.filter(m => activeMentorIds.includes(m.mentor_id));
    const recommended = recommendedMentors.filter(m => !activeMentorIds.includes(m.mentor_id));

    return (
        <section className="dashboard-section section-matches">

            {/* ── In Conversation ── */}
            {inConversation.length > 0 && (
                <div style={{ marginBottom: '3rem' }}>
                    <div className="section-header" style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                width: '10px', height: '10px', borderRadius: '50%',
                                backgroundColor: '#22c55e', boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.25)'
                            }} />
                            <h2 style={{ margin: 0 }}>In Conversation</h2>
                        </div>
                        <p>Mentors you are currently chatting with.</p>
                    </div>
                    <div className="mentor-grid">
                        {inConversation.map(mentor => (
                            <MentorCard
                                key={mentor.mentor_id}
                                mentor={mentor}
                                isActive={true}
                                onStartConversation={onStartConversation}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Recommended Mentors ── */}
            {recommended.length > 0 && (
                <div>
                    <div className="section-header" style={{ marginBottom: '1.5rem' }}>
                        <h2>Recommended Mentors</h2>
                        <p>Based on your transition from <strong>{user.origin_industry}</strong> to <strong>{user.target_industry}</strong></p>
                    </div>
                    <div className="mentor-grid">
                        {recommended.map(mentor => (
                            <MentorCard
                                key={mentor.mentor_id}
                                mentor={mentor}
                                isActive={false}
                                onStartConversation={onStartConversation}
                            />
                        ))}
                    </div>
                </div>
            )}

        </section>
    );
}
