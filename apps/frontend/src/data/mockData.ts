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
  rtsPaperKg: number; // Return To Store
  maxAllowedSpoilagePct: number; // 3.5%
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

export interface LedgerTransaction {
  id: string;
  txHash: string;
  timestamp: string;
  itemCode: string;
  itemName: string;
  type: 'OPENING' | 'INWARD_GRN' | 'PRESS_ISSUE' | 'PRESS_RTS' | 'OUTWARD_DISPATCH' | 'AUDIT_ADJUSTMENT';
  quantityChange: number; // + or -
  runningBalance: number;
  unit: string;
  referenceDoc: string;
  initiatedBy: string;
  actorRole: string;
}

export interface AlertNotification {
  id: string;
  type: 'CRITICAL_STOCK' | 'LOW_STOCK' | 'SPOILAGE_WARNING' | 'PENDING_SANCTION' | 'GATE_ARRIVAL';
  title: string;
  titleAs: string;
  message: string;
  timestamp: string;
  severity: 'red' | 'amber' | 'blue';
  read: boolean;
  actionUrl: string;
}

// Initial Mock Data
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
  },
  {
    id: 'stk-6',
    code: 'INK-OFF-BLK',
    name: 'Process Black High-Speed Web Offset Ink',
    nameAs: 'প্ৰচেছ ব্লেক অফছেট চিয়াঁহী',
    category: 'Inks & Chemicals',
    unit: 'Drums (20Kg)',
    unitAs: 'ড্ৰাম (২০কেজি)',
    currentStock: 48,
    openingStock: 30,
    totalInward: 60,
    totalOutward: 42,
    allocatedPress: 4,
    minThreshold: 20,
    criticalThreshold: 10,
    bayRackLocation: 'Bay C (Chemical Stores) - Flammables C-01',
    valuationPerUnit: 6400,
    status: 'In Stock'
  },
  {
    id: 'stk-7',
    code: 'FRM-ASM-SCH',
    name: 'Assam Schedule VIII Service Book Registers',
    nameAs: 'অসম অনুসূচী ৮ সেৱা বহী পঞ্জী',
    category: 'Printed Forms & Books',
    unit: 'Books',
    unitAs: 'বহী',
    currentStock: 1450,
    openingStock: 1000,
    totalInward: 2000,
    totalOutward: 1550,
    allocatedPress: 0,
    minThreshold: 500,
    criticalThreshold: 200,
    bayRackLocation: 'Bay D (Finished Goods Depot) - Bay D-11',
    valuationPerUnit: 180,
    status: 'In Stock'
  },
  {
    id: 'stk-8',
    code: 'FRM-TR-42',
    name: 'Treasury Form 42 Contingent Bill Voucher Pads',
    nameAs: 'কোষাগাৰ প্ৰপত্ৰ ৪২ আকস্মিক বিল পেড',
    category: 'Printed Forms & Books',
    unit: 'Pads (100 sh)',
    unitAs: 'পেড',
    currentStock: 3200,
    openingStock: 2000,
    totalInward: 4500,
    totalOutward: 3300,
    allocatedPress: 0,
    minThreshold: 1000,
    criticalThreshold: 500,
    bayRackLocation: 'Bay D (Finished Goods Depot) - Bay D-08',
    valuationPerUnit: 75,
    status: 'In Stock'
  }
];

