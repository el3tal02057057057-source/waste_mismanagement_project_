import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, Bell, User, PlusCircle } from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: '/home', label: 'الرئيسية', icon: <Home className="w-5 h-5" /> },
  { path: '/report', label: 'إبلاغ', icon: <PlusCircle className="w-5 h-5" /> },
  { path: '/notifications', label: 'الإشعارات', icon: <Bell className="w-5 h-5" /> },
  { path: '/profile', label: 'حسابي', icon: <User className="w-5 h-5" /> },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 z-40 safe-area-bottom">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
                isActive
                  ? 'text-teal-600 bg-teal-50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}