// User types
export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'super_admin'
  avatar?: string
}

// User types from mobile app
export interface MobileUser {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  points: number
  level: number
  totalReports: number
  totalValidations: number
  totalCleanings: number
  createdAt: Date
}

// Zone types
export type ZoneStatus = 'clean' | 'dirty' | 'review'

export interface Zone {
  id: string
  lat: number
  lng: number
  status: ZoneStatus
  lastReport?: Report
  cleaningCount: number
}

// Report types
export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical'
export type ReportStatus = 'pending' | 'in_review' | 'resolved' | 'rejected'
export type ReportCategory = 'household' | 'industrial' | 'medical' | 'electronic' | 'other'

export interface Report {
  id: string
  zoneId: string
  userId: string
  userName: string
  category: ReportCategory
  severity: ReportSeverity
  description: string
  imageUrl?: string
  location: { lat: number; lng: number }
  status: ReportStatus
  createdAt: Date
  resolvedAt?: Date
  beforeImage?: string
  afterImage?: string
}

// Notification types
export type NotificationType = 'report_resolved' | 'points_earned' | 'achievement' | 'alert' | 'validation_needed'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: Date
  data?: any
}

// Analytics types
export interface DailyStats {
  date: string
  reports: number
  resolved: number
  users: number
}

export interface AreaStats {
  zoneId: string
  reportCount: number
  avgSeverity: number
  lastReportDate: Date
}

export interface UserRanking {
  userId: string
  userName: string
  avatar: string
  points: number
  reportsCount: number
  rank: number
}