export const INITIAL_GRNS: InwardGRN[] = [
  {
    id: 'grn-1',
    grnNumber: 'GRN-2026-0891',
    poNumber: 'PO/DPS/2026/0411',
    poDate: '2026-11-10',
    supplierName: 'Nagaon Paper Mill Reserve Depository / HPC',
    vehicleNumber: 'AS-01-MC-8812',
    gatePassNo: 'GP-2026-1092',
    challanNumber: 'DC/NPM/9921',
    challanDate: '2026-11-14',
    itemCode: 'PPR-MAP-70',
    itemName: 'Maplitho Printing Paper 70 GSM (Reels)',
    orderedQty: 300,
    receivedQty: 300,
    acceptedQty: 300,
    rejectedQty: 0,
    unit: 'Reams',
    gsmTested: 70.4,
    moisturePercent: 5.2,
    bayAllocated: 'Bay A (Reel Yard) - Rack R-02',
    reelQrCodes: ['MK-REL-70G-0891-01', 'MK-REL-70G-0891-02', 'MK-REL-70G-0891-03'],
    status: 'Approved',
    storekeeper: 'Pranjal Saikia (Storekeeper)',
    inspectedBy: 'Bhaskar Jyoti Das (Quality Inspector)',
    approvedBy: 'D. K. Baruah (Store Officer)',
    receivedAt: '2026-11-15 11:30'
  },
  {
    id: 'grn-2',
    grnNumber: 'GRN-2026-0892',
    poNumber: 'PO/DPS/2026/0419',
    poDate: '2026-11-12',
    supplierName: 'Star Paper Mills Ltd, Saharanpur',
    vehicleNumber: 'UP-14-BT-3142',
    gatePassNo: 'GP-2026-1102',
    challanNumber: 'SPM/EXP/5502',
    challanDate: '2026-11-18',
    itemCode: 'PPR-WHT-80',
    itemName: 'White Premium Bond Paper 80 GSM',
    orderedQty: 500,
    receivedQty: 500,
    acceptedQty: 500,
    rejectedQty: 0,
    unit: 'Reams',
    gsmTested: 80.1,
    moisturePercent: 4.8,
    bayAllocated: 'Bay B (Ream Stacks) - Rack S-05',
    reelQrCodes: ['MK-RRM-80G-0892-01', 'MK-RRM-80G-0892-02'],
    status: 'Approved',
    storekeeper: 'Pranjal Saikia (Storekeeper)',
    inspectedBy: 'Bhaskar Jyoti Das (Quality Inspector)',
    approvedBy: 'D. K. Baruah (Store Officer)',
    receivedAt: '2026-11-20 14:15'
  },
  {
    id: 'grn-3',
    grnNumber: 'GRN-2026-0893',
    poNumber: 'PO/DPS/2026/0428',
    poDate: '2026-11-18',
    supplierName: 'Ballarpur Industries Ltd (BILT)',
    vehicleNumber: 'WB-23-C-9910',
    gatePassNo: 'GP-2026-1115',
    challanNumber: 'BILT/GUW/771',
    challanDate: '2026-11-23',
    itemCode: 'PPR-KRF-120',
    itemName: 'Heavy Kraft Packaging Paper 120 GSM',
    orderedQty: 10,
    receivedQty: 10,
    acceptedQty: 10,
    rejectedQty: 0,
    unit: 'Reels',
    gsmTested: 119.8,
    moisturePercent: 5.6,
    bayAllocated: 'Bay A (Reel Yard) - Bay Floor BF-04',
    reelQrCodes: ['MK-REL-120K-0893-01'],
    status: 'Inspected',
    storekeeper: 'Pranjal Saikia (Storekeeper)',
    inspectedBy: 'Bhaskar Jyoti Das (Quality Inspector)',
    receivedAt: '2026-11-24 16:40'
  }
];

