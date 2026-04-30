// Firebase configuration for Admin Dashboard
// Get your config from: https://console.firebase.google.com/

import { initializeApp, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, collection, onSnapshot, query, where, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore'
import { getStorage, FirebaseStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { Report, ReportStatus, Zone } from '@/types'

// Firebase configuration - REPLACE THESE VALUES WITH YOUR OWN
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}

// Initialize Firebase
let app: FirebaseApp
let db: Firestore
let storage: FirebaseStorage

export function initializeFirebase() {
  try {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    storage = getStorage(app)
    console.log('Firebase initialized successfully')
    return { app, db, storage }
  } catch (error) {
    console.error('Firebase initialization error:', error)
    throw error
  }
}

export function getFirebaseApp() {
  return app
}

export function getFirebaseDB() {
  return db
}

export function getFirebaseStorage() {
  return storage
}

// Report types for Firebase
export interface FirebaseReport {
  id: string
  imageUrl?: string
  location: { lat: number; lng: number }
  userId: string
  userName: string
  zoneId: string
  category: 'household' | 'industrial' | 'medical' | 'electronic' | 'other'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  status: 'pending' | 'in_review' | 'resolved' | 'rejected'
  timestamp: Timestamp
  resolvedAt?: Timestamp
}

// Zone types for Firebase
export interface FirebaseZone {
  id: string
  lat: number
  lng: number
  status: 'clean' | 'dirty' | 'review'
  cleaningCount: number
  lastReportId?: string
}

// Convert Firebase Report to App Report
export function convertFirebaseReport(firebaseReport: FirebaseReport): Report {
  return {
    id: firebaseReport.id,
    zoneId: firebaseReport.zoneId,
    userId: firebaseReport.userId,
    userName: firebaseReport.userName,
    category: firebaseReport.category,
    severity: firebaseReport.severity,
    description: firebaseReport.description,
    imageUrl: firebaseReport.imageUrl,
    location: firebaseReport.location,
    status: firebaseReport.status === 'rejected' ? 'in_review' : firebaseReport.status,
    createdAt: firebaseReport.timestamp?.toDate() || new Date(),
    resolvedAt: firebaseReport.resolvedAt?.toDate()
  }
}

// Reports collection reference
export function getReportsCollection() {
  return collection(db, 'reports')
}

// Create a new report
export async function createReport(reportData: Omit<FirebaseReport, 'id' | 'timestamp'>): Promise<string> {
  const reportsRef = collection(db, 'reports')
  const newReportRef = doc(reportsRef)

  const report: FirebaseReport = {
    ...reportData,
    id: newReportRef.id,
    timestamp: Timestamp.now()
  }

  await setDoc(newReportRef, report)
  return newReportRef.id
}

// Update report status
export async function updateReportStatus(reportId: string, status: ReportStatus | 'rejected'): Promise<void> {
  const reportRef = doc(db, 'reports', reportId)

  const updateData: Partial<FirebaseReport> = {
    status
  }

  if (status === 'resolved') {
    updateData.resolvedAt = Timestamp.now()
  }

  await updateDoc(reportRef, updateData)
}

// Get single report
export async function getReport(reportId: string): Promise<FirebaseReport | null> {
  const reportRef = doc(db, 'reports', reportId)
  const reportSnap = await getDoc(reportRef)

  if (reportSnap.exists()) {
    return reportSnap.data() as FirebaseReport
  }
  return null
}

// Get all reports (one-time fetch)
export async function getAllReports(): Promise<FirebaseReport[]> {
  const reportsRef = collection(db, 'reports')
  const q = query(reportsRef, orderBy('timestamp', 'desc'))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map(doc => doc.data() as FirebaseReport)
}

// Subscribe to real-time reports updates
export function subscribeToReports(callback: (reports: FirebaseReport[]) => void): () => void {
  const reportsRef = collection(db, 'reports')
  const q = query(reportsRef, orderBy('timestamp', 'desc'))

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const reports = snapshot.docs.map(doc => doc.data() as FirebaseReport)
    callback(reports)
  }, (error) => {
    console.error('Reports subscription error:', error)
  })

  return unsubscribe
}

// Subscribe to reports by status
export function subscribeToReportsByStatus(
  status: ReportStatus | 'pending' | 'in_review' | 'resolved' | 'rejected',
  callback: (reports: FirebaseReport[]) => void
): () => void {
  const reportsRef = collection(db, 'reports')
  const q = query(
    reportsRef,
    where('status', '==', status),
    orderBy('timestamp', 'desc')
  )

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const reports = snapshot.docs.map(doc => doc.data() as FirebaseReport)
    callback(reports)
  }, (error) => {
    console.error('Reports subscription error:', error)
  })

  return unsubscribe
}

// Subscribe to single report updates
export function subscribeToReport(
  reportId: string,
  callback: (report: FirebaseReport | null) => void
): () => void {
  const reportRef = doc(db, 'reports', reportId)

  const unsubscribe = onSnapshot(reportRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data() as FirebaseReport)
    } else {
      callback(null)
    }
  }, (error) => {
    console.error('Report subscription error:', error)
  })

  return unsubscribe
}

// Delete report
export async function deleteReport(reportId: string): Promise<void> {
  const reportRef = doc(db, 'reports', reportId)
  await deleteDoc(reportRef)
}

// Get pending reports count
export async function getPendingReportsCount(): Promise<number> {
  const reportsRef = collection(db, 'reports')
  const q = query(reportsRef, where('status', '==', 'pending'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.size
}

// Get resolved reports count
export async function getResolvedReportsCount(): Promise<number> {
  const reportsRef = collection(db, 'reports')
  const q = query(reportsRef, where('status', '==', 'resolved'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.size
}

// Zones Firebase operations
export function getZonesCollection() {
  return collection(db, 'zones')
}

// Subscribe to real-time zones updates
export function subscribeToZones(callback: (zones: FirebaseZone[]) => void): () => void {
  const zonesRef = collection(db, 'zones')
  const q = query(zonesRef)

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const zones = snapshot.docs.map(doc => doc.data() as FirebaseZone)
    callback(zones)
  }, (error) => {
    console.error('Zones subscription error:', error)
  })

  return unsubscribe
}

// Update zone status
export async function updateZoneStatus(zoneId: string, status: 'clean' | 'dirty' | 'review'): Promise<void> {
  const zoneRef = doc(db, 'zones', zoneId)
  await updateDoc(zoneRef, { status })
}

// Increment zone cleaning count
export async function incrementZoneCleaningCount(zoneId: string): Promise<void> {
  const zoneRef = doc(db, 'zones', zoneId)
  await updateDoc(zoneRef, {
    cleaningCount: (await getDoc(zoneRef)).data()?.cleaningCount + 1 || 1,
    status: 'clean'
  })
}

// Get all zones
export async function getAllZones(): Promise<FirebaseZone[]> {
  const zonesRef = collection(db, 'zones')
  const querySnapshot = await getDocs(zonesRef)

  return querySnapshot.docs.map(doc => doc.data() as FirebaseZone)
}
