import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, RefreshCw, Send, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function VerifyEmailScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { firebaseUser, refreshVerification, sendVerificationEmail, logout, isLoading } = useAuth();
  const [message, setMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const userEmail = location.state?.email || firebaseUser?.email || '';

  useEffect(() => {
    // Check if user is already verified on mount
    if (firebaseUser?.emailVerified) {
      navigate('/home', { replace: true });
    }
  }, [firebaseUser, navigate]);

  const handleRefresh = async () => {
    setIsChecking(true);
    setMessage('');
    setIsChecking(true);

    try {
      await refreshVerification();

      if (firebaseUser?.emailVerified) {
        setMessage('تم تأكيد الإيميل! جاري التحويل...');
        setTimeout(() => {
          navigate('/home', { replace: true });
        }, 1000);
      } else {
        setMessage('الإيميل لم يتم تأكيده بعد. يرجى فتح الإيميل والضغط على رابط التأكيد.');
      }
    } catch (error) {
      setMessage('حدث خطأ أثناء التحقق. يرجى المحاولة مرة أخرى.');
    }

    setIsChecking(false);
  };

  const handleResendEmail = async () => {
    setMessage('');
    const result = await sendVerificationEmail();
    if (result.success) {
      setMessage('تم إرسال إيميل التأكيد بنجاح! تحقق من بريدك الإلكتروني.');
    } else {
      setMessage(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* Email Icon */}
      <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-6">
        <Mail className="w-12 h-12 text-amber-500" />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-slate-900 mb-2">تأكيد البريد الإلكتروني</h1>
      <p className="text-slate-600 text-center mb-6">
        يرجى تأكيد بريدك الإلكتروني للمتابعة
      </p>

      {/* User Email */}
      {userEmail && (
        <div className="bg-slate-100 rounded-xl px-6 py-3 mb-6">
          <p className="text-slate-800 font-medium">{userEmail}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-amber-50 rounded-xl px-6 py-4 mb-8 max-w-sm">
        <p className="text-amber-800 text-sm text-center">
          <strong>الخطوات التالية:</strong><br />
          1. افتح بريدك الإلكتروني<br />
          2. اضغط على رابط التأكيد<br />
          3. اضغط على "تحديث حالة التأكيد"
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className={`rounded-xl px-6 py-3 mb-6 max-w-sm w-full text-center ${
          message.includes('تم') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          <p className="text-sm">{message}</p>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3 w-full max-w-sm">
        <button
          onClick={handleRefresh}
          disabled={isChecking}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className={`w-5 h-5 ${isChecking ? 'animate-spin' : ''}`} />
          {isChecking ? 'جاري التحقق...' : 'تحديث حالة التأكيد'}
        </button>

        <button
          onClick={handleResendEmail}
          disabled={isChecking}
          className="w-full bg-slate-100 hover:bg-slate-200 disabled:bg-slate-100 text-slate-700 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          إعادة إرسال إيميل التأكيد
        </button>

        <button
          onClick={() => logout().then(() => navigate('/login'))}
          className="w-full border border-slate-200 hover:bg-slate-50 text-slate-600 py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          تسجيل الخروج
        </button>
      </div>

      {/* Note */}
      <p className="text-xs text-slate-400 mt-8 text-center">
        لم تجد الإيميل؟ تحقق من مجلد البريد العشوائي (Spam)
      </p>
    </div>
  );
}