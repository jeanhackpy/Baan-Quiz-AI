import { describe, it, expect } from 'vitest';
import { calculateCompatibilityScore, getMatchedProperties } from '../utils/matchingLogic';
import { Property, PropertyType, QuizAnswers } from '../types';

const mockProperty: Property = {
    id: '1',
    location: 'Bangkok, Thailand',
    price: 100000,
    numberOfRooms: 2,
    numberOfBathrooms: 1,
    houseSize: 50,
    pool: true,
    lift: true,
    yearBuilt: 2020,
    propertyType: PropertyType.CONDOMINIUM,
    energyCertificate: 'A',
    amenities: [],
    detailedDescription: 'Test',
    imageUrl: 'test.jpg'
};

describe('Matching Logic', () => {
    it('should calculate perfect score (100) for exact matches', () => {
        const answers: QuizAnswers = {
            propertyType: PropertyType.CONDOMINIUM,
            location: 'Bangkok',
            pool: true
        };
        const score = calculateCompatibilityScore(mockProperty, answers);
        expect(score).toBe(100);
    });

    it('should calculate partial score correctly', () => {
        const answers: QuizAnswers = {
            propertyType: PropertyType.CONDOMINIUM,
            location: 'Phuket', // No match
            pool: true
        };
        const score = calculateCompatibilityScore(mockProperty, answers);
        expect(score).toBe(70); // 40 (type) + 0 (loc) + 30 (pool)
    });

    it('should handle missing fields in quiz answers', () => {
        const answers: QuizAnswers = {
            propertyType: PropertyType.CONDOMINIUM
        };
        const score = calculateCompatibilityScore(mockProperty, answers);
        expect(score).toBe(40);
    });

    it('should sort properties by score descending', () => {
       const properties = [
           { ...mockProperty, id: 'low', pool: false }, // score 70 with pool:true
           { ...mockProperty, id: 'high' } // score 100 with pool:true
       ];
       const answers: QuizAnswers = {
            propertyType: PropertyType.CONDOMINIUM,
            location: 'Bangkok',
            pool: true
       };
       const matched = getMatchedProperties(properties, answers);
       expect(matched[0].id).toBe('high');
       expect(matched[0].compatibilityScore).toBe(100);
       expect(matched[1].id).toBe('low');
       expect(matched[1].compatibilityScore).toBe(70);
    });
});
