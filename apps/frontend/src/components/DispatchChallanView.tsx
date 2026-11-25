import React, { useState } from 'react';
import { 
  Truck, 
  QrCode, 
  Printer, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Building2, 
  FileCheck, 
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';
import { DispatchChallan, I18N } from '../data/mockData';

interface DispatchChallanViewProps {
  lang: 'en' | 'as';
  dispatches: DispatchChallan[];
  onUpdateDispatch: (updated: DispatchChallan) => void;
  activeRole: string;
}

export const DispatchChallanView: React.FC<DispatchChallanViewProps> = ({
  lang,
  dispatches,
  onUpdateDispatch,
  activeRole
}) => {
  const t = I18N[lang];
  const [selectedChallanForPrint, setSelectedChallanForPrint] = useState<DispatchChallan | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleDispatchTruck = (challan: DispatchChallan) => {
    const updated: DispatchChallan = {
      ...challan,
      status: 'In Transit'
    };
    onUpdateDispatch(updated);
    setToastMessage(`Vehicle ${challan.vehicleNumber} dispatched! e-Challan activated for mobile scan.`);
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
            <Truck className="w-6 h-6 text-navy-800" />
            <span>{t.navDispatch}</span>
            <span className="text-xs bg-gold-100 text-gold-900 px-2 py-0.5 rounded font-mono font-semibold">
              Screen 07 · Cryptographic e-Challan Outflows
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'en'
              ? 'Eliminate delivery disputes: cryptographic SHA-256 QR coded outward challans with mobile digital sign-off.'
              : 'বিভাগীয় বিতৰণ নিশ্চিতকৰণ: কিউ.আৰ. কোডেড ই-চালান আৰু ডিজিটেল হস্তান্তৰ প্ৰমাণ।'}
          </p>
        </div>
      </div>

      {/* Active Dispatches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {dispatches.map((challan) => {
          const isDelivered = challan.status === 'Delivered & Confirmed';
          const isInTransit = challan.status === 'In Transit';

          return (
            <div key={challan.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-navy-900 bg-navy-50 px-2 py-0.5 rounded">
                    {challan.challanNumber}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isDelivered 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : isInTransit 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {challan.status}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-navy-950 leading-snug">
                  {challan.departmentName}
                </h3>

                <div className="mt-2 text-xs text-slate-600 space-y-1">
                  <div className="flex items-start space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>{challan.deliveryLocation}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Truck className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="font-mono font-medium">{challan.vehicleNumber} ({challan.driverName})</span>
                  </div>
                </div>

                {/* Bundle items summary */}
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Consignment Items
                  </span>
                  {challan.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between font-mono">
                      <span className="text-navy-900 truncate max-w-[180px] font-sans">{it.itemName}</span>
                      <span className="font-bold">{it.qty} {it.unit}</span>
                    </div>
                  ))}
                </div>

                {/* Crypto QR Token */}
                <div className="mt-3 p-2 bg-navy-950 rounded-lg text-slate-300 text-[10px] font-mono flex items-center justify-between">
                  <span className="truncate max-w-[200px]">HASH: {challan.qrHash}</span>
                  <span className="text-gold-400 font-bold">QR Verified</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedChallanForPrint(challan)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2 rounded-lg text-xs flex items-center justify-center space-x-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5 text-navy-800" />
                  <span>Print e-Challan</span>
                </button>

                {!isDelivered && !isInTransit && (
                  <button
                    onClick={() => handleDispatchTruck(challan)}
                    className="flex-1 bg-navy-800 hover:bg-navy-900 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center space-x-1.5 shadow transition"
                  >
                    <Send className="w-3.5 h-3.5 text-gold-400" />
                    <span>Dispatch Truck</span>
                  </button>
                )}

                {isDelivered && (
                  <div className="text-[11px] font-semibold text-emerald-700 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Signed by {challan.signedBy?.split(' ')[0]}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Official Assam Govt e-Challan Printable Modal */}
      {selectedChallanForPrint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border-2 border-navy-800 space-y-4 animate-scale-up text-slate-900">
            {/* Gov Header */}
            <div className="text-center pb-3 border-b-2 border-navy-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                GOVERNMENT OF ASSAM
              </span>
              <h3 className="text-base font-black text-navy-950 uppercase tracking-tight">
                Directorate of Printing & Stationery
              </h3>
              <p className="text-xs text-slate-600">
                Central Stationery Depot, Bamunimaidam, Guwahati - 781021
              </p>
              <div className="inline-block bg-navy-900 text-gold-400 font-mono font-bold px-3 py-0.5 rounded text-xs mt-1">
                OUTWARD DIGITAL DELIVERY e-CHALLAN
              </div>
            </div>

            {/* Meta details */}
            <div className="grid grid-cols-2 gap-3 text-xs p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <div>e-Challan No: <strong className="font-mono text-navy-900">{selectedChallanForPrint.challanNumber}</strong></div>
                <div>Indent Ref: <strong className="font-mono">{selectedChallanForPrint.indentRef}</strong></div>
                <div>Gate Pass No: <strong className="font-mono">{selectedChallanForPrint.securityGatePass}</strong></div>
              </div>
              <div>
                <div>Dispatch Date: <strong>{selectedChallanForPrint.dispatchDate}</strong></div>
                <div>Carrier Vehicle: <strong className="font-mono">{selectedChallanForPrint.vehicleNumber}</strong></div>
                <div>Driver: <strong>{selectedChallanForPrint.driverName}</strong></div>
              </div>
            </div>

            <div className="text-xs">
              <span className="text-slate-500">Consignee State Department:</span>
              <div className="font-bold text-navy-950 text-sm mt-0.5">{selectedChallanForPrint.departmentName}</div>
              <div className="text-slate-600 mt-0.5">Destination: {selectedChallanForPrint.deliveryLocation}</div>
            </div>

            {/* Manifest Table */}
            <table className="w-full text-xs border border-slate-300">
              <thead className="bg-navy-900 text-white uppercase text-[10px]">
                <tr>
                  <th className="p-2 text-left">Sl</th>
                  <th className="p-2 text-left">Item Description</th>
                  <th className="p-2 text-right">Qty</th>
                  <th className="p-2 text-left">Bundle Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {selectedChallanForPrint.items.map((it, i) => (
                  <tr key={i}>
                    <td className="p-2 font-mono">{i + 1}</td>
                    <td className="p-2 font-medium">{it.itemName}</td>
                    <td className="p-2 text-right font-mono font-bold">{it.qty} {it.unit}</td>
                    <td className="p-2 font-mono text-[11px] text-slate-500">{it.bundleNos}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* QR Code & Signatures */}
            <div className="pt-2 grid grid-cols-3 gap-3 items-center border-t border-slate-200">
              <div className="flex flex-col items-center p-2 bg-slate-50 rounded border border-slate-200">
                <QrCode className="w-16 h-16 text-navy-950" />
                <span className="font-mono text-[8px] text-slate-500 mt-1 truncate max-w-full">
                  {selectedChallanForPrint.qrHash.slice(0, 20)}...
                </span>
                <span className="text-[8px] font-bold text-emerald-700">Cryptographic Proof</span>
              </div>

              <div className="text-center text-[10px] space-y-8">
                <div className="font-semibold text-slate-700">Storekeeper In-charge</div>
                <div className="border-t border-slate-400 pt-1 font-bold">Bamunimaidam Depot</div>
              </div>

              <div className="text-center text-[10px] space-y-8">
                <div className="font-semibold text-slate-700">Recipient DDO Signature</div>
                <div className="border-t border-slate-400 pt-1 font-bold">
                  {selectedChallanForPrint.signedBy || '(Mobile Digital Sign)'}
                </div>
              </div>
            </div>

            {/* Modal actions */}
            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedChallanForPrint(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => alert(`Printing official Government e-Challan ${selectedChallanForPrint.challanNumber}...`)}
                className="px-4 py-2 text-xs font-bold bg-navy-800 hover:bg-navy-900 text-white rounded-lg flex items-center space-x-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-gold-400" />
                <span>Print Official Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
