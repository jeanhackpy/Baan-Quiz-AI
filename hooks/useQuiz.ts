import { useState } from 'react';
import { QuizAnswers, PropertyType } from '../types';
import { quizSteps } from '../config/constants';

type QuizValue = PropertyType | string | boolean;

export const useQuiz = (onQuizComplete: (answers: QuizAnswers) => void) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  const handleInputChange = (field: keyof QuizAnswers, value: QuizValue) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onQuizComplete(answers);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentQuizStep = quizSteps[currentStep];
  const isLastStep = currentStep === quizSteps.length - 1;

  return {
    currentStep,
    answers,
    handleInputChange,
    nextStep,
    prevStep,
    currentQuizStep,
    isLastStep
  };
};
