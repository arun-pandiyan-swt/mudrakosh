import React, { useState } from 'react';
import { Header } from './components/Header';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { StockLedgerView } from './components/StockLedgerView';
import { InwardGRNWizard } from './components/InwardGRNWizard';
import { PressFloorView } from './components/PressFloorView';
import { DepartmentIndentsView } from './components/DepartmentIndentsView';
import { DispatchChallanView } from './components/DispatchChallanView';
import { StatutoryReportsView } from './components/StatutoryReportsView';
import { AlertsView } from './components/AlertsView';
import { MobileHeader } from './components/mobile/MobileHeader';
import { GatePassView } from './components/mobile/GatePassView';
import { QRScannerView } from './components/mobile/QRScannerView';
import { DriverManifestView } from './components/mobile/DriverManifestView';
import { ProofOfDeliveryView } from './components/mobile/ProofOfDeliveryView';
import { 
  Truck, 
  QrCode, 
  Navigation, 
  FileCheck2, 
  Laptop, 
  Smartphone,
  LogOut
} from 'lucide-react';
import { 
  INITIAL_STOCK_ITEMS, 
  INITIAL_GRNS, 
  INITIAL_PRESS_JOBS, 
  INITIAL_INDENTS, 
  INITIAL_DISPATCHES, 
  INITIAL_LEDGER_TRANSACTIONS, 
  INITIAL_ALERTS,
  INITIAL_GATE_PASSES,
  StockItem,
  InwardGRN,
  PressWorkOrder,
  IndentRequisition,
  DispatchChallan,
  LedgerTransaction,
  AlertNotification,
  GatePassEntry
} from './data/mockData';

