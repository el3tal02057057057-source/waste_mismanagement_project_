import React from 'react';
import { X, MapPin, Calendar, User, CheckCircle, AlertTriangle, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Zone, ZoneStatus } from '../../types';
import { Button } from '../common/Button';
import { getReportsByZone } from '../../data/mockData';

interface ZoneDetailsModalProps {
  zone: Zone;
  onClose: () => void;
}

const getStatusColor = (status: ZoneStatus) => {
  switch (status) {
    case 'clean':
      return 'bg-green-100 text-green-700';
    case 'dirty':
      return 'bg-red-100 text-red-700';
    case 'review':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

const getStatusText = (status: ZoneStatus) => {
  switch (status) {
    case 'clean':
      return 'نظيف';
    case 'dirty':
      return 'مبلّغ عنه';
    case 'review':
      return 'قيد المراجعة';
    default:
      return status;
  }
};

export function ZoneDetailsModal({ zone, onClose }: ZoneDetailsModalProps) {
  const reports = getReportsByZone(zone.id);
  const lastReport = reports[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50">
      <div className="bg-white w-full sm:w-[90%] sm:max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-hidden animate-slideUp">
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
                <User className="w-4 h-4" />
                <span>{lastReport.userName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <AlertTriangle className="w-4 h-4" />
                <span>{lastReport.category} - {lastReport.severity}</span>
              </div>
              <p className="text-sm text-slate-600">{lastReport.description}</p>
              <div className="w-full h-32 bg-slate-200 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-slate-400" />
                <span className="text-xs text-slate-400 ml-2">صورة المرفق</span>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-green-700">هذه المنطقة نظيفة ولم يتم الإبلاغ عن أي مشاكل</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 pt-2">
            {zone.status !== 'clean' && (
              <Button variant="primary" fullWidth>
                <CheckCircle className="w-4 h-4" />
                أنا نظفت هذه المنطقة
              </Button>
            )}
            <Link to={`/report?zone=${zone.id}`} onClick={onClose}>
              <Button variant={zone.status === 'clean' ? 'primary' : 'outline'} fullWidth>
                <AlertTriangle className="w-4 h-4" />
                الإبلاغ عن مشكلة
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}