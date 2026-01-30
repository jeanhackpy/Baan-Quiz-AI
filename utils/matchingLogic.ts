import { Property, QuizAnswers } from '../types';

export const calculateCompatibilityScore = (property: Property, answers: QuizAnswers): number => {
    let score = 0;

    // Property Type Match (High Priority)
    if (answers.propertyType && property.propertyType === answers.propertyType) {
        score += 40;
    }

    // Location Match (Medium Priority)
    if (answers.location && property.location.toLowerCase().includes(answers.location.toLowerCase())) {
        score += 30;
    }

    // Pool Preference Match (Medium Priority)
    if (typeof answers.pool === 'boolean' && property.pool === answers.pool) {
        score += 30;
    }

    return score;
};

export const getMatchedProperties = (properties: Property[], answers: QuizAnswers) => {
    return properties
        .map(p => ({
            ...p,
            compatibilityScore: calculateCompatibilityScore(p, answers),
        }))
        .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
};
