const MINIMAX_API_KEY = import.meta.env.VITE_MINIMAX_API_KEY;
const MINIMAX_API_BASE = import.meta.env.VITE_MINIMAX_API_BASE || "https://api.minimax.io/v1";
const MINIMAX_MODEL = import.meta.env.VITE_MINIMAX_MODEL || "MiniMax-M2.5";
const MINIMAX_API_URL = `${MINIMAX_API_BASE}/text/chatcompletion_v2`;

// ── Diverse name pool ──────────────────────────────────────────
const FIRST_NAMES = [
    'Amara', 'Babajide', 'Chloe', 'Diego', 'Elena', 'Femi', 'Gabrielle', 'Haruto',
    'Ingrid', 'Jasmine', 'Kofi', 'Leila', 'Marcus', 'Nadia', 'Oluwaseun', 'Priya',
    'Quinton', 'Rania', 'Santiago', 'Taraji', 'Usman', 'Valentina', 'Wei', 'Xochitl',
    'Yusuf', 'Zara', 'Adaeze', 'Brendan', 'Chioma', 'Dmitri', 'Esme', 'Fatou',
    'Giovanna', 'Hamid', 'Imani', 'Javier', 'Keiko', 'Lena', 'Mireille', 'Ngozi',
    'Oscar', 'Pita', 'Rahim', 'Saoirse', 'Thierry', 'Ursula', 'Veronica', 'Wanjiku',
    'Ximena', 'Yemi', 'Ziad', 'Aliya', 'Bryce', 'Chiamaka', 'Daisuke', 'Elif',
    'Florencia', 'Gideon', 'Hana', 'Ivan', 'Jolene', 'Kwame', 'Linh', 'Makena',
    'Niall', 'Odessa', 'Pascal', 'Quynh', 'Reuben', 'Soraya', 'Tobias', 'Uma',
    'Victor', 'Wren', 'Yara', 'Zephyr', 'Aisha', 'Ben', 'Camille', 'Deshi',
    'Emeka', 'Frida', 'Gael', 'Hiromi', 'Ife', 'Jules', 'Kira', 'Luca',
    'Mikael', 'Nneka', 'Orion', 'Phoebe', 'Rashida', 'Sienna', 'Tanner', 'Ulrika',
];

const LAST_NAMES = [
    'Adeyemi', 'Baker', 'Chen', 'Diallo', 'Eriksson', 'Ferreira', 'García', 'Hassan',
    'Ihejirika', 'Johansson', 'Kim', 'Leblanc', 'Martinez', 'Nakamura', 'Okafor', 'Patel',
    'Quinn', 'Rivera', 'Santos', 'Tanaka', 'Uche', 'Vargas', 'Wang', 'Xavier',
    'Yamamoto', 'Zuberi', 'Achebe', 'Bergström', 'Cardoso', 'Dlamini', 'Ekwueme',
    'Fontaine', 'Guerrero', 'Haddad', 'Ito', 'Joubert', 'Kowalski', 'Lombardi',
    'Mensah', 'Nwosu', 'Oliveira', 'Petrov', 'Ramirez', 'Svensson', 'Tremblay',
    'Uwamahoro', 'Velez', 'Williams', 'Xu', 'Yilmaz', 'Zhang', 'Abbot', 'Byrne',
    'Castillo', 'Delacroix', 'Edwards', 'Fischer', 'Grant', 'Hughes', 'Ibrahim',
];

function pickRandomNames(count) {
    const shuffledFirst = [...FIRST_NAMES].sort(() => Math.random() - 0.5);
    const shuffledLast = [...LAST_NAMES].sort(() => Math.random() - 0.5);
    return Array.from({ length: count }, (_, i) => ({
        firstName: shuffledFirst[i],
        lastName: shuffledLast[i],
    }));
}
// ──────────────────────────────────────────────────────────────