export const INITIAL_PRESS_JOBS: PressWorkOrder[] = [
  {
    id: 'wo-1',
    orderNumber: 'WO-2026-GAZ-47',
    title: 'The Assam Gazette (Weekly Issue No. 47 - Extraordinary)',
    titleAs: 'অসম ৰাজপত্ৰ (সাপ্তাহিক ৪৭তম বিশেষ সংখ্যা)',
    publicationType: 'Gazette',
    targetCopies: 4500,
    completedCopies: 4500,
    assignedMachine: 'Web Offset Harris Graphics Unit 01',
    paperCode: 'PPR-MAP-70',
    paperName: 'Maplitho Printing Paper 70 GSM',
    paperIssuedKg: 1850,
    paperFinishedKg: 1745,
    spoilageKg: 46,
    spoilagePercentage: 2.48, // norm <3.5%
    rtsPaperKg: 59,
    maxAllowedSpoilagePct: 3.5,
    supervisor: 'Manabendra Sarma (Press Supervisor)',
    status: 'Completed',
    startedAt: '2026-11-21 09:00',
    completedAt: '2026-11-22 17:30'
  },
  {
    id: 'wo-2',
    orderNumber: 'WO-2026-BDG-02',
    title: 'Winter Session Supplementary Budget Demand for Grants 2026-27',
    titleAs: 'শীতকালীন অধিৱেশন অতিৰিক্ত বাজেট অনুদান দাবী ২০২৬-২৭',
    publicationType: 'Budget',
    targetCopies: 1200,
    completedCopies: 850,
    assignedMachine: 'Heidelberg 4-Color Sheetfed Offset Machine B',
    paperCode: 'PPR-WHT-80',
    paperName: 'White Premium Bond Paper 80 GSM',
    paperIssuedKg: 920,
    paperFinishedKg: 640,
    spoilageKg: 22,
    spoilagePercentage: 2.39,
    rtsPaperKg: 0,
    maxAllowedSpoilagePct: 3.5,
    supervisor: 'Manabendra Sarma (Press Supervisor)',
    status: 'In Press',
    startedAt: '2026-11-24 08:30'
  },
  {
    id: 'wo-3',
    orderNumber: 'WO-2026-ELEC-12',
    title: 'Special Summary Electoral Revision Statutory Form 6 & 7 Pads',
    titleAs: 'বিশেষ সংক্ষিপ্ত ভোটাৰ তালিকা সংশোধনী প্ৰপত্ৰ ৬ আৰু ৭',
    publicationType: 'Forms',
    targetCopies: 8000,
    completedCopies: 8000,
    assignedMachine: 'Auto Platen Letterpress Unit 03',
    paperCode: 'PPR-MAP-70',
    paperName: 'Maplitho Printing Paper 70 GSM',
    paperIssuedKg: 600,
    paperFinishedKg: 568,
    spoilageKg: 18,
    spoilagePercentage: 3.0,
    rtsPaperKg: 14,
    maxAllowedSpoilagePct: 3.5,
    supervisor: 'Bipul Hazarika (Shift Foreman)',
    status: 'RTS Received',
    startedAt: '2026-11-18 10:00',
    completedAt: '2026-11-19 16:00'
  }
];

