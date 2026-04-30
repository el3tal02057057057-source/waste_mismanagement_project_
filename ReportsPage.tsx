import React, { useState } from 'react'
import { useAdmin } from '@/context/AdminContext'
import { StatusBadge, SeverityBadge } from '@/components/common/StatCard'
import { Search, Filter, CheckCircle, XCircle, Eye, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'
import { Report } from '@/types'
import { formatDateTime, formatRelativeTime } from '@/lib/utils'
import { categoryLabels, severityLabels, reportStatusLabels } from '@/data/mockData'

type FilterStatus = 'all' | 'pending' | 'in_review' | 'resolved' | 'rejected'

export function ReportsPage() {
  const { reports, updateReportStatus, zones, isLoadingReports, isFirebaseConnected } = useAdmin()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const itemsPerPage = 10

  // Handle status update with loading state
  const handleStatusUpdate = async (reportId: string, status: 'resolved' | 'in_review' | 'rejected') => {
    setProcessingId(reportId)
    try {
      await updateReportStatus(reportId, status)
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setProcessingId(null)
    }
  }

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch =
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.zoneId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === 'all' || report.status === filterStatus

    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getZoneStatus = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId)
    return zone?.status || 'unknown'
  }

  // Show loading state
  if (isLoadingReports) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">جاري تحميل البلاغات من Firebase...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة البلاغات</h1>
          <p className="text-gray-500 mt-1">عرض ومعالجة جميع البلاغات</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Firebase Connection Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
            isFirebaseConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isFirebaseConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {isFirebaseConnected ? 'متصل بـ Firebase' : 'غير متصل'}
          </div>
          <span className="text-sm text-gray-500">
            إجمالي البلاغات: <span className="font-bold text-gray-900">{reports.length}</span>
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="بحث في البلاغات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              dir="rtl"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              dir="rtl"
            >
              <option value="all">الكل</option>
              <option value="pending">قيد الانتظار</option>
              <option value="in_review">قيد المراجعة</option>
              <option value="resolved">تم الحل</option>
              <option value="rejected">مرفوض</option>
            </select>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mr-auto">
            <div className="px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm">
              <span className="font-bold">{reports.filter(r => r.status === 'pending').length}</span> قيد الانتظار
            </div>
            <div className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm">
              <span className="font-bold">{reports.filter(r => r.status === 'in_review').length}</span> قيد المراجعة
            </div>
            <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm">
              <span className="font-bold">{reports.filter(r => r.status === 'resolved').length}</span> تم الحل
            </div>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">المنطقة</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">المستخدم</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">التصنيف</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">الخطورة</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">الوصف</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">الحالة</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">التاريخ</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReports.map((report) => (
                <tr key={report.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        'w-3 h-3 rounded-full',
                        getZoneStatus(report.zoneId) === 'clean' ? 'bg-green-500' :
                        getZoneStatus(report.zoneId) === 'dirty' ? 'bg-red-500' :
                        'bg-yellow-500'
                      )}></span>
                      <span className="font-mono text-sm text-gray-700">{report.zoneId}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{report.userName}</td>
                  <td className="py-4 px-6 text-gray-700">
                    {categoryLabels[report.category]}
                  </td>
                  <td className="py-4 px-6">
                    <SeverityBadge severity={report.severity} />
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-gray-600 max-w-xs truncate">{report.description}</p>
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="py-4 px-6 text-gray-500 text-sm">
                    {formatRelativeTime(new Date(report.createdAt))}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="عرض التفاصيل"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      {report.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(report.id, 'resolved')}
                            disabled={processingId === report.id}
                            className="p-2 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                            title="تم الحل"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(report.id, 'in_review')}
                            disabled={processingId === report.id}
                            className="p-2 hover:bg-yellow-100 rounded-lg transition-colors disabled:opacity-50"
                            title="قيد المراجعة"
                          >
                            <Eye className="w-4 h-4 text-yellow-600" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(report.id, 'rejected')}
                            disabled={processingId === report.id}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                            title="رفض"
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      )}
                      {report.status === 'in_review' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(report.id, 'resolved')}
                            disabled={processingId === report.id}
                            className="p-2 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                            title="تم الحل"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(report.id, 'rejected')}
                            disabled={processingId === report.id}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                            title="رفض"
                          >
                            <XCircle className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedReports.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    لا توجد بلاغات
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              عرض {(currentPage - 1) * itemsPerPage + 1} إلى {Math.min(currentPage * itemsPerPage, filteredReports.length)} من {filteredReports.length}
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

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">تفاصيل البلاغ</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image */}
              {(selectedReport.imageUrl || selectedReport.beforeImage) && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={selectedReport.imageUrl || selectedReport.beforeImage}
                    alt="صورة البلاغ"
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              {/* Report Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">المستخدم</p>
                  <p className="font-medium text-gray-900">{selectedReport.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">المنطقة</p>
                  <p className="font-medium text-gray-900">{selectedReport.zoneId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">التصنيف</p>
                  <p className="font-medium text-gray-900">{categoryLabels[selectedReport.category]}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">الخطورة</p>
                  <SeverityBadge severity={selectedReport.severity} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">الحالة</p>
                  <StatusBadge status={selectedReport.status} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">التاريخ</p>
                  <p className="font-medium text-gray-900">{formatDateTime(new Date(selectedReport.createdAt))}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm text-gray-500 mb-1">الوصف</p>
                <p className="text-gray-900">{selectedReport.description || 'لا يوجد وصف'}</p>
              </div>

              {/* Location */}
              <div>
                <p className="text-sm text-gray-500 mb-1">الموقع</p>
                <p className="text-gray-900 font-mono text-sm">
                  {selectedReport.location.lat.toFixed(6)}, {selectedReport.location.lng.toFixed(6)}
                </p>
              </div>

              {/* Admin Actions - REAL DATA CONTROLLED */}
              {selectedReport.status !== 'resolved' && selectedReport.status !== 'rejected' && (
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedReport.id, 'resolved')
                      setSelectedReport(null)
                    }}
                    disabled={processingId === selectedReport.id}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>تم الحل</span>
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedReport.id, 'in_review')
                      setSelectedReport(null)
                    }}
                    disabled={processingId === selectedReport.id}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                  >
                    <Eye className="w-5 h-5" />
                    <span>قيد المراجعة</span>
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedReport.id, 'rejected')
                      setSelectedReport(null)
                    }}
                    disabled={processingId === selectedReport.id}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <AlertTriangle className="w-5 h-5" />
                    <span>رفض</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}