import React from 'react'
import { Settings, Bell, Shield, Database, Globe, Mail } from 'lucide-react'

export function SettingsPage() {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">الإعدادات</h1>
        <p className="text-gray-500 mt-1">إدارة إعدادات النظام</p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-gray-900">الإعدادات العامة</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">اسم النظام</p>
                <p className="text-sm text-gray-500">نظام إدارة النفايات</p>
              </div>
              <button className="px-4 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg">
                تعديل
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">المنطقة الزمنية</p>
                <p className="text-sm text-gray-500">الرياض (UTC+3)</p>
              </div>
              <button className="px-4 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg">
                تغيير
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">اللغة</p>
                <p className="text-sm text-gray-500">العربية</p>
              </div>
              <button className="px-4 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg">
                تغيير
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">الإشعارات</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">إشعارات البلاغات الجديدة</p>
                <p className="text-sm text-gray-500">إشعار عند وصول بلاغ جديد</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">إشعارات المستخدمين</p>
                <p className="text-sm text-gray-500">إشعار عند تسجيل مستخدم جديد</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">تقارير يومية</p>
                <p className="text-sm text-gray-500">إرسال تقرير يومي بالبريد</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-100 rounded-lg">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">الأمان والحماية</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">تغيير كلمة المرور</p>
                <p className="text-sm text-gray-500">تحديث كلمة مرور المسؤول</p>
              </div>
              <button className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">
                تغيير
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">المصادقة ثنائية العامل</p>
                <p className="text-sm text-gray-500">تفعيل المصادقة الثنائية</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">سجل النشاط</p>
                <p className="text-sm text-gray-500">مراجعة سجلات الدخول</p>
              </div>
              <button className="px-4 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg">
                عرض
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Database className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">إدارة البيانات</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">نسخ احتياطي</p>
                <p className="text-sm text-gray-500">إنشاء نسخة احتياطية من البيانات</p>
              </div>
              <button className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:opacity-90">
                إنشاء نسخة
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">استعادة البيانات</p>
                <p className="text-sm text-gray-500">استعادة من نسخة احتياطية</p>
              </div>
              <button className="px-4 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg">
                استعادة
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">تصدير البيانات</p>
                <p className="text-sm text-gray-500">تصدير البيانات كملف CSV</p>
              </div>
              <button className="px-4 py-2 text-sm text-primary hover:bg-primary/5 rounded-lg">
                تصدير
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">معلومات النظام</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">إصدار النظام</p>
            <p className="text-lg font-bold text-gray-900">v1.0.0</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">آخر تحديث</p>
            <p className="text-lg font-bold text-gray-900">2026-04-29</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">حالة الخادم</p>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-lg font-bold text-green-600">مفعّل</span>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">نوع الاتصال</p>
            <p className="text-lg font-bold text-gray-900">Firebase</p>
          </div>
        </div>
      </div>
    </div>
  )
}