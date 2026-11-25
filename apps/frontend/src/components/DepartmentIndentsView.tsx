import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Plus, 
  Building2, 
  Clock, 
  ShieldCheck, 
  FileCheck, 
  User, 
  Send,
  Eye,
  ArrowRight
} from 'lucide-react';
import { IndentRequisition, StockItem, I18N } from '../data/mockData';

interface DepartmentIndentsViewProps {
  lang: 'en' | 'as';
  indents: IndentRequisition[];
  stockItems: StockItem[];
  onUpdateIndent: (updated: IndentRequisition) => void;
  onAddIndent: (newIndent: IndentRequisition) => void;
  activeRole: string;
}

export const DepartmentIndentsView: React.FC<DepartmentIndentsViewProps> = ({
  lang,
  indents,
  stockItems,
  onUpdateIndent,
  onAddIndent,
  activeRole
}) => {
  const t = I18N[lang];
  const [showNewIndentModal, setShowNewIndentModal] = useState(false);
  const [selectedIndentForReview, setSelectedIndentForReview] = useState<IndentRequisition | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Indent form state
  const [deptName, setDeptName] = useState('Directorate of Higher Education, Kahilipara, Guwahati');
  const [nodalOfficer, setNodalOfficer] = useState('Dr. Pranab Sarma, AES');
  const [designation, setDesignation] = useState('Deputy Director (Administration)');
  const [contactNo, setContactNo] = useState('+91-94350-66712');
  const [selectedItemCode, setSelectedItemCode] = useState('PPR-WHT-80');
  const [requestedQty, setRequestedQty] = useState(60);
  const [purpose, setPurpose] = useState('College inspection reports and state degree certificate printing paper');
  const [priority, setPriority] = useState<'Routine' | 'Urgent' | 'VVIP Assembly'>('Routine');

  const canSanction = activeRole === 'Director' || activeRole === 'Super Admin';
  const canVerify = activeRole === 'Store Officer' || canSanction;

  const handleSanction = (indent: IndentRequisition, isPartial = false) => {
    const updated: IndentRequisition = {
      ...indent,
      status: isPartial ? 'Partially Sanctioned' : 'Sanctioned',
      sanctionedBy: 'S. N. Talukdar, IAS (Director, Printing & Stationery)',
      sanctionDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
      eChallanRef: `ECH-2026-078${indents.length + 3}`,
      items: indent.items.map(item => ({
        ...item,
        sanctionedQty: isPartial ? Math.round(item.requestedQty * 0.7) : item.requestedQty
      }))
    };

    onUpdateIndent(updated);
    setSelectedIndentForReview(null);
    setToastMessage(`Indent ${indent.indentNumber} successfully ${updated.status}. Outward e-Challan queued!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleReturnCorrection = (indent: IndentRequisition) => {
    const updated: IndentRequisition = {
      ...indent,
      status: 'Verified'
    };
    onUpdateIndent(updated);
    setSelectedIndentForReview(null);
    setToastMessage(`Indent ${indent.indentNumber} marked for verification.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateIndent = () => {
    const item = stockItems.find(s => s.code === selectedItemCode);
    const newIndent: IndentRequisition = {
      id: `ind-${Date.now()}`,
      indentNumber: `IND-2026-041${indents.length + 6}`,
      departmentName: deptName,
      departmentCode: `DEPT-${deptName.slice(0, 4).toUpperCase()}-0${indents.length + 1}`,
      nodalOfficer,
      designation,
      contactNo,
      items: [
        {
          itemCode: selectedItemCode,
          itemName: item ? item.name : 'Stationery Item',
          requestedQty: Number(requestedQty),
          sanctionedQty: 0,
          unit: item ? item.unit : 'Reams',
          annualQuota: 400,
          utilizedQuota: 220
        }
      ],
      purpose,
      priority,
      status: 'Submitted',
      submittedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    onAddIndent(newIndent);
    setShowNewIndentModal(false);
    setToastMessage(`New Indent ${newIndent.indentNumber} submitted by ${nodalOfficer}!`);
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
            <FileText className="w-6 h-6 text-navy-800" />
            <span>{t.navIndents}</span>
            <span className="text-xs bg-navy-100 text-navy-900 px-2 py-0.5 rounded font-mono font-semibold">
              Screen 06 · Online Department Requisition
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'en'
              ? 'Multi-tier digital requisition portal: quota compliance checking, Director sanctions, and automated outward challan queueing.'
              : 'বিভাগীয় অনলাইন আবেদন, বাৰ্ষিক কোটা নিৰীক্ষণ, সঞ্চালকৰ মঞ্জুৰী আৰু ই-চালান প্ৰস্তুতি।'}
          </p>
        </div>

        <button
          onClick={() => setShowNewIndentModal(true)}
          className="bg-navy-800 hover:bg-navy-900 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center space-x-1.5 shadow transition"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>{t.raiseIndent}</span>
        </button>
      </div>

      {/* Role Permission Advice Banner */}
      <div className="bg-slate-100 border border-slate-300 p-3 rounded-lg text-xs flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-navy-800" />
          <span className="text-slate-700">
            Current Persona: <strong className="text-navy-950">{activeRole}</strong>. 
            {canSanction 
              ? ' You have executive authority to Sanction / Reject indents.' 
              : ' Only Directorate Leadership (Director) has sanction authority.'}
          </span>
        </div>
        <span className="text-[11px] font-mono font-bold text-navy-800">
          Dual-Authorization RBAC Active
        </span>
      </div>

      {/* Indents List Grid */}
      <div className="space-y-4">
        {indents.map((indent) => {
          const isSanctioned = indent.status === 'Sanctioned' || indent.status === 'Partially Sanctioned';
          const isUrgent = indent.priority === 'Urgent' || indent.priority === 'VVIP Assembly';

          return (
            <div key={indent.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-navy-900 bg-navy-50 px-2 py-0.5 rounded">
                      {indent.indentNumber}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSanctioned 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : indent.status === 'Verified'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {indent.status}
                    </span>
                    {isUrgent && (
                      <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                        {indent.priority}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-navy-950 mt-1">
                    {indent.departmentName}
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Nodal Officer: <span className="font-semibold text-slate-800">{indent.nodalOfficer}</span> ({indent.designation}) · {indent.contactNo}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {canSanction && !isSanctioned && (
                    <button
                      onClick={() => handleSanction(indent)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 shadow transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sanction Indent</span>
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedIndentForReview(indent)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Review Details</span>
                  </button>
                </div>
              </div>

              {/* Items & Quota Meter */}
              <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <h4 className="font-semibold text-slate-600 uppercase text-[10px] tracking-wider mb-2">
                    Requested Items
                  </h4>
                  <div className="space-y-1.5">
                    {indent.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200">
                        <span className="font-medium text-navy-950">{item.itemName}</span>
                        <span className="font-mono font-bold text-navy-900">
                          {isSanctioned ? item.sanctionedQty : item.requestedQty} {item.unit}
                          {isSanctioned && <span className="text-emerald-700 font-normal ml-1">(Sanctioned)</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-600 uppercase text-[10px] tracking-wider mb-2">
                    Department Annual Quota Status
                  </h4>
                  {indent.items.map((item, idx) => {
                    const pct = Math.round((item.utilizedQuota / item.annualQuota) * 100);
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                          <span>{item.itemCode} Utilization:</span>
                          <span>{item.utilizedQuota} / {item.annualQuota} {item.unit} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${pct > 90 ? 'bg-red-600' : 'bg-navy-700'}`} 
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Purpose: {indent.purpose}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Review Modal */}
      {selectedIndentForReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <h3 className="font-bold text-navy-950 text-sm">
                Executive Indent Requisition Review
              </h3>
              <button 
                onClick={() => setSelectedIndentForReview(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Indent Number:</span>
                  <span className="font-mono font-bold text-navy-950">{selectedIndentForReview.indentNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-navy-950 text-right max-w-[280px]">{selectedIndentForReview.departmentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Officer:</span>
                  <span>{selectedIndentForReview.nodalOfficer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Purpose:</span>
                  <span className="text-slate-800 text-right max-w-[280px]">{selectedIndentForReview.purpose}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700">Requested Items Breakdown:</span>
                {selectedIndentForReview.items.map((it, i) => (
                  <div key={i} className="flex justify-between p-2 rounded border border-slate-200 bg-white">
                    <span>{it.itemName}</span>
                    <span className="font-mono font-bold">{it.requestedQty} {it.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex flex-wrap justify-end gap-2">
              <button
                onClick={() => setSelectedIndentForReview(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>

              {canSanction && selectedIndentForReview.status !== 'Sanctioned' && (
                <>
                  <button
                    onClick={() => handleSanction(selectedIndentForReview, true)}
                    className="px-3 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
                  >
                    Partial Sanction (70%)
                  </button>
                  <button
                    onClick={() => handleSanction(selectedIndentForReview, false)}
                    className="px-4 py-1.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sanction 100%</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* New Indent Modal */}
      {showNewIndentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <h3 className="font-bold text-navy-950 text-sm">
                Submit Online Department Requisition
              </h3>
              <button 
                onClick={() => setShowNewIndentModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">State Department Name</label>
                <input
                  type="text"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nodal Officer Name</label>
                  <input
                    type="text"
                    value={nodalOfficer}
                    onChange={(e) => setNodalOfficer(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Requested Stationery Item</label>
                  <select
                    value={selectedItemCode}
                    onChange={(e) => setSelectedItemCode(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono text-[11px]"
                  >
                    {stockItems.map(s => (
                      <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity Requested</label>
                  <input
                    type="number"
                    value={requestedQty}
                    onChange={(e) => setRequestedQty(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Purpose of Requirement</label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={2}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
              <button
                onClick={() => setShowNewIndentModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateIndent}
                className="px-4 py-2 text-xs font-bold bg-navy-800 hover:bg-navy-900 text-white rounded-lg flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5 text-gold-400" />
                <span>Submit Indent to Directorate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
