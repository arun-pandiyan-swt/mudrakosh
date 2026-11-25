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
import { 
  INITIAL_STOCK_ITEMS, 
  INITIAL_GRNS, 
  INITIAL_PRESS_JOBS, 
  INITIAL_INDENTS, 
  INITIAL_DISPATCHES, 
  INITIAL_LEDGER_TRANSACTIONS, 
  INITIAL_ALERTS,
  StockItem,
  InwardGRN,
  PressWorkOrder,
  IndentRequisition,
  DispatchChallan,
  LedgerTransaction,
  AlertNotification
} from './data/mockData';

export const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<string>('S. N. Talukdar, IAS');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [lang, setLang] = useState<'en' | 'as'>('en');
  const [activeRole, setActiveRole] = useState<string>('Director');

  const handleLogin = (role: string, username: string) => {
    setActiveRole(role);
    setCurrentUser(username);
    setIsAuthenticated(true);
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Application Data States
  const [stockItems, setStockItems] = useState<StockItem[]>(INITIAL_STOCK_ITEMS);
  const [grns, setGrns] = useState<InwardGRN[]>(INITIAL_GRNS);
  const [pressJobs, setPressJobs] = useState<PressWorkOrder[]>(INITIAL_PRESS_JOBS);
  const [indents, setIndents] = useState<IndentRequisition[]>(INITIAL_INDENTS);
  const [dispatches, setDispatches] = useState<DispatchChallan[]>(INITIAL_DISPATCHES);
  const [transactions, setTransactions] = useState<LedgerTransaction[]>(INITIAL_LEDGER_TRANSACTIONS);
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);

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
    if (updatedJob.rtsPaperKg > 0) {
      setStockItems(prev => prev.map(item => {
        if (item.code === updatedJob.paperCode) {
          return {
            ...item,
            currentStock: item.currentStock + updatedJob.rtsPaperKg
          };
        }
        return item;
      }));

      const newTx: LedgerTransaction = {
        id: `tx-${Date.now()}`,
        txHash: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`,
        timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
        itemCode: updatedJob.paperCode,
        itemName: updatedJob.paperName,
        type: 'PRESS_RTS',
        quantityChange: updatedJob.rtsPaperKg,
        runningBalance: (stockItems.find(s => s.code === updatedJob.paperCode)?.currentStock || 0) + updatedJob.rtsPaperKg,
        unit: 'Kg',
        referenceDoc: `${updatedJob.orderNumber} (RTS Return)`,
        initiatedBy: updatedJob.supervisor.split(' ')[0],
        actorRole: 'Press Floor Supervisor'
      };
      setTransactions(prev => [newTx, ...prev]);
    }
  };

  const handleAddJob = (newJob: PressWorkOrder) => {
    setPressJobs(prev => [newJob, ...prev]);

    // Issue paper from stock
    setStockItems(prev => prev.map(item => {
      if (item.code === newJob.paperCode) {
        return {
          ...item,
          currentStock: Math.max(0, item.currentStock - newJob.paperIssuedKg),
          allocatedPress: item.allocatedPress + newJob.paperIssuedKg
        };
      }
      return item;
    }));

    const newTx: LedgerTransaction = {
      id: `tx-${Date.now()}`,
      txHash: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`,
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      itemCode: newJob.paperCode,
      itemName: newJob.paperName,
      type: 'PRESS_ISSUE',
      quantityChange: -newJob.paperIssuedKg,
      runningBalance: Math.max(0, (stockItems.find(s => s.code === newJob.paperCode)?.currentStock || 0) - newJob.paperIssuedKg),
      unit: 'Kg',
      referenceDoc: newJob.orderNumber,
      initiatedBy: activeRole,
      actorRole: 'Store Officer'
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  // Indent Handler
  const handleUpdateIndent = (updatedIndent: IndentRequisition) => {
    setIndents(prev => prev.map(i => i.id === updatedIndent.id ? updatedIndent : i));

    // When an indent is sanctioned, create the outward dispatch record
    if (updatedIndent.status === 'Sanctioned' || updatedIndent.status === 'Partially Sanctioned') {
      const challanNo = updatedIndent.eChallanRef || `ECH-2026-078${dispatches.length + 5}`;
      const newDispatch: DispatchChallan = {
        id: `dsp-${Date.now()}`,
        challanNumber: challanNo,
        indentRef: updatedIndent.indentNumber,
        departmentName: updatedIndent.departmentName,
        deliveryLocation: 'State Receiving Section, Janata Bhawan, Dispur',
        vehicleNumber: 'AS-01-GC-4482',
        driverName: 'Rupam Borah',
        driverPhone: '+91-98642-11002',
        securityGatePass: `OUT-GP-2026-0${dispatches.length + 620}`,
        qrHash: `MUDRA-${challanNo}-SHA256-${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
        items: updatedIndent.items.map(it => ({
          itemCode: it.itemCode,
          itemName: it.itemName,
          qty: it.sanctionedQty > 0 ? it.sanctionedQty : it.requestedQty,
          unit: it.unit,
          bundleNos: `BNDL-${challanNo.slice(-4)}-01 to 10`
        })),
        dispatchDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
        status: 'Ready for Dispatch'
      };
      setDispatches(prev => [newDispatch, ...prev]);
    }
  };

  const handleAddIndent = (newIndent: IndentRequisition) => {
    setIndents(prev => [newIndent, ...prev]);
  };

  // Dispatch Handler
  const handleUpdateDispatch = (updatedDispatch: DispatchChallan) => {
    setDispatches(prev => prev.map(d => d.id === updatedDispatch.id ? updatedDispatch : d));

    // If dispatched, deduct confirmed stock
    if (updatedDispatch.status === 'In Transit') {
      updatedDispatch.items.forEach(it => {
        setStockItems(prev => prev.map(s => {
          if (s.code === it.itemCode) {
            const nextStock = Math.max(0, s.currentStock - it.qty);
            return {
              ...s,
              currentStock: nextStock,
              totalOutward: s.totalOutward + it.qty,
              status: nextStock < s.criticalThreshold ? 'Critical' : nextStock < s.minThreshold ? 'Low Stock' : 'In Stock'
            };
          }
          return s;
        }));

        const newTx: LedgerTransaction = {
          id: `tx-${Date.now()}`,
          txHash: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`,
          timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
          itemCode: it.itemCode,
          itemName: it.itemName,
          type: 'OUTWARD_DISPATCH',
          quantityChange: -it.qty,
          runningBalance: Math.max(0, (stockItems.find(s => s.code === it.itemCode)?.currentStock || 0) - it.qty),
          unit: it.unit,
          referenceDoc: updatedDispatch.challanNumber,
          initiatedBy: 'Pranjal Saikia',
          actorRole: 'Central Storekeeper'
        };
        setTransactions(prev => [newTx, ...prev]);
      });
    }
  };

  const handleMarkAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const unreadAlertCount = alerts.filter(a => !a.read).length;

  if (!isAuthenticated) {
    return (
      <LoginView
        onLogin={handleLogin}
        lang={lang}
        setLang={setLang}
      />
    );
  }

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
            <div className="text-gold-400 font-mono">Pilot Depot: Bamunimaidam Central Warehouse, Guwahati</div>
            <div>GIGW 3.0 & DPDP Act 2023 Compliant · Central Append-Only Ledger</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
