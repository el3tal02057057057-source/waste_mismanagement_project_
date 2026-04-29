import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  level: number;
  totalReports: number;
  totalValidations: number;
  totalCleanings: number;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isLoading: boolean;
  hasCompletedFirstLogin: boolean; // Track if user has logged in before
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  refreshVerification: () => Promise<void>;
  sendVerificationEmail: () => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create user document in Firestore
async function createUserDocument(firebaseUser: FirebaseUser, name: string): Promise<User> {
  const userRef = doc(db, 'users', firebaseUser.uid);

  const userData: User = {
    id: firebaseUser.uid,
    name,
    email: firebaseUser.email || '',
    points: 0,
    level: 1,
    totalReports: 0,
    totalValidations: 0,
    totalCleanings: 0,
    createdAt: new Date(),
  };

  try {
    await setDoc(userRef, {
      userId: firebaseUser.uid,
      email: firebaseUser.email,
      name,
      createdAt: new Date().toISOString(),
      points: 0,
    });
  } catch (e) {
    console.error('Error creating user document:', e);
  }

  return userData;
}

// Get user document from Firestore
async function getUserDocument(firebaseUser: FirebaseUser): Promise<User | null> {
  const userRef = doc(db, 'users', firebaseUser.uid);

  try {
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: data.userId,
        name: data.name,
        email: data.email,
        points: data.points || 0,
        level: data.level || 1,
        totalReports: data.totalReports || 0,
        totalValidations: data.totalValidations || 0,
        totalCleanings: data.totalCleanings || 0,
        createdAt: new Date(data.createdAt),
      };
    }
  } catch (e) {
    console.error('Error getting user document:', e);
  }

  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedFirstLogin, setHasCompletedFirstLogin] = useState(false);

  useEffect(() => {
    // Check if user has completed first login before
    const firstLoginCompleted = localStorage.getItem('firstLoginCompleted') === 'true';
    setHasCompletedFirstLogin(firstLoginCompleted);

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setIsLoading(true);

      if (fbUser) {
        setFirebaseUser(fbUser);

        // Try to get user data from Firestore
        try {
          let userData = await getUserDocument(fbUser);

          // If user document doesn't exist, create one
          if (!userData && fbUser.email) {
            const name = fbUser.displayName || fbUser.email.split('@')[0];
            userData = await createUserDocument(fbUser, name);
          }

          setUser(userData);
        } catch (e) {
          console.error('Error in auth state change:', e);
          // Create basic user data even if Firestore fails
          setUser({
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            email: fbUser.email || '',
            points: 0,
            level: 1,
            totalReports: 0,
            totalValidations: 0,
            totalCleanings: 0,
            createdAt: new Date(),
          });
        }
      } else {
        setFirebaseUser(null);
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setFirebaseUser(userCredential.user);

      // Mark that user has completed their first login
      // This allows them to access app without email verification on future logins
      localStorage.setItem('firstLoginCompleted', 'true');
      setHasCompletedFirstLogin(true);

      return { success: true, message: 'تم تسجيل الدخول بنجاح!' };
    } catch (error: any) {
      let errorMessage = 'فشل في تسجيل الدخول';

      if (error.code === 'auth/user-not-found') {
        errorMessage = 'لا يوجد حساب بهذا الإيميل';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'كلمة المرور غير صحيحة';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'الإيميل غير صالح';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'تم تجاوز عدد المحاولات. يرجى المحاولة لاحقاً.';
      }

      console.error('Login error:', error);
      return { success: false, message: errorMessage };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setFirebaseUser(userCredential.user);

      // Send verification email
      await sendEmailVerification(userCredential.user);

      // Create user document in Firestore
      await createUserDocument(userCredential.user, name);

      return {
        success: true,
        message: 'تم إنشاء الحساب! تم إرسال رابط تأكيد الإيميل. يرجى فتح الإيميل والتأكد منه.'
      };
    } catch (error: any) {
      let errorMessage = 'فشل في إنشاء الحساب';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'هذا الإيميل مسجل بالفعل';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'الإيميل غير صالح';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'خطأ في الاتصال بالإنترنت. يرجى المحاولة مرة أخرى.';
      }

      console.error('Signup error:', error);
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (firebaseUser && user) {
      // Update local state
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);

      // Update Firestore (with error handling)
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        await setDoc(userRef, updates, { merge: true });
      } catch (e) {
        console.error('Error updating user:', e);
      }
    }
  };

  const refreshVerification = async () => {
    if (firebaseUser) {
      try {
        await firebaseUser.reload();
        setFirebaseUser({ ...firebaseUser } as FirebaseUser);
      } catch (e) {
        console.error('Error refreshing verification:', e);
      }
    }
  };

  const sendVerificationEmail = async () => {
    if (firebaseUser) {
      try {
        await sendEmailVerification(firebaseUser);
        return { success: true, message: 'تم إرسال إيميل التأكيد!' };
      } catch (error) {
        return { success: false, message: 'فشل في إرسال إيميل التأكيد' };
      }
    }
    return { success: false, message: 'لا يوجد مستخدم مسجل' };
  };

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      isAuthenticated: !!firebaseUser,
      isEmailVerified: firebaseUser?.emailVerified || false,
      isLoading,
      hasCompletedFirstLogin,
      login,
      signup,
      logout,
      updateUser,
      refreshVerification,
      sendVerificationEmail,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}