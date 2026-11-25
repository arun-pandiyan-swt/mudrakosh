export interface StockItem {
  id: string;
  code: string;
  name: string;
  nameAs: string;
  category: 'Paper - Reels' | 'Paper - Reams' | 'Inks & Chemicals' | 'Printed Forms & Books';
  gsm?: number;
  unit: string;
  unitAs: string;
  currentStock: number;
  openingStock: number;
  totalInward: number;
  totalOutward: number;
  allocatedPress: number;
  minThreshold: number;
  criticalThreshold: number;
  bayRackLocation: string;
  valuationPerUnit: number;
  status: 'In Stock' | 'Low Stock' | 'Critical';
}

export interface InwardGRN {
  id: string;
  grnNumber: string;
  poNumber: string;
  poDate: string;
  supplierName: string;
  vehicleNumber: string;
  gatePassNo: string;
  challanNumber: string;
  challanDate: string;
  itemCode: string;
  itemName: string;
  orderedQty: number;
  receivedQty: number;
  acceptedQty: number;
  rejectedQty: number;
  unit: string;
  gsmTested: number;
  moisturePercent: number;
  bayAllocated: string;
  reelQrCodes: string[];
  status: 'Draft' | 'Inspected' | 'Approved' | 'Rejected';
  storekeeper: string;
  inspectedBy: string;
  approvedBy?: string;
  receivedAt: string;
}

export interface PressWorkOrder {
  id: string;
  orderNumber: string;
  title: string;
  titleAs: string;
  publicationType: 'Gazette' | 'Budget' | 'Forms' | 'Reports' | 'General';
  targetCopies: number;
  completedCopies: number;
  assignedMachine: string;
  paperCode: string;
  paperName: string;
  paperIssuedKg: number;
  paperFinishedKg: number;
  spoilageKg: number;
  spoilagePercentage: number;
  rtsPaperKg: number;
  maxAllowedSpoilagePct: number;
  supervisor: string;
  status: 'Scheduled' | 'In Press' | 'Spoilage Logged' | 'Completed' | 'RTS Received';
  startedAt: string;
  completedAt?: string;
}

export interface IndentRequisition {
  id: string;
  indentNumber: string;
  departmentName: string;
  departmentCode: string;
  nodalOfficer: string;
  designation: string;
  contactNo: string;
  items: {
    itemCode: string;
    itemName: string;
    requestedQty: number;
    sanctionedQty: number;
    unit: string;
    annualQuota: number;
    utilizedQuota: number;
  }[];
  purpose: string;
  priority: 'Routine' | 'Urgent' | 'VVIP Assembly';
  status: 'Submitted' | 'Verified' | 'Sanctioned' | 'Partially Sanctioned' | 'Dispatched' | 'Delivered';
  sanctionedBy?: string;
  sanctionDate?: string;
  eChallanRef?: string;
  submittedAt: string;
}

export interface DispatchChallan {
  id: string;
  challanNumber: string;
  indentRef: string;
  departmentName: string;
  deliveryLocation: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  securityGatePass: string;
  qrHash: string;
  items: {
    itemCode: string;
    itemName: string;
    qty: number;
    unit: string;
    bundleNos: string;
  }[];
  dispatchDate: string;
  status: 'Ready for Dispatch' | 'In Transit' | 'Delivered & Confirmed';
  signedBy?: string;
  signedAt?: string;
  signatureDataUrl?: string;
}

export interface GatePassEntry {
  id: string;
  passNumber: string;
  type: 'INWARD' | 'OUTWARD';
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  supplierOrDepartment: string;
  referenceDocNumber: string; // PO No. or e-Challan No.
  entryTime: string;
  exitTime?: string;
  grossWeightKg?: number;
  tareWeightKg?: number;
  netWeightKg?: number;
  securityGuard: string;
  status: 'At Gate (Gross Weight Checked)' | 'Unloading in Bay' | 'Completed / Exited';
}

