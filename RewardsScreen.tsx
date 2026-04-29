import React, { useState } from 'react';
import { ArrowLeft, Gift, Award, Coffee, Tv, ShoppingCart, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface Reward {
  id: number;
  title: string;
  description: string;
  pointsRequired: number;
  icon: React.ReactNode;
  color: string;
}

export function RewardsScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const rewards: Reward[] = [
    {
      id: 1,
      title: 'خصم 10%',
      description: 'خصم على خدمات التنظيف',
      pointsRequired: 100,
      icon: <Coffee className="w-6 h-6" />,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      id: 2,
      title: 'شحن مجاني',
      description: 'شحن مجاني لجميع الطلبات',
      pointsRequired: 200,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 3,
      title: 'اشتراك شهري مجاني',
      description: 'اشتراك مجاني في خدمات VIP',
      pointsRequired: 500,
      icon: <Tv className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 4,
      title: 'هدية خاصة',
      description: 'هدية فاخرة من شركائنا',
      pointsRequired: 1000,
      icon: <Gift className="w-6 h-6" />,
      color: 'bg-pink-100 text-pink-600',
    },
    {
      id: 5,
      title: 'شارة ذهبية',
      description: 'شارة مميزة تظهر على ملفك',
      pointsRequired: 50,
      icon: <Award className="w-6 h-6" />,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      id: 6,
      title: 'بطاقة تنظيف VIP',
      description: '5 تنظيفات مجانية',
      pointsRequired: 750,
      icon: <Award className="w-6 h-6" />,
      color: 'bg-teal-100 text-teal-600',
    },
  ];

  const canRedeem = (pointsRequired: number) => {
    return (user?.points || 0) >= pointsRequired;
  };

  const handleRedeem = (reward: Reward) => {
    if (canRedeem(reward.pointsRequired)) {
      alert(`تم استبدال: ${reward.title}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-700 px-4 pt-8 pb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-white text-xl font-bold">المكافآت والعروض</h1>
        </div>
      </div>

      {/* Points Summary */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm">نقاطك المتاحة</p>
            <p className="text-3xl font-bold text-teal-600">{user?.points || 0}</p>
          </div>
          <div className="flex items-center gap-2 text-teal-600">
            <Award className="w-5 h-5" />
            <span className="font-medium">نقطة</span>
          </div>
        </div>
      </div>

      {/* Rewards List */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">المكافآت المتاحة</h3>
        <div className="space-y-3">
          {rewards.map((reward) => {
            const canGet = canRedeem(reward.pointsRequired);
            return (
              <div
                key={reward.id}
                onClick={() => handleRedeem(reward)}
                className={`bg-white rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all ${
                  canGet ? 'hover:shadow-md active:scale-[0.98]' : 'opacity-60'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${reward.color}`}>
                  {reward.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">{reward.title}</h4>
                  <p className="text-sm text-slate-500">{reward.description}</p>
                </div>
                <div className="text-left">
                  <div className={`text-sm font-bold ${canGet ? 'text-teal-600' : 'text-slate-400'}`}>
                    {reward.pointsRequired}
                  </div>
                  <div className="text-xs text-slate-400">نقطة</div>
                </div>
                {canGet ? (
                  <ChevronRight className="w-5 h-5 text-teal-500" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
                    <span className="text-slate-400 text-xs">🔒</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Note */}
      <div className="px-4 mt-6">
        <div className="bg-teal-50 rounded-xl p-4">
          <p className="text-sm text-teal-800 text-center">
            اجمع النقاط واستبدلها بمكافآت حصرية!
          </p>
        </div>
      </div>
    </div>
  );
}
