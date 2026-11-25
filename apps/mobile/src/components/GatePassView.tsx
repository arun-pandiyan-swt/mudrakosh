import React, { useState } from 'react';
import { 
  Truck, 
  ShieldCheck, 
  Scale, 
  CheckCircle2, 
  Clock, 
  Plus, 
  QrCode, 
  Printer,
  ChevronRight
} from 'lucide-react';
import { GatePassEntry } from '../data/mockData';

interface GatePassViewProps {
  lang: 'en' | 'as';
  gatePasses: GatePassEntry[];
  onAddGatePass: (newPass: GatePassEntry) => void;
  activeRole: string;
}

export const GatePassView: React.FC<GatePassViewProps> = ({
  lang,
  gatePasses,
  onAddGatePass,
  activeRole
}) => {
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [passType, setPassType] = useState<'INWARD' | 'OUTWARD'>('INWARD');
  const [vehicleNo, setVehicleNo] = useState('AS-01-KC-8891');
  const [driverName, setDriverName] = useState('Dilip Kalita');
  const [driverPhone, setDriverPhone] = useState('+91-98640-33120');
  const [supplierOrDept, setSupplierOrDept] = useState('Nagaon Paper Mill Reserve Depository');
  const [refDoc, setRefDoc] = useState('PO/DPS/2026/0435');
  const [grossKg, setGrossKg] = useState(16500);
  const [tareKg, setTareKg] = useState(7200);
  const [selectedPassForQR, setSelectedPassForQR] = useState<GatePassEntry | null>(null);

  const netKg = grossKg - tareKg;

  const handleCreatePass = () => {
    const newPass: GatePassEntry = {
      id: `gp-${Date.now()}`,
      passNumber: passType === 'INWARD' ? `GP-2026-11${gatePasses.length + 16}` : `OUT-GP-2026-0${gatePasses.length + 616}`,
      type: passType,
      vehicleNumber: vehicleNo.toUpperCase(),
      driverName,
      driverPhone,
      supplierOrDepartment: supplierOrDept,
      referenceDocNumber: refDoc,
      entryTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      grossWeightKg: Number(grossKg),
      tareWeightKg: Number(tareKg),
      netWeightKg: Number(netKg),
      securityGuard: 'Havildar T. Gogoi (Gate Security)',
      status: passType === 'INWARD' ? 'Unloading in Bay' : 'Completed / Exited'
    };

    onAddGatePass(newPass);
    setShowEntryModal(false);
    setSelectedPassForQR(newPass);
  };

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-navy-950 flex items-center gap-1.5">
            <Truck className="w-5 h-5 text-navy-800" />
            <span>{lang === 'en' ? 'Security Gate Pass' : 'সুৰক্ষা প্ৰৱেশদ্বাৰ পাছ'}</span>
          </h2>
          <p className="text-[11px] text-slate-500">
            Bamunimaidam Depot Entrance & Weighbridge
          </p>
        </div>

        <button
          onClick={() => setShowEntryModal(true)}
          className="bg-navy-900 text-gold-400 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center space-x-1 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Weighbridge Payload Formula Card */}
      <div className="bg-navy-900 text-white p-3 rounded-xl border border-navy-800 text-xs space-y-1">
        <div className="flex items-center justify-between text-gold-400 font-bold text-[11px]">
          <span className="flex items-center gap-1">
            <Scale className="w-3.5 h-3.5" />
            <span>Digital Weighbridge Sensor Linked</span>
          </span>
          <span className="bg-navy-800 px-1.5 py-0.5 rounded text-[10px]">Active</span>
        </div>
        <div className="font-mono text-slate-300 text-[11px]">
          Net Consignment Paper = Gross Weight - Tare Truck Weight
        </div>
      </div>

      {/* Gate Passes List */}
      <div className="space-y-3">
        {gatePasses.map((pass) => {
          const isInward = pass.type === 'INWARD';

          return (
            <div 
              key={pass.id}
              className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm space-y-2 hover:border-slate-300 transition"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isInward ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {pass.type === 'INWARD' ? 'INWARD TRUCK' : 'OUTWARD DISPATCH'}
                </span>
                <span className="font-mono text-xs font-bold text-navy-950">
                  {pass.passNumber}
                </span>
              </div>

              <div>
                <div className="font-bold text-sm text-navy-950 flex items-center justify-between">
                  <span>{pass.vehicleNumber}</span>
                  <span className="text-xs font-mono text-slate-600">{pass.driverName}</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  {pass.supplierOrDepartment}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Ref Doc: {pass.referenceDocNumber}
                </div>
              </div>

              {/* Weighment Slip */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs grid grid-cols-3 text-center font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 font-sans block">Gross</span>
                  <span className="font-bold text-navy-900">{pass.grossWeightKg} Kg</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-sans block">Tare</span>
                  <span className="text-slate-600">{pass.tareWeightKg} Kg</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700 font-sans font-bold block">Net Weight</span>
                  <span className="font-bold text-emerald-700">{pass.netWeightKg} Kg</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                <span className="text-slate-500 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{pass.entryTime}</span>
                </span>
                <button
                  onClick={() => setSelectedPassForQR(pass)}
                  className="text-navy-800 hover:text-navy-950 font-bold flex items-center space-x-1"
                >
                  <QrCode className="w-3.5 h-3.5 text-gold-600" />
                  <span>Pass QR</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Gate Entry Modal */}
      {showEntryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-4 border border-slate-200 space-y-3 animate-scale-up">
            <div className="flex items-center justify-between border-b pb-2 border-slate-200">
              <h3 className="font-bold text-navy-950 text-sm">Security Gate Inward Clearance</h3>
              <button onClick={() => setShowEntryModal(false)} className="text-slate-400 text-xs font-bold">Close</button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPassType('INWARD')}
                  className={`py-1.5 rounded-lg font-bold text-xs ${passType === 'INWARD' ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  Inward Consignment
                </button>
                <button
                  onClick={() => setPassType('OUTWARD')}
                  className={`py-1.5 rounded-lg font-bold text-xs ${passType === 'OUTWARD' ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-700'}`}
                >
                  Outward Carrier
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Vehicle License Number</label>
                <input
                  type="text"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold uppercase text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Driver Name</label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-1.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Driver Mobile</label>
                  <input
                    type="text"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-1.5 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Supplier / Recipient Office</label>
                <input
                  type="text"
                  value={supplierOrDept}
                  onChange={(e) => setSupplierOrDept(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-1.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Gross Weight (Kg)</label>
                  <input
                    type="number"
                    value={grossKg}
                    onChange={(e) => setGrossKg(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-1.5 font-mono font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">Tare Weight (Kg)</label>
                  <input
                    type="number"
                    value={tareKg}
                    onChange={(e) => setTareKg(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-1.5 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="p-2 bg-slate-50 rounded border border-slate-200 text-xs flex justify-between font-mono">
                <span className="font-sans font-semibold text-slate-600">Calculated Net Paper:</span>
                <span className="font-bold text-emerald-700">{netKg} Kg</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-end space-x-2">
              <button onClick={() => setShowEntryModal(false)} className="px-3 py-1.5 text-xs text-slate-600">Cancel</button>
              <button onClick={handleCreatePass} className="px-4 py-1.5 text-xs font-bold bg-navy-900 text-gold-400 rounded-lg">
                Authorize Gate Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Pass Popup */}
      {selectedPassForQR && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full text-center space-y-3 animate-scale-up">
            <h3 className="font-bold text-navy-950 text-sm">Gate Clearance Token</h3>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-300 inline-block">
              <QrCode className="w-32 h-32 mx-auto text-navy-950" />
              <span className="font-mono text-xs font-bold text-navy-900 block mt-1">
                {selectedPassForQR.passNumber}
              </span>
            </div>
            <div className="text-xs text-slate-600">
              Vehicle: <strong>{selectedPassForQR.vehicleNumber}</strong><br />
              Net Weight: <strong>{selectedPassForQR.netWeightKg} Kg</strong>
            </div>
            <button
              onClick={() => setSelectedPassForQR(null)}
              className="w-full bg-navy-900 text-white font-bold py-2 rounded-lg text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
