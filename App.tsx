import React, { useState, useEffect } from 'react';
import { AppLogoIcon } from './components/icons';
import Quiz from './components/Quiz';
import QuizResults from './components/QuizResults';
import Dashboard from './components/Dashboard';
import { QuizAnswers } from './types';
import { usePropertyMatches } from './hooks/usePropertyMatches';

type AppView = 'landing' | 'quiz' | 'quizResults' | 'dashboard';

const App: React.FC = () => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    console.warn(
      "VITE_GEMINI_API_KEY environment variable is not set. Gemini API calls will likely fail. " +
      "Please ensure it's configured in your environment (e.g., .env file and build setup)."
    );
  }

  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { matchedProperties, calculateAndSetMatches, setMatchedProperties } = usePropertyMatches();

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedQuizAnswers = localStorage.getItem('quizAnswers');
    if (storedEmail && storedQuizAnswers) {
      setUserEmail(storedEmail);
      const parsedAnswers = JSON.parse(storedQuizAnswers);
      setQuizAnswers(parsedAnswers);
      // Recalculate matches if returning to the app and already "logged in"
      calculateAndSetMatches(parsedAnswers);
      setCurrentView('dashboard');
    }
  }, [calculateAndSetMatches]);


  const handleQuizComplete = (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    calculateAndSetMatches(answers);
    setCurrentView('quizResults');
  };

  const handleEmailSubmit = (email: string) => {
    setUserEmail(email);
    localStorage.setItem('userEmail', email);
    if (quizAnswers) {
      localStorage.setItem('quizAnswers', JSON.stringify(quizAnswers));
    }
    setCurrentView('dashboard');
  };

  const handleRetakeQuiz = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('quizAnswers');
    setUserEmail(null);
    setQuizAnswers(null);
    setMatchedProperties([]);
    setCurrentView('quiz');
  };
  
  const renderView = () => {
    switch (currentView) {
      case 'quiz':
        return <Quiz onQuizComplete={handleQuizComplete} />;
      case 'quizResults':
        if (!quizAnswers) return <p className="text-white">Something went wrong. Please retake the quiz.</p>;
        return (
          <QuizResults
            properties={matchedProperties}
            onEmailSubmit={handleEmailSubmit}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            userEmail={userEmail}
            properties={matchedProperties}
            quizAnswers={quizAnswers}
            onRetakeQuiz={handleRetakeQuiz}
          />
        );
      case 'landing':
      default:
        return (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <AppLogoIcon className="w-16 h-16 text-sky-400" />
              <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-400">
                Properly
              </h1>
            </div>
            <p className="text-2xl text-slate-300 mb-8">
              Find Your Perfect Thai Property Match.
            </p>
            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
              Answer a few simple questions in our Home Match Quiz, and we'll connect you with Thai properties tailored to your preferences.
            </p>
            <button
              onClick={() => setCurrentView('quiz')}
              className="px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg text-lg shadow-lg hover:shadow-sky-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Start the Home Match Quiz
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800 text-gray-100">
      {currentView !== 'landing' && (
         <header className="w-full max-w-5xl mx-auto mb-8 text-center sticky top-0 py-4 z-10 bg-slate-900/80 backdrop-blur-sm rounded-b-xl">
          <div className="flex items-center justify-center space-x-3">
            <AppLogoIcon className="w-10 h-10 text-sky-400" />
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-400">
              Properly: Thai Property Guide
            </h1>
          </div>
        </header>
      )}
      <main className={`w-full ${currentView !== 'landing' ? 'max-w-5xl' : ''} flex-grow flex flex-col justify-center items-center`}>
        {renderView()}
      </main>
      {currentView !== 'landing' && (
        <footer className="mt-8 text-center text-slate-500 text-sm w-full max-w-5xl mx-auto">
          <p>&copy; {new Date().getFullYear()} Properly - Thai Real Estate Guidance. Powered by Gemini.</p>
          <p className="mt-1">Property data is simulated for demonstration purposes.</p>
        </footer>
      )}
    </div>
  );
};

export default App;
