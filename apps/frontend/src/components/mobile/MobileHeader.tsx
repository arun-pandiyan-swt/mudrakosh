import React from 'react';
import { 
  Wifi, 
  WifiOff, 
  UserCheck, 
  ShieldCheck, 
  QrCode, 
  Truck, 
  FileCheck2, 
  Building
} from 'lucide-react';

interface MobileHeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: 'en' | 'as';
  setLang: (lang: 'en' | 'as') => void;
  activeRole: string;
  setActiveRole: (role: string) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
}

export const MOBILE_ROLES = [
  { id: 'Gate Guard', label: 'Security Gate Guard', short: 'Gate Guard' },
  { id: 'Warehouse Storekeeper', label: 'Warehouse Floor Storekeeper', short: 'Storekeeper' },
  { id: 'Delivery Driver', label: 'Delivery Carrier Driver', short: 'Driver' },
  { id: 'Recipient DDO', label: 'Recipient Dept Nodal Officer (DDO)', short: 'Recipient DDO' }
];

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  activeRole,
  setActiveRole,
  isOnline,
  setIsOnline
}) => {
  return (
    <header className="sticky top-0 z-40 bg-navy-900 text-white shadow-md border-b-2 border-gold-500">
      {/* Top micro bar */}
      <div className="bg-navy-950 px-3 py-1 flex items-center justify-between text-[11px] text-slate-300 border-b border-navy-800">
        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
          <span className="font-semibold text-gold-400">DPS Bamunimaidam</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Offline/Online toggle */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
              isOnline ? 'bg-emerald-900/60 text-emerald-300' : 'bg-red-900/60 text-red-300'
            }`}
            title="Toggle Online/Offline Sync"
          >
            {isOnline ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-red-400" />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </button>

          {/* Lang toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'as' : 'en')}
            className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-navy-800 text-gold-300 border border-navy-700"
          >
            {lang === 'en' ? 'অসমীয়া' : 'English'}
          </button>
        </div>
      </div>

      {/* Main app bar */}
      <div className="px-3.5 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold-500 text-navy-950 font-black text-lg flex items-center justify-center shadow">
            ম
          </div>
          <div>
            <h1 className="text-sm font-black text-white flex items-center space-x-1.5">
              <span>MudraKosh</span>
              <span className="text-gold-400 text-xs">(মুদ্ৰাকোষ)</span>
            </h1>
            <p className="text-[10px] text-slate-300 leading-tight">
              Mobile Field PWA · {activeRole}
            </p>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center space-x-1">
          <select
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value)}
            className="bg-navy-800 border border-navy-700 text-gold-300 text-[11px] font-bold rounded-lg px-2 py-1 focus:outline-none"
          >
            {MOBILE_ROLES.map(r => (
              <option key={r.id} value={r.id} className="bg-navy-900 text-white">
                {r.short}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};
