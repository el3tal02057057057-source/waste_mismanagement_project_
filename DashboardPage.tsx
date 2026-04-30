import React from 'react'
import { useAdmin } from '@/context/AdminContext'
import { StatCard, StatusBadge } from '@/components/common/StatCard'
import { FileText, Map, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export function DashboardPage() {
  const { getStats, dailyStats, userRankings, reports } = useAdmin()
  const stats = getStats()

  // Calculate max for chart
  const maxReports = Math.max(...dailyStats.map(d => Math.max(d.reports, d.resolved)))

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-500 mt-1">نظرة عامة على نظام إدارة النفايات</p>
        </div>
        <div className="text-left text-sm text-gray-500">
          آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="إجمالي البلاغات"
          value={stats.totalReports}
          icon={<FileText className="w-6 h-6" />}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="المناطق القذرة"
          value={stats.dirtyZones}
          icon={<AlertTriangle className="w-6 h-6" />}
          color="red"
        />
        <StatCard
          title="المناطق النظيفة"
          value={stats.cleanZones}
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="المستخدمين النشطين"
          value={stats.activeUsers}
          icon={<Users className="w-6 h-6" />}
          color="blue"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">بلاغات قيد الانتظار</h3>
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-4xl font-bold text-orange-600">{stats.pendingReports}</p>
          <p className="text-sm text-gray-500 mt-2">بلاغ تحتاج مراجعة</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">بلاغات تم حلها</h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-4xl font-bold text-green-600">{stats.resolvedReports}</p>
          <p className="text-sm text-gray-500 mt-2">من إجمالي {stats.totalReports} بلاغ</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">المناطق قيد المراجعة</h3>
            <Map className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-4xl font-bold text-yellow-600">{stats.reviewZones}</p>
          <p className="text-sm text-gray-500 mt-2">من إجمالي {stats.cleanZones + stats.dirtyZones + stats.reviewZones} منطقة</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">النشاط اليومي</h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {dailyStats.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col gap-1" style={{ height: '160px' }}>
                  <div
                    className="w-full bg-primary rounded-t transition-all"
                    style={{ height: `${(day.reports / maxReports) * 100}%`, minHeight: '4px' }}
                    title={`بلاغات: ${day.reports}`}
                  />
                  <div
                    className="w-full bg-status-clean rounded-t transition-all"
                    style={{ height: `${(day.resolved / maxReports) * 100}%`, minHeight: '4px' }}
                    title={`تم حلها: ${day.resolved}`}
                  />
                </div>
                <span className="text-xs text-gray-500">{day.date.split('-')[2]}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm text-gray-600">بلاغات جديدة</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-clean"></div>
              <span className="text-sm text-gray-600">تم حلها</span>
            </div>
          </div>
        </div>

        {/* Top Users */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">أفضل المستخدمين</h3>
          <div className="space-y-4">
            {userRankings.slice(0, 5).map((user, index) => (
              <div key={user.userId} className="flex items-center gap-4">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                  index === 0 ? 'bg-yellow-100 text-yellow-700' :
                  index === 1 ? 'bg-gray-200 text-gray-700' :
                  index === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-100 text-gray-600'
                )}>
                  {user.rank}
                </div>
                <img
                  src={user.avatar}
                  alt={user.userName}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{user.userName}</p>
                  <p className="text-sm text-gray-500">{user.reportsCount} بلاغ</p>
                </div>
                <div className="text-left">
                  <p className="font-bold text-primary">{user.points}</p>
                  <p className="text-xs text-gray-500">نقطة</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">أحدث البلاغات</h3>
          <a href="/reports" className="text-sm text-primary hover:underline">عرض الكل</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">المنطقة</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">المستخدم</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">الوصف</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">الحالة</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {reports.slice(0, 5).map((report) => (
                <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-mono text-sm text-gray-700">{report.zoneId}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{report.userName}</td>
                  <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{report.description}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-sm">
                    {new Date(report.createdAt).toLocaleDateString('ar-SA')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}