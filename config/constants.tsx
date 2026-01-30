import React from 'react';
import { PropertyType } from '../types';
import { HomeIcon, LocationMarkerIcon, SparklesIcon as PoolIcon } from '../components/icons';

export const quizSteps = [
  { id: 'propertyType', title: 'Property Type', question: 'What type of property are you primarily interested in?', icon: <HomeIcon className="w-8 h-8 text-sky-400" /> },
  { id: 'location', title: 'Preferred Location', question: 'Select a popular destination, or type your own preference.', icon: <LocationMarkerIcon className="w-8 h-8 text-sky-400" /> },
  { id: 'pool', title: 'Pool Preference', question: 'Is having a pool (private or community) important to you?', icon: <PoolIcon className="w-8 h-8 text-sky-400" /> },
];

export const propertyTypeImages: { [key in PropertyType]: string } = {
    [PropertyType.CONDOMINIUM]: 'https://images.unsplash.com/photo-1594495894542-a46cc73e081a?q=80&w=800&auto=format&fit=crop',
    [PropertyType.SINGLE_FAMILY_HOME]: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop',
    [PropertyType.TOWNHOUSE]: 'https://images.unsplash.com/photo-1605276374104-5de67d4619da?q=80&w=800&auto=format&fit=crop',
    [PropertyType.APARTMENT]: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=800&auto=format&fit=crop',
    [PropertyType.VILLA]: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop',
    [PropertyType.DUPLEX]: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=800&auto=format&fit=crop',
    [PropertyType.PENTHOUSE]: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
};

export const poolImages = {
    yes: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
    no: 'https://images.unsplash.com/photo-1542359649-31e03cdde435?q=80&w=800&auto=format&fit=crop'
};

export const popularLocations = [
  { name: 'Bangkok', image: 'https://images.unsplash.com/photo-1539086915129-883ea5789481?q=80&w=400&auto=format&fit=crop', position: { top: '38%', left: '50%' } },
  { name: 'Phuket', image: 'https://images.unsplash.com/photo-1589588978434-f99496384059?q=80&w=400&auto=format&fit=crop', position: { top: '80%', left: '35%' } },
  { name: 'Chiang Mai', image: 'https://images.unsplash.com/photo-1596348482613-596985a133d1?q=80&w=400&auto=format&fit=crop', position: { top: '15%', left: '48%' } },
  { name: 'Pattaya', image: 'https://images.unsplash.com/photo-1592911319024-e6b8c4331776?q=80&w=400&auto=format&fit=crop', position: { top: '48%', left: '68%' } },
  { name: 'Hua Hin', image: 'https://images.unsplash.com/photo-1628177439343-a6b8e2103322?q=80&w=400&auto=format&fit=crop', position: { top: '55%', left: '52%' } },
];