export const INITIAL_STOCK_ITEMS: StockItem[] = [
  {
    id: 'stk-1',
    code: 'PPR-MAP-70',
    name: 'Maplitho Printing Paper 70 GSM',
    nameAs: 'মেপলিথʼ মুদ্ৰণ কাগজ ৭০ জি.এছ.এম.',
    category: 'Paper - Reels',
    gsm: 70,
    unit: 'Reams',
    unitAs: 'ৰীম',
    currentStock: 420,
    openingStock: 250,
    totalInward: 600,
    totalOutward: 380,
    allocatedPress: 50,
    minThreshold: 150,
    criticalThreshold: 75,
    bayRackLocation: 'Bay A (Reel Yard) - Rack R-02',
    valuationPerUnit: 420,
    status: 'In Stock'
  },
  {
    id: 'stk-2',
    code: 'PPR-WHT-80',
    name: 'White Premium Bond Paper 80 GSM',
    nameAs: 'বগা প্ৰিমিয়াম বণ্ড কাগজ ৮০ জি.এছ.এম.',
    category: 'Paper - Reams',
    gsm: 80,
    unit: 'Reams',
    unitAs: 'ৰীম',
    currentStock: 850,
    openingStock: 400,
    totalInward: 950,
    totalOutward: 500,
    allocatedPress: 0,
    minThreshold: 300,
    criticalThreshold: 150,
    bayRackLocation: 'Bay B (Ream Stacks) - Rack S-05',
    valuationPerUnit: 580,
    status: 'In Stock'
  },
  {
    id: 'stk-3',
    code: 'PPR-AZR-85',
    name: 'Azure Laid Watermarked Ledger Paper 85 GSM',
    nameAs: 'এজুৰ লেইড ৱাটাৰমাৰ্ক লেজাৰ কাগজ ৮৫ জি.এছ.এম.',
    category: 'Paper - Reams',
    gsm: 85,
    unit: 'Reams',
    unitAs: 'ৰীম',
    currentStock: 180,
    openingStock: 300,
    totalInward: 200,
    totalOutward: 320,
    allocatedPress: 0,
    minThreshold: 250,
    criticalThreshold: 100,
    bayRackLocation: 'Bay B (Ream Stacks) - Safe Rack SR-01',
    valuationPerUnit: 890,
    status: 'Low Stock'
  },
  {
    id: 'stk-4',
    code: 'PPR-ART-130',
    name: 'Royal Art Paper Gloss 130 GSM',
    nameAs: 'ৰয়েল আৰ্ট কাগজ গ্লʼছ ১৩০ জি.এছ.এম.',
    category: 'Paper - Reams',
    gsm: 130,
    unit: 'Packets',
    unitAs: 'পেকেট',
    currentStock: 38,
    openingStock: 120,
    totalInward: 80,
    totalOutward: 162,
    allocatedPress: 0,
    minThreshold: 80,
    criticalThreshold: 40,
    bayRackLocation: 'Bay B (Special Stocks) - Shelf G-12',
    valuationPerUnit: 1450,
    status: 'Critical'
  },
  {
    id: 'stk-5',
    code: 'PPR-KRF-120',
    name: 'Heavy Kraft Packaging Paper 120 GSM',
    nameAs: 'হেভি ক্ৰাফ্ট পেকেজিং কাগজ ১২০ জি.এছ.এম.',
    category: 'Paper - Reels',
    gsm: 120,
    unit: 'Reels',
    unitAs: 'ৰীল',
    currentStock: 24,
    openingStock: 15,
    totalInward: 30,
    totalOutward: 21,
    allocatedPress: 0,
    minThreshold: 10,
    criticalThreshold: 5,
    bayRackLocation: 'Bay A (Reel Yard) - Bay Floor BF-04',
    valuationPerUnit: 12500,
    status: 'In Stock'
  }
];

