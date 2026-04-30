import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
  { path: '/map', label: 'الخريطة', icon: Map },
  { path: '/reports', label: 'البلاغات', icon: FileText },
  { path: '/users', label: 'المستخدمين', icon: Users },
  { path: '/analytics', label: 'التحليلات', icon: BarChart3 },
  { path: '/settings', label: 'الإعدادات', icon: Settings },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <div className="w-64 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-status-clean rounded-lg flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">نظام إدارة النفايات</h1>
            <p className="text-xs text-slate-400">لوحة تحكم المسؤول</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-active text-white'
                      : 'hover:bg-sidebar-hover'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-700">
        {/* Notifications */}
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-hover transition-all mb-2">
          <Bell className="w-5 h-5" />
          <span className="font-medium">الإشعارات</span>
          <span className="mr-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
        </button>

        {/* Logout */}
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-hover transition-all text-red-400">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  )
}