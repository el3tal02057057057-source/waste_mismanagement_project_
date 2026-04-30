import { MobileUser, Zone, Report, Notification, DailyStats, UserRanking } from '@/types'

// Mock Users (from mobile app)
export const mockUsers: MobileUser[] = [
  {
    id: 'user-1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed',
    points: 450,
    level: 2,
    totalReports: 15,
    totalValidations: 23,
    totalCleanings: 8,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'user-2',
    name: 'فاطمة علي',
    email: 'fatima@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatima',
    points: 1200,
    level: 4,
    totalReports: 45,
    totalValidations: 67,
    totalCleanings: 32,
    createdAt: new Date('2023-06-20')
  },
  {
    id: 'user-3',
    name: 'خالد سعيد',
    email: 'khaled@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=khaled',
    points: 320,
    level: 2,
    totalReports: 12,
    totalValidations: 18,
    totalCleanings: 5,
    createdAt: new Date('2024-03-10')
  },
  {
    id: 'user-4',
    name: 'نورة أحمد',
    email: 'noura@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=noura',
    points: 890,
    level: 3,
    totalReports: 28,
    totalValidations: 42,
    totalCleanings: 15,
    createdAt: new Date('2023-11-05')
  },
  {
    id: 'user-5',
    name: 'محمد علي',
    email: 'mohammed@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed',
    points: 150,
    level: 1,
    totalReports: 5,
    totalValidations: 8,
    totalCleanings: 2,
    createdAt: new Date('2024-04-01')
  }
]

// Mock Zones (around Riyadh coordinates - same as original mobile app)
export const mockZones: Zone[] = [
  { id: 'zone-1', lat: 24.7136, lng: 46.6753, status: 'clean', cleaningCount: 12 },
  { id: 'zone-2', lat: 24.7146, lng: 46.6763, status: 'dirty', cleaningCount: 3 },
  { id: 'zone-3', lat: 24.7156, lng: 46.6773, status: 'review', cleaningCount: 5 },
  { id: 'zone-4', lat: 24.7166, lng: 46.6783, status: 'clean', cleaningCount: 15 },
  { id: 'zone-5', lat: 24.7176, lng: 46.6793, status: 'dirty', cleaningCount: 2 },
  { id: 'zone-6', lat: 24.7186, lng: 46.6803, status: 'clean', cleaningCount: 20 },
  { id: 'zone-7', lat: 24.7196, lng: 46.6813, status: 'review', cleaningCount: 4 },
  { id: 'zone-8', lat: 24.7206, lng: 46.6823, status: 'clean', cleaningCount: 18 },
  { id: 'zone-9', lat: 24.7116, lng: 46.6753, status: 'dirty', cleaningCount: 1 },
  { id: 'zone-10', lat: 24.7126, lng: 46.6763, status: 'clean', cleaningCount: 14 },
  { id: 'zone-11', lat: 24.7136, lng: 46.6773, status: 'review', cleaningCount: 6 },
  { id: 'zone-12', lat: 24.7146, lng: 46.6783, status: 'clean', cleaningCount: 22 },
]

