
export enum PropertyType {
  CONDOMINIUM = 'Condominium',
  SINGLE_FAMILY_HOME = 'Single Family Home',
  TOWNHOUSE = 'Townhouse',
  APARTMENT = 'Apartment',
  VILLA = 'Villa',
  DUPLEX = 'Duplex',
  PENTHOUSE = 'Penthouse'
}

export interface Property {
  id: string;
  location: string;
  price: number;
  numberOfRooms: number;
  numberOfBathrooms: number;
  houseSize: number; // in sq meters
  pool: boolean;
  lift: boolean;
  yearBuilt: number;
  propertyType: PropertyType;
  energyCertificate: string; // e.g., 'A', 'B', 'LEED Gold'
  amenities: string[]; // e.g., ['garden', 'solar panels', 'terrace']
  detailedDescription: string;
  imageUrl: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  associatedProperties?: Array<Property & { compatibilityScore?: number }>;
}

// For Gemini Chat
export interface GeminiChatSession {
  sendMessage: (params: { 
    message: string; 
    userId?: string | null; // For potential vector DB user identification
    quizAnswers?: QuizAnswers | null; // Context for vector DB or Gemini
    propertiesForContext?: Array<Property & {compatibilityScore?: number}> | null; // Context
  }) => Promise<{ text: string }>;
}

export interface QuizAnswers {
  propertyType?: PropertyType;
  location?: string;
  pool?: boolean;
  // Add more quiz answer fields here as needed
  // e.g. budgetRange?: string;
  // e.g. numberOfBedrooms?: number;
}
