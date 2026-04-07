export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low';

export interface DonorProfile {
  id: string;
  name: string;
  bloodType: BloodType | null;
  cpf: string;
  phone: string;
  lastDonation?: string;
  nextEligibleDate: string;
  totalDonations: number;
  points: number;
  rank: string;
  email: string;
}

export interface BloodRequest {
  id: string;
  hospitalName: string;
  location: string;
  bloodType: BloodType;
  requiredBags: number;
  collectedBags: number;
  urgency: UrgencyLevel;
  description: string;
  distance?: string;
  createdAt: string;
  status: 'active' | 'completed' | 'cancelled';
  patientName: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'urgent_request' | 'donation_reminder' | 'thank_you' | 'general';
  isRead: boolean;
  createdAt: string;
  relatedRequestId?: string;
}

export interface EligibilityQuestion {
  id: string;
  question: string;
  disqualifyOnYes: boolean;
}

export interface HistoryItem {
  id: string;
  date: string;
  location: string;
  bagsCount: number;
  type: 'donation' | 'request';
  status: 'completed' | 'pending';
}
