import React from 'react';
import { Property } from '../types';
import { LocationMarkerIcon, CurrencyEuroIcon, HomeIcon, BathroomIcon, ArrowsExpandIcon, CalendarIcon, OfficeBuildingIcon, LightningBoltIcon, SparklesIcon as AmenitiesIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon, StarIcon } from './icons'; // Added StarIcon

interface PropertyCardProps {
  property: Property & { compatibilityScore?: number }; // Added compatibilityScore
  variant?: 'full' | 'compact';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, variant = 'full' }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
  };

  if (variant === 'compact') {
    return (
       <div className="bg-slate-600/50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-150 border border-slate-500/50 relative">
        {typeof property.compatibilityScore === 'number' && (
          <div className="absolute top-2 right-2 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <StarIcon className="w-3 h-3 mr-1" /> {property.compatibilityScore}% Match
          </div>
        )}
        <div className="flex items-center space-x-3">
          <img src={property.imageUrl} alt={property.propertyType} className="w-16 h-16 object-cover rounded flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-sky-300 truncate pr-16">{property.location} - {property.propertyType}</h3>
            <p className="text-xs text-gray-300">{formatPrice(property.price)}</p>
            <p className="text-xs text-gray-400">{property.numberOfRooms} rooms, {property.houseSize} m²</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-700/50 backdrop-blur-md p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-600/70 relative">
      {typeof property.compatibilityScore === 'number' && (
        <div className="absolute top-3 right-3 bg-teal-500 text-white text-sm font-bold px-3 py-1.5 rounded-full flex items-center shadow-lg">
          <StarIcon className="w-4 h-4 mr-1.5" /> {property.compatibilityScore}% Match
        </div>
      )}
      <img
        src={property.imageUrl}
        alt={`View of ${property.propertyType} in ${property.location}`}
        className="w-full h-48 object-cover rounded-lg mb-4 shadow-md"
      />
      <h3 className="text-xl font-bold text-sky-300 mb-1">{property.propertyType} in {property.location}</h3>
      <p className="text-2xl font-semibold text-teal-300 mb-3">{formatPrice(property.price)}</p>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-300 mb-4">
        <DetailItem icon={<HomeIcon />} label="Rooms" value={`${property.numberOfRooms}`} />
        <DetailItem icon={<BathroomIcon />} label="Bathrooms" value={`${property.numberOfBathrooms}`} />
        <DetailItem icon={<ArrowsExpandIcon />} label="Size" value={`${property.houseSize} m²`} />
        <DetailItem icon={<CalendarIcon />} label="Year Built" value={`${property.yearBuilt}`} />
        <DetailItem icon={<OfficeBuildingIcon />} label="Type" value={property.propertyType} />
        <DetailItem icon={<LightningBoltIcon />} label="Energy Cert." value={property.energyCertificate} />
      </div>

      <div className="mb-4">
        <h4 className="text-md font-semibold text-slate-200 mb-1 flex items-center"><AmenitiesIcon className="w-5 h-5 mr-2 text-yellow-400" />Amenities</h4>
        <div className="flex flex-wrap gap-2 text-xs">
          {property.amenities.map(amenity => (
            <span key={amenity} className="bg-slate-600 px-2 py-1 rounded-full text-slate-300">{amenity}</span>
          ))}
          <span className={`flex items-center px-2 py-1 rounded-full ${property.pool ? 'bg-blue-500/30 text-blue-300' : 'bg-red-500/20 text-red-300'}`}>
            {property.pool ? <CheckCircleIcon className="w-4 h-4 mr-1" /> : <XCircleIcon className="w-4 h-4 mr-1" />} Pool
          </span>
          <span className={`flex items-center px-2 py-1 rounded-full ${property.lift ? 'bg-green-500/30 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
            {property.lift ? <CheckCircleIcon className="w-4 h-4 mr-1" /> : <XCircleIcon className="w-4 h-4 mr-1" />} Lift
          </span>
        </div>
      </div>
      
      <div>
        <h4 className="text-md font-semibold text-slate-200 mb-1 flex items-center"><InformationCircleIcon className="w-5 h-5 mr-2 text-indigo-400"/>Description</h4>
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-200">
          {property.detailedDescription}
        </p>
      </div>
    </div>
  );
};

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}
const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-2">
    <span className="text-sky-400 w-5 h-5 flex-shrink-0">{icon}</span>
    <span className="text-slate-400">{label}:</span>
    <span className="font-medium text-slate-200">{value}</span>
  </div>
);

export default PropertyCard;