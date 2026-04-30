import React from 'react'
import { X, MapPin, CheckCircle, AlertTriangle, Camera } from 'lucide-react'
import { Zone, ZoneStatus } from '@/types'
import { useAdmin } from '@/context/AdminContext'
import { Button } from '@/components/common/Button'

interface ZoneDetailsModalProps {
  zone: Zone
  onClose: () => void
}

const getStatusColor = (status: ZoneStatus) => {
  switch (status) {
    case 'clean':
      return 'bg-green-100 text-green-700'
    case 'dirty':
      return 'bg-red-100 text-red-700'
    case 'review':
      return 'bg-yellow-100 text-yellow-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

const getStatusText = (status: ZoneStatus) => {
  switch (status) {
    case 'clean':
      return 'نظيف'
    case 'dirty':
      return 'مبلّغ عنه'
    case 'review':
      return 'قيد المراجعة'
    default:
      return status
  }
}

export function ZoneDetailsModal({ zone, onClose }: ZoneDetailsModalProps) {
  const { reports, updateZoneStatus, updateReportStatus } = useAdmin()
  const zoneReports = reports.filter(r => r.zoneId === zone.id)
  const lastReport = zoneReports[0]

  const handleResolve = () => {
    updateZoneStatus(zone.id, 'clean')
    zoneReports.forEach(report => {
      if (report.status !== 'resolved') {
        updateReportStatus(report.id, 'resolved')
      }
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">تفاصيل المنطقة</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(zone.status)}`}>
                {getStatusText(zone.status)}
              </span>
              <span className="text-xs text-slate-500">موقع: {zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">{zone.cleaningCount} تنظيف</span>
            </div>
          </div>

          {/* Map Preview */}
          <div className="h-32 bg-slate-100 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-teal-600 mx-auto mb-2" />
              <p className="text-sm text-slate-600">المنطقة: {zone.id}</p>
              <p className="text-xs text-slate-400">{zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}</p>
            </div>
          </div>

          {/* Last Report */}
          {lastReport ? (
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-slate-900">آخر بلاغ</h3>
                <span className="text-xs text-slate-500">
                  {new Date(lastReport.createdAt).toLocaleDateString('ar-EG')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>{lastReport.userName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <AlertTriangle className="w-4 h-4" />
                <span>{lastReport.category} - {lastReport.severity}</span>
              </div>
              <p className="text-sm text-slate-600">{lastReport.description}</p>
              {lastReport.beforeImage && (
                <div className="w-full h-32 bg-slate-200 rounded-lg overflow-hidden">
                  <img src={lastReport.beforeImage} alt="صورة البلاغ" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-green-700">هذه المنطقة نظيفة ولم يتم الإبلاغ عن أي مشاكل</p>
            </div>
          )}

          {/* All Reports */}
          {zoneReports.length > 1 && (
            <div className="bg-slate-50 rounded-xl p-4">
              <h3 className="font-medium text-slate-900 mb-2">جميع البلاغات ({zoneReports.length})</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {zoneReports.map((report, index) => (
                  <div key={report.id} className="text-sm text-slate-600 border-b border-slate-100 pb-2 last:border-0">
                    <div className="flex items-center justify-between">
                      <span>{report.userName}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        report.status === 'in_review' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {report.status === 'resolved' ? 'تم الحل' : report.status === 'in_review' ? 'قيد المراجعة' : 'معلق'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{report.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 pt-2">
            {zone.status !== 'clean' && (
              <button
                onClick={handleResolve}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>أنا نظفت هذه المنطقة</span>
              </button>
            )}
            <button
              onClick={onClose}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                zone.status === 'clean'
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'border border-red-200 text-red-500 hover:bg-red-50'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>الإبلاغ عن مشكلة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}