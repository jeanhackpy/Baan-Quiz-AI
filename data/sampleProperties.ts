
import { Property, PropertyType } from '../types';

export const sampleProperties: Property[] = [
  {
    id: 'prop1',
    location: 'Bangkok, Thailand',
    price: 150000, // Approx 5.5M THB
    numberOfRooms: 2,
    numberOfBathrooms: 1,
    houseSize: 60, // m²
    pool: true, // Community pool
    lift: true,
    yearBuilt: 2018,
    propertyType: PropertyType.CONDOMINIUM,
    energyCertificate: 'B',
    amenities: ['near BTS/MRT', 'city view', 'gym access', 'community pool'],
    detailedDescription: 'Modern 2-room condominium in a prime Bangkok location with excellent transport links via BTS/MRT. Features city views, access to a community pool and gym. Ideal for urban professionals or investors.',
    imageUrl: 'https://picsum.photos/seed/bangkokcondo/600/400',
  },
  {
    id: 'prop2',
    location: 'Phuket, Thailand',
    price: 450000, // Approx 16.5M THB
    numberOfRooms: 3,
    numberOfBathrooms: 3,
    houseSize: 250, // m²
    pool: true, // Private pool
    lift: false,
    yearBuilt: 2020,
    propertyType: PropertyType.VILLA,
    energyCertificate: 'A',
    amenities: ['private pool', 'sea view', 'garden', 'close to beach', 'sala'],
    detailedDescription: 'Luxurious 3-bedroom villa in Phuket offering breathtaking sea views and a private pool. Features a spacious garden and a traditional Thai sala, perfect for relaxation. Close to popular beaches.',
    imageUrl: 'https://picsum.photos/seed/phuketvilla/600/400',
  },
  {
    id: 'prop3',
    location: 'Chiang Mai, Thailand',
    price: 250000, // Approx 9M THB
    numberOfRooms: 4,
    numberOfBathrooms: 2,
    houseSize: 180, // m²
    pool: false,
    lift: false,
    yearBuilt: 2015,
    propertyType: PropertyType.SINGLE_FAMILY_HOME,
    energyCertificate: 'B',
    amenities: ['mountain view', 'quiet area', 'large garden', 'traditional Thai style elements'],
    detailedDescription: 'Charming 4-bedroom single-family home in a tranquil area of Chiang Mai, boasting beautiful mountain views. Features a large garden and incorporates traditional Thai architectural elements.',
    imageUrl: 'https://picsum.photos/seed/chiangmaihouse/600/400',
  },
  {
    id: 'prop4',
    location: 'Pattaya, Thailand',
    price: 200000, // Approx 7.3M THB
    numberOfRooms: 2,
    numberOfBathrooms: 2,
    houseSize: 85, // m²
    pool: true, // Community pool
    lift: true,
    yearBuilt: 2019,
    propertyType: PropertyType.CONDOMINIUM,
    energyCertificate: 'A',
    amenities: ['beachfront', 'high floor', 'gym', '24hr security', 'balcony'],
    detailedDescription: 'Modern high-floor condominium in Pattaya with direct beachfront access and stunning sea views from the balcony. Offers excellent facilities including a gym, pool, and 24-hour security.',
    imageUrl: 'https://picsum.photos/seed/pattayacondo/600/400',
  },
  {
    id: 'prop5',
    location: 'Hua Hin, Thailand',
    price: 180000, // Approx 6.6M THB
    numberOfRooms: 3,
    numberOfBathrooms: 2,
    houseSize: 150, // m²
    pool: true, // Community Pool
    lift: false,
    yearBuilt: 2017,
    propertyType: PropertyType.TOWNHOUSE,
    energyCertificate: 'B',
    amenities: ['gated community', 'near golf course', 'family friendly', 'clubhouse'],
    detailedDescription: 'Contemporary 3-bedroom townhouse in a secure gated community in Hua Hin. Ideal for families, located near renowned golf courses and offering access to a community clubhouse and pool.',
    imageUrl: 'https://picsum.photos/seed/huahintownhouse/600/400',
  }
];