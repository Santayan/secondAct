export function calculateMatchScore(mentee, mentor) {
    let score = 0;
    const maxScore = 100;

    // Exact target industry match
    if (mentor.targetIndustry.toLowerCase() === mentee.targetIndustry.toLowerCase()) {
        score += 50;
    } else if (mentor.targetIndustry.toLowerCase().includes(mentee.targetIndustry.toLowerCase()) ||
        mentee.targetIndustry.toLowerCase().includes(mentor.targetIndustry.toLowerCase())) {
        score += 30; // Partial match
    }

    // Exact origin industry match
    if (mentor.originIndustry.toLowerCase() === mentee.originIndustry.toLowerCase()) {
        score += 35;
    } else if (mentor.originIndustry.toLowerCase().includes(mentee.originIndustry.toLowerCase()) ||
        mentee.originIndustry.toLowerCase().includes(mentor.originIndustry.toLowerCase())) {
        score += 15; // Partial match
    }

    // Experience level alignment (e.g. mentor should ideally have slightly more or similar years of experience)
    // For simplicity, if they both have 10+ years, add 15 points
    if (mentee.yearsExperience && mentor.yearsExperience) {
        if (mentee.yearsExperience === mentor.yearsExperience) {
            score += 15;
        } else {
            score += 5;
        }
    } else {
        // If one is missing, just give a baseline
        score += 10;
    }

    return Math.min(score, maxScore);
}

export function getRecommendedMentors(mentee, allMentors) {
    const scoredMentors = allMentors.map(mentor => {
        return {
            ...mentor,
            matchedPercentage: calculateMatchScore(mentee, mentor)
        };
    });

    // Sort by highest match score first, and exclude any under 30% (irrelevant matches)
    return scoredMentors
        .filter(m => m.matchedPercentage >= 30)
        .sort((a, b) => b.matchedPercentage - a.matchedPercentage)
        .slice(0, 10); // Return top 10
}
