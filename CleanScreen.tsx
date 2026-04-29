import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Camera, CheckCircle, X, Image } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { POINTS_CONFIG } from '../../types';

export function CleanScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const zoneId = searchParams.get('zone');
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!photo) {
      alert('يرجى اختيار صورة للمكان');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update user points for cleaning
    if (user) {
      updateUser({
        points: user.points + POINTS_CONFIG.CLEANED_IT,
        totalCleanings: (user.totalCleanings || 0) + 1,
      });
    }

    // Update zone state - set to review (yellow) first
    if (zoneId) {
      let zoneStates: any = {};
      try {
        const saved = localStorage.getItem('zoneStates');
        if (saved) zoneStates = JSON.parse(saved);
      } catch (e) {}

      // Set to review (yellow)
      zoneStates[zoneId] = { status: 'review', lastAction: 'clean', lastActionTime: Date.now() };
      localStorage.setItem('zoneStates', JSON.stringify(zoneStates));

      // After 10 seconds, change to clean (green)
      setTimeout(() => {
        let currentStates: any = {};
        try {
          const saved = localStorage.getItem('zoneStates');
          if (saved) currentStates = JSON.parse(saved);
        } catch (e) {}

        if (currentStates[zoneId]?.status === 'review') {
          currentStates[zoneId] = { ...currentStates[zoneId], status: 'clean', lastAction: 'clean', lastActionTime: Date.now() };
          localStorage.setItem('zoneStates', JSON.stringify(currentStates));
        }
      }, 10000);
    }

    setIsSubmitting(false);

    // Show success and redirect
    alert('تم! المنطقة ستتحول للأصفر ثم للأخضر خلال 10 ثواني');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handlePhotoSelect}
        className="hidden"
      />

      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-4 border-b border-slate-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <div className="flex-1">
          <h1 className="font-semibold text-slate-900">تأكيد التنظيف</h1>
          {zoneId && <p className="text-xs text-slate-500">المنطقة: {zoneId}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        <div className="bg-green-50 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Camera className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">صورة التأكيد *</h3>
              <p className="text-sm text-slate-500">التقط صورة للمكان بعد التنظيف</p>
            </div>
          </div>
          <p className="text-xs text-green-600 bg-green-100 rounded-lg p-2">
            هذه الخطوة إلزامية - يجب اختيار صورة للمكان
          </p>
        </div>

        {photo ? (
          <div className="space-y-4">
            <div className="relative">
              <img src={photo} alt="Clean confirmation" className="w-full h-64 object-cover rounded-xl" />
              <button
                onClick={() => { setPhoto(null); setPhotoFile(null); }}
                className="absolute top-2 right-2 bg-white/90 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                إزالة
              </button>
            </div>

            {photoFile && (
              <div className="bg-green-50 rounded-xl p-3 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm text-green-700 font-medium">تم اختيار الصورة</p>
                  <p className="text-xs text-green-600">{photoFile.name}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleOpenFilePicker}
            className="w-full border-2 border-dashed border-green-300 rounded-xl p-8 flex flex-col items-center justify-center hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <Camera className="w-12 h-12 text-green-400 mb-3" />
            <p className="text-slate-600 font-medium mb-1">التقط صورة للمكان</p>
            <p className="text-sm text-slate-400">اضغط لاختيار صورة من المعرض</p>
          </button>
        )}

        {/* Info */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-blue-700">
            <span className="font-semibold">ملاحظة:</span> بعد تأكيد التنظيف، ستتحول المنطقة للأصفر ثم للأخضر خلال 10 ثواني
          </p>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="px-4 py-4 border-t border-slate-100 bg-white">
        <Button
          variant="primary"
          onClick={handleSubmit}
          fullWidth
          isLoading={isSubmitting}
          disabled={!photo}
        >
          تأكيد التنظيف
        </Button>
      </div>
    </div>
  );
}
