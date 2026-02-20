import React, { useState, useContext, useEffect, useRef } from 'react';
import { Send, Phone, Calendar } from 'lucide-react';
import { AppContext } from '../../../context/AppContext';
import { chatWithAIMentor } from '../../../utils/minimaxClient';
import { supabase } from '../../../utils/supabaseClient';

export default function Messages({ user, initialMentorId }) {
    const { aiMentors } = useContext(AppContext);

    const [activeChat, setActiveChat] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [chats, setChats] = useState({});
    const chatBottomRef = useRef(null);

    // Set active chat: prefer initialMentorId, else first mentor with a real conversation
    useEffect(() => {
        if (initialMentorId) {
            setActiveChat(initialMentorId);
        } else if (!activeChat && aiMentors && aiMentors.length > 0) {
            // Find the first mentor who has real (non-greeting) messages
            const firstActive = aiMentors.find(m => {
                const history = chats[m.mentor_id] || [];
                return history.some(msg => !msg.isGreeting);
            });
            if (firstActive) setActiveChat(firstActive.mentor_id);
        }
    }, [aiMentors, activeChat, initialMentorId, chats]);

    // Load all messages for this user from Supabase
    useEffect(() => {
        if (!user?.id) return;

        const loadMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error loading messages:', error.message);
                return;
            }

            // Group messages by mentor_id
            const grouped = {};
            (data || []).forEach(msg => {
                if (!grouped[msg.mentor_id]) grouped[msg.mentor_id] = [];
                grouped[msg.mentor_id].push(msg);
            });

            // For mentors with no history yet, add a local greeting (not saved to DB)
            if (aiMentors && aiMentors.length > 0) {
                aiMentors.forEach(mentor => {
                    const mid = mentor.mentor_id;
                    if (!grouped[mid]) {
                        grouped[mid] = [{
                            id: `greeting_${mid}`,
                            sender: mid,
                            text: `Hi ${user.name}! I see you're looking to pivot from ${user.origin_industry} to ${user.target_industry}. I've made a similar jump myself. How can I help you today?`,
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            isGreeting: true
                        }];
                    }
                });
            }

            setChats(grouped);
        };

        loadMessages();
    }, [user, aiMentors]);

    // Scroll to bottom when messages change
    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chats, activeChat, isTyping]);

    const activeMentor = aiMentors?.find(m => m.mentor_id === activeChat);
    const currentHistory = chats[activeChat] || [];

    // Build a mentor profile shape compatible with chatWithMentor
    const getMentorProfile = (mentor) => ({
        firstName: mentor.first_name,
        lastName: mentor.last_name,
        jobTitle: mentor.job_title,
        company: mentor.company,
        bio: mentor.bio,
        id: mentor.mentor_id,
    });

    // Build user profile shape compatible with chatWithMentor
    const getUserProfile = () => ({
        name: user.name,
        originIndustry: user.origin_industry,
        targetIndustry: user.target_industry,
    });

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !activeMentor) return;

        const userText = messageInput.trim();
        setMessageInput("");
        const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const mentorId = activeMentor.mentor_id;
        const sentAt = Date.now();

        const newUserMsg = { id: sentAt, sender: "me", text: userText, timestamp: ts };
        const updatedHistory = [...currentHistory.filter(m => !m.isGreeting), newUserMsg];
        setChats(prev => ({ ...prev, [mentorId]: [...(prev[mentorId] || []).filter(m => !m.isGreeting), newUserMsg] }));

        // 1. Kick off saving user msg and fetching mentor response immediately
        const contextForMentor = updatedHistory.map(m => ({ sender: m.sender, text: m.text }));
        const aiPromise = (async () => {
            await supabase.from('messages').insert([{
                user_id: user.id, mentor_id: mentorId, sender: 'me', text: userText, timestamp: ts,
            }]);
            return chatWithAIMentor(getMentorProfile(activeMentor), getUserProfile(), contextForMentor);
        })();

        // 2. Show "...is typing" at a random time between 5s and 10s
        const typingDelay = 5000 + Math.random() * 5000;
        const typingTimer = setTimeout(() => setIsTyping(true), typingDelay);

        // 3. Wait until 60 seconds have passed since the user sent the message,
        //    then reveal the response (even if mentor already responded earlier)
        const REVEAL_AFTER_MS = 60000;
        const [aiResponseText] = await Promise.all([
            aiPromise,
            new Promise(resolve => setTimeout(resolve, REVEAL_AFTER_MS - (Date.now() - sentAt)))
        ]);

        clearTimeout(typingTimer);
        setIsTyping(false);

        const aiTs = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newAiMsg = { id: Date.now() + 1, sender: mentorId, text: aiResponseText, timestamp: aiTs };

        // Save mentor response to Supabase then reveal it
        await supabase.from('messages').insert([{
            user_id: user.id, mentor_id: mentorId, sender: mentorId, text: aiResponseText, timestamp: aiTs,
        }]);

        setChats(prev => ({ ...prev, [mentorId]: [...prev[mentorId], newAiMsg] }));
    };

    return (
        <div className="messages-layout">
            <div className="messages-sidebar">
                <h3 className="messages-sidebar-header">Conversations</h3>
                <div className="chat-list">
                    {(() => {
                        // Only show mentors with at least one real (non-greeting) message
                        const activeMentors = aiMentors?.filter(m => {
                            const history = chats[m.mentor_id] || [];
                            return history.some(msg => !msg.isGreeting);
                        }) || [];

                        if (activeMentors.length === 0) {
                            return (
                                <div style={{ padding: '1.5rem 1rem', color: '#888', fontSize: '0.875rem', lineHeight: '1.5', textAlign: 'center' }}>
                                    <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: '0.75rem' }}>💬</span>
                                    No conversations yet.<br />
                                    <span style={{ opacity: 0.75 }}>Go to <strong>My Mentors</strong> and click<br />"Start Conversation" to begin.</span>
                                </div>
                            );
                        }

                        return activeMentors.map(mentor => (
                            <div
                                key={mentor.mentor_id}
                                className={`chat-item ${activeChat === mentor.mentor_id ? 'active' : ''}`}
                                onClick={() => setActiveChat(mentor.mentor_id)}
                            >
                                <div className="chat-avatar">{mentor.avatar || (mentor.first_name || '?').charAt(0)}</div>
                                <div className="chat-preview">
                                    <span className="chat-name">{mentor.first_name} {mentor.last_name}</span>
                                    <p>{mentor.job_title}</p>
                                </div>
                            </div>
                        ));
                    })()}
                </div>
            </div>

            <div className="chat-window">
                {activeMentor ? (
                    <>
                        <div className="chat-header">
                            <div className="chat-header-info">
                                <div className="chat-avatar">{activeMentor.avatar || (activeMentor.first_name || '?').charAt(0)}</div>
                                <div>
                                    <h3>{activeMentor.first_name} {activeMentor.last_name}</h3>
                                    <p className="chat-status">Mentor • {activeMentor.job_title} at {activeMentor.company}</p>
                                </div>
                            </div>
                            <div className="chat-actions">
                                <button className="icon-btn"><Phone size={20} title="Start Video Call" /></button>
                                <button className="icon-btn"><Calendar size={20} title="Schedule Meeting" /></button>
                            </div>
                        </div>

                        <div className="chat-messages">
                            {currentHistory.map(msg => (
                                <div key={msg.id} className={`message-bubble ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                                    <div className="message-text">{msg.text}</div>
                                    <div className="message-meta">{msg.timestamp}</div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="message-bubble received">
                                    <div className="message-text" style={{ fontStyle: 'italic', opacity: 0.7 }}>
                                        {activeMentor.first_name} is typing...
                                    </div>
                                </div>
                            )}
                            <div ref={chatBottomRef} />
                        </div>

                        <form className="chat-input-area" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                placeholder="Ask your mentor a question..."
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                disabled={isTyping}
                            />
                            <button type="submit" className="btn btn-primary" disabled={!messageInput.trim() || isTyping}>
                                <Send size={18} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="empty-chat-state">
                        <p>Select a conversation to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
}
