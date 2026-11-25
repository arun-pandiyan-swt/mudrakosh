import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Layers, 
  Download, 
  History, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  FileSpreadsheet, 
  Building, 
  ChevronRight,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { StockItem, LedgerTransaction, I18N } from '../data/mockData';

interface StockLedgerViewProps {
  lang: 'en' | 'as';
  stockItems: StockItem[];
  transactions: LedgerTransaction[];
  activeRole: string;
}

export const StockLedgerView: React.FC<StockLedgerViewProps> = ({
  lang,
  stockItems,
  transactions,
  activeRole
}) => {
  const t = I18N[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedItemForAudit, setSelectedItemForAudit] = useState<StockItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = ['ALL', 'Paper - Reels', 'Paper - Reams', 'Inks & Chemicals', 'Printed Forms & Books'];
  const statuses = ['ALL', 'In Stock', 'Low Stock', 'Critical'];

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = 
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nameAs.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['Item Code', 'Item Name', 'Category', 'GSM', 'Unit', 'Opening Stock', 'Total Inward', 'Total Outward', 'Current Stock', 'Valuation (INR)', 'Status'];
    const rows = filteredItems.map(i => [
      i.code,
      `"${i.name}"`,
      i.category,
      i.gsm || 'N/A',
      i.unit,
      i.openingStock,
      i.totalInward,
      i.totalOutward,
      i.currentStock,
      i.currentStock * i.valuationPerUnit,
      i.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MudraKosh_Stock_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage(lang === 'en' ? 'Stock Ledger exported as CSV (CAG Audit Format)' : 'ষ্টক খতিয়ান চি.এ.জি. ফৰ্মেটত ডাউনলোড কৰা হʼল');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const itemAuditTransactions = selectedItemForAudit 
    ? transactions.filter(t => t.itemCode === selectedItemForAudit.code)
    : [];

  return (
    <div className="space-y-5">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-navy-950 text-gold-400 border border-gold-500/50 px-4 py-2.5 rounded-lg shadow-xl text-xs font-bold flex items-center space-x-2 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Export Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-navy-950 flex items-center gap-2">
            <Layers className="w-6 h-6 text-navy-800" />
            <span>{t.navStock}</span>
            <span className="text-xs bg-navy-100 text-navy-800 px-2 py-0.5 rounded font-mono font-semibold">
              {filteredItems.length} Items Listed
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'en' 
              ? 'Real-time perpetual stock ledger with strict row-locking & zero direct quantity overwrites.'
              : 'সক্ৰিয় অবিৰত ষ্টক খতিয়ান, অপৰিৱৰ্তনীয় লেনদেন আৰু নিৰীক্ষণ সুৰক্ষা।'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="bg-navy-800 hover:bg-navy-900 text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow transition"
          >
            <Download className="w-4 h-4 text-gold-400" />
            <span>{t.downloadReport}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-navy-800 focus:border-navy-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 text-navy-950 focus:outline-none focus:ring-1 focus:ring-navy-800 bg-white"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'ALL' ? t.allCategories : c}</option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-2 text-navy-950 focus:outline-none focus:ring-1 focus:ring-navy-800 bg-white"
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s === 'ALL' ? t.allStatuses : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-navy-900 text-white uppercase text-[11px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Item Code & Name</th>
                <th className="py-3 px-3">Category / GSM</th>
                <th className="py-3 px-3">Depot Location</th>
                <th className="py-3 px-3 text-right">Opening</th>
                <th className="py-3 px-3 text-right">Inward (+)</th>
                <th className="py-3 px-3 text-right">Outward (-)</th>
                <th className="py-3 px-3 text-right">Available Stock</th>
                <th className="py-3 px-3 text-right">Valuation (₹)</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredItems.map((item) => {
                const isCritical = item.status === 'Critical';
                const isLow = item.status === 'Low Stock';
                const totalItemValuation = item.currentStock * item.valuationPerUnit;

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-navy-900">{item.code}</div>
                      <div className="font-semibold text-slate-900">{lang === 'en' ? item.name : item.nameAs}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-800">{item.category}</span>
                      {item.gsm && (
                        <div className="text-[11px] font-mono text-slate-500 font-semibold">{item.gsm} GSM</div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <div className="font-medium text-slate-800 flex items-center space-x-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.bayRackLocation}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      {item.openingStock.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-700 font-semibold">
                      +{item.totalInward.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700">
                      -{item.totalOutward.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-navy-950 text-sm">
                      {item.currentStock.toLocaleString()} <span className="text-[11px] font-normal text-slate-500">{item.unit}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-slate-800">
                      ₹{totalItemValuation.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isCritical 
                          ? 'bg-red-100 text-red-800 border border-red-200' 
                          : isLow 
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setSelectedItemForAudit(item)}
                        className="p-1.5 rounded-lg bg-navy-50 hover:bg-navy-100 text-navy-800 transition"
                        title="View Immutable Audit Ledger"
                      >
                        <History className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Audit Drawer for Selected Item */}
      {selectedItemForAudit && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end animate-fade-in">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-gold-600" />
                  <div>
                    <h3 className="font-bold text-navy-950 text-sm">
                      {lang === 'en' ? 'Immutable Ledger Audit Trail' : 'অপৰিৱৰ্তনীয় খতিয়ান তথ্য'}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      {selectedItemForAudit.code} · {selectedItemForAudit.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItemForAudit(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Item Balance Summary Card */}
              <div className="my-4 p-3 bg-navy-50 rounded-lg border border-navy-100 text-xs flex justify-between items-center">
                <div>
                  <span className="text-slate-500">Current Balance:</span>
                  <div className="text-base font-black text-navy-950 font-mono">
                    {selectedItemForAudit.currentStock} {selectedItemForAudit.unit}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Threshold:</span>
                  <div className="font-mono text-slate-700">
                    Min: {selectedItemForAudit.minThreshold} | Crit: {selectedItemForAudit.criticalThreshold}
                  </div>
                </div>
              </div>

              {/* Transaction Logs */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Audit Log Entries ({itemAuditTransactions.length})
                </h4>
                {itemAuditTransactions.length === 0 ? (
                  <div className="p-4 bg-slate-50 rounded-lg text-slate-500 text-center text-xs">
                    No individual ledger records found for this specific item in current session.
                  </div>
                ) : (
                  itemAuditTransactions.map((tx) => (
                    <div key={tx.id} className="p-3 rounded-lg border border-slate-200 bg-white space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.quantityChange > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-navy-100 text-navy-800'
                        }`}>
                          {tx.type}
                        </span>
                        <span className="font-mono text-[11px] text-slate-400">{tx.timestamp}</span>
                      </div>
                      <div className="flex justify-between items-baseline font-mono">
                        <span className="text-slate-600 font-sans">Delta:</span>
                        <span className={`font-bold ${tx.quantityChange > 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                          {tx.quantityChange > 0 ? `+${tx.quantityChange}` : tx.quantityChange} {tx.unit}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline font-mono text-[11px]">
                        <span className="text-slate-500 font-sans">Running Balance:</span>
                        <span className="font-bold text-navy-950">{tx.runningBalance} {tx.unit}</span>
                      </div>
                      <div className="pt-1 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                        <span>Ref: {tx.referenceDoc}</span>
                        <span>By: {tx.initiatedBy}</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 truncate">
                        SHA-256: {tx.txHash}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 mt-6">
              <button
                onClick={() => setSelectedItemForAudit(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 rounded-lg text-xs"
              >
                Close Audit Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
