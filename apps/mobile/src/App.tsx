import React, { useState } from 'react';
import { MobileHeader } from './components/MobileHeader';
import { GatePassView } from './components/GatePassView';
import { QRScannerView } from './components/QRScannerView';
import { DriverManifestView } from './components/DriverManifestView';
import { ProofOfDeliveryView } from './components/ProofOfDeliveryView';
import { 
  Truck, 
  QrCode, 
  Navigation, 
  FileCheck2,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { 
  INITIAL_STOCK_ITEMS, 
  INITIAL_DISPATCHES, 
  INITIAL_GATE_PASSES,
  StockItem,
  DispatchChallan,
  GatePassEntry
} from './data/mockData';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('scanner');
  const [lang, setLang] = useState<'en' | 'as'>('en');
  const [activeRole, setActiveRole] = useState<string>('Warehouse Storekeeper');
  const [isOnline, setIsOnline] = useState<boolean>(true);

  const [stockItems, setStockItems] = useState<StockItem[]>(INITIAL_STOCK_ITEMS);
  const [dispatches, setDispatches] = useState<DispatchChallan[]>(INITIAL_DISPATCHES);
  const [gatePasses, setGatePasses] = useState<GatePassEntry[]>(INITIAL_GATE_PASSES);

  const handleAddGatePass = (newPass: GatePassEntry) => {
    setGatePasses(prev => [newPass, ...prev]);
  };

  const handleConfirmDelivery = (challanNumber: string, officerName: string, signatureUrl: string) => {
    setDispatches(prev => prev.map(d => {
      if (d.challanNumber === challanNumber) {
        return {
          ...d,
          status: 'Delivered & Confirmed',
          signedBy: officerName,
          signedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
          signatureDataUrl: signatureUrl
        };
      }
      return d;
    }));
  };

  const bottomNavItems = [
    { id: 'scanner', label: lang === 'en' ? 'Scanner' : 'স্কেনাৰ', icon: QrCode },
    { id: 'gate', label: lang === 'en' ? 'Gate Pass' : 'প্ৰৱেশদ্বাৰ', icon: Truck },
    { id: 'manifest', label: lang === 'en' ? 'Manifest' : 'চালান', icon: Navigation },
    { id: 'pod', label: lang === 'en' ? 'Sign POD' : 'স্বাক্ষৰ', icon: FileCheck2 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center py-0 sm:py-6 sm:px-4 font-sans">
      {/* Mobile Device Frame */}
      <div className="w-full max-w-md bg-slate-100 min-h-screen sm:min-h-[820px] sm:max-h-[860px] sm:rounded-[36px] shadow-2xl flex flex-col overflow-hidden border-0 sm:border-8 sm:border-slate-800 relative">
        {/* Mobile Header */}
        <MobileHeader
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          lang={lang}
          setLang={setLang}
          activeRole={activeRole}
          setActiveRole={setActiveRole}
          isOnline={isOnline}
          setIsOnline={setIsOnline}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-3.5 pb-20">
          {currentTab === 'scanner' && (
            <QRScannerView
              lang={lang}
              stockItems={stockItems}
              activeRole={activeRole}
            />
          )}

          {currentTab === 'gate' && (
            <GatePassView
              lang={lang}
              gatePasses={gatePasses}
              onAddGatePass={handleAddGatePass}
              activeRole={activeRole}
            />
          )}

          {currentTab === 'manifest' && (
            <DriverManifestView
              lang={lang}
              dispatches={dispatches}
              activeRole={activeRole}
            />
          )}

          {currentTab === 'pod' && (
            <ProofOfDeliveryView
              lang={lang}
              dispatches={dispatches}
              onConfirmDelivery={handleConfirmDelivery}
              activeRole={activeRole}
            />
          )}
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-1.5 flex justify-around items-center z-40 shadow-lg">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex flex-col items-center py-1 px-3 rounded-xl transition ${
                  isActive ? 'text-navy-950 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-gold-500/20 text-navy-950' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-navy-950 stroke-[2.5]' : ''}`} />
                </div>
                <span className="text-[10px] mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Desktop Link to Web Portal */}
      <div className="hidden lg:block fixed bottom-6 left-6 z-50">
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="bg-navy-800/95 hover:bg-navy-900 text-white border border-gold-500/50 px-4 py-2.5 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-bold transition backdrop-blur-md"
        >
          <Laptop className="w-4 h-4 text-gold-400" />
          <span>Switch to Desktop Directorate Portal (Port 5173)</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>
    </div>
  );
};

export default App;
