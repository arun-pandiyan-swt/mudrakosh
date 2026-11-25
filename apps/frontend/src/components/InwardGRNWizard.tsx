import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Truck, 
  CheckCircle2, 
  QrCode, 
  Printer, 
  Building2, 
  Layers, 
  AlertCircle, 
  Calendar, 
  User, 
  ArrowRight, 
  ArrowLeft,
  Plus
} from 'lucide-react';
import { InwardGRN, StockItem, I18N } from '../data/mockData';

interface InwardGRNWizardProps {
  lang: 'en' | 'as';
  grns: InwardGRN[];
  stockItems: StockItem[];
  onAddGRN: (newGRN: InwardGRN) => void;
  activeRole: string;
}

export const InwardGRNWizard: React.FC<InwardGRNWizardProps> = ({
  lang,
  grns,
  stockItems,
  onAddGRN,
  activeRole
}) => {
  const t = I18N[lang];
  const [showWizard, setShowWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGRNForQR, setSelectedGRNForQR] = useState<InwardGRN | null>(null);

  // Form State
  const [poNumber, setPoNumber] = useState('PO/DPS/2026/0435');
  const [supplierName, setSupplierName] = useState('Nagaon Paper Mill Reserve / HPC');
  const [vehicleNumber, setVehicleNumber] = useState('AS-01-LC-9481');
  const [gatePassNo, setGatePassNo] = useState('GP-2026-1120');
  const [challanNumber, setChallanNumber] = useState('DC/NPM/1044');
  const [selectedItemCode, setSelectedItemCode] = useState('PPR-MAP-70');
  const [receivedQty, setReceivedQty] = useState(250);
  const [gsmTested, setGsmTested] = useState(70.2);
  const [moisturePercent, setMoisturePercent] = useState(5.1);
  const [bayAllocated, setBayAllocated] = useState('Bay A (Reel Yard) - Rack R-03');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const selectedItem = stockItems.find(s => s.code === selectedItemCode);

  const handleCreateGRN = () => {
    const newGrnNumber = `GRN-2026-089${grns.length + 1}`;
    const generatedQRs = [
      `MK-REL-${gsmTested}G-089${grns.length + 1}-01`,
      `MK-REL-${gsmTested}G-089${grns.length + 1}-02`,
      `MK-REL-${gsmTested}G-089${grns.length + 1}-03`
    ];

    const newGRN: InwardGRN = {
      id: `grn-${Date.now()}`,
      grnNumber: newGrnNumber,
      poNumber,
      poDate: new Date().toISOString().slice(0, 10),
      supplierName,
      vehicleNumber,
      gatePassNo,
      challanNumber,
      challanDate: new Date().toISOString().slice(0, 10),
      itemCode: selectedItemCode,
      itemName: selectedItem ? selectedItem.name : 'Printing Paper',
      orderedQty: receivedQty,
      receivedQty: receivedQty,
      acceptedQty: receivedQty,
      rejectedQty: 0,
      unit: selectedItem ? selectedItem.unit : 'Reams',
      gsmTested: Number(gsmTested),
      moisturePercent: Number(moisturePercent),
      bayAllocated,
      reelQrCodes: generatedQRs,
      status: 'Approved',
      storekeeper: 'Pranjal Saikia (Storekeeper)',
      inspectedBy: 'Bhaskar Jyoti Das (Quality Inspector)',
      approvedBy: activeRole === 'Store Officer' || activeRole === 'Director' ? 'Authorized Officer' : 'D. K. Baruah (Store Officer)',
      receivedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    onAddGRN(newGRN);
    setShowWizard(false);
    setCurrentStep(1);
    setSelectedGRNForQR(newGRN);
    setSuccessToast(`GRN ${newGrnNumber} successfully generated with QR tag batch!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-emerald-100 border border-emerald-400 px-4 py-3 rounded-lg shadow-xl text-xs font-bold flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Banner / Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-navy-950 flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-navy-800" />
            <span>{t.navInward}</span>
            <span className="text-xs bg-gold-100 text-gold-900 px-2 py-0.5 rounded font-mono font-semibold">
              Screen 03 · 3-Step Intake Wizard
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'en'
              ? 'Record supplier consignments, verify laboratory GSM/moisture parameters, and auto-print reel QR tags.'
              : 'যোগানকাৰীৰ আমদানি পঞ্জীয়ন, জি.এছ.এম./আৰ্দ্ৰতা পৰীক্ষা আৰু কিউ.আৰ. টেগ প্ৰিণ্ট।'}
          </p>
        </div>

        <button
          onClick={() => {
            setShowWizard(true);
            setCurrentStep(1);
          }}
          className="bg-navy-800 hover:bg-navy-900 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center space-x-1.5 shadow transition"
        >
          <Plus className="w-4 h-4 text-gold-400" />
          <span>{t.createGRN}</span>
        </button>
      </div>

      {/* Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="bg-navy-900 text-white p-5 flex items-center justify-between border-b border-gold-500">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-gold-500 text-navy-950 flex items-center justify-center font-bold">
                  {currentStep}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {currentStep === 1 && 'Step 1: Supplier & Delivery PO Details'}
                    {currentStep === 2 && 'Step 2: Paper Quality & Bay Allocation'}
                    {currentStep === 3 && 'Step 3: Verification & Batch QR Label Generator'}
                  </h3>
                  <p className="text-xs text-gold-300">
                    Bamunimaidam Central Warehouse Intake Gate
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowWizard(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1"
              >
                Cancel
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className="bg-slate-100 px-6 py-3 flex items-center justify-between text-xs font-semibold border-b border-slate-200">
              <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-navy-900' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 1 ? 'bg-navy-800 text-white' : 'bg-slate-300'}`}>1</span>
                <span>Gate & PO</span>
              </div>
              <div className="flex-1 h-0.5 mx-3 bg-slate-300"></div>
              <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-navy-900' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 2 ? 'bg-navy-800 text-white' : 'bg-slate-300'}`}>2</span>
                <span>GSM & Bay</span>
              </div>
              <div className="flex-1 h-0.5 mx-3 bg-slate-300"></div>
              <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-navy-900' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 3 ? 'bg-navy-800 text-white' : 'bg-slate-300'}`}>3</span>
                <span>QR Labels</span>
              </div>
            </div>

            {/* Step 1 Form */}
            {currentStep === 1 && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Purchase Order (PO) Number</label>
                    <input
                      type="text"
                      value={poNumber}
                      onChange={(e) => setPoNumber(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Gate Pass Number</label>
                    <input
                      type="text"
                      value={gatePassNo}
                      onChange={(e) => setGatePassNo(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Paper Mill / Vendor Name</label>
                  <input
                    type="text"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Truck Vehicle No.</label>
                    <input
                      type="text"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2 font-mono uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Supplier Delivery Challan No.</label>
                    <input
                      type="text"
                      value={challanNumber}
                      onChange={(e) => setChallanNumber(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>

                <div className="bg-navy-50 p-3 rounded-lg border border-navy-100 text-xs text-navy-800 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Security Gate gross weight slip matched with Delivery Challan manifest.</span>
                </div>
              </div>
            )}

            {/* Step 2 Form */}
            {currentStep === 2 && (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Select Catalog Item</label>
                  <select
                    value={selectedItemCode}
                    onChange={(e) => setSelectedItemCode(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 font-semibold text-navy-950"
                  >
                    {stockItems.map(item => (
                      <option key={item.code} value={item.code}>
                        {item.code} - {item.name} ({item.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Received Quantity</label>
                    <input
                      type="number"
                      value={receivedQty}
                      onChange={(e) => setReceivedQty(Number(e.target.value))}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Lab Tested GSM</label>
                    <input
                      type="number"
                      step="0.1"
                      value={gsmTested}
                      onChange={(e) => setGsmTested(Number(e.target.value))}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2 font-mono text-emerald-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Moisture Content (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={moisturePercent}
                      onChange={(e) => setMoisturePercent(Number(e.target.value))}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Warehouse Bay & Rack Allocation</label>
                  <select
                    value={bayAllocated}
                    onChange={(e) => setBayAllocated(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 font-medium"
                  >
                    <option value="Bay A (Reel Yard) - Rack R-02">Bay A (Reel Yard) - Rack R-02</option>
                    <option value="Bay A (Reel Yard) - Rack R-03">Bay A (Reel Yard) - Rack R-03</option>
                    <option value="Bay B (Ream Stacks) - Rack S-05">Bay B (Ream Stacks) - Rack S-05</option>
                    <option value="Bay C (Chemical Stores) - Flammables C-01">Bay C (Chemical Stores) - Flammables C-01</option>
                    <option value="Bay D (Finished Goods Depot) - Bay D-11">Bay D (Finished Goods Depot) - Bay D-11</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3 Form */}
            {currentStep === 3 && (
              <div className="p-6 space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-navy-950">Batch QR Label Preview</span>
                    <span className="text-[10px] bg-gold-100 text-gold-900 font-bold px-2 py-0.5 rounded">
                      Print Ready
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="bg-white p-3 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center text-center">
                        <QrCode className="w-12 h-12 text-navy-950 mb-1" />
                        <span className="font-mono text-[10px] font-bold text-navy-900">
                          MK-REL-{gsmTested}G-089{grns.length + 1}-0{num}
                        </span>
                        <span className="text-[9px] text-slate-500 font-medium">{selectedItemCode}</span>
                        <span className="text-[8px] text-slate-400 mt-1">DPS Bamunimaidam</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Quality Acceptance:</span>
                    <span className="font-bold text-emerald-700">100% Accepted (0 Rejected)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Authorized Storekeeper:</span>
                    <span className="font-semibold text-navy-900">Pranjal Saikia</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approval Status:</span>
                    <span className="font-bold text-navy-950">Ready for Stock Ledger Inward Credit</span>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Navigation */}
            <div className="bg-slate-50 p-4 flex items-center justify-between border-t border-slate-200">
              {currentStep > 1 ? (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center space-x-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              ) : <div></div>}

              {currentStep < 3 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-4 py-2 rounded-lg bg-navy-800 text-white text-xs font-bold hover:bg-navy-900 flex items-center space-x-1"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleCreateGRN}
                  className="px-5 py-2 rounded-lg bg-gold-500 text-navy-950 text-xs font-black hover:bg-gold-600 flex items-center space-x-1.5 shadow"
                >
                  <Printer className="w-4 h-4" />
                  <span>Confirm GRN & Print QR Tags</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QR Tags Modal View */}
      {selectedGRNForQR && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <div className="flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-gold-600" />
                <h3 className="font-bold text-navy-950 text-sm">
                  Printable QR Tags for {selectedGRNForQR.grnNumber}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedGRNForQR(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              {selectedGRNForQR.reelQrCodes.map((qr, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-300 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <QrCode className="w-10 h-10 text-navy-900" />
                    <div>
                      <div className="font-mono font-bold text-xs text-navy-950">{qr}</div>
                      <div className="text-[11px] text-slate-600">{selectedGRNForQR.itemName}</div>
                      <div className="text-[10px] text-slate-400">Bay: {selectedGRNForQR.bayAllocated}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert(`Sending ${qr} to Zebra Thermal Printer...`)}
                    className="p-2 rounded bg-navy-800 text-gold-400 hover:bg-navy-900"
                    title="Print single tag"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedGRNForQR(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg"
              >
                Done
              </button>
              <button
                onClick={() => alert('Sending all batch QR tags to Central Store Zebra ZT411 Printer')}
                className="px-4 py-2 bg-navy-800 hover:bg-navy-900 text-white font-bold text-xs rounded-lg flex items-center space-x-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-gold-400" />
                <span>Print All Tags</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing GRNs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-navy-950 text-xs uppercase tracking-wider">
            Consignment Goods Receipt Notes (GRN) History
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {grns.length} consignments logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-navy-900 text-white uppercase text-[11px] font-semibold">
              <tr>
                <th className="py-3 px-4">GRN & PO Details</th>
                <th className="py-3 px-3">Supplier / Mill</th>
                <th className="py-3 px-3">Item Received</th>
                <th className="py-3 px-3 text-right">Qty</th>
                <th className="py-3 px-3 text-center">GSM / Moisture</th>
                <th className="py-3 px-3">Bay Location</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">QR Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {grns.map((grn) => (
                <tr key={grn.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-navy-900">{grn.grnNumber}</div>
                    <div className="text-[11px] text-slate-500">PO: {grn.poNumber}</div>
                    <div className="text-[10px] text-slate-400">{grn.receivedAt}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{grn.supplierName}</div>
                    <div className="text-[11px] text-slate-500">Veh: {grn.vehicleNumber} · Gate: {grn.gatePassNo}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-navy-950">{grn.itemName}</div>
                    <div className="text-[11px] font-mono text-slate-500">{grn.itemCode}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    {grn.receivedQty} {grn.unit}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-xs">
                    <span className="text-emerald-700 font-bold">{grn.gsmTested} GSM</span>
                    <div className="text-[10px] text-slate-500">{grn.moisturePercent}% H2O</div>
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    <span className="font-medium">{grn.bayAllocated}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      grn.status === 'Approved' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {grn.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => setSelectedGRNForQR(grn)}
                      className="p-1.5 rounded-lg bg-navy-50 hover:bg-navy-100 text-navy-800 transition"
                      title="View & Print QR Tags"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
