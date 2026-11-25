import React, { useState, useRef, useEffect } from 'react';
import { 
  FileCheck2, 
  CheckCircle2, 
  PenTool, 
  RotateCcw, 
  ShieldCheck, 
  QrCode, 
  Building, 
  User, 
  Calendar,
  Truck
} from 'lucide-react';
import { DispatchChallan } from '../../data/mockData';

interface ProofOfDeliveryViewProps {
  lang: 'en' | 'as';
  dispatches: DispatchChallan[];
  onConfirmDelivery: (challanNumber: string, officerName: string, signatureUrl: string) => void;
  activeRole: string;
}

export const ProofOfDeliveryView: React.FC<ProofOfDeliveryViewProps> = ({
  lang,
  dispatches,
  onConfirmDelivery,
  activeRole
}) => {
  const pendingDispatches = dispatches.filter(d => d.status !== 'Delivered & Confirmed');
  const deliveredDispatches = dispatches.filter(d => d.status === 'Delivered & Confirmed');

  const [selectedChallanId, setSelectedChallanId] = useState<string>(
    pendingDispatches.length > 0 ? pendingDispatches[0].id : (dispatches[0]?.id || '')
  );
  const [officerName, setOfficerName] = useState('Kabita Das, ACS');
  const [designation, setDesignation] = useState('Joint Secretary (GAD), Janata Bhawan');
  const [remarks, setRemarks] = useState('Received all bundles in sealed & intact condition.');
  const [signedSuccess, setSignedSuccess] = useState<boolean>(false);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const selectedChallan = dispatches.find(d => d.id === selectedChallanId) || dispatches[0];

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0F2942'; // Brand Navy
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSubmitPOD = () => {
    const canvas = canvasRef.current;
    const signatureDataUrl = canvas ? canvas.toDataURL() : '';
    
    onConfirmDelivery(selectedChallan.challanNumber, `${officerName} (${designation})`, signatureDataUrl);
    setSignedSuccess(true);
    setTimeout(() => {
      setSignedSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-navy-950 flex items-center gap-1.5">
            <FileCheck2 className="w-5 h-5 text-navy-800" />
            <span>{lang === 'en' ? 'Digital Proof-of-Delivery (POD)' : 'ডিজিটেল হস্তান্তৰ প্ৰমাণ'}</span>
          </h2>
          <p className="text-[11px] text-slate-500">
            Recipient Department Nodal Officer (DDO) Sign-off
          </p>
        </div>

        <span className="text-[10px] bg-gold-100 text-gold-900 font-bold px-2 py-0.5 rounded-full">
          Cryptographic Sign
        </span>
      </div>

      {/* Select active delivery challan */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 mb-1">
          Select Incoming e-Challan for Verification
        </label>
        <select
          value={selectedChallanId}
          onChange={(e) => setSelectedChallanId(e.target.value)}
          className="w-full text-xs font-bold border border-slate-300 rounded-lg p-2.5 bg-white text-navy-950 shadow-sm"
        >
          {dispatches.map(d => (
            <option key={d.id} value={d.id}>
              {d.challanNumber} · {d.departmentName.slice(0, 32)}... ({d.status})
            </option>
          ))}
        </select>
      </div>

      {/* Consignment Verification Summary */}
      {selectedChallan && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="font-mono text-xs font-bold text-navy-950">{selectedChallan.challanNumber}</span>
              <div className="text-[11px] text-slate-500">Indent: {selectedChallan.indentRef}</div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              selectedChallan.status === 'Delivered & Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {selectedChallan.status}
            </span>
          </div>

          <div className="text-xs">
            <span className="text-slate-500 text-[11px]">Receiving Office:</span>
            <div className="font-bold text-navy-950">{selectedChallan.departmentName}</div>
            <div className="text-[11px] text-slate-600 mt-0.5">Carrier: {selectedChallan.vehicleNumber} ({selectedChallan.driverName})</div>
          </div>

          {/* Bundle checklist */}
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Items to Receive & Inspect:
            </span>
            {selectedChallan.items.map((item, idx) => (
              <div key={idx} className="flex justify-between font-mono">
                <span className="text-navy-950 font-sans truncate max-w-[200px]">{item.itemName}</span>
                <span className="font-bold text-emerald-800">{item.qty} {item.unit}</span>
              </div>
            ))}
          </div>

          {/* Cryptographic hash */}
          <div className="p-2 bg-navy-950 text-slate-300 rounded-lg font-mono text-[10px] flex justify-between items-center">
            <span className="truncate max-w-[220px]">HASH: {selectedChallan.qrHash}</span>
            <span className="text-gold-400 font-bold">QR Verified</span>
          </div>
        </div>
      )}

      {/* Digital Signature Pad Form */}
      {selectedChallan && selectedChallan.status !== 'Delivered & Confirmed' ? (
        <div className="bg-white rounded-xl border-2 border-navy-800 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center space-x-1.5">
              <PenTool className="w-4 h-4 text-navy-800" />
              <h3 className="font-bold text-navy-950 text-xs uppercase tracking-wider">
                Recipient DDO Digital Signature Pad
              </h3>
            </div>
            <button
              onClick={clearSignature}
              className="text-[11px] text-slate-500 hover:text-red-700 flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Signatory Officer Name</label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-1.5 font-bold text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Designation</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-1.5 text-xs"
              />
            </div>
          </div>

          {/* Interactive Touch/Mouse Canvas Signature Surface */}
          <div className="space-y-1">
            <label className="block text-[10px] font-semibold text-slate-600">
              Draw Signature on Glass (Finger or Stylus):
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 relative overflow-hidden">
              <canvas
                ref={canvasRef}
                width={320}
                height={120}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-[120px] touch-none cursor-crosshair bg-white"
              />
              {!hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs italic">
                  ✍️ Sign inside this box to acknowledge receipt
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmitPOD}
            disabled={!hasSignature}
            className={`w-full py-2.5 rounded-xl text-xs font-black shadow-lg flex items-center justify-center space-x-1.5 transition ${
              hasSignature 
                ? 'bg-gold-500 hover:bg-gold-600 text-navy-950 cursor-pointer' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Confirm & Sign Cryptographic POD</span>
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h4 className="font-bold text-navy-950 text-sm">
            Proof of Delivery Confirmed & Sealed
          </h4>
          <p className="text-xs text-slate-600">
            Acknowledge by: <strong>{selectedChallan?.signedBy}</strong>
          </p>
          <div className="text-[10px] text-slate-400 font-mono">
            Cryptographic SHA-256 Ledger sync complete. Central stock automatically deducted.
          </div>
        </div>
      )}

      {/* Success notification */}
      {signedSuccess && (
        <div className="bg-navy-950 text-gold-400 p-3 rounded-xl border border-gold-500 text-xs font-bold text-center animate-bounce">
          ✓ Delivery Acknowledged! Signed receipt securely synchronized to Central Ledger.
        </div>
      )}
    </div>
  );
};
