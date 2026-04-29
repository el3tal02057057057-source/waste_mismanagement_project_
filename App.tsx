import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BottomNavigation } from './components/navigation/BottomNavigation';

// Screens
import { LoginScreen } from './screens/auth/LoginScreen';
import { SignupScreen } from './screens/auth/SignupScreen';
import { VerifyEmailScreen } from './screens/auth/VerifyEmailScreen';
import { HomeScreen } from './screens/home/HomeScreen';
import { ProfileScreen } from './screens/profile/ProfileScreen';
import { RewardsScreen } from './screens/profile/RewardsScreen';
import { SettingsScreen } from './screens/profile/SettingsScreen';
import { NotificationsScreen } from './screens/notifications/NotificationsScreen';
import { ReportScreen } from './screens/report/ReportScreen';
import { CleanScreen } from './screens/clean/CleanScreen';
import './index.css';

// Loading Screen
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500">Loading...</p>
    </div>
  );
}

// Protected Route Component
// - Existing users (completed first login): access without email verification
// - New users (first signup): require email verification
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, firebaseUser, isEmailVerified, hasCompletedFirstLogin } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // User is not authenticated - redirect to login
  if (!firebaseUser) {
    return <Navigate to="/login" replace />;
  }

  // User is logged in but hasn't completed first login AND email not verified
  // → Redirect to verify email page
  if (!hasCompletedFirstLogin && !isEmailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // User is logged in and either:
  // - Has completed first login before, OR
  // - Has verified their email
  // → Allow access
  return <>{children}</>;
}

// Public Route Component - redirect if logged in (regardless of email verification)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, firebaseUser } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // User is logged in (redirect to home, email verified or not)
  if (firebaseUser) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

// Main App Layout with Navigation
function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {children}
      <BottomNavigation />
    </div>
  );
}

// Main App Routes
function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<PublicRoute><LoginScreen /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupScreen /></PublicRoute>} />

      {/* Verify Email Route - accessible for unverified users */}
      <Route path="/verify-email" element={<VerifyEmailScreen />} />

      {/* Protected Routes - require auth + email verification */}
      <Route path="/home" element={
        <ProtectedRoute>
          <AppLayout><HomeScreen /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <AppLayout><ProfileScreen /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute>
          <AppLayout><NotificationsScreen /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/report" element={
        <ProtectedRoute>
          <ReportScreen />
        </ProtectedRoute>
      } />
      <Route path="/clean" element={
        <ProtectedRoute>
          <CleanScreen />
        </ProtectedRoute>
      } />
      <Route path="/rewards" element={
        <ProtectedRoute>
          <AppLayout><RewardsScreen /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <AppLayout><SettingsScreen /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;