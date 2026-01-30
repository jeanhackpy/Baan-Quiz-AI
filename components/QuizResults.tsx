import React from 'react';
import { Property } from '../types';
import PropertyCard from './PropertyCard';
import EmailForm from './EmailForm';
import { StarIcon } from './icons';

interface QuizResultsProps {
  properties: Array<Property & { compatibilityScore: number }>;
  onEmailSubmit: (email: string) => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({ properties, onEmailSubmit }) => {
  const topMatches = properties.filter(p => p.compatibilityScore > 0).slice(0, 5); // Show top 5 matches or those with score > 0

  return (
    <div className="w-full max-w-4xl p-6">
      <div className="text-center mb-8">
        <StarIcon className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
        <h2 className="text-3xl font-bold text-gray-100">Your Property Matches!</h2>
        <p className="text-slate-400 mt-2">Based on your quiz answers, here are some properties in Thailand you might like.</p>
      </div>

      {topMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {topMatches.map(prop => (
            <PropertyCard key={prop.id} property={prop} variant="full" />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-slate-800 rounded-lg shadow-lg border border-slate-700">
          <h3 className="text-xl font-semibold text-gray-200">No exact matches found right now.</h3>
          <p className="text-slate-400 mt-2">Try adjusting your quiz preferences or explore all properties.</p>
           <p className="text-slate-500 mt-1 text-sm">(Remember, this is demo data!)</p>
        </div>
      )}
      
      <div className="mt-10 p-6 bg-slate-800 shadow-xl rounded-xl border border-slate-700 text-center">
        <h3 className="text-2xl font-semibold text-sky-300 mb-3">Ready to Save Your Preferences?</h3>
        <p className="text-slate-300 mb-6 max-w-lg mx-auto">
          Enter your email to create your personalized 'Properly Dashboard'. We'll "send" you a (simulated) magic link to access it anytime and keep track of your matches.
        </p>
        <EmailForm onSubmit={onEmailSubmit} buttonText="Save & View My Dashboard" />
         <p className="text-xs text-slate-500 mt-4">(This is a simulation for demo purposes. No email will actually be sent.)</p>
      </div>
    </div>
  );
};

export default QuizResults;