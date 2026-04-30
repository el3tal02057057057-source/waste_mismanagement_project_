import React, { useState } from 'react'
import { useAdmin } from '@/context/AdminContext'
import { StatusBadge, SeverityBadge } from '@/components/common/StatCard'
import { MapPin, CheckCircle, XCircle, Eye, X } from 'lucide-react'
import { Report, Zone } from '@/types'
import { formatDateTime } from '@/lib/utils'
import { categoryLabels } from '@/data/mockData'
import { GridMap } from '@/components/map'

export function MapPage() {
  const { zones, reports, updateZoneStatus, updateReportStatus } = useAdmin()
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  const getZoneReports = (zoneId: string) => {
    return reports.filter(r => r.zoneId === zoneId)
  }

  const handleZoneSelect = (zone: Zone) => {
    setSelectedZone(zone)
    const zoneReports = getZoneReports(zone.id)
    if (zoneReports.length > 0) {
      setSelectedReport(zoneReports[0])
    }
  }

  const handleStatusChange = (status: 'clean' | 'dirty' | 'review') => {
    if (selectedZone) {
      updateZoneStatus(selectedZone.id, status)
      const zoneReports = getZoneReports(selectedZone.id)
      zoneReports.forEach(report => {
        if (report.status !== 'resolved') {
          updateReportStatus(report.id, 'resolved')
        }
      })
      setSelectedZone({ ...selectedZone, status })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clean': return 'bg-status-clean'
      case 'dirty': return 'bg-status-dirty'
      case 'review': return 'bg-status-review'
      default: return 'bg-gray-300'
    }
  }

  // Count zones by status
  const dirtyCount = zones.filter(z => z.status === 'dirty').length
  const cleanCount = zones.filter(z => z.status === 'clean').length
  const reviewCount = zones.filter(z => z.status === 'review').length

  return (
    <div className="space-y-6" dir="rtl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الخريطة التفاعلية</h1>
          <p className="text-gray-500 mt-1">إدارة المناطق ومراقبة الحالة</p>
        </div>
      </div>

      {/* Map Legend Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusColor('dirty')}`}>
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{dirtyCount}</p>
            <p className="text-sm text-gray-500">منطقة قذرة</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusColor('review')}`}>
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{reviewCount}</p>
            <p className="text-sm text-gray-500">قيد المراجعة</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getStatusColor('clean')}`}>
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{cleanCount}</p>
            <p className="text-sm text-gray-500">منطقة نظيفة</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{zones.length}</p>
            <p className="text-sm text-gray-500">إجمالي المناطق</p>
          </div>
        </div>
      </div>

      {/* Interactive Map */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">خريطة مدينة الرياض</h3>

        {/* Map Legend */}
        <div className="flex items-center gap-6 mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-red-500 opacity-40 border-2 border-red-500"></div>
            <span className="text-sm text-gray-700">منطقة قذرة</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-yellow-500 opacity-40 border-2 border-yellow-500"></div>
            <span className="text-sm text-gray-700">قيد المراجعة</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500 opacity-40 border-2 border-green-500"></div>
            <span className="text-sm text-gray-700">منطقة نظيفة</span>
          </div>
          <div className="mr-auto text-sm text-gray-500">
            انقر على الدائرة لرؤية التفاصيل
          </div>
        </div>

        {/* Leaflet Map */}
        <div className="w-full rounded-xl overflow-hidden" style={{ minHeight: '500px' }}>
          <GridMap
            zones={zones}
            onZoneSelect={handleZoneSelect}
            className="w-full"
          />
        </div>
      </div>

      {/* Zone Details Panel */}
      {selectedZone && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">تفاصيل المنطقة</h3>
            <button
              onClick={() => setSelectedZone(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Zone Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded ${getStatusColor(selectedZone.status)}`}></div>
                <span className="font-medium text-gray-900">{selectedZone.id}</span>
                <StatusBadge status={selectedZone.status} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">عدد عمليات التنظيف</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedZone.cleaningCount}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">عدد البلاغات</p>
                  <p className="text-2xl font-bold text-gray-900">{getZoneReports(selectedZone.id).length}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">الإحداثيات</p>
                <p className="font-mono text-sm text-gray-700">
                  lat: {selectedZone.lat.toFixed(4)}, lng: {selectedZone.lng.toFixed(4)}
                </p>
              </div>
            </div>

            {/* Zone Reports */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">البلاغات في هذه المنطقة</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {getZoneReports(selectedZone.id).length === 0 ? (
                  <p className="text-gray-500 text-sm">لا توجد بلاغات في هذه المنطقة</p>
                ) : (
                  getZoneReports(selectedZone.id).map((report) => (
                    <div
                      key={report.id}
                      className={`
                        p-3 rounded-lg border cursor-pointer transition-all
                        ${selectedReport?.id === report.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}
                      `}
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{report.userName}</span>
                        <StatusBadge status={report.status} />
                      </div>
                      <p className="text-sm text-gray-600">{report.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => handleStatusChange('clean')}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-status-clean text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <CheckCircle className="w-5 h-5" />
              <span>تحديد كنظيفة</span>
            </button>
            <button
              onClick={() => handleStatusChange('review')}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-status-review text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Eye className="w-5 h-5" />
              <span>وضع قيد المراجعة</span>
            </button>
            <button
              onClick={() => handleStatusChange('dirty')}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-status-dirty text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <XCircle className="w-5 h-5" />
              <span>تحديد كقذرة</span>
            </button>
          </div>
        </div>
      )}

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">تفاصيل البلاغ</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image */}
              {selectedReport.beforeImage && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={selectedReport.beforeImage}
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
                <p className="text-gray-900">{selectedReport.description}</p>
              </div>

              {/* Location */}
              <div>
                <p className="text-sm text-gray-500 mb-1">الموقع</p>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4" />
                  <span className="font-mono text-sm">
                    lat: {selectedReport.location.lat.toFixed(4)}, lng: {selectedReport.location.lng.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    updateReportStatus(selectedReport.id, 'resolved')
                    setSelectedReport(null)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-status-clean text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>تم الحل</span>
                </button>
                <button
                  onClick={() => {
                    updateReportStatus(selectedReport.id, 'in_review')
                    setSelectedReport(null)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-status-review text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Eye className="w-5 h-5" />
                  <span>قيد المراجعة</span>
                </button>
                <button
                  onClick={() => {
                    updateReportStatus(selectedReport.id, 'pending')
                    setSelectedReport(null)
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <XCircle className="w-5 h-5" />
                  <span>إلغاء</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}