import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight, 
  Factory, 
  Truck, 
  FileCheck, 
  ShieldAlert, 
  Clock, 
  Package,
  QrCode,
  ArrowRight
} from 'lucide-react';
import { 
  StockItem, 
  InwardGRN, 
  PressWorkOrder, 
  IndentRequisition, 
  DispatchChallan, 
  LedgerTransaction,
  I18N 
} from '../data/mockData';

interface DashboardViewProps {
  lang: 'en' | 'as';
  stockItems: StockItem[];
  grns: InwardGRN[];
  pressJobs: PressWorkOrder[];
  indents: IndentRequisition[];
  dispatches: DispatchChallan[];
  transactions: LedgerTransaction[];
  onNavigate: (tab: string) => void;
  activeRole: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  lang,
  stockItems,
  grns,
  pressJobs,
  indents,
  dispatches,
  transactions,
  onNavigate,
  activeRole
}) => {
  const t = I18N[lang];

  // Calculations
  const totalValuation = stockItems.reduce((acc, s) => acc + (s.currentStock * s.valuationPerUnit), 0);
  const criticalItems = stockItems.filter(s => s.status === 'Critical');
  const lowStockItems = stockItems.filter(s => s.status === 'Low Stock');
  const pendingSanctions = indents.filter(i => i.status === 'Submitted' || i.status === 'Verified');
  const activeJobs = pressJobs.filter(j => j.status === 'In Press' || j.status === 'Scheduled');
  
  // Average press spoilage
  const totalIssuedKg = pressJobs.reduce((acc, j) => acc + j.paperIssuedKg, 0);
  const totalSpoilageKg = pressJobs.reduce((acc, j) => acc + j.spoilageKg, 0);
  const avgSpoilagePct = totalIssuedKg > 0 ? ((totalSpoilageKg / totalIssuedKg) * 100).toFixed(2) : '2.45';

  return (
    <div className="space-y-6">
      {/* Welcome & Context Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 rounded-xl p-5 text-white shadow-lg border border-navy-700 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center pr-10 pointer-events-none">
          <Factory className="w-64 h-64 text-gold-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gold-500 text-navy-950">
                {activeRole} Active
              </span>
              <span className="text-xs text-gold-400 font-mono">
                Assam State Press Portal · Bamunimaidam
              </span>
            </div>
            <h2 className="text-2xl font-black mt-1 text-white tracking-tight">
              {lang === 'en' ? 'Digital Inventory & Material Ledger' : 'ডিজিটেল মজুত আৰু সামগ্ৰী খতিয়ান'}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {lang === 'en' 
                ? 'Real-time reconciliation of raw paper reels, web offset print runs, machine trimming spoilage, and cryptographic QR delivery e-Challans across Assam Government departments.'
                : 'কাঁচা কাগজৰ ৰীল, ৱেব অফছেট মুদ্ৰণ, যন্ত্ৰৰ অপচয় আৰু অসম চৰকাৰৰ বিভাগসমূহলৈ ই-চালানৰ জৰিয়তে প্ৰেৰণৰ লাইভ খতিয়ান।'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('inward')}
              className="bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold px-3.5 py-2 rounded-lg text-xs flex items-center space-x-1.5 shadow transition"
            >
              <Package className="w-4 h-4" />
              <span>{t.createGRN}</span>
            </button>
            <button
              onClick={() => onNavigate('indents')}
              className="bg-navy-700 hover:bg-navy-600 text-white border border-navy-500 font-semibold px-3.5 py-2 rounded-lg text-xs flex items-center space-x-1.5 transition"
            >
              <FileCheck className="w-4 h-4 text-gold-400" />
              <span>{t.raiseIndent}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Valuation */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {lang === 'en' ? 'Store Valuation' : 'ভঁৰালৰ মুঠ মূল্য'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-navy-100 flex items-center justify-center text-navy-800">
              <span className="font-bold text-sm">₹</span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-navy-950">
              ₹{(totalValuation / 100000).toFixed(2)} Lakhs
            </span>
            <span className="text-emerald-700 bg-emerald-50 text-[11px] font-bold px-1.5 py-0.5 rounded flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +4.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {stockItems.length} active master catalog items tracked
          </p>
        </div>

        {/* Machine Spoilage Accounting */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {lang === 'en' ? 'Press Spoilage Rate' : 'ছপাশালৰ যন্ত্ৰ অপচয়'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Factory className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-navy-950">
              {avgSpoilagePct}%
            </span>
            <span className="text-emerald-800 bg-emerald-50 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-200">
              Norm &lt;3.5% OK
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {totalSpoilageKg} Kg spoilage out of {totalIssuedKg} Kg issued
          </p>
        </div>

        {/* Stockout Risk & Critical Alerts */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {lang === 'en' ? 'Stock Health Alerts' : 'মজুত সতৰ্কতা'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-navy-950">
              {criticalItems.length + lowStockItems.length}
            </span>
            <span className="text-red-700 bg-red-50 text-[11px] font-bold px-1.5 py-0.5 rounded">
              {criticalItems.length} Critical
            </span>
            <span className="text-amber-700 bg-amber-50 text-[11px] font-bold px-1.5 py-0.5 rounded">
              {lowStockItems.length} Low
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Art Paper & Azure Laid need replenishment
          </p>
        </div>

        {/* Pending Sanctions & Outward e-Challans */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {lang === 'en' ? 'Indents & Dispatches' : 'আবেদন আৰু প্ৰেৰণ'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-navy-100 flex items-center justify-center text-navy-800">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black text-navy-950">
              {pendingSanctions.length} / {dispatches.filter(d => d.status === 'In Transit').length}
            </span>
            <span className="text-navy-800 bg-navy-50 text-[11px] font-bold px-2 py-0.5 rounded">
              Active Flow
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {pendingSanctions.length} pending director sanctions, {dispatches.filter(d => d.status === 'In Transit').length} truck in transit
          </p>
        </div>
      </div>

      {/* Ledger Invariant Formula Card (P0 Requirement) */}
      <div className="bg-navy-900 border-l-4 border-gold-500 text-white rounded-xl p-4 shadow">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-gold-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-gold-300">
                {lang === 'en' ? 'Central Ledger Mathematical Invariant Rule' : 'কেন্দ্ৰীয় খতিয়ানৰ গাণিতিক নীতি'}
              </h4>
              <span className="text-[10px] bg-navy-800 text-emerald-400 px-1.5 py-0.2 rounded font-mono">
                100% Deterministic · Zero Overselling
              </span>
            </div>
            <div className="font-mono text-sm sm:text-base text-slate-100 font-semibold bg-navy-950/70 p-2 rounded border border-navy-700">
              Available Stock = Opening Balance (2,435) + Approved Inflows (4,230) - Confirmed Outflows (3,410) ± Adjustments
            </div>
          </div>
          <button 
            onClick={() => onNavigate('stock')}
            className="text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center space-x-1 whitespace-nowrap bg-navy-800 px-3 py-1.5 rounded border border-navy-700"
          >
            <span>View Full Stock Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Operational 5-Step Visual Handoff Journey */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
              {lang === 'en' ? 'MudraKosh Closed-Loop Operational Handoff' : 'মুদ্ৰাকোষ বন্ধ-চক্ৰ কাৰ্যপ্ৰণালী'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'en' ? 'End-to-end synchronization across all 5 key human personas' : '৫ গৰাকী বিষয়া-কৰ্মচাৰীৰ মাজত সমন্বয়'}
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">Bamunimaidam Depot Pilot</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {/* Step 1 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:border-gold-400 transition cursor-pointer" onClick={() => onNavigate('inward')}>
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
              <span>STEP 01</span>
              <Truck className="w-3.5 h-3.5 text-navy-700" />
            </div>
            <h4 className="text-xs font-bold text-navy-900">Paper Mill Supplier</h4>
            <p className="text-[11px] text-slate-600 mt-1">Truck PO & gate entry check at security post.</p>
            <span className="mt-2 inline-block text-[10px] font-semibold bg-navy-100 text-navy-800 px-1.5 py-0.5 rounded">
              Gate Pass Cleared
            </span>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:border-gold-400 transition cursor-pointer" onClick={() => onNavigate('inward')}>
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
              <span>STEP 02</span>
              <QrCode className="w-3.5 h-3.5 text-navy-700" />
            </div>
            <h4 className="text-xs font-bold text-navy-900">Central Storekeeper</h4>
            <p className="text-[11px] text-slate-600 mt-1">GSM & moisture test, GRN creation & QR tagging.</p>
            <span className="mt-2 inline-block text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
              QR Tag Attached
            </span>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:border-gold-400 transition cursor-pointer" onClick={() => onNavigate('press')}>
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
              <span>STEP 03</span>
              <Factory className="w-3.5 h-3.5 text-navy-700" />
            </div>
            <h4 className="text-xs font-bold text-navy-900">Press Supervisor</h4>
            <p className="text-[11px] text-slate-600 mt-1">Offset machine print runs, spoilage (Kg) & RTS return.</p>
            <span className="mt-2 inline-block text-[10px] font-semibold bg-gold-100 text-gold-900 px-1.5 py-0.5 rounded">
              Spoilage 2.45%
            </span>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:border-gold-400 transition cursor-pointer" onClick={() => onNavigate('indents')}>
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
              <span>STEP 04</span>
              <FileCheck className="w-3.5 h-3.5 text-navy-700" />
            </div>
            <h4 className="text-xs font-bold text-navy-900">Directorate Director</h4>
            <p className="text-[11px] text-slate-600 mt-1">Sanction department indents against annual quota.</p>
            <span className="mt-2 inline-block text-[10px] font-semibold bg-navy-100 text-navy-800 px-1.5 py-0.5 rounded">
              Sanction Granted
            </span>
          </div>

          {/* Step 5 */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 hover:border-gold-400 transition cursor-pointer" onClick={() => onNavigate('dispatch')}>
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-1">
              <span>STEP 05</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <h4 className="text-xs font-bold text-navy-900">Recipient DDO</h4>
            <p className="text-[11px] text-slate-600 mt-1">Mobile QR scan & digital signature proof-of-delivery.</p>
            <span className="mt-2 inline-block text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
              Cryptographic POD
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Top Consuming Departments & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Consumption Analytics */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
                {lang === 'en' ? 'Top Consuming State Departments' : 'শীৰ্ষ ব্যৱহাৰকাৰী বিভাগসমূহ'}
              </h3>
              <p className="text-xs text-slate-500">FY 2026-27 Stationery Quota vs Issued</p>
            </div>
            <button 
              onClick={() => onNavigate('indents')}
              className="text-xs text-navy-700 hover:text-gold-600 font-semibold flex items-center"
            >
              <span>Manage Quotas</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-navy-900">General Administration Dept (Janata Bhawan)</span>
                <span className="text-navy-950 font-bold">450 / 600 Reams (75%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-navy-700 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-navy-900">Assam Police Headquarters (Logistics)</span>
                <span className="text-navy-950 font-bold">650 / 1000 Books (65%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-navy-600 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-navy-900">Finance (Expenditure) Department</span>
                <span className="text-navy-950 font-bold">310 / 500 Reams (62%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-gold-500 h-2 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-navy-900">Directorate of Health Services</span>
                <span className="text-red-700 font-bold">480 / 500 Reams (96% Near Quota)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-red-600 h-2 rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Immutable Ledger Transactions */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-navy-950 uppercase tracking-wider">
                {lang === 'en' ? 'Live Append-Only Ledger Feed' : 'প্ৰত্যক্ষ অপৰিৱৰ্তনীয় খতিয়ান তথ্য'}
              </h3>
              <p className="text-xs text-slate-500">Tamper-evident transactional audit log</p>
            </div>
            <button 
              onClick={() => onNavigate('stock')}
              className="text-xs text-navy-700 hover:text-gold-600 font-semibold flex items-center"
            >
              <span>Audit History</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="space-y-3">
            {transactions.slice(0, 4).map((tx) => (
              <div key={tx.id} className="flex items-start justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      tx.quantityChange > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-navy-100 text-navy-800'
                    }`}>
                      {tx.type}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">{tx.txHash}</span>
                  </div>
                  <div className="font-semibold text-navy-950">{tx.itemName}</div>
                  <div className="text-[11px] text-slate-500">
                    Ref: <span className="font-medium text-slate-700">{tx.referenceDoc}</span> · {tx.initiatedBy} ({tx.actorRole})
                  </div>
                </div>

                <div className="text-right">
                  <div className={`font-mono font-bold ${
                    tx.quantityChange > 0 ? 'text-emerald-700' : 'text-slate-800'
                  }`}>
                    {tx.quantityChange > 0 ? `+${tx.quantityChange}` : tx.quantityChange} {tx.unit}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">{tx.timestamp.split(' ')[1]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
