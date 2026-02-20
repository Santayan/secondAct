import React, { createContext, useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import { supabase } from '../utils/supabaseClient';
import { generateAIMentors } from '../utils/minimaxClient';

export const AppContext = createContext();

export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiMentors, setAiMentors] = useState([]);

    useEffect(() => {
        const savedUserId = localStorage.getItem('secondActUserId');
        if (savedUserId) {
            restoreSession(savedUserId);
        } else {
            setLoading(false);
        }
    }, []);

    const restoreSession = async (userId) => {
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            setUser(profile);
            await loadMentorAssignments(userId);
        } catch (err) {
            console.error('Error restoring session:', err.message);
            localStorage.removeItem('secondActUserId');
        } finally {
            setLoading(false);
        }
    };

    const loadMentorAssignments = async (userId) => {
        const { data: mentors, error } = await supabase
            .from('mentor_assignments')
            .select('*')
            .eq('user_id', userId);

        if (!error && mentors?.length > 0) {
            setAiMentors(mentors);
        }
    };

    const assignMentors = async (userId, originIndustry, targetIndustry, yearsExperience) => {
        console.log('⏳ Generating AI mentors for:', originIndustry, '->', targetIndustry);
        const generated = await generateAIMentors(originIndustry, targetIndustry, yearsExperience);

        if (!generated || generated.length === 0) {
            console.warn('⚠️ No mentors generated — check Minimax API.');
            return;
        }

        const rows = generated.map((mentor, i) => ({
            user_id: userId,
            mentor_id: mentor.id || `ai_${i + 1}`,
            first_name: mentor.firstName || mentor.first_name || 'Mentor',
            last_name: mentor.lastName || mentor.last_name || '',
            job_title: mentor.jobTitle || mentor.job_title || '',
            company: mentor.company || '',
            bio: mentor.bio || '',
            avatar: mentor.avatar || (mentor.firstName || 'M').charAt(0),
            origin_industry: originIndustry,
            target_industry: targetIndustry,
            years_experience: yearsExperience,
            match_percentage: mentor.matchedPercentage || (Math.floor(Math.random() * 15) + 85),
        }));

        const { data, error } = await supabase
            .from('mentor_assignments')
            .insert(rows)
            .select();

        if (error) {
            console.error('❌ Error saving mentors:', error.message);
        } else {
            console.log('✅ Mentors saved:', data);
            setAiMentors(data);
        }
    };

    const login = async (email, password) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !data) throw new Error('Invalid email or password');

        // Compare hashed password
        const passwordMatch = await bcrypt.compare(password, data.password);
        if (!passwordMatch) throw new Error('Invalid email or password');

        localStorage.setItem('secondActUserId', data.id);
        setUser(data);
        await loadMentorAssignments(data.id);
        return data;
    };

    const signup = async (userData) => {
        const { email, password, name, role, originIndustry, targetIndustry, yearsExperience } = userData;

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from('profiles')
            .insert([{
                email,
                password: hashedPassword,
                name,
                role,
                origin_industry: originIndustry,
                target_industry: targetIndustry,
                years_experience: yearsExperience,
            }])
            .select()
            .single();

        if (error) {
            console.error('❌ Signup error:', error);
            throw new Error(error.message);
        }

        console.log('✅ Profile created:', data.id);
        localStorage.setItem('secondActUserId', data.id);
        setUser(data);
        await assignMentors(data.id, originIndustry, targetIndustry, yearsExperience);
    };

    const updateProfile = async (updates) => {
        const { data, error } = await supabase
            .from('profiles')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', user.id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('secondActUserId');
        setUser(null);
        setAiMentors([]);
    };

    return (
        <AppContext.Provider value={{ user, loading, aiMentors, login, signup, logout, updateProfile }}>
            {children}
        </AppContext.Provider>
    );
}