export const App: React.FC = () => {
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  
  // FIRST SCREEN MUST BE LOGIN SCREEN by default
  // Only authenticated if explicitly bypassed with ?auth=true
  const initialAuth = urlParams.get('auth') === 'true';
  const initialTab = urlParams.get('tab') || 'dashboard';
  const initialMobileTab = urlParams.get('tab') && ['scanner', 'gate', 'manifest', 'pod'].includes(urlParams.get('tab')!) 
    ? urlParams.get('tab')! 
    : 'scanner';
  const initialViewMode = (urlParams.get('view') === 'mobile' || urlParams.get('mode') === 'mobile') ? 'mobile' : 'desktop';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAuth);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>(initialViewMode);
  const [currentUser, setCurrentUser] = useState<string>('S. N. Talukdar, IAS');
  const [currentTab, setCurrentTab] = useState<string>(initialTab);
  const [mobileTab, setMobileTab] = useState<string>(initialMobileTab);
  const [lang, setLang] = useState<'en' | 'as'>('en');
  const [activeRole, setActiveRole] = useState<string>('Director');
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Application Data States
  const [stockItems, setStockItems] = useState<StockItem[]>(INITIAL_STOCK_ITEMS);
  const [grns, setGrns] = useState<InwardGRN[]>(INITIAL_GRNS);
  const [pressJobs, setPressJobs] = useState<PressWorkOrder[]>(INITIAL_PRESS_JOBS);
  const [indents, setIndents] = useState<IndentRequisition[]>(INITIAL_INDENTS);
  const [dispatches, setDispatches] = useState<DispatchChallan[]>(INITIAL_DISPATCHES);
  const [transactions, setTransactions] = useState<LedgerTransaction[]>(INITIAL_LEDGER_TRANSACTIONS);
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);
  const [gatePasses, setGatePasses] = useState<GatePassEntry[]>(INITIAL_GATE_PASSES);

  const handleLogin = (role: string, username: string) => {
    setActiveRole(role);
    setCurrentUser(username);
    setIsAuthenticated(true);
    
    // Auto-direct to mobile view if user selects field personas
    if (['Gate Guard', 'Delivery Driver'].includes(role)) {
      setViewMode('mobile');
      setMobileTab(role === 'Gate Guard' ? 'gate' : 'manifest');
    } else {
      setViewMode('desktop');
      setCurrentTab('dashboard');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Inward GRN Addition Handler with Immutable Ledger Entry
  const handleAddGRN = (newGRN: InwardGRN) => {
    setGrns(prev => [newGRN, ...prev]);

    // Update Stock Item
    setStockItems(prev => prev.map(item => {
      if (item.code === newGRN.itemCode) {
        const updatedStock = item.currentStock + newGRN.acceptedQty;
        return {
          ...item,
          currentStock: updatedStock,
          totalInward: item.totalInward + newGRN.acceptedQty,
          status: updatedStock < item.criticalThreshold ? 'Critical' : updatedStock < item.minThreshold ? 'Low Stock' : 'In Stock'
        };
      }
      return item;
    }));

    // Append-only Ledger Transaction
    const newTx: LedgerTransaction = {
      id: `tx-${Date.now()}`,
      txHash: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`,
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      itemCode: newGRN.itemCode,
      itemName: newGRN.itemName,
      type: 'INWARD_GRN',
      quantityChange: newGRN.acceptedQty,
      runningBalance: (stockItems.find(s => s.code === newGRN.itemCode)?.currentStock || 0) + newGRN.acceptedQty,
      unit: newGRN.unit,
      referenceDoc: newGRN.grnNumber,
      initiatedBy: newGRN.storekeeper.split(' ')[0],
      actorRole: 'Central Storekeeper'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  // Press Job Handler
  const handleUpdateJob = (updatedJob: PressWorkOrder) => {
    setPressJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));

    // If RTS (Return to store) was logged, credit stock
    if (updatedJob.status === 'RTS Received' && updatedJob.rtsPaperKg > 0) {
      setStockItems(prev => prev.map(item => {
        if (item.code === updatedJob.paperCode) {
          return {
            ...item,
            currentStock: item.currentStock + updatedJob.rtsPaperKg,
            allocatedPress: Math.max(0, item.allocatedPress - updatedJob.paperRequiredKg)
          };
        }
        return item;
      }));

      const newTx: LedgerTransaction = {
        id: `tx-${Date.now()}`,
        txHash: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`,
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
        itemCode: updatedJob.paperCode,
        itemName: updatedJob.jobTitle,
        type: 'PRESS_RTS',
        quantityChange: updatedJob.rtsPaperKg,
        runningBalance: (stockItems.find(s => s.code === updatedJob.paperCode)?.currentStock || 0) + updatedJob.rtsPaperKg,
        unit: 'Kg',
        referenceDoc: `RTS-${updatedJob.workOrderNo}`,
        initiatedBy: 'Press Supervisor',
        actorRole: 'Press Floor Supervisor'
      };
      setTransactions(prev => [newTx, ...prev]);
    }
  };

  const handleAddJob = (newJob: PressWorkOrder) => {
    setPressJobs(prev => [newJob, ...prev]);

    // Issue paper from available stock to allocated
    setStockItems(prev => prev.map(item => {
      if (item.code === newJob.paperCode) {
        return {
          ...item,
          currentStock: Math.max(0, item.currentStock - newJob.paperRequiredKg),
          allocatedPress: item.allocatedPress + newJob.paperRequiredKg
        };
      }
      return item;
    }));

    const newTx: LedgerTransaction = {
      id: `tx-${Date.now()}`,
      txHash: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`,
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      itemCode: newJob.paperCode,
      itemName: newJob.jobTitle,
      type: 'PRESS_ISSUE',
      quantityChange: -newJob.paperRequiredKg,
      runningBalance: (stockItems.find(s => s.code === newJob.paperCode)?.currentStock || 0) - newJob.paperRequiredKg,
      unit: 'Kg',
      referenceDoc: newJob.workOrderNo,
      initiatedBy: 'Press Supervisor',
      actorRole: 'Press Floor Supervisor'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  // Indent Handlers
  const handleUpdateIndent = (updated: IndentRequisition) => {
    setIndents(prev => prev.map(i => i.id === updated.id ? updated : i));
  };

  const handleAddIndent = (newIndent: IndentRequisition) => {
    setIndents(prev => [newIndent, ...prev]);
  };

  // Dispatch Handlers
  const handleUpdateDispatch = (updated: DispatchChallan) => {
    setDispatches(prev => prev.map(d => d.id === updated.id ? updated : d));

    if (updated.status === 'In Transit') {
      updated.items.forEach(it => {
        setStockItems(prev => prev.map(stock => {
          if (stock.code === it.itemCode) {
            return {
              ...stock,
              currentStock: Math.max(0, stock.currentStock - it.dispatchedQty),
              totalOutward: stock.totalOutward + it.dispatchedQty
            };
          }
          return stock;
        }));

        const newTx: LedgerTransaction = {
          id: `tx-${Date.now()}-${it.itemCode}`,
          txHash: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`,
          timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
          itemCode: it.itemCode,
          itemName: it.itemName,
          type: 'OUTWARD_DISPATCH',
          quantityChange: -it.dispatchedQty,
          runningBalance: Math.max(0, (stockItems.find(s => s.code === it.itemCode)?.currentStock || 0) - it.dispatchedQty),
          unit: 'Units',
          referenceDoc: updated.challanNumber,
          initiatedBy: 'Storekeeper',
          actorRole: 'Central Storekeeper'
        };
        setTransactions(prev => [newTx, ...prev]);
      });
    }
  };

  // Mobile Gate Pass Handler
  const handleAddGatePass = (newPass: GatePassEntry) => {
    setGatePasses(prev => [newPass, ...prev]);
  };

  // Mobile POD Confirmation Handler
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

  const handleMarkAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const unreadAlertCount = alerts.filter(a => !a.read).length;

  // 1. FIRST SCREEN: LOGIN SCREEN (if not authenticated)
  if (!isAuthenticated) {
    return (
      <LoginView
        onLogin={handleLogin}
        lang={lang}
        setLang={setLang}
      />
    );
  }

  const bottomNavItems = [
    { id: 'scanner', label: lang === 'en' ? 'Scanner' : 'স্কেনাৰ', icon: QrCode },
    { id: 'gate', label: lang === 'en' ? 'Gate Pass' : 'প্ৰৱেশদ্বাৰ', icon: Truck },
    { id: 'manifest', label: lang === 'en' ? 'Manifest' : 'চালান', icon: Navigation },
    { id: 'pod', label: lang === 'en' ? 'Sign POD' : 'স্বাক্ষৰ', icon: FileCheck2 },
  ];

  // 2. UNIFIED APP: RENDER FIELD MOBILE VIEW ON SAME PORT (5173)
  if (viewMode === 'mobile') {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center py-0 sm:py-6 sm:px-4 font-sans relative">
        {/* Mobile Device Frame */}
        <div className="w-full max-w-md bg-slate-100 min-h-screen sm:min-h-[820px] sm:max-h-[860px] sm:rounded-[36px] shadow-2xl flex flex-col overflow-hidden border-0 sm:border-8 sm:border-slate-800 relative">
          {/* Mobile Header */}
          <MobileHeader
            currentTab={mobileTab}
            setCurrentTab={setMobileTab}
            lang={lang}
            setLang={setLang}
            activeRole={activeRole}
            setActiveRole={setActiveRole}
            isOnline={isOnline}
            setIsOnline={setIsOnline}
          />

          {/* Scrollable View Container */}
          <main className="flex-1 overflow-y-auto p-3.5 pb-20">
            {mobileTab === 'scanner' && (
              <QRScannerView
                lang={lang}
                stockItems={stockItems}
                activeRole={activeRole}
              />
            )}

            {mobileTab === 'gate' && (
              <GatePassView
                lang={lang}
                gatePasses={gatePasses}
                onAddGatePass={handleAddGatePass}
                activeRole={activeRole}
              />
            )}

            {mobileTab === 'manifest' && (
              <DriverManifestView
                lang={lang}
                dispatches={dispatches}
                activeRole={activeRole}
              />
            )}

            {mobileTab === 'pod' && (
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
              const isActive = mobileTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setMobileTab(item.id)}
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

        {/* Floating Quick Action Controls (Same Port Switcher & Logout) */}
        <div className="fixed bottom-6 left-6 z-50 flex items-center space-x-3">
          <button
            onClick={() => setViewMode('desktop')}
            className="bg-navy-800/95 hover:bg-navy-900 text-white border border-gold-500/50 px-4 py-2.5 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-bold transition backdrop-blur-md"
            title="Switch to Desktop Directorate Portal on same port"
          >
            <Laptop className="w-4 h-4 text-gold-400" />
            <span>Switch to Desktop Portal</span>
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-950/90 hover:bg-red-900 text-red-200 border border-red-800/60 px-3 py-2.5 rounded-xl shadow-2xl flex items-center space-x-1.5 text-xs font-bold transition"
            title="Log Out of MudraKosh"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. UNIFIED APP: RENDER DESKTOP DIRECTORATE PORTAL ON SAME PORT (5173)
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        unreadAlertCount={unreadAlertCount}
        currentUser={currentUser}
        onLogout={handleLogout}
        onToggleViewMode={() => setViewMode('mobile')}
        viewMode={viewMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            lang={lang}
            stockItems={stockItems}
            grns={grns}
            pressJobs={pressJobs}
            indents={indents}
            dispatches={dispatches}
            transactions={transactions}
            onNavigate={setCurrentTab}
            activeRole={activeRole}
          />
        )}

        {currentTab === 'stock' && (
          <StockLedgerView
            lang={lang}
            stockItems={stockItems}
            transactions={transactions}
            activeRole={activeRole}
          />
        )}

        {currentTab === 'inward' && (
          <InwardGRNWizard
            lang={lang}
            grns={grns}
            stockItems={stockItems}
            onAddGRN={handleAddGRN}
            activeRole={activeRole}
          />
        )}

        {currentTab === 'press' && (
          <PressFloorView
            lang={lang}
            pressJobs={pressJobs}
            stockItems={stockItems}
            onUpdateJob={handleUpdateJob}
            onAddJob={handleAddJob}
            activeRole={activeRole}
          />
        )}

        {currentTab === 'indents' && (
          <DepartmentIndentsView
            lang={lang}
            indents={indents}
            stockItems={stockItems}
            onUpdateIndent={handleUpdateIndent}
            onAddIndent={handleAddIndent}
            activeRole={activeRole}
          />
        )}

        {currentTab === 'dispatch' && (
          <DispatchChallanView
            lang={lang}
            dispatches={dispatches}
            onUpdateDispatch={handleUpdateDispatch}
            activeRole={activeRole}
          />
        )}

        {currentTab === 'reports' && (
          <StatutoryReportsView
            lang={lang}
            stockItems={stockItems}
            pressJobs={pressJobs}
            transactions={transactions}
            activeRole={activeRole}
          />
        )}

        {currentTab === 'alerts' && (
          <AlertsView
            lang={lang}
            alerts={alerts}
            onMarkAsRead={handleMarkAlertRead}
            onNavigate={setCurrentTab}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-navy-950 text-slate-400 py-6 text-xs border-t-2 border-gold-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-gold-500 text-navy-950 flex items-center justify-center font-bold text-sm">
              ম
            </div>
            <div>
              <div className="text-white font-bold">MudraKosh (মুদ্ৰাকোষ) · Government Press & Stationery Portal</div>
              <div className="text-[11px] text-slate-400">Stream 1 · NESFIC-D-39 · Department of Information, Public Relations, Printing & Stationery, Govt. of Assam</div>
            </div>
          </div>
          <div className="text-center md:text-right text-[11px] space-y-1">
            <div className="text-gold-400 font-mono">Pilot Depot: Bamunimaidam Central Warehouse, Guwahati (Port 5173)</div>
            <div>GIGW 3.0 & DPDP Act 2023 Compliant · Central Append-Only Ledger</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
