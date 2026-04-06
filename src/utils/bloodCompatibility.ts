import { BloodType, BloodRequest, MatchResult, UrgencyLevel } from '../types';

/**
 * Blood type compatibility matrix.
 * Key = donor blood type, Value = array of compatible recipient blood types.
 */
const DONATION_COMPATIBILITY: Record<BloodType, BloodType[]> = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal donor
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'], // Universal receiver (can only donate to AB+)
};

/**
 * Receiving compatibility matrix.
 * Key = recipient blood type, Value = array of compatible donor blood types.
 */
const RECEIVING_COMPATIBILITY: Record<BloodType, BloodType[]> = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal receiver
};

/**
 * Check if a donor can donate to a specific blood type.
 */
export function canDonateTo(donorType: BloodType, recipientType: BloodType): boolean {
  return DONATION_COMPATIBILITY[donorType].includes(recipientType);
}

/**
 * Check if a recipient can receive from a specific blood type.
 */
export function canReceiveFrom(recipientType: BloodType, donorType: BloodType): boolean {
  return RECEIVING_COMPATIBILITY[recipientType].includes(donorType);
}

/**
 * Get all blood types a donor can donate to.
 */
export function getCompatibleRecipients(donorType: BloodType): BloodType[] {
  return DONATION_COMPATIBILITY[donorType];
}

/**
 * Get all blood types a recipient can receive from.
 */
export function getCompatibleDonors(recipientType: BloodType): BloodType[] {
  return RECEIVING_COMPATIBILITY[recipientType];
}

/**
 * Check if a donor is compatible with a blood request.
 */
export function isCompatibleWithRequest(donorType: BloodType, request: BloodRequest): boolean {
  return canDonateTo(donorType, request.bloodType);
}

// ─── Matching Algorithm ───

const URGENCY_WEIGHTS: Record<UrgencyLevel, number> = {
  critical: 100,
  high: 75,
  medium: 50,
  low: 25,
};

/**
 * Score a blood request match for a donor.
 * Prioritizes: 1) Urgency  2) Distance  3) Availability
 */
export function scoreMatch(
  donorType: BloodType,
  request: BloodRequest,
  donorDistance: number
): MatchResult {
  const isCompatible = canDonateTo(donorType, request.bloodType);

  // Urgency score (0-100)
  const urgencyScore = isCompatible ? URGENCY_WEIGHTS[request.urgency] : 0;

  // Distance score (0-100, closer = higher)
  const maxDistance = 50; // km
  const distanceScore = isCompatible
    ? Math.max(0, 100 - (donorDistance / maxDistance) * 100)
    : 0;

  // Compatibility bonus for exact match
  const compatibilityScore = donorType === request.bloodType ? 100 : isCompatible ? 60 : 0;

  // Weighted total
  const totalScore = urgencyScore * 0.5 + distanceScore * 0.3 + compatibilityScore * 0.2;

  return {
    request,
    compatibilityScore,
    distanceScore,
    urgencyScore,
    totalScore,
  };
}

/**
 * Find and rank the best matching requests for a donor.
 */
export function findBestMatches(
  donorType: BloodType,
  requests: BloodRequest[],
  donorDistance?: number
): MatchResult[] {
  return requests
    .filter((r) => canDonateTo(donorType, r.bloodType))
    .map((r) => scoreMatch(donorType, r, donorDistance ?? r.distance))
    .sort((a, b) => b.totalScore - a.totalScore);
}

export const ALL_BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