export const INITIAL_DISPATCHES: DispatchChallan[] = [
  {
    id: 'dsp-1',
    challanNumber: 'ECH-2026-0781',
    indentRef: 'IND-2026-0412',
    departmentName: 'General Administration Department (GAD), Assam Secretariat, Dispur',
    deliveryLocation: 'Stationery Cell, Janata Bhawan, Dispur, Guwahati',
    vehicleNumber: 'AS-01-GC-4482',
    driverName: 'Rupam Borah',
    driverPhone: '+91-98642-11002',
    securityGatePass: 'OUT-GP-2026-0612',
    qrHash: 'MUDRA-ECH-2026-0781-SHA256-D7E4F28190B',
    items: [
      {
        itemCode: 'PPR-MAP-70',
        itemName: 'Maplitho Printing Paper 70 GSM',
        qty: 100,
        unit: 'Reams',
        bundleNos: 'BNDL-0781-01 to 20'
      },
      {
        itemCode: 'PPR-WHT-80',
        itemName: 'White Premium Bond Paper 80 GSM',
        qty: 40,
        unit: 'Reams',
        bundleNos: 'BNDL-0781-21 to 28'
      },
      {
        itemCode: 'FRM-TR-42',
        itemName: 'Treasury Form 42 Contingent Bill Voucher Pads',
        qty: 150,
        unit: 'Pads (100 sh)',
        bundleNos: 'BOX-0781-A & B'
      }
    ],
    dispatchDate: '2026-11-24 14:00',
    status: 'In Transit'
  },
  {
    id: 'dsp-2',
    challanNumber: 'ECH-2026-0782',
    indentRef: 'IND-2026-0414',
    departmentName: 'Finance (Expenditure) Department, Block-F, Dispur',
    deliveryLocation: 'Finance Dispatch Section, Janata Bhawan, Dispur',
    vehicleNumber: 'AS-01-EE-9102',
    driverName: 'Jatin Kalita',
    driverPhone: '+91-94353-88910',
    securityGatePass: 'OUT-GP-2026-0615',
    qrHash: 'MUDRA-ECH-2026-0782-SHA256-A83FC198273',
    items: [
      {
        itemCode: 'PPR-WHT-80',
        itemName: 'White Premium Bond Paper 80 GSM',
        qty: 120,
        unit: 'Reams',
        bundleNos: 'BNDL-0782-01 to 24'
      }
    ],
    dispatchDate: '2026-11-25 09:30',
    status: 'Ready for Dispatch'
  },
  {
    id: 'dsp-3',
    challanNumber: 'ECH-2026-0780',
    indentRef: 'IND-2026-0399',
    departmentName: 'Office of Deputy Commissioner, Kamrup Metro, Panbazar',
    deliveryLocation: 'Nazarat Branch, DC Office Complex, Panbazar',
    vehicleNumber: 'AS-01-GC-4482',
    driverName: 'Rupam Borah',
    driverPhone: '+91-98642-11002',
    securityGatePass: 'OUT-GP-2026-0598',
    qrHash: 'MUDRA-ECH-2026-0780-SHA256-C44BA00198F',
    items: [
      {
        itemCode: 'FRM-ASM-SCH',
        itemName: 'Assam Schedule VIII Service Book Registers',
        qty: 100,
        unit: 'Books',
        bundleNos: 'BNDL-0780-01 to 05'
      }
    ],
    dispatchDate: '2026-11-20 11:00',
    status: 'Delivered & Confirmed',
    signedBy: 'Nirmal Deka (Nazarat Officer)',
    signedAt: '2026-11-20 15:40'
  }
];

export const INITIAL_GATE_PASSES: GatePassEntry[] = [
  {
    id: 'gp-1',
    passNumber: 'GP-2026-1115',
    type: 'INWARD',
    vehicleNumber: 'WB-23-C-9910',
    driverName: 'Subhash Roy',
    driverPhone: '+91-98310-44912',
    supplierOrDepartment: 'Ballarpur Industries Ltd (BILT)',
    referenceDocNumber: 'PO/DPS/2026/0428',
    entryTime: '2026-11-24 15:20',
    grossWeightKg: 18450,
    tareWeightKg: 8200,
    netWeightKg: 10250,
    securityGuard: 'Havildar T. Gogoi (Gate Security)',
    status: 'Unloading in Bay'
  },
  {
    id: 'gp-2',
    passNumber: 'OUT-GP-2026-0612',
    type: 'OUTWARD',
    vehicleNumber: 'AS-01-GC-4482',
    driverName: 'Rupam Borah',
    driverPhone: '+91-98642-11002',
    supplierOrDepartment: 'General Administration Dept (Janata Bhawan)',
    referenceDocNumber: 'ECH-2026-0781',
    entryTime: '2026-11-24 13:45',
    exitTime: '2026-11-24 14:10',
    grossWeightKg: 5200,
    tareWeightKg: 3400,
    netWeightKg: 1800,
    securityGuard: 'Havildar T. Gogoi (Gate Security)',
    status: 'Completed / Exited'
  }
];
