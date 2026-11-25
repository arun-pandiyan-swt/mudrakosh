import React, { useState } from 'react';
import { 
  Factory, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  RotateCcw, 
  FileText, 
  Gauge, 
  Scale, 
  Printer, 
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { PressWorkOrder, StockItem, I18N } from '../data/mockData';

interface PressFloorViewProps {
  lang: 'en' | 'as';
  pressJobs: PressWorkOrder[];
  stockItems: StockItem[];
  onUpdateJob: (updatedJob: PressWorkOrder) => void;
  onAddJob: (newJob: PressWorkOrder) => void;
  activeRole: string;
}

export const PressFloorView: React.FC<PressFloorViewProps> = ({
  lang,
  pressJobs,
  stockItems,
  onUpdateJob,
  onAddJob,
  activeRole
}) => {
  const t = I18N[lang];
  const [selectedJobForSpoilage, setSelectedJobForSpoilage] = useState<PressWorkOrder | null>(null);
  const [showNewJobModal, setShowNewJobModal] = useState(false);

  // Spoilage logging form state
  const [finishedKg, setFinishedKg] = useState(0);
  const [spoilageKg, setSpoilageKg] = useState(0);
  const [rtsKg, setRtsKg] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Work order form state
  const [orderTitle, setOrderTitle] = useState('The Assam Gazette Weekly Issue No. 48');
  const [publicationType, setPublicationType] = useState<'Gazette' | 'Budget' | 'Forms' | 'Reports' | 'General'>('Gazette');
  const [targetCopies, setTargetCopies] = useState(4000);
  const [assignedMachine, setAssignedMachine] = useState('Web Offset Harris Graphics Unit 01');
  const [selectedPaperCode, setSelectedPaperCode] = useState('PPR-MAP-70');
  const [paperIssuedKg, setPaperIssuedKg] = useState(1600);

  const openSpoilageModal = (job: PressWorkOrder) => {
    setSelectedJobForSpoilage(job);
    setFinishedKg(job.paperFinishedKg || Math.round(job.paperIssuedKg * 0.94));
    setSpoilageKg(job.spoilageKg || Math.round(job.paperIssuedKg * 0.025));
    setRtsKg(job.rtsPaperKg || Math.max(0, job.paperIssuedKg - (job.paperFinishedKg || Math.round(job.paperIssuedKg * 0.94)) - (job.spoilageKg || Math.round(job.paperIssuedKg * 0.025))));
  };

  const handleSaveSpoilage = () => {
    if (!selectedJobForSpoilage) return;
    const computedSpoilagePct = Number(((spoilageKg / selectedJobForSpoilage.paperIssuedKg) * 100).toFixed(2));
    
    const updated: PressWorkOrder = {
      ...selectedJobForSpoilage,
      paperFinishedKg: Number(finishedKg),
      spoilageKg: Number(spoilageKg),
      spoilagePercentage: computedSpoilagePct,
      rtsPaperKg: Number(rtsKg),
      status: rtsKg > 0 ? 'RTS Received' : 'Completed',
      completedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    onUpdateJob(updated);
    setSelectedJobForSpoilage(null);
    setToastMessage(`Job ${updated.orderNumber} spoilage logged (${computedSpoilagePct}%). RTS Return sent to store!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateJob = () => {
    const paper = stockItems.find(s => s.code === selectedPaperCode);
    const newJob: PressWorkOrder = {
      id: `wo-${Date.now()}`,
      orderNumber: `WO-2026-${publicationType.toUpperCase().slice(0, 3)}-0${pressJobs.length + 1}`,
      title: orderTitle,
      titleAs: orderTitle,
      publicationType,
      targetCopies: Number(targetCopies),
      completedCopies: 0,
      assignedMachine,
      paperCode: selectedPaperCode,
      paperName: paper ? paper.name : 'Printing Paper',
      paperIssuedKg: Number(paperIssuedKg),
      paperFinishedKg: 0,
      spoilageKg: 0,
      spoilagePercentage: 0,
      rtsPaperKg: 0,
      maxAllowedSpoilagePct: 3.5,
      supervisor: 'Manabendra Sarma (Press Supervisor)',
      status: 'In Press',
      startedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    onAddJob(newJob);
    setShowNewJobModal(false);
    setToastMessage(`New Work Order ${newJob.orderNumber} initiated on ${assignedMachine}!`);
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
            <Factory className="w-6 h-6 text-navy-800" />
            <span>{t.navPress}</span>
            <span className="text-xs bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-mono font-semibold">
              Screen 05 · Spoilage Accounting
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'en'
              ? 'Eliminate the press floor black hole: link paper issued to print runs, machine trimming, and RTS credit.'
              : 'ছপাশালৰ যন্ত্ৰত ব্যৱহৃত কাগজ, ট্ৰিমিং অপচয় আৰু অৱশিষ্ট কাগজৰ ভঁৰাললৈ প্ৰত্যাৱৰ্তনৰ খতিয়ান।'}
          </p>
        </div>

        <button
          onClick={() => setShowNewJobModal(true)}
          className="bg-navy-800 hover:bg-navy-900 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center space-x-1.5 shadow transition"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>New Print Work Order</span>
        </button>
      </div>

      {/* Norm Compliance Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-navy-900 text-white p-4 rounded-xl border border-emerald-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Assam Government Spoilage Benchmark Norm: &lt; 3.50%
            </h4>
            <p className="text-xs text-slate-200">
              Formula: <span className="font-mono text-gold-300 font-semibold">Issued (Kg) = Finished (Kg) + Machine Spoilage (Kg) + RTS (Kg)</span>
            </p>
          </div>
        </div>
        <div className="bg-navy-950/80 px-4 py-2 rounded-lg border border-emerald-500/30 text-right">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Average Press Spoilage</span>
          <span className="text-xl font-black text-emerald-400 font-mono">2.45%</span>
          <span className="text-[10px] text-emerald-300 ml-1.5 font-bold">Within Standard Norm</span>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pressJobs.map((job) => {
          const isOverNorm = job.spoilagePercentage >= job.maxAllowedSpoilagePct;
          const isCompleted = job.status === 'Completed' || job.status === 'RTS Received';

          return (
            <div key={job.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-navy-800 bg-navy-50 px-2 py-0.5 rounded">
                    {job.orderNumber}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isCompleted 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-gold-100 text-gold-900'
                  }`}>
                    {job.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-navy-950 leading-snug">
                  {lang === 'en' ? job.title : job.titleAs}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
                  <Printer className="w-3 h-3 text-slate-400" />
                  <span>{job.assignedMachine}</span>
                </p>

                {/* Paper Accounting Breakdown */}
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5 font-mono">
                  <div className="flex justify-between text-slate-600 font-sans">
                    <span>Paper Allocated:</span>
                    <span className="font-bold text-navy-950">{job.paperIssuedKg} Kg</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-sans">
                    <span>Finished Copies:</span>
                    <span className="font-bold text-slate-900">{job.completedCopies.toLocaleString()} / {job.targetCopies.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-sans">
                    <span>Machine Spoilage:</span>
                    <span className={`font-bold ${isOverNorm ? 'text-red-700' : 'text-emerald-700'}`}>
                      {job.spoilageKg} Kg ({job.spoilagePercentage}%)
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-sans">
                    <span>Unused Paper (RTS):</span>
                    <span className="font-bold text-navy-700">{job.rtsPaperKg} Kg</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                {!isCompleted ? (
                  <button
                    onClick={() => openSpoilageModal(job)}
                    className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold py-2 rounded-lg text-xs flex items-center justify-center space-x-1.5 shadow transition"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Log Spoilage & Return RTS</span>
                  </button>
                ) : (
                  <div className="text-center text-[11px] font-semibold text-emerald-700 flex items-center justify-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Reconciliation Closed & RTS Credited</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Spoilage Logging Modal */}
      {selectedJobForSpoilage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <div className="flex items-center space-x-2">
                <Factory className="w-5 h-5 text-navy-800" />
                <div>
                  <h3 className="font-bold text-navy-950 text-sm">
                    Reconcile Press Spoilage & RTS
                  </h3>
                  <p className="text-[11px] font-mono text-slate-500">
                    {selectedJobForSpoilage.orderNumber}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedJobForSpoilage(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="p-3 bg-navy-50 rounded-lg text-xs text-navy-900 space-y-1">
              <div className="flex justify-between">
                <span>Total Raw Paper Issued:</span>
                <span className="font-mono font-bold">{selectedJobForSpoilage.paperIssuedKg} Kg</span>
              </div>
              <div className="flex justify-between">
                <span>Machine Assigned:</span>
                <span className="font-medium">{selectedJobForSpoilage.assignedMachine}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Finished Printed Paper Net Weight (Kg)
                </label>
                <input
                  type="number"
                  value={finishedKg}
                  onChange={(e) => setFinishedKg(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Machine Trimming & Setup Spoilage (Kg)
                </label>
                <input
                  type="number"
                  value={spoilageKg}
                  onChange={(e) => setSpoilageKg(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold text-red-700"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Current: {((spoilageKg / selectedJobForSpoilage.paperIssuedKg) * 100).toFixed(2)}% (Norm: &lt; 3.50%)
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Unprinted Balance Paper - Return-to-Store (RTS) (Kg)
                </label>
                <input
                  type="number"
                  value={rtsKg}
                  onChange={(e) => setRtsKg(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold text-navy-800"
                />
                <span className="text-[10px] text-emerald-600 mt-0.5 block">
                  Will be automatically re-credited to Central Store Ledger.
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedJobForSpoilage(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSpoilage}
                className="px-4 py-2 text-xs font-bold bg-navy-800 hover:bg-navy-900 text-white rounded-lg flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-gold-400" />
                <span>Confirm & Credit RTS</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Work Order Modal */}
      {showNewJobModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <h3 className="font-bold text-navy-950 text-sm">
                Create Print Work Order Requisition
              </h3>
              <button 
                onClick={() => setShowNewJobModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Order Title</label>
                <input
                  type="text"
                  value={orderTitle}
                  onChange={(e) => setOrderTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={publicationType}
                    onChange={(e) => setPublicationType(e.target.value as any)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    <option value="Gazette">Gazette</option>
                    <option value="Budget">Budget</option>
                    <option value="Forms">Forms</option>
                    <option value="Reports">Reports</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Copies</label>
                  <input
                    type="number"
                    value={targetCopies}
                    onChange={(e) => setTargetCopies(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Press Machinery</label>
                <select
                  value={assignedMachine}
                  onChange={(e) => setAssignedMachine(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                >
                  <option value="Web Offset Harris Graphics Unit 01">Web Offset Harris Graphics Unit 01</option>
                  <option value="Heidelberg 4-Color Sheetfed Offset Machine B">Heidelberg 4-Color Sheetfed Offset Machine B</option>
                  <option value="Auto Platen Letterpress Unit 03">Auto Platen Letterpress Unit 03</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Paper</label>
                  <select
                    value={selectedPaperCode}
                    onChange={(e) => setSelectedPaperCode(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono text-[11px]"
                  >
                    {stockItems.map(s => (
                      <option key={s.code} value={s.code}>{s.code} ({s.currentStock} {s.unit})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Requisition Paper (Kg)</label>
                  <input
                    type="number"
                    value={paperIssuedKg}
                    onChange={(e) => setPaperIssuedKg(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
              <button
                onClick={() => setShowNewJobModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateJob}
                className="px-4 py-2 text-xs font-bold bg-navy-800 hover:bg-navy-900 text-white rounded-lg flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-gold-400" />
                <span>Issue Paper & Start Job</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
