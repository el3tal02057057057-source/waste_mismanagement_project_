import React from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'green' | 'red' | 'yellow' | 'blue'
  className?: string
}

export function StatCard({ title, value, icon, trend, color = 'blue', className }: StatCardProps) {
  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    blue: 'bg-blue-100 text-blue-600'
  }

  const bgColors = {
    green: 'bg-status-clean',
    red: 'bg-status-dirty',
    yellow: 'bg-status-review',
    blue: 'bg-primary'
  }

  return (
    <div className={cn('bg-white rounded-xl p-6 shadow-sm border border-gray-100', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={cn('flex items-center gap-1 mt-2 text-sm', trend.isPositive ? 'text-green-600' : 'text-red-600')}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-gray-400 mr-1">من الأسبوع الماضي</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-lg', colorClasses[color])}>
          {icon}
        </div>
      </div>
    </div>
  )
}

interface StatusBadgeProps {
  status: 'clean' | 'dirty' | 'review' | 'pending' | 'in_review' | 'resolved'
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    clean: { label: 'نظيفة', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    dirty: { label: 'قذرة', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
    review: { label: 'قيد المراجعة', bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    pending: { label: 'قيد الانتظار', bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
    in_review: { label: 'قيد المراجعة', bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    resolved: { label: 'تم الحل', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' }
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium', config.bg, config.text, className)}>
      <span className={cn('w-2 h-2 rounded-full', config.dot)}></span>
      {config.label}
    </span>
  )
}

interface SeverityBadgeProps {
  severity: 'low' | 'medium' | 'high' | 'critical'
  className?: string
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const severityConfig = {
    low: { label: 'منخفضة', bg: 'bg-green-100', text: 'text-green-700' },
    medium: { label: 'متوسطة', bg: 'bg-yellow-100', text: 'text-yellow-700' },
    high: { label: 'مرتفعة', bg: 'bg-orange-100', text: 'text-orange-700' },
    critical: { label: 'حرجة', bg: 'bg-red-100', text: 'text-red-700' }
  }

  const config = severityConfig[severity] || severityConfig.low

  return (
    <span className={cn('inline-flex px-3 py-1 rounded-full text-sm font-medium', config.bg, config.text, className)}>
      {config.label}
    </span>
  )
}