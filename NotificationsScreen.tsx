import React from 'react';
import { Bell, CheckCircle, Star, AlertTriangle, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockNotifications } from '../../data/mockData';
import { Notification, NotificationType } from '../../types';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'report_resolved':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'points_earned':
      return <Star className="w-5 h-5 text-yellow-500" />;
    case 'achievement':
      return <Star className="w-5 h-5 text-teal-500" />;
    case 'alert':
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    default:
      return <Bell className="w-5 h-5 text-slate-400" />;
  }
};

const getNotificationBg = (type: NotificationType) => {
  switch (type) {
    case 'report_resolved':
      return 'bg-green-100';
    case 'points_earned':
      return 'bg-yellow-100';
    case 'achievement':
      return 'bg-teal-100';
    case 'alert':
      return 'bg-red-100';
    default:
      return 'bg-slate-100';
  }
};

export function NotificationsScreen() {
  const notifications = mockNotifications;
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-4 flex items-center gap-4 sticky top-0 z-10">
        <Link to="/home" className="p-2 -ml-2">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>
        <div className="flex-1">
          <h1 className="font-semibold text-slate-900">الإشعارات</h1>
          <p className="text-sm text-slate-500">{unreadCount} إشعارات غير مقروءة</p>
        </div>
        <button className="text-teal-600 text-sm font-medium">قراءة الكل</button>
      </div>

      {/* Notifications List */}
      <div className="px-4 py-4 space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-xl p-4 flex items-start gap-4 ${
              !notification.read ? 'border-r-4 border-teal-600' : ''
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getNotificationBg(notification.type)}`}>
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                {!notification.read && (
                  <span className="w-2 h-2 bg-teal-600 rounded-full"></span>
                )}
              </div>
              <p className="text-sm text-slate-600 mb-2">{notification.message}</p>
              <p className="text-xs text-slate-400">
                {new Date(notification.createdAt).toLocaleDateString('ar-EG', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">لا توجد إشعارات</p>
          </div>
        )}
      </div>
    </div>
  );
}