export const generateAIMentors = async (originIndustry, targetIndustry, yearsExperience) => {
    if (!MINIMAX_API_KEY || MINIMAX_API_KEY === 'YOUR_MINIMAX_API_KEY_HERE') {
        console.warn("Minimax API Key missing.");
        return [];
    }

    const names = pickRandomNames(3);
    const nameList = names.map((n, i) => `Mentor ${i + 1}: ${n.firstName} ${n.lastName}`).join(', ');

    const systemPrompt = `You are a career transition matching API. 
Generate exactly 3 distinct professional mentor personas who successfully transitioned from ${originIndustry} to ${targetIndustry}. They should have around ${yearsExperience} of professional experience. 
Return the data as a raw JSON array of objects. Do not include markdown formatting or backticks (no \`\`\`json). Just the array.
You MUST use these exact names (in order): ${nameList}.
Each object must have: 
- "id": a unique string (e.g., "mentor_1", "mentor_2")
- "firstName": string (use the name provided above)
- "lastName": string (use the name provided above)
- "jobTitle": string
- "company": string
- "bio": A short 2-sentence bio from their perspective about their pivot.
- "avatar": A single letter string (their first initial).`;

    try {
        const response = await fetch(MINIMAX_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MINIMAX_API_KEY}`
            },
            body: JSON.stringify({
                model: MINIMAX_MODEL,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Please generate the 3 mentors for someone pivoting from ${originIndustry} to ${targetIndustry}. Use names: ${nameList}.` }
                ]
            })
        });

        const data = await response.json();
        let content = data?.choices?.[0]?.message?.content;

        if (content) {
            content = content.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(content);
            // Guarantee names are correct even if the model ignores instructions
            return parsed.map((mentor, i) => ({
                ...mentor,
                firstName: names[i]?.firstName || mentor.firstName,
                lastName: names[i]?.lastName || mentor.lastName,
                avatar: names[i]?.firstName?.charAt(0) || mentor.avatar,
            }));
        }
    } catch (e) {
        console.error("Failed to generate mentors:", e);
    }
    return [];
};

export const generateCareerGuide = async (originIndustry, targetIndustry, yearsExperience) => {
    if (!MINIMAX_API_KEY || MINIMAX_API_KEY === 'YOUR_MINIMAX_API_KEY_HERE') {
        return null;
    }

    const prompt = `You are an expert career coach specialising in mid-career transitions.

Write a personalised, practical career guide for someone with ${yearsExperience} of experience in ${originIndustry} who wants to transition into ${targetIndustry}.

Structure the guide with these exact sections using markdown:
## Why Your ${originIndustry} Background Is an Asset
(2–3 paragraphs on transferable skills and mindset advantages)

## The 90-Day Transition Roadmap
(A numbered list of concrete monthly milestones)

## Skills to Build
(Bulleted list of the top 5–7 skills to develop, with a suggested resource type for each)

## Common Interview Questions — and How to Answer Them
(3 interview questions with brief answer frameworks)

## Your First 3 Steps Starting Today
(3 immediate, actionable steps)

Keep the tone warm, direct, and encouraging. Write 600–800 words total. Do not mention that you are an AI.`;

    try {
        const response = await fetch(MINIMAX_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MINIMAX_API_KEY}`
            },
            body: JSON.stringify({
                model: MINIMAX_MODEL,
                messages: [
                    { role: 'system', content: 'You are an expert career coach. Write professional, warm, and actionable career advice.' },
                    { role: 'user', content: prompt }
                ]
            })
        });
        const data = await response.json();
        return data?.choices?.[0]?.message?.content || null;
    } catch (e) {
        console.error('Failed to generate career guide:', e);
        return null;
    }
};

export const chatWithAIMentor = async (mentorProfile, menteeProfile, chatHistory) => {
    if (!MINIMAX_API_KEY || MINIMAX_API_KEY === 'YOUR_MINIMAX_API_KEY_HERE') {
        return "Minimax API Key is not configured correctly.";
    }

    const systemPrompt = `You are ${mentorProfile.firstName} ${mentorProfile.lastName}, a ${mentorProfile.jobTitle} at ${mentorProfile.company}. You successfully pivoted from ${menteeProfile.originIndustry} to ${menteeProfile.targetIndustry}. You are talking to a mentee making the same pivot. Speak eagerly, professionally, and draw on your simulated experience to give them actionable advice. Keep responses concise and human-like.`;

    const messages = [
        { role: "system", content: systemPrompt }
    ];

    // map chat history to minimax roles ("user" and "assistant")
    for (const msg of chatHistory) {
        messages.push({
            role: msg.sender === 'me' ? 'user' : 'assistant',
            content: msg.text
        });
    }

    try {
        const response = await fetch(MINIMAX_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MINIMAX_API_KEY}`
            },
            body: JSON.stringify({
                model: MINIMAX_MODEL,
                messages: messages
            })
        });

        const data = await response.json();
        return data?.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that.";
    } catch (e) {
        console.error("API Error:", e);
        return "Network error connecting to AI.";
    }
};
