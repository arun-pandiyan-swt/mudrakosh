import React, { useState } from 'react';
import { 
  QrCode, 
  Camera, 
  Flashlight, 
  CheckCircle2, 
  MapPin, 
  Layers, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  RefreshCw,
  Search
} from 'lucide-react';
import { StockItem } from '../data/mockData';

interface QRScannerViewProps {
  lang: 'en' | 'as';
  stockItems: StockItem[];
  activeRole: string;
}

export const QRScannerView: React.FC<QRScannerViewProps> = ({
  lang,
  stockItems,
  activeRole
}) => {
  const [torchOn, setTorchOn] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scannedResult, setScannedResult] = useState<{
    code: string;
    item: StockItem | null;
    reelNo: string;
    gsm: number;
    bay: string;
    moisture: string;
    status: string;
    batchNo: string;
  } | null>(null);

  const simulateScan = (code: string) => {
    if (code.includes('70G') || code.includes('MAP')) {
      const item = stockItems.find(s => s.code === 'PPR-MAP-70') || null;
      setScannedResult({
        code,
        item,
        reelNo: code,
        gsm: 70.4,
        bay: 'Bay A (Reel Yard) - Rack R-02',
        moisture: '5.2%',
        status: 'Quality Certified · Available for Press Issue',
        batchNo: 'BATCH-NPM-2026-9921'
      });
    } else if (code.includes('80G') || code.includes('WHT')) {
      const item = stockItems.find(s => s.code === 'PPR-WHT-80') || null;
      setScannedResult({
        code,
        item,
        reelNo: code,
        gsm: 80.1,
        bay: 'Bay B (Ream Stacks) - Rack S-05',
        moisture: '4.8%',
        status: 'Quality Certified · Available for Indent Dispatch',
        batchNo: 'BATCH-SPM-2026-5502'
      });
    } else {
      // General item
      const item = stockItems[0];
      setScannedResult({
        code,
        item,
        reelNo: code,
        gsm: item.gsm || 70,
        bay: item.bayRackLocation,
        moisture: '5.0%',
        status: 'Active Stock Verified',
        batchNo: 'BATCH-DPS-2026-001'
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-navy-950 flex items-center gap-1.5">
            <QrCode className="w-5 h-5 text-navy-800" />
            <span>{lang === 'en' ? 'Warehouse Floor QR Scanner' : 'ভঁৰালৰ কিউ.আৰ. স্কেনাৰ'}</span>
          </h2>
          <p className="text-[11px] text-slate-500">
            Scan reel tags & bay bin barcodes on the warehouse floor
          </p>
        </div>

        <button
          onClick={() => setTorchOn(!torchOn)}
          className={`p-2 rounded-lg text-xs font-bold flex items-center space-x-1 ${
            torchOn ? 'bg-gold-500 text-navy-950 shadow' : 'bg-slate-200 text-slate-700'
          }`}
          title="Toggle Flash"
        >
          <Flashlight className="w-4 h-4" />
        </button>
      </div>

      {/* Simulated Camera Viewfinder Frame */}
      <div className="relative bg-navy-950 rounded-2xl overflow-hidden shadow-xl aspect-square max-h-[310px] w-full flex flex-col items-center justify-center border-2 border-navy-800">
        {/* Background camera simulation texture */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Viewfinder Corner Brackets */}
        <div className="relative w-56 h-56 border-2 border-gold-400/60 rounded-2xl flex items-center justify-center p-4">
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-gold-400 rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-gold-400 rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-gold-400 rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-gold-400 rounded-br-xl"></div>

          {/* Animated Laser Scanning Beam */}
          <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent animate-pulse shadow-[0_0_12px_#D49B24]"></div>

          <div className="text-center space-y-1 text-slate-300 pointer-events-none">
            <Camera className="w-8 h-8 mx-auto text-gold-400/80 animate-bounce" />
            <span className="text-[11px] font-mono block">Align Reel QR Tag inside frame</span>
          </div>
        </div>

        {/* Live HUD info */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-400 bg-navy-900/80 px-3 py-1 rounded-full backdrop-blur-sm border border-navy-700">
          <span>FPS: 60 · ISO 400</span>
          <span className="text-emerald-400">● CAMERA ACTIVE</span>
        </div>
      </div>

      {/* Quick Test Tap Bar */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
          One-Tap Sample QR Scans:
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => simulateScan('MK-REL-70G-0891-01')}
            className="p-2 bg-white rounded-lg border border-slate-300 text-left text-xs hover:border-gold-500 transition shadow-sm"
          >
            <div className="font-mono font-bold text-navy-950 text-[11px]">MK-REL-70G-0891-01</div>
            <div className="text-[10px] text-slate-500">Maplitho 70 GSM · Bay A</div>
          </button>
          <button
            onClick={() => simulateScan('MK-RRM-80G-0892-01')}
            className="p-2 bg-white rounded-lg border border-slate-300 text-left text-xs hover:border-gold-500 transition shadow-sm"
          >
            <div className="font-mono font-bold text-navy-950 text-[11px]">MK-RRM-80G-0892-01</div>
            <div className="text-[10px] text-slate-500">White Bond 80 GSM · Bay B</div>
          </button>
        </div>
      </div>

      {/* Manual Input Fallback */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Or enter QR serial number..."
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2 font-mono"
        />
        <button
          onClick={() => manualCode && simulateScan(manualCode)}
          className="bg-navy-900 text-gold-400 font-bold px-3 py-2 rounded-lg text-xs"
        >
          Lookup
        </button>
      </div>

      {/* Scanned Tag Details Card */}
      {scannedResult && (
        <div className="bg-white rounded-xl border-2 border-emerald-500 p-4 shadow-lg space-y-3 animate-slide-up">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Reel Tag Identified
                </span>
                <span className="font-mono font-bold text-xs text-navy-950">
                  {scannedResult.reelNo}
                </span>
              </div>
            </div>
            <button
              onClick={() => setScannedResult(null)}
              className="text-slate-400 text-xs hover:text-slate-600"
            >
              Dismiss
            </button>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Item Name:</span>
              <span className="font-bold text-navy-950">{scannedResult.item?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Lab Tested GSM:</span>
              <span className="font-mono font-bold text-emerald-700">{scannedResult.gsm} GSM (Moisture: {scannedResult.moisture})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Physical Location:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{scannedResult.bay}</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Mill Batch:</span>
              <span className="font-mono text-[11px] text-slate-600">{scannedResult.batchNo}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => alert(`Reel ${scannedResult.reelNo} requisitioned for Press Offset Unit!`)}
              className="flex-1 bg-navy-900 text-white font-bold py-2 rounded-lg text-xs"
            >
              Requisition for Press
            </button>
            <button
              onClick={() => alert(`Bin check verified for ${scannedResult.bay}`)}
              className="flex-1 bg-slate-100 text-slate-800 font-semibold py-2 rounded-lg text-xs"
            >
              Verify Bin Count
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
