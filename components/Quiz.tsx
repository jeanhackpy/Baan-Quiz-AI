import React, { useState } from 'react';
import { PropertyType, QuizAnswers } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, HomeIcon, LocationMarkerIcon, SparklesIcon as PoolIcon, CheckCircleIcon } from './icons';

interface QuizProps {
  onQuizComplete: (answers: QuizAnswers) => void;
}

const quizSteps = [
  { id: 'propertyType', title: 'Property Type', question: 'What type of property are you primarily interested in?', icon: <HomeIcon className="w-8 h-8 text-sky-400" /> },
  { id: 'location', title: 'Preferred Location', question: 'Select a popular destination, or type your own preference.', icon: <LocationMarkerIcon className="w-8 h-8 text-sky-400" /> },
  { id: 'pool', title: 'Pool Preference', question: 'Is having a pool (private or community) important to you?', icon: <PoolIcon className="w-8 h-8 text-sky-400" /> },
];

const propertyTypeImages: { [key in PropertyType]: string } = {
    [PropertyType.CONDOMINIUM]: 'https://images.unsplash.com/photo-1594495894542-a46cc73e081a?q=80&w=800&auto=format&fit=crop',
    [PropertyType.SINGLE_FAMILY_HOME]: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop',
    [PropertyType.TOWNHOUSE]: 'https://images.unsplash.com/photo-1605276374104-5de67d4619da?q=80&w=800&auto=format&fit=crop',
    [PropertyType.APARTMENT]: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=800&auto=format&fit=crop',
    [PropertyType.VILLA]: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop',
    [PropertyType.DUPLEX]: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=800&auto=format&fit=crop',
    [PropertyType.PENTHOUSE]: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
};

const poolImages = {
    yes: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
    no: 'https://images.unsplash.com/photo-1542359649-31e03cdde435?q=80&w=800&auto=format=fit=crop'
};

const popularLocations = [
  { name: 'Bangkok', image: 'https://images.unsplash.com/photo-1539086915129-883ea5789481?q=80&w=400&auto=format&fit=crop', position: { top: '38%', left: '50%' } },
  { name: 'Phuket', image: 'https://images.unsplash.com/photo-1589588978434-f99496384059?q=80&w=400&auto=format&fit=crop', position: { top: '80%', left: '35%' } },
  { name: 'Chiang Mai', image: 'https://images.unsplash.com/photo-1596348482613-596985a133d1?q=80&w=400&auto=format=fit=crop', position: { top: '15%', left: '48%' } },
  { name: 'Pattaya', image: 'https://images.unsplash.com/photo-1592911319024-e6b8c4331776?q=80&w=400&auto=format=fit=crop', position: { top: '48%', left: '68%' } },
  { name: 'Hua Hin', image: 'https://images.unsplash.com/photo-1628177439343-a6b8e2103322?q=80&w=400&auto=format=fit=crop', position: { top: '55%', left: '52%' } },
];

const ThailandMapSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" className="w-48 h-96 text-slate-700/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-50" aria-hidden="true">
        <path d="M66.4,1.8A162.3,162.3,0,0,0,50,11.5,103.4,103.4,0,0,0,38.5,41.9C28.9,62.8,25.9,81.1,28.6,99.9c2,13.8,7.9,27.1,10.2,40.9a60.7,60.7,0,0,0,3.3,13.2c3.4,10.6,6.3,21.3,12.3,31.2l2.3,3.7c.2.3-1.2.2-1.5.2a14.3,14.3,0,0,1-4.8-.8,10.1,10.1,0,0,1-3.6-2.5c-2.4-2.5-4.7-5-7.3-7.2s-5.4-4-8.4-5.2a21.9,21.9,0,0,0-12.7-1.1c-3.1,1-6,2.8-8.9,4.4s-5.7,3-8.6,4.7c-2.8,1.6-5.7,3.1-8.3,5S-2.4,182.2.1,185.3c2.4,3,5.9,5,9.2,6.4s6.9,2,10.4,2.2c7.6.4,14.9-2.1,21.5-5.9,6.7-3.8,12.5-8.8,18.4-13.7l10.8-9.1c5-4.2,10.1-8.4,15.2-12.5a110.4,110.4,0,0,0,12.7-13.4,94.9,94.9,0,0,0,10.6-15.6,134.1,134.1,0,0,0,9.9-24.1c3.1-10.7,5.2-21.7,4.8-32.8C123.9,49.9,91.2,20.4,66.4,1.8Z" 
        fill="currentColor" stroke="#64748b" strokeWidth="2" strokeLinejoin="round" />
    </svg>
);