export const INITIAL_INDENTS: IndentRequisition[] = [
  {
    id: 'ind-1',
    indentNumber: 'IND-2026-0412',
    departmentName: 'General Administration Department (GAD), Assam Secretariat, Dispur',
    departmentCode: 'DEPT-GAD-01',
    nodalOfficer: 'Kabita Das, ACS',
    designation: 'Joint Secretary (Administration)',
    contactNo: '+91-94350-12841',
    items: [
      {
        itemCode: 'PPR-MAP-70',
        itemName: 'Maplitho Printing Paper 70 GSM',
        requestedQty: 100,
        sanctionedQty: 100,
        unit: 'Reams',
        annualQuota: 600,
        utilizedQuota: 450
      },
      {
        itemCode: 'PPR-WHT-80',
        itemName: 'White Premium Bond Paper 80 GSM',
        requestedQty: 40,
        sanctionedQty: 40,
        unit: 'Reams',
        annualQuota: 200,
        utilizedQuota: 140
      },
      {
        itemCode: 'FRM-TR-42',
        itemName: 'Treasury Form 42 Contingent Bill Voucher Pads',
        requestedQty: 150,
        sanctionedQty: 150,
        unit: 'Pads (100 sh)',
        annualQuota: 800,
        utilizedQuota: 550
      }
    ],
    purpose: 'Routine monthly administrative stationery and Assembly session secretarial preparation',
    priority: 'Routine',
    status: 'Sanctioned',
    sanctionedBy: 'S. N. Talukdar, IAS (Director, Printing & Stationery)',
    sanctionDate: '2026-11-23 15:45',
    eChallanRef: 'ECH-2026-0781',
    submittedAt: '2026-11-22 11:20'
  },
  {
    id: 'ind-2',
    indentNumber: 'IND-2026-0413',
    departmentName: 'Director General of Police, Assam (Police Headquarters, Ulubari)',
    departmentCode: 'DEPT-POL-02',
    nodalOfficer: 'Tridip Goswami, APS',
    designation: 'Assistant Inspector General (Logistics)',
    contactNo: '+91-98640-55912',
    items: [
      {
        itemCode: 'PPR-AZR-85',
        itemName: 'Azure Laid Watermarked Ledger Paper 85 GSM',
        requestedQty: 50,
        sanctionedQty: 50,
        unit: 'Reams',
        annualQuota: 250,
        utilizedQuota: 170
      },
      {
        itemCode: 'FRM-ASM-SCH',
        itemName: 'Assam Schedule VIII Service Book Registers',
        requestedQty: 200,
        sanctionedQty: 200,
        unit: 'Books',
        annualQuota: 1000,
        utilizedQuota: 650
      }
    ],
    purpose: 'Police Station General Diary and Crime Register annual replenishment',
    priority: 'Urgent',
    status: 'Verified',
    submittedAt: '2026-11-24 10:15'
  },
  {
    id: 'ind-3',
    indentNumber: 'IND-2026-0414',
    departmentName: 'Finance (Expenditure) Department, Block-F, Dispur',
    departmentCode: 'DEPT-FIN-03',
    nodalOfficer: 'Hitesh Medhi, AFS',
    designation: 'Financial Adviser',
    contactNo: '+91-94351-77821',
    items: [
      {
        itemCode: 'PPR-WHT-80',
        itemName: 'White Premium Bond Paper 80 GSM',
        requestedQty: 120,
        sanctionedQty: 120,
        unit: 'Reams',
        annualQuota: 500,
        utilizedQuota: 310
      }
    ],
    purpose: 'Printing of State Supplementary Budget circulars and Treasury reconciliations',
    priority: 'VVIP Assembly',
    status: 'Sanctioned',
    sanctionedBy: 'S. N. Talukdar, IAS (Director, Printing & Stationery)',
    sanctionDate: '2026-11-24 16:30',
    eChallanRef: 'ECH-2026-0782',
    submittedAt: '2026-11-24 12:00'
  },
  {
    id: 'ind-4',
    indentNumber: 'IND-2026-0415',
    departmentName: 'Directorate of Health Services, Hengrabari, Guwahati',
    departmentCode: 'DEPT-HLT-05',
    nodalOfficer: 'Dr. Nilakshi Phukan',
    designation: 'Deputy Director (Store & Supplies)',
    contactNo: '+91-94350-98124',
    items: [
      {
        itemCode: 'PPR-MAP-70',
        itemName: 'Maplitho Printing Paper 70 GSM',
        requestedQty: 150,
        sanctionedQty: 0,
        unit: 'Reams',
        annualQuota: 500,
        utilizedQuota: 480
      }
    ],
    purpose: 'District Hospital Patient OPD Registers and Referral Slips',
    priority: 'Routine',
    status: 'Submitted',
    submittedAt: '2026-11-24 17:30'
  }
];

