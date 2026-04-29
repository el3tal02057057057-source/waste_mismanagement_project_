import React, { useState } from 'react';
import { ArrowLeft, Bell, Languages, Moon, Sun, HelpCircle, Info, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SettingItem {
  icon: React.ReactNode;
  label: string;
  type: 'toggle' | 'link' | 'action';
  value?: boolean;
  onClick?: () => void;
  onToggle?: (value: boolean) => void;
}

export function SettingsScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [arabic, setArabic] = useState(true);

  const handleLogout = () => {
    if (confirm('هل تريد تسجيل الخروج؟')) {
      logout();
    }
  };

  const settingsItems: SettingItem[] = [
    {
      icon: <Bell className="w-5 h-5" />,
      label: 'الإشعارات',
      type: 'toggle',
      value: notifications,
      onToggle: (value) => setNotifications(value),
    },
    {
      icon: <Moon className="w-5 h-5" />,
      label: 'الوضع الداكن',
      type: 'toggle',
      value: darkMode,
      onToggle: (value) => setDarkMode(value),
    },
    {
      icon: <Languages className="w-5 h-5" />,
      label: 'اللغة العربية',
      type: 'toggle',
      value: arabic,
      onToggle: (value) => setArabic(value),
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      label: 'المساعدة والدعم',
      type: 'link',
      onClick: () => alert('تواصل معنا على: support@example.com'),
    },
    {
      icon: <Shield className="w-5 h-5" />,
      label: 'سياسة الخصوصية',
      type: 'link',
      onClick: () => alert('سياسة الخصوصية: يتم جمع البيانات فقط لتحسين تجربة المستخدم'),
    },
    {
      icon: <Info className="w-5 h-5" />,
      label: 'عن التطبيق',
      type: 'link',
      onClick: () => alert('نظام إدارة النفايات - الإصدار 1.0.0'),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 px-4 pt-8 pb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white text-xl font-bold">الإعدادات</h1>
        </div>
      </div>

      {/* Settings List */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-xl overflow-hidden">
          {settingsItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 border-b border-slate-100 last:border-b-0 ${
                item.type !== 'toggle' ? 'cursor-pointer hover:bg-slate-50' : ''
              }`}
              onClick={() => item.type === 'link' && item.onClick?.()}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                  {item.icon}
                </div>
                <span className="text-slate-900 font-medium">{item.label}</span>
              </div>
              {item.type === 'toggle' && (
                <button
                  onClick={() => item.onToggle?.(!item.value)}
                  className={`w-12 h-7 rounded-full relative transition-colors ${
                    item.value ? 'bg-teal-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      item.value ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              )}
              {item.type === 'link' && (
                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Account Section */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">الحساب</h3>
        <div className="bg-white rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                <span className="text-lg font-bold">{user?.name?.charAt(0) || 'U'}</span>
              </div>
              <div>
                <span className="text-slate-900 font-medium">{user?.name}</span>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* App Version */}
      <p className="text-center text-slate-400 text-xs mt-6">الإصدار 1.0.0</p>
    </div>
  );
}
