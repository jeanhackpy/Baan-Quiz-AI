import { useState, useCallback } from 'react';
import { Property, QuizAnswers } from '../types';
import { sampleProperties } from '../data/sampleProperties';
import { getMatchedProperties } from '../utils/matchingLogic';

export const usePropertyMatches = () => {
  const [matchedProperties, setMatchedProperties] = useState<Array<Property & { compatibilityScore: number }>>([]);

  const calculateAndSetMatches = useCallback((answers: QuizAnswers) => {
    const scoredProperties = getMatchedProperties(sampleProperties, answers);
    setMatchedProperties(scoredProperties);
  }, []);

  return {
    matchedProperties,
    calculateAndSetMatches,
    setMatchedProperties
  };
};