export const INITIAL_DISPATCHES: DispatchChallan[] = [
  {
    id: 'dsp-1',
    challanNumber: 'ECH-2026-0781',
    indentRef: 'IND-2026-0412',
    departmentName: 'General Administration Department (GAD), Assam Secretariat, Dispur',
    deliveryLocation: 'Stationery Receiving Cell, Ground Floor, Janata Bhawan, Dispur, Guwahati',
    vehicleNumber: 'AS-01-GC-4482 (DPS Govt Carrier)',
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
        bundleNos: 'BNDL-0781-01 to BNDL-0781-20 (5 Reams/Bndl)'
      },
      {
        itemCode: 'PPR-WHT-80',
        itemName: 'White Premium Bond Paper 80 GSM',
        qty: 40,
        unit: 'Reams',
        bundleNos: 'BNDL-0781-21 to BNDL-0781-28 (5 Reams/Bndl)'
      },
      {
        itemCode: 'FRM-TR-42',
        itemName: 'Treasury Form 42 Contingent Bill Voucher Pads',
        qty: 150,
        unit: 'Pads (100 sh)',
        bundleNos: 'BOX-0781-A & BOX-0781-B'
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
    deliveryLocation: 'Finance Dispatch Section, 2nd Floor, Janata Bhawan, Dispur',
    vehicleNumber: 'AS-01-EE-9102 (DPS Light Van)',
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
        bundleNos: 'BNDL-0782-01 to BNDL-0782-24'
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
    deliveryLocation: 'Nazarat Branch, DC Office Complex, Panbazar, Guwahati',
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
    signedBy: 'Nirmal Deka (Nazarat Officer, DC Office)',
    signedAt: '2026-11-20 15:40'
  }
];

export const INITIAL_LEDGER_TRANSACTIONS: LedgerTransaction[] = [
  {
    id: 'tx-1008',
    txHash: '0x9d4a8f...39b1',
    timestamp: '2026-11-24 14:00:15',
    itemCode: 'PPR-MAP-70',
    itemName: 'Maplitho Printing Paper 70 GSM',
    type: 'OUTWARD_DISPATCH',
    quantityChange: -100,
    runningBalance: 420,
    unit: 'Reams',
    referenceDoc: 'ECH-2026-0781',
    initiatedBy: 'Pranjal Saikia',
    actorRole: 'Central Storekeeper'
  },
  {
    id: 'tx-1007',
    txHash: '0x7e21a0...cc84',
    timestamp: '2026-11-24 14:00:15',
    itemCode: 'PPR-WHT-80',
    itemName: 'White Premium Bond Paper 80 GSM',
    type: 'OUTWARD_DISPATCH',
    quantityChange: -40,
    runningBalance: 850,
    unit: 'Reams',
    referenceDoc: 'ECH-2026-0781',
    initiatedBy: 'Pranjal Saikia',
    actorRole: 'Central Storekeeper'
  },
  {
    id: 'tx-1006',
    txHash: '0x43bc12...e112',
    timestamp: '2026-11-22 17:35:40',
    itemCode: 'PPR-MAP-70',
    itemName: 'Maplitho Printing Paper 70 GSM',
    type: 'PRESS_RTS',
    quantityChange: +14,
    runningBalance: 520,
    unit: 'Reams',
    referenceDoc: 'WO-2026-GAZ-47 (RTS Return)',
    initiatedBy: 'Manabendra Sarma',
    actorRole: 'Press Floor Supervisor'
  },
  {
    id: 'tx-1005',
    txHash: '0x18a992...f7aa',
    timestamp: '2026-11-21 09:10:00',
    itemCode: 'PPR-MAP-70',
    itemName: 'Maplitho Printing Paper 70 GSM',
    type: 'PRESS_ISSUE',
    quantityChange: -50,
    runningBalance: 506,
    unit: 'Reams',
    referenceDoc: 'WO-2026-GAZ-47',
    initiatedBy: 'D. K. Baruah',
    actorRole: 'Store Officer'
  },
  {
    id: 'tx-1004',
    txHash: '0x22c5e1...9120',
    timestamp: '2026-11-20 14:30:22',
    itemCode: 'PPR-WHT-80',
    itemName: 'White Premium Bond Paper 80 GSM',
    type: 'INWARD_GRN',
    quantityChange: +500,
    runningBalance: 890,
    unit: 'Reams',
    referenceDoc: 'GRN-2026-0892',
    initiatedBy: 'Pranjal Saikia',
    actorRole: 'Central Storekeeper'
  },
  {
    id: 'tx-1003',
    txHash: '0xfa8801...4419',
    timestamp: '2026-11-15 11:45:00',
    itemCode: 'PPR-MAP-70',
    itemName: 'Maplitho Printing Paper 70 GSM',
    type: 'INWARD_GRN',
    quantityChange: +300,
    runningBalance: 556,
    unit: 'Reams',
    referenceDoc: 'GRN-2026-0891',
    initiatedBy: 'Pranjal Saikia',
    actorRole: 'Central Storekeeper'
  },
  {
    id: 'tx-1002',
    txHash: '0x884102...110e',
    timestamp: '2026-11-01 00:00:00',
    itemCode: 'PPR-WHT-80',
    itemName: 'White Premium Bond Paper 80 GSM',
    type: 'OPENING',
    quantityChange: +400,
    runningBalance: 400,
    unit: 'Reams',
    referenceDoc: 'CAG-OPENING-AUDIT-2026',
    initiatedBy: 'S. N. Talukdar',
    actorRole: 'Directorate Leadership'
  },
  {
    id: 'tx-1001',
    txHash: '0x0017fa...aa90',
    timestamp: '2026-11-01 00:00:00',
    itemCode: 'PPR-MAP-70',
    itemName: 'Maplitho Printing Paper 70 GSM',
    type: 'OPENING',
    quantityChange: +250,
    runningBalance: 250,
    unit: 'Reams',
    referenceDoc: 'CAG-OPENING-AUDIT-2026',
    initiatedBy: 'S. N. Talukdar',
    actorRole: 'Directorate Leadership'
  }
];

