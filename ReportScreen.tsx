import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Camera, CheckCircle, ChevronRight, Image, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { REPORT_CATEGORIES, SEVERITY_LEVELS, ReportCategory, Severity, POINTS_CONFIG } from '../../types';

type Step = 'location' | 'photo' | 'details' | 'confirm';

const steps: Step[] = ['location', 'photo', 'details', 'confirm'];

const getStepLabel = (step: Step) => {
  switch (step) {
    case 'location': return 'تحديد الموقع';
    case 'photo': return 'الصورة';
    case 'details': return 'التفاصيل';
    case 'confirm': return 'التأكيد';
  }
};

export function ReportScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const zoneId = searchParams.get('zone');
  const [currentStep, setCurrentStep] = useState<Step>('location');
  const [location, setLocation] = useState({ lat: 30.0450, lng: 31.2370 });
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [category, setCategory] = useState<ReportCategory>('Household');
  const [severity, setSeverity] = useState<Severity>('medium');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentStepIndex = steps.indexOf(currentStep);

  const handleNext = () => {
    // Require photo before proceeding
    if (currentStep === 'photo' && !photo) {
      alert('يرجى اختيار صورة للمكان');
      return;
    }
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    } else {
      navigate(-1);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      // Create preview URL
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
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Update user points
    if (user) {
      updateUser({
        points: user.points + POINTS_CONFIG.REPORT_SUBMITTED,
        totalReports: user.totalReports + 1,
      });
    }

    // If reporting from a zone, update zone state
    if (zoneId) {
      // Load current states
      let zoneStates: any = {};
      try {
        const saved = localStorage.getItem('zoneStates');
        if (saved) zoneStates = JSON.parse(saved);
      } catch (e) {}

      // Set to review (yellow) immediately
      zoneStates[zoneId] = { status: 'review', lastAction: 'report', lastActionTime: Date.now() };
      localStorage.setItem('zoneStates', JSON.stringify(zoneStates));

      // After 10 seconds, change to dirty (red)
      setTimeout(() => {
        let currentStates: any = {};
        try {
          const saved = localStorage.getItem('zoneStates');
          if (saved) currentStates = JSON.parse(saved);
        } catch (e) {}

        if (currentStates[zoneId]?.status === 'review') {
          currentStates[zoneId] = { ...currentStates[zoneId], status: 'dirty', lastAction: 'report', lastActionTime: Date.now() };
          localStorage.setItem('zoneStates', JSON.stringify(currentStates));
        }
      }, 10000);
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">تم الإبلاغ بنجاح!</h1>
        <p className="text-slate-600 text-center mb-4">
          شكراً لك على مساهمتك في تحسين البيئة.<br />
          لقد حصلت على {POINTS_CONFIG.REPORT_SUBMITTED} نقاط!
        </p>
        {zoneId && (
          <div className="bg-yellow-50 rounded-xl px-6 py-4 mb-6 text-center">
            <p className="text-yellow-700 font-medium">
              المنطقة ستتحول للأصفر ثم للأخضر خلال 10 ثواني
            </p>
          </div>
        )}
        <div className="bg-teal-50 rounded-xl px-6 py-4 mb-8">
          <p className="text-teal-700 font-semibold text-center">
            نقاطك الحالية: {user ? user.points + POINTS_CONFIG.REPORT_SUBMITTED : POINTS_CONFIG.REPORT_SUBMITTED}
          </p>
        </div>
        <Button onClick={() => navigate('/home')} fullWidth>
          العودة للرئيسية
        </Button>
      </div>
    );
  }

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
        <button onClick={handleBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <div className="flex-1">
          <h1 className="font-semibold text-slate-900">إبلاغ عن مشكلة</h1>
          {zoneId && <p className="text-xs text-slate-500">المنطقة: {zoneId}</p>}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  index <= currentStepIndex
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}>
                  {index < currentStepIndex ? <CheckCircle className="w-4 h-4" /> : index + 1}
                </div>
                <span className="text-xs text-slate-500 mt-1">{getStepLabel(step)}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded ${
                  index < currentStepIndex ? 'bg-teal-600' : 'bg-slate-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        {/* Step 1: Location */}
        {currentStep === 'location' && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">تحديد الموقع</h3>
                  <p className="text-sm text-slate-500">اختر موقع المشكلة على الخريطة</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">المنطقة:</p>
                  <p className="font-medium text-slate-900">
                    {zoneId || 'غير محدد'}
                  </p>
                </div>
                {zoneId && (
                  <span className="text-xs text-teal-600 bg-teal-50 px-2 py-1 rounded">
                    تم الاختيار من الخريطة
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Photo */}
        {currentStep === 'photo' && (
          <div className="space-y-4">
            <div className="bg-red-50 rounded-xl p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Camera className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">صورة المشكلة *</h3>
                  <p className="text-sm text-slate-500">التقط صورة أو اختر من المعرض</p>
                </div>
              </div>
              <p className="text-xs text-red-600 bg-red-100 rounded-lg p-2">
                هذه الخطوة إلزامية - يجب اختيار صورة للمكان
              </p>
            </div>

            {photo ? (
              <div className="relative">
                <img src={photo} alt="Report" className="w-full h-64 object-cover rounded-xl" />
                <button
                  onClick={() => { setPhoto(null); setPhotoFile(null); }}
                  className="absolute top-2 right-2 bg-white/90 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  إزالة
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleOpenFilePicker}
                  className="w-full border-2 border-dashed border-red-300 rounded-xl p-8 flex flex-col items-center justify-center hover:border-red-500 hover:bg-red-50 transition-colors"
                >
                  <Camera className="w-12 h-12 text-red-400 mb-3" />
                  <p className="text-slate-600 font-medium mb-1">التقط صورة للمكان</p>
                  <p className="text-sm text-slate-400">اضغط لاختيار صورة من المعرض</p>
                </button>
              </div>
            )}

            {/* File info if selected */}
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
        )}

        {/* Step 3: Details */}
        {currentStep === 'details' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">التصنيف</label>
              <div className="grid grid-cols-2 gap-3">
                {REPORT_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`p-3 rounded-xl border-2 transition-colors ${
                      category === cat
                        ? 'border-teal-600 bg-teal-50 text-teal-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-sm font-medium">{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">الخطورة</label>
              <div className="flex gap-2">
                {SEVERITY_LEVELS.map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverity(sev)}
                    className={`flex-1 py-3 rounded-xl border-2 transition-colors ${
                      severity === sev
                        ? sev === 'critical'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : sev === 'high'
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : sev === 'medium'
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : 'border-green-500 bg-green-50 text-green-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-sm font-medium capitalize">{sev}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">الوصف (اختياري)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={200}
                placeholder="أضف وصفاً مختصراً للمشكلة..."
                className="w-full h-32 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
              <p className="text-xs text-slate-400 text-left">{description.length}/200</p>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {currentStep === 'confirm' && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-xl p-4 space-y-4">
              <h3 className="font-semibold text-slate-900">مراجعة البلاغ</h3>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">المنطقة</p>
                  <p className="font-medium text-slate-900">{zoneId || 'غير محدد'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Camera className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">الصورة</p>
                  {photo ? (
                    <img src={photo} alt="Preview" className="w-20 h-20 object-cover rounded-lg mt-1" />
                  ) : (
                    <p className="text-sm text-slate-400">لم يتم اختيار صورة</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-slate-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm text-slate-500">التصنيف والخطورة</p>
                  <p className="font-medium text-slate-900">{category} - {severity}</p>
                </div>
              </div>

              {description && (
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <span className="text-slate-400 text-sm">📝</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">الوصف</p>
                    <p className="font-medium text-slate-900">{description}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-teal-50 rounded-xl p-4">
              <p className="text-sm text-teal-800">
                ست earn <span className="font-bold text-teal-600">{POINTS_CONFIG.REPORT_SUBMITTED} نقاط</span> عند إرسال هذا البلاغ!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="px-4 py-4 border-t border-slate-100 bg-white">
        <div className="flex gap-3">
          {currentStepIndex > 0 && (
            <Button variant="outline" onClick={handleBack} fullWidth>
              السابق
            </Button>
          )}
          {currentStepIndex < steps.length - 1 ? (
            <Button variant="primary" onClick={handleNext} fullWidth={currentStepIndex === 0}>
              التالي
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmit} fullWidth isLoading={isSubmitting}>
              إرسال البلاغ
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
