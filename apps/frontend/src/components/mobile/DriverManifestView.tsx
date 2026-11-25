import React from 'react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  Package, 
  QrCode,
  FileCheck2
} from 'lucide-react';
import { DispatchChallan } from '../../data/mockData';

interface DriverManifestViewProps {
  lang: 'en' | 'as';
  dispatches: DispatchChallan[];
  activeRole: string;
}

export const DriverManifestView: React.FC<DriverManifestViewProps> = ({
  lang,
  dispatches,
  activeRole
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-navy-950 flex items-center gap-1.5">
            <Truck className="w-5 h-5 text-navy-800" />
            <span>{lang === 'en' ? 'Driver Delivery Manifest' : 'চালান বিতৰণ তালিকা'}</span>
          </h2>
          <p className="text-[11px] text-slate-500">
            Assigned Vehicle: AS-01-GC-4482 · Carrier Driver: Rupam Borah
          </p>
        </div>

        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
          Route Active
        </span>
      </div>

      {/* Driver Card */}
      <div className="bg-navy-900 text-white p-3.5 rounded-xl border border-navy-800 shadow text-xs space-y-2">
        <div className="flex justify-between items-center text-gold-400 font-bold">
          <span>Today's Dispur & Guwahati Route</span>
          <span className="font-mono text-[11px]">2 Stops Scheduled</span>
        </div>
        <div className="text-slate-300 text-[11px]">
          Gate Security Pass OUT-GP-2026-0612 stamped at 14:10. Return to Bamunimaidam depot by 17:30.
        </div>
      </div>

      {/* Consignments List */}
      <div className="space-y-3">
        {dispatches.map((challan, idx) => {
          const isDelivered = challan.status === 'Delivered & Confirmed';

          return (
            <div key={challan.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-navy-900 bg-navy-50 px-2 py-0.5 rounded">
                  STOP 0{idx + 1} · {challan.challanNumber}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isDelivered ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {challan.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-navy-950">
                  {challan.departmentName}
                </h3>
                <div className="text-xs text-slate-600 flex items-start space-x-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span>{challan.deliveryLocation}</span>
                </div>
              </div>

              {/* Items loaded */}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Loaded Bundles Checklist:
                </span>
                {challan.items.map((item, i) => (
                  <div key={i} className="flex justify-between font-mono">
                    <span className="text-navy-900 font-sans truncate max-w-[200px]">{item.itemName}</span>
                    <span className="font-bold">{item.qty} {item.unit}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 pt-1 border-t border-slate-100">
                <a
                  href={`tel:+919435012841`}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-lg text-xs flex items-center justify-center space-x-1"
                >
                  <Phone className="w-3.5 h-3.5 text-navy-800" />
                  <span>Call Officer</span>
                </a>

                {!isDelivered ? (
                  <button
                    onClick={() => alert(`Showing e-Challan QR code for ${challan.challanNumber} to receiving officer...`)}
                    className="flex-1 bg-navy-900 hover:bg-navy-950 text-gold-400 font-bold py-2 rounded-lg text-xs flex items-center justify-center space-x-1 shadow"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Show e-Challan</span>
                  </button>
                ) : (
                  <div className="flex-1 text-center font-bold text-xs text-emerald-700 py-2 flex items-center justify-center space-x-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>POD Signed</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
