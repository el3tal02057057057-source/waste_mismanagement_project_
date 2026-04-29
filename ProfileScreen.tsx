import React from 'react';
import { Settings, LogOut, Award, MapPin, CheckCircle, AlertTriangle, ChevronRight, Star, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getLevelFromPoints } from '../../types';

export function ProfileScreen() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const level = getLevelFromPoints(user.points);

  const menuItems = [
    { icon: <MapPin className="w-5 h-5" />, label: 'بلاغاتي', value: `${user.totalReports} بلاغ`, path: '/my-reports' },
    { icon: <CheckCircle className="w-5 h-5" />, label: 'عمليات التنظيف', value: `${user.totalCleanings} عملية`, path: '/my-cleanings' },
    { icon: <AlertTriangle className="w-5 h-5" />, label: 'عمليات التحقق', value: `${user.totalValidations} تحقق`, path: '/my-validations' },
  ];

  const settingsItems = [
    { icon: <Settings className="w-5 h-5" />, label: 'الإعدادات', path: '/settings' },
    { icon: <Gift className="w-5 h-5" />, label: 'المكافآت والعروض', path: '/rewards' },
  ];

  const handleSettingsItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 px-4 pt-8 pb-20">
        <h1 className="text-white text-xl font-bold mb-6">حسابي</h1>

        {/* Profile Card */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-3xl font-bold text-white">{user.name.charAt(0)}</span>
          </div>
          <div>
            <h2 className="text-white text-xl font-bold">{user.name}</h2>
            <p className="text-teal-100 text-sm">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-sm font-medium">مستوى {level.level}: {level.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Points Card */}
      <div className="px-4 -mt-10">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm mb-1">نقاطي الحالية</p>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-teal-600">{user.points}</span>
                <span className="text-slate-400">نقطة</span>
              </div>
            </div>
            <div className="text-left">
              <p className="text-xs text-slate-500 mb-1">المستوى التالي</p>
              <div className="flex items-center gap-1">
                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"
                    style={{ width: `${Math.min((user.points / level.maxPoints) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-1">{level.maxPoints - user.points} نقطة متبقية</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="w-5 h-5 text-teal-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{user.totalReports}</p>
            <p className="text-xs text-slate-500">بلاغ</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{user.totalCleanings}</p>
            <p className="text-xs text-slate-500">تنظيف</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{user.totalValidations}</p>
            <p className="text-xs text-slate-500">تحقق</p>
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">نشاطاتي</h3>
        <div className="bg-white rounded-xl overflow-hidden">
          {menuItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                  {item.icon}
                </div>
                <span className="text-slate-900 font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm">{item.value}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Section */}
      <div className="px-4 mt-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">الإعدادات</h3>
        <div className="bg-white rounded-xl overflow-hidden">
          {settingsItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleSettingsItemClick(item.path)}
              className="flex items-center justify-between p-4 border-b border-slate-100 last:border-b-0 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                  {item.icon}
                </div>
                <span className="text-slate-900 font-medium">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-4 mt-6">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-medium hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          تسجيل الخروج
        </button>
      </div>

      {/* App Version */}
      <p className="text-center text-slate-400 text-xs mt-6 mb-4">الإصدار 1.0.0</p>
    </div>
  );
}