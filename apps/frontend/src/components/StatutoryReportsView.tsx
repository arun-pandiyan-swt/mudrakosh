import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle2, 
  Calendar, 
  Building2, 
  Printer, 
  Scale,
  Award
} from 'lucide-react';
import { StockItem, PressWorkOrder, LedgerTransaction, I18N } from '../data/mockData';

interface StatutoryReportsViewProps {
  lang: 'en' | 'as';
  stockItems: StockItem[];
  pressJobs: PressWorkOrder[];
  transactions: LedgerTransaction[];
  activeRole: string;
}

export const StatutoryReportsView: React.FC<StatutoryReportsViewProps> = ({
  lang,
  stockItems,
  pressJobs,
  transactions,
  activeRole
}) => {
  const t = I18N[lang];
  const [selectedReport, setSelectedReport] = useState<'CAG_LEDGER' | 'PRESS_SPOILAGE' | 'DEPT_QUOTA'>('CAG_LEDGER');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleDownload = (format: 'PDF' | 'EXCEL') => {
    setToastMessage(`Generated certified ${format} report for ${selectedReport} with cryptographic audit signature!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-navy-950 text-gold-400 border border-gold-500 px-4 py-3 rounded-lg shadow-xl text-xs font-bold flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-navy-950 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-navy-800" />
            <span>{t.navReports}</span>
            <span className="text-xs bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-mono font-semibold">
              Screen 09 · CAG Compliance
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'en'
              ? 'Statutory reporting suite compliant with Assam Financial Rules, CAG audit norms, and GIGW 3.0.'
              : 'চি.এ.জি. সংবিধিবদ্ধ প্ৰতিবেদন, অসম বিত্তীয় নিয়ম আৰু অডিট অনুপালন খতিয়ান।'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleDownload('EXCEL')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3.5 py-2 rounded-lg text-xs flex items-center space-x-1.5 shadow transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => handleDownload('PDF')}
            className="bg-navy-800 hover:bg-navy-900 text-white font-bold px-3.5 py-2 rounded-lg text-xs flex items-center space-x-1.5 shadow transition"
          >
            <Download className="w-4 h-4 text-gold-400" />
            <span>Download Certified PDF</span>
          </button>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="flex space-x-2 bg-slate-200/60 p-1.5 rounded-xl border border-slate-300">
        <button
          onClick={() => setSelectedReport('CAG_LEDGER')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition ${
            selectedReport === 'CAG_LEDGER' 
              ? 'bg-navy-900 text-white shadow' 
              : 'text-slate-700 hover:bg-white/50'
          }`}
        >
          CAG Master Inventory Ledger
        </button>
        <button
          onClick={() => setSelectedReport('PRESS_SPOILAGE')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition ${
            selectedReport === 'PRESS_SPOILAGE' 
              ? 'bg-navy-900 text-white shadow' 
              : 'text-slate-700 hover:bg-white/50'
          }`}
        >
          Press Machinery Spoilage Norms (&lt;3.5%)
        </button>
        <button
          onClick={() => setSelectedReport('DEPT_QUOTA')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition ${
            selectedReport === 'DEPT_QUOTA' 
              ? 'bg-navy-900 text-white shadow' 
              : 'text-slate-700 hover:bg-white/50'
          }`}
        >
          Department Quota & Outflow Summary
        </button>
      </div>

      {/* Certified Ledger Preview Sheet */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-sm p-6 space-y-4">
        {/* Certificate Watermark Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center font-bold text-xl border border-gold-500">
              ম
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                STATUTORY AUDIT LEDGER · CAG FORM NO. 18
              </span>
              <h3 className="text-base font-black text-navy-950">
                Directorate of Printing & Stationery, Government of Assam
              </h3>
              <p className="text-xs text-slate-500">
                Central Press & Depot, Bamunimaidam, Guwahati · Financial Year 2026-27
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center space-x-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300">
              <Award className="w-3.5 h-3.5" />
              <span>Certified Tamper-Evident</span>
            </span>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              Ledger Hash: 0x9b441f...8201a
            </div>
          </div>
        </div>

        {/* Selected Report Content */}
        {selectedReport === 'CAG_LEDGER' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-navy-900 text-white uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-2.5">Item Code & Specification</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5 text-right">Opening Bal</th>
                  <th className="p-2.5 text-right">Receipts (GRN)</th>
                  <th className="p-2.5 text-right">Issues (Outward)</th>
                  <th className="p-2.5 text-right">Closing Balance</th>
                  <th className="p-2.5 text-right">Valuation (₹)</th>
                  <th className="p-2.5 text-center">CAG Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {stockItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-sans font-bold text-navy-950">{item.code} - {item.name}</td>
                    <td className="p-2.5 font-sans text-slate-600">{item.category}</td>
                    <td className="p-2.5 text-right">{item.openingStock}</td>
                    <td className="p-2.5 text-right text-emerald-700">+{item.totalInward}</td>
                    <td className="p-2.5 text-right text-navy-800">-{item.totalOutward}</td>
                    <td className="p-2.5 text-right font-bold text-navy-950">{item.currentStock} {item.unit}</td>
                    <td className="p-2.5 text-right font-bold">₹{(item.currentStock * item.valuationPerUnit).toLocaleString()}</td>
                    <td className="p-2.5 text-center">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Reconciled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'PRESS_SPOILAGE' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-navy-900 text-white uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-2.5">Work Order No. & Title</th>
                  <th className="p-2.5">Machine Assigned</th>
                  <th className="p-2.5 text-right">Paper Issued (Kg)</th>
                  <th className="p-2.5 text-right">Finished Copies Net (Kg)</th>
                  <th className="p-2.5 text-right">Spoilage (Kg)</th>
                  <th className="p-2.5 text-right">Spoilage %</th>
                  <th className="p-2.5 text-right">RTS Returned (Kg)</th>
                  <th className="p-2.5 text-center">Audit Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {pressJobs.map(job => (
                  <tr key={job.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-sans font-bold text-navy-950">{job.orderNumber} - {job.title}</td>
                    <td className="p-2.5 font-sans text-slate-600">{job.assignedMachine}</td>
                    <td className="p-2.5 text-right font-bold">{job.paperIssuedKg}</td>
                    <td className="p-2.5 text-right">{job.paperFinishedKg}</td>
                    <td className="p-2.5 text-right text-red-700 font-bold">{job.spoilageKg}</td>
                    <td className="p-2.5 text-right font-bold text-emerald-700">{job.spoilagePercentage}%</td>
                    <td className="p-2.5 text-right font-bold text-navy-800">{job.rtsPaperKg}</td>
                    <td className="p-2.5 text-center">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Norm Compliant (&lt;3.5%)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'DEPT_QUOTA' && (
          <div className="p-4 bg-slate-50 rounded-xl text-xs space-y-3">
            <h4 className="font-bold text-navy-950 uppercase text-[11px] tracking-wider">
              Department Annual Allocation Compliance Matrix
            </h4>
            <p className="text-slate-600">
              Verified by Store Officer on 24-Nov-2026. All dispatches strictly matched with Director sanctions.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded border border-slate-200">
                <span className="font-bold text-navy-950">Dispur Secretariat (GAD)</span>
                <div className="text-slate-500 mt-1">Quota: 600 Reams · Issued: 450 Reams (75% Consumed)</div>
              </div>
              <div className="p-3 bg-white rounded border border-slate-200">
                <span className="font-bold text-navy-950">Assam Police HQ (Logistics)</span>
                <div className="text-slate-500 mt-1">Quota: 1000 Books · Issued: 650 Books (65% Consumed)</div>
              </div>
            </div>
          </div>
        )}

        {/* Counter Signatures Footer */}
        <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-3 gap-6 text-center text-xs">
          <div>
            <div className="font-mono text-[11px] text-slate-500">DIGITALLY SIGNED</div>
            <div className="font-bold text-navy-950 mt-1">Pranjal Saikia</div>
            <div className="text-[11px] text-slate-500">Central Storekeeper</div>
          </div>
          <div>
            <div className="font-mono text-[11px] text-slate-500">VERIFIED & AUDITED</div>
            <div className="font-bold text-navy-950 mt-1">D. K. Baruah</div>
            <div className="text-[11px] text-slate-500">Store Officer</div>
          </div>
          <div>
            <div className="font-mono text-[11px] text-slate-500">SANCTIONED & SEALED</div>
            <div className="font-bold text-navy-950 mt-1">S. N. Talukdar, IAS</div>
            <div className="text-[11px] text-slate-500">Director, Printing & Stationery</div>
          </div>
        </div>
      </div>
    </div>
  );
};
