import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';

export function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailExists(false);

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    if (!acceptTerms) {
      setError('يجب الموافقة على الشروط والأحكام');
      return;
    }

    setIsLoading(true);
    const result = await signup(name, email, password);

    if (result.success) {
      // Navigate to verify email screen
      navigate('/verify-email', { state: { email } });
    } else {
      // Check if email already exists
      if (result.message.includes('مسجل بالفعل') || result.message.includes('already registered')) {
        setEmailExists(true);
        setError('هذا الإيميل مسجل بالفعل. يرجى تسجيل الدخول أو تأكيد حسابك.');
      } else {
        setError(result.message);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-4 border-b border-slate-100">
        <Link to="/login" className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </Link>
        <h1 className="text-lg font-semibold text-slate-900">إنشاء حساب جديد</h1>
      </div>

      {/* Form */}
      <div className="px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {emailExists && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg text-sm space-y-3">
              <p>هذا الإيميل مسجل بالفعل. هل تريد تسجيل الدخول؟</p>
              <button
                type="button"
                onClick={() => navigate('/login', { state: { email } })}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                الذهاب لتسجيل الدخول
              </button>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">الاسم الكامل</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="محمد أحمد"
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailExists(false); }}
                placeholder="example@email.com"
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">رقم الهاتف (اختياري)</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 1xx xxx xxxx"
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">تأكيد كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-start gap-3 pt-2">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
            />
            <label htmlFor="terms" className="text-sm text-slate-600">
              أوافق على{' '}
              <a href="#" className="text-teal-600 font-medium hover:underline">الشروط والأحكام</a>
              {' '}و{' '}
              <a href="#" className="text-teal-600 font-medium hover:underline">سياسة الخصوصية</a>
            </label>
          </div>

          <Button type="submit" fullWidth isLoading={isLoading} size="lg">
            إنشاء الحساب
          </Button>
        </form>

        <p className="text-center text-slate-600 mt-8">
          لديك حساب بالفعل؟{' '}
          <Link to="/login" className="text-teal-600 font-semibold hover:text-teal-700">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}