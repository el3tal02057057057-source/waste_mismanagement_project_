import React, { useState } from 'react'
import { useAdmin } from '@/context/AdminContext'
import { Search, Award, FileText, CheckCircle, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export function UsersPage() {
  const { users, reports } = useAdmin()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter users
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Get user reports count
  const getUserReportsCount = (userId: string) => {
    return reports.filter(r => r.userId === userId).length
  }

  // Get user level badge
  const getLevelBadge = (level: number) => {
    const badges = {
      1: { label: 'مبتدئ', bg: 'bg-gray-100', text: 'text-gray-700' },
      2: { label: 'مساهم', bg: 'bg-blue-100', text: 'text-blue-700' },
      3: { label: 'حارس', bg: 'bg-purple-100', text: 'text-purple-700' },
      4: { label: 'بطل البيئة', bg: 'bg-yellow-100', text: 'text-yellow-700' }
    }
    const badge = badges[level as keyof typeof badges] || badges[1]
    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    )
  }

  // Total stats
  const totalPoints = users.reduce((sum, u) => sum + u.points, 0)
  const totalUserReports = users.reduce((sum, u) => sum + u.totalReports, 0)

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
          <p className="text-gray-500 mt-1">عرض ومتابعة المستخدمين النشطين</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-primary/10 text-primary rounded-lg">
            <span className="font-bold">{users.length}</span> مستخدم
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">إجمالي النقاط</p>
              <p className="text-2xl font-bold text-gray-900">{totalPoints.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">إجمالي البلاغات</p>
              <p className="text-2xl font-bold text-gray-900">{totalUserReports}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">إجمالي التنظيفات</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.reduce((sum, u) => sum + u.totalCleanings, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">أبطال البيئة</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.level === 4).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="relative max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="بحث عن مستخدم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            dir="rtl"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">المستخدم</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">البريد الإلكتروني</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">المستوى</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">النقاط</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">البلاغات</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">التأكيدات</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">التنظيفات</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">تاريخ التسجيل</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{user.email}</td>
                  <td className="py-4 px-6">{getLevelBadge(user.level)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-primary">{user.points}</span>
                      <span className="text-gray-400 text-sm">نقطة</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">{user.totalReports}</td>
                  <td className="py-4 px-6 text-center">{user.totalValidations}</td>
                  <td className="py-4 px-6 text-center">{user.totalCleanings}</td>
                  <td className="py-4 px-6 text-gray-500 text-sm">
                    {formatDate(new Date(user.createdAt))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              عرض {(currentPage - 1) * itemsPerPage + 1} إلى {Math.min(currentPage * itemsPerPage, filteredUsers.length)} من {filteredUsers.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}