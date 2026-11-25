import React from 'react';
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ShieldAlert,
  Truck
} from 'lucide-react';
import { AlertNotification, I18N } from '../data/mockData';

interface AlertsViewProps {
  lang: 'en' | 'as';
  alerts: AlertNotification[];
  onMarkAsRead: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  lang,
  alerts,
  onMarkAsRead,
  onNavigate
}) => {
  const t = I18N[lang];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-navy-950 flex items-center gap-2">
            <Bell className="w-6 h-6 text-navy-800" />
            <span>{t.navAlerts}</span>
            <span className="text-xs bg-red-100 text-red-900 px-2 py-0.5 rounded font-mono font-semibold">
              Screen 08 · Automated Alert Feeds
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'en'
              ? 'Automated early warning feeds for critical stockouts, machine spoilage variances, and gate arrivals.'
              : 'সক্ৰিয় সতৰ্কবাৰ্তা: জটিল নাটনি, যন্ত্ৰৰ অস্বাভাৱিক অপচয় আৰু আগমন তথ্য।'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alt) => {
          const isRed = alt.severity === 'red';
          const isAmber = alt.severity === 'amber';

          return (
            <div 
              key={alt.id}
              className={`p-4 rounded-xl border transition flex items-start justify-between gap-4 ${
                !alt.read ? 'bg-white shadow-sm border-slate-300' : 'bg-slate-50 border-slate-200 opacity-80'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isRed ? 'bg-red-100 text-red-800' : isAmber ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {isRed ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : isAmber ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <Truck className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-sm text-navy-950">
                      {lang === 'en' ? alt.title : alt.titleAs}
                    </h4>
                    {!alt.read && (
                      <span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {alt.message}
                  </p>
                  <div className="text-[11px] text-slate-400 flex items-center space-x-1 pt-1">
                    <Clock className="w-3 h-3" />
                    <span>{alt.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                {!alt.read && (
                  <button
                    onClick={() => onMarkAsRead(alt.id)}
                    className="text-[11px] text-slate-500 hover:text-navy-900 font-semibold px-2 py-1 rounded hover:bg-slate-100"
                  >
                    Mark Read
                  </button>
                )}
                <button
                  onClick={() => {
                    const tabMap: Record<string, string> = {
                      '/inventory/stock': 'stock',
                      '/indents': 'indents',
                      '/inventory/inward': 'inward'
                    };
                    onNavigate(tabMap[alt.actionUrl] || 'dashboard');
                  }}
                  className="bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 transition"
                >
                  <span>Resolve</span>
                  <ExternalLink className="w-3 h-3 text-gold-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