export const INITIAL_ALERTS: AlertNotification[] = [
  {
    id: 'alt-1',
    type: 'CRITICAL_STOCK',
    title: 'Critical Stockout Alert: Royal Art Paper 130 GSM',
    titleAs: 'জৰুৰী নাটনি সতৰ্কতা: ৰয়েল আৰ্ট কাগজ ১৩০ জি.এছ.এম.',
    message: 'Current stock 38 Packets is below the critical threshold (40 Packets). Upcoming Governor Address printing requires immediate procurement.',
    timestamp: '15 mins ago',
    severity: 'red',
    read: false,
    actionUrl: '/inventory/stock'
  },
  {
    id: 'alt-2',
    type: 'LOW_STOCK',
    title: 'Low Stock Warning: Azure Laid Ledger Paper 85 GSM',
    titleAs: 'নিম্ন মজুত সতৰ্কতা: এজুৰ লেইড লেজাৰ কাগজ ৮৫ জি.এছ.এম.',
    message: 'Stock at 180 Reams (<30% threshold of 250 Reams). Police Station Crime Registers indent IND-2026-0413 pending.',
    timestamp: '2 hours ago',
    severity: 'amber',
    read: false,
    actionUrl: '/inventory/stock'
  },
  {
    id: 'alt-3',
    type: 'PENDING_SANCTION',
    title: 'Sanction Required: Health Directorate Indent IND-2026-0415',
    titleAs: 'মঞ্জুৰী প্ৰয়োজন: স্বাস্থ্য সঞ্চালকালয়ৰ আবেদন',
    message: 'Indent for 150 Reams Maplitho submitted by Dr. Nilakshi Phukan. Current utilized quota 96%. Director sanction needed.',
    timestamp: '3 hours ago',
    severity: 'amber',
    read: false,
    actionUrl: '/indents'
  },
  {
    id: 'alt-4',
    type: 'GATE_ARRIVAL',
    title: 'Security Gate Pass Cleared: Vehicle WB-23-C-9910',
    titleAs: 'সুৰক্ষা প্ৰৱেশদ্বাৰ পাছ সম্পন্ন: বাহন WB-23-C-9910',
    message: 'Ballarpur Industries 10 Reels Kraft consignment entered Bamunimaidam depot. Ready for unloading and moisture test.',
    timestamp: '5 hours ago',
    severity: 'blue',
    read: true,
    actionUrl: '/inventory/inward'
  }
];