const Quiz: React.FC<QuizProps> = ({ onQuizComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  const handleInputChange = (field: keyof QuizAnswers, value: any) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };
  
  const handleLocationSelect = (locationName: string) => {
    handleInputChange('location', locationName);
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

  const renderStepContent = () => {
    const step = quizSteps[currentStep];
    switch (step.id) {
      case 'propertyType':
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {Object.values(PropertyType).map(type => (
              <button
                key={type}
                onClick={() => { handleInputChange('propertyType', type); setTimeout(nextStep, 200);}}
                className={`relative group rounded-lg overflow-hidden border-2 transition-all duration-150
                  ${answers.propertyType === type ? 'border-sky-400 shadow-lg ring-2 ring-sky-400' : 'border-slate-600 hover:border-sky-500/50'}`}
              >
                <img src={propertyTypeImages[type]} alt={type} className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-200" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <span className="absolute bottom-2 left-3 text-white font-semibold text-sm drop-shadow-md">{type}</span>
                {answers.propertyType === type && (
                    <div className="absolute top-2 right-2 bg-sky-500 rounded-full p-1 text-white">
                        <CheckCircleIcon className="w-4 h-4" />
                    </div>
                )}
              </button>
            ))}
          </div>
        );
      case 'location':
        return (
          <div className="space-y-4">
            <div className="relative w-full h-[350px] sm:h-[400px] bg-slate-800/20 rounded-lg overflow-hidden border border-slate-700">
                <ThailandMapSVG />
                <div className="absolute inset-0 z-10">
                    {popularLocations.map((loc) => (
                        <button
                            key={loc.name}
                            onClick={() => handleLocationSelect(loc.name)}
                            className="absolute z-10 group transform -translate-x-1/2 -translate-y-1/2"
                            style={{ top: loc.position.top, left: loc.position.left }}
                            aria-label={`Select ${loc.name}`}
                        >
                            <div className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 transition-all duration-200 ${answers.location === loc.name ? 'border-sky-400 scale-110 ring-2 ring-sky-400/50' : 'border-slate-500'} bg-slate-900 shadow-lg group-hover:scale-110 group-hover:border-sky-500`}>
                                <img src={loc.image} alt={loc.name} className="w-full h-full object-cover rounded-full opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-full"></div>
                                {answers.location === loc.name && (
                                    <div className="absolute -top-1 -right-1 bg-sky-500 rounded-full p-1 text-white shadow-md">
                                        <CheckCircleIcon className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                            <span className={`mt-2 block w-full text-center text-xs sm:text-sm font-semibold transition-colors duration-200 ${answers.location === loc.name ? 'text-sky-300' : 'text-slate-400 group-hover:text-sky-400'}`}>{loc.name}</span>
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="relative">
                 <LocationMarkerIcon className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2"/>
                <input
                    type="text"
                    value={answers.location || ''}
                    onChange={e => handleInputChange('location', e.target.value)}
                    placeholder="Or type another location..."
                    className="w-full p-3 pl-10 bg-slate-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none placeholder-slate-400 text-base"
                />
            </div>
        </div>
        );
      case 'pool':
        return (
          <div className="flex flex-col sm:flex-row gap-4">
             <button
              onClick={() => {handleInputChange('pool', true); setTimeout(nextStep, 200);}}
              className={`relative flex-1 group rounded-lg overflow-hidden border-2 transition-all duration-150 h-40
                ${answers.pool === true ? 'border-sky-400 shadow-lg ring-2 ring-sky-400' : 'border-slate-600 hover:border-sky-500/50'}`}
            >
                <img src={poolImages.yes} alt="Property with a pool" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <span className="absolute bottom-3 left-3 text-white font-bold text-lg drop-shadow-md">Yes, a pool is important</span>
                 {answers.pool === true && (
                    <div className="absolute top-2 right-2 bg-sky-500 rounded-full p-1.5 text-white">
                        <CheckCircleIcon className="w-5 h-5" />
                    </div>
                )}
            </button>
            <button
              onClick={() => {handleInputChange('pool', false); setTimeout(nextStep, 200);}}
              className={`relative flex-1 group rounded-lg overflow-hidden border-2 transition-all duration-150 h-40
                ${answers.pool === false ? 'border-sky-400 shadow-lg ring-2 ring-sky-400' : 'border-slate-600 hover:border-sky-500/50'}`}
            >
                <img src={poolImages.no} alt="Property with a garden" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <span className="absolute bottom-3 left-3 text-white font-bold text-lg drop-shadow-md">No, not essential</span>
                 {answers.pool === false && (
                    <div className="absolute top-2 right-2 bg-sky-500 rounded-full p-1.5 text-white">
                        <CheckCircleIcon className="w-5 h-5" />
                    </div>
                )}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const currentQuizStep = quizSteps[currentStep];

  return (
    <div className="w-full max-w-2xl p-6 sm:p-8 bg-slate-800 shadow-2xl rounded-xl border border-slate-700">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3 text-sky-400">
          {currentQuizStep.icon}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">{currentQuizStep.title}</h2>
        <p className="text-slate-400 mt-1 text-sm sm:text-base">{currentQuizStep.question}</p>
        <div className="w-full bg-slate-700 rounded-full h-2.5 mt-4 overflow-hidden">
          <div
            className="bg-sky-500 h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / quizSteps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="my-8 flex items-center justify-center">
        <div className="w-full">
            {renderStepContent()}
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 flex items-center"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          Back
        </button>
        {currentQuizStep.id === 'location' && (
           <button
            onClick={nextStep}
            disabled={!answers.location}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-colors duration-150 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === quizSteps.length - 1 ? 'View Matches' : 'Next'}
            <ChevronRightIcon className="w-5 h-5 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;