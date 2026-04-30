import React, { useState } from 'react'
import { useAdmin } from '@/context/AdminContext'
import { FileText, TrendingUp, Users, Download } from 'lucide-react'

type TimeRange = '7days' | '30days' | '90days'

export function AnalyticsPage() {
  const { dailyStats, userRankings, zones, reports, users } = useAdmin()
  const [timeRange, setTimeRange] = useState<TimeRange>('7days')

  // Calculate statistics
  const totalReports = reports.length
  const resolvedReports = reports.filter(r => r.status === 'resolved').length
  const resolutionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0

  const mostReportedZones = zones
    .map(zone => ({
      zoneId: zone.id,
      count: reports.filter(r => r.zoneId === zone.id).length
    }))
    .filter(z => z.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const categoryStats = reports.reduce((acc, report) => {
    acc[report.category] = (acc[report.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalPoints = users.reduce((sum, u) => sum + u.points, 0)
  const avgPointsPerUser = Math.round(totalPoints / users.length)

  // Calculate max for charts
  const maxReports = Math.max(...dailyStats.map(d => Math.max(d.reports, d.resolved)), 1)
  const maxUsers = Math.max(...dailyStats.map(d => d.users), 1)

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">التحليلات</h1>
          <p className="text-gray-500 mt-1">تقارير وإحصائيات النظام</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === '7days' ? 'bg-primary text-white' : 'hover:bg-gray-100'
              }`}
            >
              7 أيام
            </button>
            <button
              onClick={() => setTimeRange('30days')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === '30days' ? 'bg-primary text-white' : 'hover:bg-gray-100'
              }`}
            >
              30 يوم
            </button>
            <button
              onClick={() => setTimeRange('90days')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === '90days' ? 'bg-primary text-white' : 'hover:bg-gray-100'
              }`}
            >
              90 يوم
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90">
            <Download className="w-5 h-5" />
            <span>تصدير التقرير</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي البلاغات</p>
              <p className="text-3xl font-bold text-gray-900">{totalReports}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">نسبة الحل</p>
              <p className="text-3xl font-bold text-green-600">{resolutionRate}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">المستخدمين النشطين</p>
              <p className="text-3xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">متوسط النقاط</p>
              <p className="text-3xl font-bold text-primary">{avgPointsPerUser}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity */}
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
          <div className="flex items-center justify-center gap-4 mt-4">
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

        {/* Users Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">نشاط المستخدمين</h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {dailyStats.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col" style={{ height: '160px', justifyContent: 'flex-end' }}>
                  <div
                    className="w-full bg-purple-500 rounded-t transition-all"
                    style={{ height: `${(day.users / maxUsers) * 100}%`, minHeight: '4px' }}
                    title={`مستخدمين: ${day.users}`}
                  />
                </div>
                <span className="text-xs text-gray-500">{day.date.split('-')[2]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">توزيع البلاغات حسب التصنيف</h3>
          <div className="space-y-3">
            {Object.entries(categoryStats).map(([key, value], index) => {
              const percentages = (value / totalReports) * 100
              const colors = ['bg-primary', 'bg-orange-500', 'bg-red-500', 'bg-purple-500', 'bg-gray-500']
              const labels: Record<string, string> = {
                household: 'منزلية',
                industrial: 'صناعية',
                medical: 'طبية',
                electronic: 'إلكترونية',
                other: 'أخرى'
              }
              return (
                <div key={key} className="flex items-center gap-4">
                  <div className="w-20 text-sm text-gray-600">{labels[key] || key}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full ${colors[index % 5]} rounded-full transition-all`}
                      style={{ width: `${percentages}%` }}
                    />
                  </div>
                  <div className="w-16 text-sm text-gray-900 text-left">{value}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">توزيع البلاغات حسب الخطورة</h3>
          <div className="space-y-3">
            {[
              { name: 'منخفضة', value: reports.filter(r => r.severity === 'low').length, color: 'bg-green-500' },
              { name: 'متوسطة', value: reports.filter(r => r.severity === 'medium').length, color: 'bg-yellow-500' },
              { name: 'مرتفعة', value: reports.filter(r => r.severity === 'high').length, color: 'bg-orange-500' },
              { name: 'حرجة', value: reports.filter(r => r.severity === 'critical').length, color: 'bg-red-500' }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-20 text-sm text-gray-600">{item.name}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: `${(item.value / totalReports) * 100}%` }}
                  />
                </div>
                <div className="w-16 text-sm text-gray-900 text-left">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Reported Areas */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">المناطق الأكثر بلاغاً</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {mostReportedZones.map((zone, index) => (
            <div key={zone.zoneId} className="p-4 bg-gray-50 rounded-lg text-center">
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto mb-3',
                index === 0 ? 'bg-yellow-500' :
                index === 1 ? 'bg-gray-400' :
                index === 2 ? 'bg-orange-500' :
                'bg-gray-300'
              )}>
                {index + 1}
              </div>
              <p className="font-medium text-gray-900">{zone.zoneId}</p>
              <p className="text-sm text-gray-500">{zone.count} بلاغ</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Users Ranking */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">ترتيب أفضل المستخدمين</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">الترتيب</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">المستخدم</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">النقاط</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">عدد البلاغات</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">المستوى</th>
              </tr>
            </thead>
            <tbody>
              {userRankings.map((user, index) => (
                <tr key={user.userId} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <span className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-200 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-600'
                    )}>
                      {user.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.userName} className="w-8 h-8 rounded-full" />
                      <span className="font-medium text-gray-900">{user.userName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-primary">{user.points}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{user.reportsCount}</td>
                  <td className="py-3 px-4">
                    {index === 0 && <span className="text-yellow-500">👑</span>}
                    <span className="text-sm text-gray-500">
                      {user.points >= 1000 ? 'بطل البيئة' :
                       user.points >= 500 ? 'حارس' :
                       user.points >= 100 ? 'مساهم' : 'مبتدئ'}
                    </span>
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