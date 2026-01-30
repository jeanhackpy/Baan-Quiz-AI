
import React from 'react';
import { Property, QuizAnswers } from '../types';
import PropertyCard from './PropertyCard';
import ChatInterface from './ChatInterface';
import { RefreshIcon, SparklesIcon, HomeIcon, LocationMarkerIcon } from './icons';

interface DashboardProps {
  userEmail: string | null;
  properties: Array<Property & { compatibilityScore: number }>;
  quizAnswers: QuizAnswers | null;
  onRetakeQuiz: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userEmail, properties, quizAnswers, onRetakeQuiz }) => {
  const userId = userEmail; // Use email as a simple userId for this simulation
  
  return (
    <div className="w-full max-w-7xl p-4 sm:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- Dashboard Preferences Header --- */}
        <div className="lg:col-span-3 p-4 bg-slate-800/70 backdrop-blur-sm shadow-lg rounded-xl border border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-x-4 md:gap-x-6 w-full overflow-x-auto pb-2 sm:pb-0">
              <span className="text-md font-semibold text-gray-200 hidden lg:block flex-shrink-0">Your Preferences:</span>
              {quizAnswers ? (
                  <div className="flex flex-nowrap items-center gap-x-4 md:gap-x-5 text-sm">
                  {quizAnswers.propertyType && (
                      <div className="flex items-center text-slate-300 flex-shrink-0 bg-slate-700/50 px-3 py-1.5 rounded-lg">
                      <HomeIcon className="w-5 h-5 mr-2 text-sky-400" />
                      <span>{quizAnswers.propertyType}</span>
                      </div>
                  )}
                  {quizAnswers.location && (
                      <div className="flex items-center text-slate-300 flex-shrink-0 bg-slate-700/50 px-3 py-1.5 rounded-lg">
                      <LocationMarkerIcon className="w-5 h-5 mr-2 text-sky-400" />
                      <span>{quizAnswers.location}</span>
                      </div>
                  )}
                  {typeof quizAnswers.pool === 'boolean' && (
                      <div className="flex items-center text-slate-300 flex-shrink-0 bg-slate-700/50 px-3 py-1.5 rounded-lg">
                      <SparklesIcon className="w-5 h-5 mr-2 text-sky-400" />
                      <span>Pool: {quizAnswers.pool ? 'Yes' : 'No'}</span>
                      </div>
                  )}
                  </div>
              ) : (
                  <p className="text-slate-400">No preferences set. Take the quiz!</p>
              )}
          </div>
          <button
            onClick={onRetakeQuiz}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-lg transition-colors duration-150 flex items-center text-sm flex-shrink-0 w-full sm:w-auto justify-center"
          >
              <RefreshIcon className="w-4 h-4 mr-2" />
              Change Preferences
          </button>
        </div>

        {/* Property Matches Section */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center text-xl font-semibold text-sky-300">
                <HomeIcon className="w-6 h-6 mr-2"/>
                Your Matched Properties
            </div>
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.filter(p => p.compatibilityScore > 0).map(prop => (
                <PropertyCard key={prop.id} property={prop} variant="full" />
              ))}
              {properties.filter(p => p.compatibilityScore > 0).length === 0 && (
                 <div className="md:col-span-2 text-center py-10 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
                    <h3 className="text-xl font-semibold text-gray-200">No specific matches based on your current criteria.</h3>
                    <p className="text-slate-400 mt-2">Consider changing your preferences, or ask Properly AI for ideas!</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
              <h3 className="text-xl font-semibold text-gray-200">No properties to display.</h3>
              <p className="text-slate-400 mt-2">Please complete the quiz to see your matches.</p>
            </div>
          )}
        </div>

        {/* AI Chat Assistant Section */}
        <div className="lg:col-span-1">
             <div className="sticky top-24"> {/* Make chat sticky on larger screens */}
                <div className="flex items-center mb-3 text-xl font-semibold text-sky-300">
                    <SparklesIcon className="w-6 h-6 mr-2"/>
                    Properly AI Assistant
                </div>
                <div className="h-[550px] sm:h-[600px]"> {/* Fixed height for chat */}
                 <ChatInterface 
                    userId={userId} 
                    quizAnswers={quizAnswers} 
                    propertiesForContext={properties} 
                  />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
