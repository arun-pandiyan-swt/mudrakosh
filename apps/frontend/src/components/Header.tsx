import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Bell, 
  Globe, 
  UserCheck, 
  Layers, 
  FileText, 
  Truck, 
  Factory, 
  ClipboardCheck, 
  BarChart3,
  Search,
  ExternalLink,
  LogOut,
  User
} from 'lucide-react';
import { I18N } from '../data/mockData';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: 'en' | 'as';
  setLang: (lang: 'en' | 'as') => void;
  activeRole: string;
  setActiveRole: (role: string) => void;
  unreadAlertCount: number;
  onOpenMobilePreview?: () => void;
  currentUser?: string;
  onLogout?: () => void;
}

export const ROLES = [
  { id: 'Director', label: 'Directorate Leadership (Director)', tag: 'Sanction Authority' },
  { id: 'Store Officer', label: 'Store Officer', tag: 'Verification & Audit' },
  { id: 'Storekeeper', label: 'Central Storekeeper', tag: 'Intake & QR Tagging' },
  { id: 'Press Supervisor', label: 'Press Floor Supervisor', tag: 'Requisition & Spoilage' },
  { id: 'Recipient DDO', label: 'Recipient Dept DDO', tag: 'Online Indent & POD' },
  { id: 'Super Admin', label: 'Super Admin', tag: 'Full Control' }
];

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  activeRole,
  setActiveRole,
  unreadAlertCount,
  currentUser,
  onLogout
}) => {
  const t = I18N[lang];

  const navItems = [
    { id: 'dashboard', label: t.navDashboard, icon: BarChart3 },
    { id: 'stock', label: t.navStock, icon: Layers },
    { id: 'inward', label: t.navInward, icon: ClipboardCheck },
    { id: 'press', label: t.navPress, icon: Factory },
    { id: 'indents', label: t.navIndents, icon: FileText },
    { id: 'dispatch', label: t.navDispatch, icon: Truck },
    { id: 'reports', label: t.navReports, icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-navy-800 text-white shadow-md border-b-2 border-gold-500">
      {/* Top Gov Bar */}
      <div className="bg-navy-950 px-4 py-1.5 text-xs text-slate-300 flex flex-wrap items-center justify-between border-b border-navy-700">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-gold-500 text-navy-950">
            GOVT. OF ASSAM
          </span>
          <span className="hidden sm:inline text-slate-300 font-medium">
            {t.govtSubtitle}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-gold-400 font-mono text-[11px] flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
            {t.pilotDepot}
          </span>
        </div>

        <div className="flex items-center space-x-4 mt-1 sm:mt-0">
          {/* Language Switcher */}
          <div className="flex items-center bg-navy-900 border border-navy-700 rounded-md overflow-hidden p-0.5">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 text-xs font-semibold rounded ${
                lang === 'en' ? 'bg-gold-500 text-navy-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('as')}
              className={`px-2 py-0.5 text-xs font-semibold rounded ${
                lang === 'as' ? 'bg-gold-500 text-navy-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              অসমীয়া
            </button>
          </div>

          {/* Active Role Selector */}
          <div className="flex items-center space-x-1.5">
            <UserCheck className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-[11px] text-slate-400 hidden md:inline">{t.switchRole}</span>
            <select
              value={activeRole}
              onChange={(e) => setActiveRole(e.target.value)}
              className="bg-navy-900 border border-navy-700 text-gold-300 rounded px-2 py-0.5 text-xs font-medium focus:ring-1 focus:ring-gold-500 focus:outline-none"
            >
              {ROLES.map((r) => (
                <option key={r.id} value={r.id} className="bg-navy-900 text-white">
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Branding & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-3">
          {/* Logo & Portal Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-lg border border-gold-300 text-navy-950 font-black text-2xl tracking-tighter">
              ম
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>MudraKosh</span>
                  <span className="text-gold-400 text-lg font-bold">(মুদ্ৰাকোষ)</span>
                </h1>
                <span className="bg-navy-700/80 text-gold-300 border border-gold-500/30 text-[10px] px-1.5 py-0.5 rounded font-mono font-medium">
                  v2.0 Master
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {t.appSubtitle} · NESFIC-D-39
              </p>
            </div>
          </div>

          {/* Quick Actions & Notification Bell */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentTab('alerts')}
              className="relative p-2 rounded-lg bg-navy-700/60 hover:bg-navy-700 border border-navy-600 text-slate-200 transition"
              title="Alert Notifications"
            >
              <Bell className="w-4 h-4 text-gold-400" />
              {unreadAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {unreadAlertCount}
                </span>
              )}
            </button>

            {currentUser && (
              <div className="hidden sm:flex items-center space-x-2 bg-navy-900/80 border border-navy-700 px-2.5 py-1 rounded-lg text-xs">
                <div className="w-6 h-6 rounded-full bg-gold-500 text-navy-950 font-bold flex items-center justify-center text-[10px]">
                  {currentUser.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-bold text-white truncate max-w-[120px]">{currentUser}</div>
                  <div className="text-[9px] text-gold-400 font-medium">{activeRole}</div>
                </div>
              </div>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 text-xs font-semibold bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/50 px-2.5 py-1.5 rounded-lg transition"
                title="Log Out of MudraKosh"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden md:inline">Log Out</span>
              </button>
            )}
            
            <a 
              href="http://localhost:5174" 
              target="_blank" 
              rel="noreferrer"
              className="hidden lg:flex items-center space-x-1.5 text-xs font-semibold bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-500/40 px-3 py-1.5 rounded-lg transition"
            >
              <span>Launch Mobile App (Port 5174)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 pt-1 border-t border-navy-700/50 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gold-500 text-navy-950 shadow-sm font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-navy-700/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-navy-950' : 'text-gold-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
