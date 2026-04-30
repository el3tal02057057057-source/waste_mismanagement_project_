import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { Zone, Report, MobileUser, Notification, ReportStatus, ZoneStatus, DailyStats, UserRanking } from '@/types'
import { mockZones, mockUsers, mockDailyStats, mockUserRankings } from '@/data/mockData'

// Import Firebase services
import {
  initializeFirebase,
  subscribeToReports,
  updateReportStatus as firebaseUpdateReportStatus,
  FirebaseReport,
  convertFirebaseReport,
} from '@/firebase/config'

interface AdminContextType {
  // Zones - derived from Firebase reports
  zones: Zone[]
  updateZoneStatus: (zoneId: string, status: ZoneStatus) => void

  // Reports - from Firebase (real-time)
  reports: Report[]
  updateReportStatus: (reportId: string, status: ReportStatus | 'rejected') => Promise<void>
  isLoadingReports: boolean

  // Users (mock data for demo)
  users: MobileUser[]

  // Notifications
  notifications: Notification[]

  // Analytics (mock data for demo)
  dailyStats: DailyStats[]
  userRankings: UserRanking[]

  // Firebase connection status
  isFirebaseConnected: boolean

  // Stats
  getStats: () => {
    totalReports: number
    cleanZones: number
    dirtyZones: number
    reviewZones: number
    activeUsers: number
    pendingReports: number
    resolvedReports: number
  }
}

export const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [zones, setZones] = useState<Zone[]>(mockZones)
  const [reports, setReports] = useState<Report[]>([])
  const [users] = useState<MobileUser[]>(mockUsers)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [dailyStats] = useState<DailyStats[]>(mockDailyStats)
  const [userRankings] = useState<UserRanking[]>(mockUserRankings)
  const [isLoadingReports, setIsLoadingReports] = useState(true)
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false)

  // Initialize Firebase and subscribe to real-time updates
  useEffect(() => {
    let unsubscribeReports: (() => void) | null = null

    const initFirebase = async () => {
      try {
        initializeFirebase()
        setIsFirebaseConnected(true)

        // Subscribe to all reports in real-time
        unsubscribeReports = subscribeToReports((firebaseReports: FirebaseReport[]) => {
          const appReports = firebaseReports.map(convertFirebaseReport)
          setReports(appReports)
          setIsLoadingReports(false)

          // Update zones based on pending reports
          updateZonesFromReports(appReports)
        })
      } catch (error) {
        console.error('Firebase initialization error:', error)
        setIsFirebaseConnected(false)
        setIsLoadingReports(false)
      }
    }

    initFirebase()

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribeReports) {
        unsubscribeReports()
      }
    }
  }, [])

  // Update zones based on Firebase reports
  const updateZonesFromReports = useCallback((allReports: Report[]) => {
    setZones(prevZones => {
      return prevZones.map(zone => {
        // Find the latest pending report for this zone
        const zoneReports = allReports.filter(r => r.zoneId === zone.id)
        const pendingReport = zoneReports.find(r => r.status === 'pending')
        const lastReport = zoneReports.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]

        // Zone is dirty if it has pending reports
        const newStatus = pendingReport ? 'dirty' : 'clean'

        return {
          ...zone,
          status: newStatus,
          lastReport: lastReport
        }
      })
    })
  }, [])

  const updateZoneStatus = (zoneId: string, status: ZoneStatus) => {
    setZones(prev => prev.map(zone =>
      zone.id === zoneId ? { ...zone, status } : zone
    ))
  }

  // Update report status in Firebase - REAL DATA, ADMIN CONTROLLED
  const updateReportStatus = async (reportId: string, status: ReportStatus | 'rejected') => {
    try {
      // Update in Firebase
      await firebaseUpdateReportStatus(reportId, status)

      // Reports will update automatically via Firebase subscription
      // Add notification for status change
      const report = reports.find(r => r.id === reportId)
      if (report) {
        setNotifications(prev => [{
          id: `notif-${Date.now()}`,
          type: 'report_resolved',
          title: status === 'resolved' ? 'تم حل البلاغ' : status === 'rejected' ? 'تم رفض البلاغ' : 'تم تحديث البلاغ',
          message: `تم تحديث حالة البلاغ إلى ${status}`,
          read: false,
          createdAt: new Date()
        }, ...prev])
      }
    } catch (error) {
      console.error('Error updating report status:', error)
      throw error
    }
  }

  const getStats = () => {
    return {
      totalReports: reports.length,
      cleanZones: zones.filter(z => z.status === 'clean').length,
      dirtyZones: zones.filter(z => z.status === 'dirty').length,
      reviewZones: zones.filter(z => z.status === 'review').length,
      activeUsers: users.length,
      pendingReports: reports.filter(r => r.status === 'pending').length,
      resolvedReports: reports.filter(r => r.status === 'resolved').length
    }
  }

  return (
    <AdminContext.Provider value={{
      zones,
      updateZoneStatus,
      reports,
      updateReportStatus,
      isLoadingReports,
      users,
      notifications,
      dailyStats,
      userRankings,
      isFirebaseConnected,
      getStats
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
