// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  points: number;
  level: number;
  totalReports: number;
  totalValidations: number;
  totalCleanings: number;
  createdAt: Date;
}

// Zone Types
export type ZoneStatus = 'clean' | 'dirty' | 'review';

export interface Zone {
  id: string;
  lat: number;
  lng: number;
  status: ZoneStatus;
  lastReport?: Report;
  cleaningCount: number;
}

// Report Types
export type ReportCategory = 'Household' | 'Industrial' | 'Medical' | 'Electronic' | 'Other';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type ReportStatus = 'pending' | 'in_review' | 'resolved';

export interface Report {
  id: string;
  zoneId: string;
  userId: string;
  userName: string;
  category: ReportCategory;
  severity: Severity;
  description: string;
  imageUrl: string;
  location: { lat: number; lng: number };
  status: ReportStatus;
  createdAt: Date;
  resolvedAt?: Date;
}

// Notification Types
export type NotificationType = 'report_resolved' | 'points_earned' | 'achievement' | 'alert';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: any;
}

// Points Configuration
export const POINTS_CONFIG = {
  REPORT_SUBMITTED: 10,
  REPORT_VALIDATED: 5,
  CLEANED_IT: 25,
  WEEKLY_STREAK_BONUS: 50,
};

export const LEVELS = [
  { level: 1, name: 'Beginner', minPoints: 0, maxPoints: 100 },
  { level: 2, name: 'Contributor', minPoints: 101, maxPoints: 500 },
  { level: 3, name: 'Guardian', minPoints: 501, maxPoints: 1000 },
  { level: 4, name: 'Eco Champion', minPoints: 1001, maxPoints: Infinity },
];

export function getLevelFromPoints(points: number) {
  return LEVELS.find(l => points >= l.minPoints && points <= l.maxPoints) || LEVELS[0];
}

// Categories
export const REPORT_CATEGORIES: ReportCategory[] = ['Household', 'Industrial', 'Medical', 'Electronic', 'Other'];
export const SEVERITY_LEVELS: Severity[] = ['low', 'medium', 'high', 'critical'];