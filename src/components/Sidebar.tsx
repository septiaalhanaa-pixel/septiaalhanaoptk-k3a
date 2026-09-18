import React from 'react';
import { 
  LayoutDashboard, 
  Boxes, 
  ArrowLeftRight, 
  MapPin, 
  FileText, 
  BellRing, 
  Database, 
  Ship, 
  Layers,
  ChevronRight,
  X
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'master' | 'transactions' | 'tracking' | 'reports' | 'notifications' | 'database';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  stats: {
    totalContainers: number;
    activeVessels: number;
    pendingGate: number;
    unreadNotifs: number;
  };
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  stats,
  isOpen = false,
  onClose
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard Analitik',
      sublabel: 'Performa Armada & KPI',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'master' as ActiveTab,
      label: 'Master Data',
      sublabel: 'Peti Kemas, Kapal, Yard',
      icon: Boxes,
      badge: stats.totalContainers ? `${stats.totalContainers} Unit` : null
    },
    {
      id: 'transactions' as ActiveTab,
      label: 'Transaksi Data',
      sublabel: 'Gate-In/Out & Bongkar Muat',
      icon: ArrowLeftRight,
      badge: stats.pendingGate > 0 ? `${stats.pendingGate} Baru` : null
    },
    {
      id: 'tracking' as ActiveTab,
      label: 'Pelacakan & Peta',
      sublabel: 'AIS Kapal & GPS Truk',
      icon: MapPin,
      badge: `${stats.activeVessels} Sandar`
    },
    {
      id: 'reports' as ActiveTab,
      label: 'Laporan Operasional',
      sublabel: 'Throughput & Dwelling Time',
      icon: FileText,
      badge: null
    },
    {
      id: 'notifications' as ActiveTab,
      label: 'Notifikasi Otomatis',
      sublabel: 'WhatsApp Gateway & Log',
      icon: BellRing,
      badge: stats.unreadNotifs > 0 ? stats.unreadNotifs : null,
      badgeColor: 'bg-emerald-500 text-white'
    },
    {
      id: 'database' as ActiveTab,
      label: 'Real Database Hub',
      sublabel: 'Supabase, Neon, Firebase',
      icon: Database,
      badge: 'Real DB'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed md:static inset-y-0 left-0 z-50 md:z-auto w-72 md:w-64 shrink-0 bg-slate-900 text-slate-300 p-3 flex flex-col justify-between border-r border-slate-800 transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Navigasi Modul TOS
            </span>
            {onClose && (
              <button
                id="btn-close-sidebar-mobile"
                onClick={onClose}
                className="md:hidden p-1 text-slate-400 hover:text-white rounded-md transition-colors"
                title="Tutup Menu"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all group cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'hover:bg-slate-800 hover:text-white text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-1.5 rounded-md ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-medium leading-tight truncate">
                    {item.label}
                  </div>
                  <div
                    className={`text-[10px] truncate ${
                      isActive ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-400'
                    }`}
                  >
                    {item.sublabel}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.badgeColor || (isActive ? 'bg-blue-800 text-white' : 'bg-slate-800 text-slate-400')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <ChevronRight
                  className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isActive ? 'opacity-100 text-white' : 'text-slate-500'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Terminal Live Stat Footer */}
      <div className="mt-4 p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-1.5">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Ship className="w-3.5 h-3.5 text-blue-400" />
            Terminal Dermaga
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>
        </div>
        <div className="space-y-1 text-[11px] text-slate-400">
          <div className="flex justify-between">
            <span>Kapal Sandar:</span>
            <span className="text-white font-medium">KM Samudera Jaya 18</span>
          </div>
          <div className="flex justify-between">
            <span>Quay Crane Aktif:</span>
            <span className="text-white font-medium">QC-01, QC-02</span>
          </div>
          <div className="flex justify-between">
            <span>Productivity:</span>
            <span className="text-emerald-400 font-mono font-medium">28.4 Box/Jam</span>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
};
