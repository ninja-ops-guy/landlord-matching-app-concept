export interface Tenant {
  id: number;
  name: string;
  age: number;
  avatar: string;
  job: string;
  company: string;
  monthlyIncome: number;
  creditScore: number;
  budget: number;
  city: string;
  bio: string;
  petInfo: string;
  petAvatar: string | null;
  moveInDate: string;
  verifiedIncome: boolean;
  verifiedBackground: boolean;
  verifiedReferences: boolean;
  greenFlags: string[];
  redFlags: string[];
  rentalHistoryYears: number;
  compatibilityScore: number;
  createdAt?: string;
}

export interface Landlord {
  id: number;
  name: string;
  age: number;
  avatar: string;
  bio: string;
  responseTime: string;
  style: string;
  rating: string;
  reviewsCount: number;
  greenFlags: string[];
  redFlags: string[];
  createdAt?: string;
}

export interface Listing {
  id: number;
  landlordId: number;
  title: string;
  neighborhood: string;
  city: string;
  rent: number;
  deposit: number;
  bedrooms: number;
  bathrooms: string;
  sqft: number;
  images: string[];
  description: string;
  amenities: string[];
  petPolicy: string;
  utilities: string[];
  leaseTerm: string;
  availableDate: string;
  landlord?: Landlord;
  createdAt?: string;
}

export interface Match {
  id: number;
  tenantId: number;
  listingId: number;
  landlordId: number;
  status: "matched" | "tour_scheduled" | "lease_offered" | "lease_signed";
  tourDate: string | null;
  tourTime: string | null;
  leaseMonthlyRent: number | null;
  leaseDeposit: number | null;
  leaseStartDate: string | null;
  leaseSignedAt: string | null;
  createdAt: string;
  tenant?: Tenant;
  listing?: Listing;
  landlord?: Landlord;
  lastMessage?: Message | null;
}

export interface Message {
  id: number;
  matchId: number;
  senderRole: "landlord" | "tenant";
  senderName: string;
  text: string;
  messageType: "text" | "tour_invite" | "tour_accepted" | "lease_offer" | "lease_signed";
  metadata?: Record<string, any> | null;
  createdAt: string;
}

export type AppMode = "landlord" | "tenant";
export type ActiveTab = "swipe" | "matches" | "quiz";