// Bilingual translations dictionary
export const I18N = {
  en: {
    appTitle: 'MudraKosh',
    appSubtitle: 'Digital Inventory & Movement Tracking System',
    govtSubtitle: 'Govt. of Assam · Directorate of Printing & Stationery',
    pilotDepot: 'Central Depot & Press, Bamunimaidam, Guwahati',
    navDashboard: 'Executive Dashboard',
    navStock: 'Live Stock Ledger',
    navInward: 'Inward GRN Intake',
    navPress: 'Press Floor Spoilage',
    navIndents: 'Department Indents',
    navDispatch: 'Dispatch & e-Challan',
    navAlerts: 'Alerts & Warnings',
    navReports: 'Statutory CAG Reports',
    switchRole: 'Active Persona:',
    searchPlaceholder: 'Search item code, reel QR, indent or challan...',
    availableStock: 'Available Stock',
    openingBalance: 'Opening Balance',
    approvedInflows: 'Approved Inflows',
    confirmedOutflows: 'Confirmed Outflows',
    pressConsumption: 'Press Consumption',
    spoilageLoss: 'Machine Spoilage',
    spoilageNorm: 'Norm <3.5%',
    createGRN: 'New Inward GRN',
    raiseIndent: 'Raise New Indent',
    printChallan: 'Print e-Challan',
    downloadReport: 'Export CAG Ledger',
    allStatuses: 'All Statuses',
    allCategories: 'All Categories',
    filterByGSM: 'Filter by GSM'
  },
  as: {
    appTitle: 'মুদ্ৰাকোষ',
    appSubtitle: 'ডিজিটেল মজুত আৰু চলাচল নিৰীক্ষণ প্ৰণালী',
    govtSubtitle: 'অসম চৰকাৰ · মুদ্ৰণ আৰু লেখন-সামগ্ৰী সঞ্চালকালয়',
    pilotDepot: 'কেন্দ্ৰীয় ভঁৰাল আৰু চৰকাৰী ছপাশাল, বামুনীমৈদাম, গুৱাহাটী',
    navDashboard: 'কাৰ্যবাহী ডেচবৰ্ড',
    navStock: 'সক্ৰিয় মজুত খতিয়ান',
    navInward: 'আমদানি জি.আৰ.এন.',
    navPress: 'ছপাশাল অপচয় নিয়ন্ত্ৰণ',
    navIndents: 'বিভাগীয় আবেদন',
    navDispatch: 'প্ৰেৰণ আৰু ই-চালান',
    navAlerts: 'সতৰ্কবাৰ্তা আৰু জাননী',
    navReports: 'চি.এ.জি. সংবিধিবদ্ধ প্ৰতিবেদন',
    switchRole: 'বৰ্তমান ভূমিকা:',
    searchPlaceholder: 'সামগ্ৰী কʼড, ৰীল কিউ.আৰ., আবেদন বা চালান অনুসন্ধান কৰক...',
    availableStock: 'উপলব্ধ মজুত',
    openingBalance: 'প্ৰাৰম্ভিক নাটনি/মজুত',
    approvedInflows: 'অনুমোদিত আগমন',
    confirmedOutflows: 'নিশ্চিত প্ৰস্থান',
    pressConsumption: 'ছপাশাল ব্যৱহাৰ',
    spoilageLoss: 'যন্ত্ৰৰ ট্ৰিমিং অপচয়',
    spoilageNorm: 'চৰকাৰী মানক <৩.৫%',
    createGRN: 'নতুন আমদানি জি.আৰ.এন.',
    raiseIndent: 'নতুন আবেদন দাখিল',
    printChallan: 'ই-চালান প্ৰিণ্ট',
    downloadReport: 'চি.এ.জি. খতিয়ান ডাউনলোড',
    allStatuses: 'সকলো স্থিতি',
    allCategories: 'সকলো শ্ৰেণী',
    filterByGSM: 'জি.এছ.এম. অনুসৰি বাছক'
  }
};
