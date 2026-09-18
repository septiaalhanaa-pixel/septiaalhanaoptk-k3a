import React from 'react';
import { 
  Anchor, 
  Database, 
  Bell, 
  LogOut, 
  LogIn, 
  User, 
  Clock, 
  ShieldCheck, 
  RefreshCw, 
  Sparkles,
  Wifi
} from 'lucide-react';
import { UserSession, DatabaseConfig } from '../types';

interface NavbarProps {
  user: UserSession | null;
  dbConfig: DatabaseConfig;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenDatabaseModal: () => void;
  onOpenNotifications: () => void;
  unreadNotifsCount: number;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  dbConfig,
  onOpenLogin,
  onLogout,
  onOpenDatabaseModal,
  onOpenNotifications,
  unreadNotifsCount,
  onResetData
}) => {
  const [currentTime, setCurrentTime] = React.useState('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getProviderBadge = () => {
    switch (dbConfig.activeProvider) {
      case 'supabase':
        return { label: 'Supabase DB', color: 'bg-emerald-500/10 text-emerald-700 border-emerald-300' };
      case 'neon':
        return { label: 'Neon PostgreSQL', color: 'bg-cyan-500/10 text-cyan-700 border-cyan-300' };
      case 'firebase':
        return { label: 'Firebase DB', color: 'bg-amber-500/10 text-amber-700 border-amber-300' };
      default:
        return { label: 'Active Persistent DB', color: 'bg-blue-500/10 text-blue-700 border-blue-300' };
    }
  };

  const badge = getProviderBadge();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Terminal Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-sm">
            <Anchor className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                TOS PELAYARAN
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                Terminal Ops v3.2
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Sistem Operasi Terminal Peti Kemas & Analitik Armada
            </p>
          </div>
        </div>

        {/* Center Clock & Realtime Status */}
        <div className="hidden lg:flex items-center gap-4 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
          <div className="flex items-center gap-1.5 font-mono font-medium text-slate-700">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentTime || '12:00:00 WIB'}</span>
          </div>
          <span className="h-3 w-px bg-slate-300" />
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-slate-700">Dermaga & Gate Live</span>
          </div>
        </div>

        {/* Actions Right Side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Real Database Connector Badge & Modal Trigger */}
          <button
            id="btn-database-connector"
            onClick={onOpenDatabaseModal}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer hover:shadow-xs ${badge.color}`}
            title="Klik untuk konfigurasi Supabase, Neon DB, Firebase, atau cek status database"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{badge.label}</span>
            <span className="flex items-center gap-1 text-[11px] opacity-80">
              <Wifi className="w-3 h-3 text-emerald-600" />
              {dbConfig.latencyMs || 12}ms
            </span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            id="btn-reset-demo"
            onClick={onResetData}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reset Data Operasional Default"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Customer Notification Hub Trigger */}
          <button
            id="btn-notifications-hub"
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Notifikasi Otomatis Pelanggan (WhatsApp/Email)"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* User Profile / Login */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden ring-1 ring-slate-300">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden md:block text-left text-xs leading-tight">
                <div className="font-semibold text-slate-900 truncate max-w-[130px]">{user.name}</div>
                <div className="text-[10px] text-blue-600 font-medium capitalize flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {user.role === 'admin' ? 'Admin Pelayaran' : user.role === 'supervisor' ? 'Terminal SPV' : 'Pelanggan'}
                </div>
              </div>
              <button
                id="btn-logout"
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
                title="Keluar / Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="btn-login"
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
