export type AvatarType = 'boy' | 'girl';

export type UserBadge = 'None' | 'Bronze' | 'Silver' | 'Gold';

export type AgeRangeLabel =
  | 'Under 2'
  | '2–5'
  | '6–9'
  | '10–12'
  | '13–17'
  | '18+';

export interface AgeRangeBlock {
  range: AgeRangeLabel;
  count: number;
  gender: string;
  preferredLanguage: string;
  ethnicity: string;
  specialNeeds: string;
}

export interface AdoptionCenter {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  distanceKm?: number;
  contactNumber: string;
  address: string;
  governmentLicense: string;
  governmentPortalUrl: string;
  childrenCount: number;
  primaryLanguage?: string;
  ageRangeBlocks: AgeRangeBlock[];
}

export interface AppointmentBooking {
  id: string;
  centerId: string;
  centerName: string;
  ageRange: AgeRangeLabel;
  parentName: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTimeSlot?: string;
  notes?: string;
  status: 'Pending Orphanage Confirmation' | 'Confirmed';
  createdAt: string;
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  icon: string;
  shortDescription: string;
  typicalDuration: string;
  creditsReward: number;
  suggestedTopics: string[];
}

export interface VolunteerSession {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  date: string;
  timeSlot: string;
  mode: 'Online' | 'In-person';
  locationOrCenter: string;
  topic: string;
  customTopic?: string;
  status: 'Scheduled' | 'Completed';
  hours: number;
  creditsEarned: number;
  completedAt?: string;
}

export interface DonationRecord {
  id: string;
  amount: number;
  cause: string;
  date: string;
  transactionId: string;
  donorName: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: AvatarType;
  referralCode: string;
  credits: number;
  verifiedHours: number;
  completedSessionsCount: number;
  badge: UserBadge;
  sessions: VolunteerSession[];
  donations: DonationRecord[];
  referredCount: number;
}