// Mock Reports
export const mockReports: Report[] = [
  {
    id: 'report-1',
    zoneId: 'zone-2',
    userId: 'user-1',
    userName: 'أحمد محمد',
    category: 'household',
    severity: 'medium',
    description: 'قمام كثيرة ملقاة على الأرض قرب الحديقة',
    location: { lat: 24.7146, lng: 46.6763 },
    status: 'pending',
    createdAt: new Date('2026-04-28'),
    beforeImage: 'https://picsum.photos/400/300?random=1'
  },
  {
    id: 'report-2',
    zoneId: 'zone-5',
    userId: 'user-3',
    userName: 'خالد سعيد',
    category: 'electronic',
    severity: 'high',
    description: 'إلكترونيات قديمة ملقاة في الشارع',
    location: { lat: 24.7176, lng: 46.6793 },
    status: 'in_review',
    createdAt: new Date('2026-04-27'),
    beforeImage: 'https://picsum.photos/400/300?random=2'
  },
  {
    id: 'report-3',
    zoneId: 'zone-9',
    userId: 'user-2',
    userName: 'فاطمة علي',
    category: 'industrial',
    severity: 'critical',
    description: 'نفايات صناعية خطيرة تحتاج تنظيف عاجل',
    location: { lat: 24.7116, lng: 46.6753 },
    status: 'pending',
    createdAt: new Date('2026-04-29'),
    beforeImage: 'https://picsum.photos/400/300?random=3'
  },
  {
    id: 'report-4',
    zoneId: 'zone-3',
    userId: 'user-1',
    userName: 'أحمد محمد',
    category: 'household',
    severity: 'low',
    description: 'صندوق قمامة ممتلئ يحتاج تفريغ',
    location: { lat: 24.7156, lng: 46.6773 },
    status: 'resolved',
    createdAt: new Date('2026-04-20'),
    resolvedAt: new Date('2026-04-22'),
    beforeImage: 'https://picsum.photos/400/300?random=4',
    afterImage: 'https://picsum.photos/400/300?random=5'
  },
  {
    id: 'report-5',
    zoneId: 'zone-13',
    userId: 'user-4',
    userName: 'نورة أحمد',
    category: 'medical',
    severity: 'critical',
    description: 'نفايات طبية需要进行专业处理',
    location: { lat: 24.7156, lng: 46.6793 },
    status: 'pending',
    createdAt: new Date('2026-04-29'),
    beforeImage: 'https://picsum.photos/400/300?random=6'
  },
  {
    id: 'report-6',
    zoneId: 'zone-15',
    userId: 'user-2',
    userName: 'فاطمة علي',
    category: 'other',
    severity: 'medium',
    description: 'حاويات قمامة مكسورة',
    location: { lat: 24.7176, lng: 46.6813 },
    status: 'in_review',
    createdAt: new Date('2026-04-26'),
    beforeImage: 'https://picsum.photos/400/300?random=7'
  }
]

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'report_resolved',
    title: 'تم حل البلاغ',
    message: 'تم تنظيف المنطقة بنجاح',
    read: false,
    createdAt: new Date('2026-04-28')
  },
  {
    id: 'notif-2',
    type: 'points_earned',
    title: 'earned points',
    message: 'لقد حصلت على 10 نقاط لتقديم بلاغ',
    read: false,
    createdAt: new Date('2026-04-27')
  },
  {
    id: 'notif-3',
    type: 'achievement',
    title: 'Achievement unlocked',
    message: 'لقد أنجزت 10 بلاغات!',
    read: true,
    createdAt: new Date('2026-04-25')
  },
  {
    id: 'notif-4',
    type: 'alert',
    title: 'تنبيه',
    message: 'هناك منطقة قريبة منك تحتاج تنظيف',
    read: false,
    createdAt: new Date('2026-04-29')
  }
]

// Daily Statistics for the last 7 days
export const mockDailyStats: DailyStats[] = [
  { date: '2026-04-23', reports: 12, resolved: 8, users: 5 },
  { date: '2026-04-24', reports: 18, resolved: 15, users: 7 },
  { date: '2026-04-25', reports: 8, resolved: 10, users: 4 },
  { date: '2026-04-26', reports: 22, resolved: 18, users: 9 },
  { date: '2026-04-27', reports: 15, resolved: 12, users: 6 },
  { date: '2026-04-28', reports: 20, resolved: 16, users: 8 },
  { date: '2026-04-29', reports: 25, resolved: 10, users: 11 },
]

// User Rankings
export const mockUserRankings: UserRanking[] = [
  { userId: 'user-2', userName: 'فاطمة علي', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatima', points: 1200, reportsCount: 45, rank: 1 },
  { userId: 'user-4', userName: 'نورة أحمد', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=noura', points: 890, reportsCount: 28, rank: 2 },
  { userId: 'user-1', userName: 'أحمد محمد', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed', points: 450, reportsCount: 15, rank: 3 },
  { userId: 'user-3', userName: 'خالد سعيد', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=khaled', points: 320, reportsCount: 12, rank: 4 },
  { userId: 'user-5', userName: 'محمد علي', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed', points: 150, reportsCount: 5, rank: 5 },
]

// Category labels
export const categoryLabels: Record<string, string> = {
  household: 'منزلية',
  industrial: 'صناعية',
  medical: 'طبية',
  electronic: 'إلكترونية',
  other: 'أخرى'
}

// Severity labels
export const severityLabels: Record<string, string> = {
  low: 'منخفضة',
  medium: 'متوسطة',
  high: 'مرتفعة',
  critical: 'حرجة'
}

// Status labels
export const statusLabels: Record<string, string> = {
  clean: 'نظيفة',
  dirty: 'قذرة',
  review: 'قيد المراجعة'
}

// Report status labels
export const reportStatusLabels: Record<string, string> = {
  pending: 'قيد الانتظار',
  in_review: 'قيد المراجعة',
  resolved: 'تم الحل'
}