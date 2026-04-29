import { User, Zone, Report, Notification } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    password: 'password123',
    points: 245,
    level: 2,
    totalReports: 12,
    totalValidations: 8,
    totalCleanings: 5,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Sarah Ahmed',
    email: 'sarah@example.com',
    password: 'password123',
    points: 520,
    level: 3,
    totalReports: 25,
    totalValidations: 15,
    totalCleanings: 12,
    createdAt: new Date('2023-11-20'),
  },
];

// Mock Zones (Cairo area coordinates)
export const mockZones: Zone[] = [
  { id: 'z1', lat: 30.0444, lng: 31.2357, status: 'clean', cleaningCount: 45 },
  { id: 'z2', lat: 30.0450, lng: 31.2360, status: 'dirty', cleaningCount: 12 },
  { id: 'z3', lat: 30.0440, lng: 31.2370, status: 'review', cleaningCount: 23 },
  { id: 'z4', lat: 30.0460, lng: 31.2380, status: 'clean', cleaningCount: 67 },
  { id: 'z5', lat: 30.0430, lng: 31.2350, status: 'clean', cleaningCount: 34 },
  { id: 'z6', lat: 30.0470, lng: 31.2390, status: 'dirty', cleaningCount: 8 },
  { id: 'z7', lat: 30.0420, lng: 31.2340, status: 'clean', cleaningCount: 56 },
  { id: 'z8', lat: 30.0480, lng: 31.2400, status: 'review', cleaningCount: 19 },
  { id: 'z9', lat: 30.0410, lng: 31.2330, status: 'clean', cleaningCount: 41 },
  { id: 'z10', lat: 30.0490, lng: 31.2410, status: 'dirty', cleaningCount: 5 },
  { id: 'z11', lat: 30.0500, lng: 31.2420, status: 'clean', cleaningCount: 72 },
  { id: 'z12', lat: 30.0510, lng: 31.2430, status: 'clean', cleaningCount: 38 },
];

// Mock Reports
export const mockReports: Report[] = [
  {
    id: 'r1',
    zoneId: 'z2',
    userId: '2',
    userName: 'Sarah Ahmed',
    category: 'Household',
    severity: 'high',
    description: 'Large pile of household waste accumulated near the street corner.',
    imageUrl: 'https://picsum.photos/seed/waste1/400/300',
    location: { lat: 30.0450, lng: 31.2360 },
    status: 'pending',
    createdAt: new Date('2026-04-24T10:30:00'),
  },
  {
    id: 'r2',
    zoneId: 'z6',
    userId: '2',
    userName: 'Sarah Ahmed',
    category: 'Electronic',
    severity: 'medium',
    description: 'Discarded electronics and appliances scattered on the sidewalk.',
    imageUrl: 'https://picsum.photos/seed/waste2/400/300',
    location: { lat: 30.0470, lng: 31.2390 },
    status: 'in_review',
    createdAt: new Date('2026-04-23T14:15:00'),
  },
  {
    id: 'r3',
    zoneId: 'z10',
    userId: '1',
    userName: 'Ahmed Hassan',
    category: 'Industrial',
    severity: 'critical',
    description: 'Industrial waste dump threatening nearby residential area.',
    imageUrl: 'https://picsum.photos/seed/waste3/400/300',
    location: { lat: 30.0490, lng: 31.2410 },
    status: 'pending',
    createdAt: new Date('2026-04-25T08:45:00'),
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'points_earned',
    title: 'Points Earned!',
    message: 'You earned 10 points for submitting a report.',
    read: false,
    createdAt: new Date('2026-04-25T09:00:00'),
    data: { points: 10 },
  },
  {
    id: 'n2',
    type: 'report_resolved',
    title: 'Report Resolved',
    message: 'Zone A7 has been cleaned! Thank you for your contribution.',
    read: true,
    createdAt: new Date('2026-04-24T16:30:00'),
    data: { zoneId: 'z1' },
  },
  {
    id: 'n3',
    type: 'achievement',
    title: 'Achievement Unlocked',
    message: 'Congratulations! You earned the "First Report" badge.',
    read: false,
    createdAt: new Date('2026-04-23T11:00:00'),
    data: { badge: 'first_report' },
  },
  {
    id: 'n4',
    type: 'alert',
    title: 'Community Alert',
    message: 'High priority report detected in your area. Action required.',
    read: false,
    createdAt: new Date('2026-04-25T08:00:00'),
    data: { priority: 'high' },
  },
];

// Helper functions
export function getZoneById(zoneId: string): Zone | undefined {
  return mockZones.find(z => z.id === zoneId);
}

export function getReportsByZone(zoneId: string): Report[] {
  return mockReports.filter(r => r.zoneId === zoneId);
}

export function getZonesByStatus(status: string): Zone[] {
  return mockZones.filter(z => z.status === status);
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Stats calculations
export function getStats() {
  const cleanZones = mockZones.filter(z => z.status === 'clean').length;
  const dirtyZones = mockZones.filter(z => z.status === 'dirty').length;
  const reviewZones = mockZones.filter(z => z.status === 'review').length;
  const totalCleanings = mockZones.reduce((sum, z) => sum + z.cleaningCount, 0);

  return {
    cleanZones,
    dirtyZones,
    reviewZones,
    totalZones: mockZones.length,
    totalCleanings,
    pendingReports: mockReports.filter(r => r.status === 'pending').length,
  };
}