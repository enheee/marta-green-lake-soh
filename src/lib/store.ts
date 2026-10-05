import fs from 'fs';
import path from 'path';
import {
  Announcement,
  BillRecord,
  CctvRequest,
  ComplaintRequest,
  DeliveryItem,
  ExpenseReceipt,
  FinancialReport,
  MeterReading,
  PaymentReceipt,
  Poll,
  SohSettings,
  VehicleRecord,
} from './types';
import {
  initialAnnouncements,
  initialBills,
  initialReports,
  initialRequests,
  initialSettings,
} from './initial-data';

interface DatabaseSchema {
  settings: SohSettings;
  announcements: Announcement[];
  bills: BillRecord[];
  requests: ComplaintRequest[];
  reports: FinancialReport[];
  polls: Poll[];
  receipts: PaymentReceipt[];
  vehicles: VehicleRecord[];
  meters: MeterReading[];
  deliveries: DeliveryItem[];
  cctvRequests: CctvRequest[];
  expenses: ExpenseReceipt[];
}

// On Vercel serverless, process.cwd() is read-only.
// Use /tmp directory for writable database file in serverless or fallback to memory
const IS_VERCEL = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
const DATA_DIR = IS_VERCEL ? '/tmp/data' : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const ORIGINAL_DB_FILE = path.join(process.cwd(), 'data', 'db.json');

// In-memory cache fallback to guarantee 100% operation
let memoryDb: DatabaseSchema | null = null;

const initialPolls: Poll[] = [
  {
    id: 'poll-1',
    title: 'Хүүхдийн тоглоомын талбайн камержуулалт, хашаа шинэчлэх тухай',
    description:
      'Хүүхдийн аюулгүй байдлыг хангах үүднээс тоглоомын талбай руу чиглэсэн өндөр нягтаршилтай 2 камер суурилуулж, хамгаалалтын төмөр хашааг шинэчлэх СӨХ-ийн сангийн төсвийг батлах санал асуулга.',
    options: [
      { id: 'opt-1', text: 'Бүрэн дэмжиж байна', votes: 24 },
      { id: 'opt-2', text: 'Төсвийг багасгаж зөвхөн камер суурилуулах', votes: 7 },
      { id: 'opt-3', text: 'Дэмжихгүй байна', votes: 2 },
    ],
    status: 'Идэвхтэй',
    createdAt: '2026-09-10',
    endDate: '2026-10-25',
    votedUnits: {
      '5': 'opt-1',
      '12': 'opt-1',
      '14': 'opt-2',
      '24': 'opt-1',
      '35': 'opt-1',
    },
    totalVotes: 33,
  },
  {
    id: 'poll-2',
    title: 'Хотхоны гадна гэрэлтүүлгийг бүрэн LED болгох төсөл',
    description:
      'Цахилгааны эрчим хүчний зардлыг 40% хэмнэх, шөнийн үзэгдэх орчныг сайжруулах зорилгоор гадна шонгийн 16 чийдэнг автомат мэдрэгчтэй ухаалаг LED лампаар солих төсөл.',
    options: [
      { id: 'opt-a', text: 'Зөвшөөрч байна', votes: 31 },
      { id: 'opt-b', text: 'Одоогийн гэрэлтүүлэг хангалттай', votes: 4 },
    ],
    status: 'Идэвхтэй',
    createdAt: '2026-09-12',
    endDate: '2026-10-28',
    votedUnits: {
      '12': 'opt-a',
      '24': 'opt-a',
    },
    totalVotes: 35,
  },
];

const initialVehicles: VehicleRecord[] = [
  {
    id: 'veh-1',
    plateNumber: '1234 УБА',
    unitNumber: '12',
    carModel: 'Toyota Land Cruiser 200 (Цагаан)',
    ownerName: 'Б.Батболд',
    ownerPhone: '9911-2233',
    registeredAt: '2026-08-10',
  },
  {
    id: 'veh-2',
    plateNumber: '5566 УБН',
    unitNumber: '5',
    carModel: 'Toyota Prius 30 (Мөнгөлөг)',
    ownerName: 'Д.Ганболд',
    ownerPhone: '9922-4455',
    registeredAt: '2026-08-12',
  },
  {
    id: 'veh-3',
    plateNumber: '8899 УБТ',
    unitNumber: '24',
    carModel: 'Lexus RX450h (Хар)',
    ownerName: 'М.Энхжаргал',
    ownerPhone: '8811-0099',
    registeredAt: '2026-08-15',
  },
  {
    id: 'veh-4',
    plateNumber: '0011 УБЭ',
    unitNumber: '35',
    carModel: 'Hyundai Tucson (Саарал)',
    ownerName: 'Ц.Сүрэн',
    ownerPhone: '8801-9988',
    registeredAt: '2026-08-20',
  },
  {
    id: 'veh-5',
    plateNumber: '7722 УБР',
    unitNumber: '14',
    carModel: 'Kia Sorento (Хар)',
    ownerName: 'Э.Тэмүүлэн',
    ownerPhone: '9911-0022',
    registeredAt: '2026-08-25',
  },
  {
    id: 'veh-6',
    plateNumber: '3344 УБС',
    unitNumber: '48',
    carModel: 'Toyota Harrier (Цагаан)',
    ownerName: 'Б.Ариунболд',
    ownerPhone: '9512-3344',
    registeredAt: '2026-09-01',
  },
];

const initialReceipts: PaymentReceipt[] = [
  {
    id: 'rec-1',
    unitNumber: '14',
    amount: 28000,
    bankName: 'Хаан Банк',
    transactionNo: 'TXN-984321',
    note: '9-р сарын төлбөр шилжүүлэв',
    status: 'Хүлээгдэж буй',
    createdAt: '2026-10-01 11:20',
  },
];

// Phase 2 Initial Seed Data
const initialMeters: MeterReading[] = [
  {
    id: 'mtr-1',
    unitNumber: '12',
    residentName: '12-р тоот',
    period: '2026 оны 10-р сар',
    coldWater: 142.5,
    hotWater: 88.2,
    electricity: 3420,
    submittedAt: '2026-10-02 09:15',
    status: 'Хянагдсан',
  },
  {
    id: 'mtr-2',
    unitNumber: '24',
    residentName: '24-р тоот',
    period: '2026 оны 10-р сар',
    coldWater: 195.0,
    hotWater: 112.4,
    electricity: 4180,
    submittedAt: '2026-10-03 14:30',
    status: 'Шинэ',
  },
  {
    id: 'mtr-3',
    unitNumber: '5',
    residentName: '5-р тоот',
    period: '2026 оны 10-р сар',
    coldWater: 110.2,
    hotWater: 65.0,
    electricity: 2890,
    submittedAt: '2026-10-04 18:00',
    status: 'Шинэ',
  },
];

const initialDeliveries: DeliveryItem[] = [
  {
    id: 'dlv-1',
    code: 'DLV-101',
    unitNumber: '12',
    courierCompany: 'Toki Delivery',
    itemDescription: 'Цэнхэр ууттай жижиг илгээмж (Хувцас)',
    status: 'Хүлээгдэж буй',
    arrivedAt: '2026-10-05 15:40',
  },
  {
    id: 'dlv-2',
    code: 'DLV-102',
    unitNumber: '35',
    courierCompany: 'Mongol Post',
    itemDescription: 'Хайрцагтай илгээмж',
    status: 'Хүлээгдэж буй',
    arrivedAt: '2026-10-05 16:10',
  },
  {
    id: 'dlv-3',
    code: 'DLV-103',
    unitNumber: '24',
    courierCompany: 'Shoppy.mn',
    itemDescription: 'Гутлын хайрцаг',
    status: 'Хүлээн авсан',
    arrivedAt: '2026-10-04 11:20',
    pickedUpAt: '2026-10-04 19:30',
  },
];

const initialCctvRequests: CctvRequest[] = [
  {
    id: 'cctv-1',
    code: 'CCTV-101',
    unitNumber: '14',
    phone: '9911-0022',
    date: '2026-10-04',
    timeRange: '14:00 - 15:30',
    location: 'Зүүн талын ил зогсоол',
    reason: 'Машины зүүн хаалгыг үл мэдэгдэх машин шүргээд явсан байх магадлалтай.',
    status: 'Шалгаж байна',
    adminNote: 'Жижүүр 3-р камерын бичлэгийг татаж байна.',
    createdAt: '2026-10-04 17:00',
  },
];

const initialExpenses: ExpenseReceipt[] = [
  {
    id: 'exp-1',
    title: '1-р орцны халаалтын паарны хаалт, жийргэвч 4ш',
    category: 'Цахилгаан, сантехник',
    amount: 145000,
    date: '2026-09-28',
    storeName: '100 айл сантехник',
    createdAt: '2026-09-28',
  },
  {
    id: 'exp-2',
    title: 'Гадна талбайн шонгийн LED гэрэл 6ш',
    category: 'Цахилгаан, сантехник',
    amount: 210000,
    date: '2026-09-20',
    storeName: 'Нарны зам цахилгаан бараа',
    createdAt: '2026-09-20',
  },
  {
    id: 'exp-3',
    title: 'Цэвэрлэгээний уусмал, бээлий, шуудай',
    category: 'Цэвэрлэгээ үйлчилгээ',
    amount: 85000,
    date: '2026-09-14',
    storeName: 'Номин Их Дэлгүүр',
    createdAt: '2026-09-14',
  },
];

function ensureDataFile(): DatabaseSchema {
  if (memoryDb) {
    return memoryDb;
  }

  // 1. Try reading from DB_FILE (e.g. /tmp/data/db.json)
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      memoryDb = parsed;
      return memoryDb!;
    } catch (e) {
      console.warn('Could not read existing DB_FILE:', e);
    }
  }

  // 2. Try reading from ORIGINAL_DB_FILE (process.cwd()/data/db.json)
  if (fs.existsSync(ORIGINAL_DB_FILE)) {
    try {
      const content = fs.readFileSync(ORIGINAL_DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      memoryDb = parsed;
      // Try copying to DB_FILE if writable
      try {
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
        fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
      } catch (err) {}
      return memoryDb!;
    } catch (e) {
      console.warn('Could not read ORIGINAL_DB_FILE:', e);
    }
  }

  // 3. Fallback to initial seed data
  const initialDb: DatabaseSchema = {
    settings: initialSettings,
    announcements: initialAnnouncements,
    bills: initialBills,
    requests: initialRequests,
    reports: initialReports,
    polls: initialPolls,
    receipts: initialReceipts,
    vehicles: initialVehicles,
    meters: initialMeters,
    deliveries: initialDeliveries,
    cctvRequests: initialCctvRequests,
    expenses: initialExpenses,
  };

  memoryDb = initialDb;
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
  } catch (err) {
    // Read-only filesystem in serverless, memoryDb will suffice
  }

  return memoryDb;
}

function saveData(data: DatabaseSchema): void {
  memoryDb = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // In Vercel serverless where filesystem writes are restricted, memoryDb preserves the state
    console.warn('Filesystem write failed, saved to memoryDb:', err);
  }
}

// Settings
export function getSettings(): SohSettings {
  return ensureDataFile().settings;
}

export function updateSettings(newSettings: Partial<SohSettings>): SohSettings {
  const db = ensureDataFile();
  db.settings = { ...db.settings, ...newSettings };
  saveData(db);
  return db.settings;
}

// Announcements
export function getAnnouncements(): Announcement[] {
  return ensureDataFile().announcements;
}

export function addAnnouncement(item: Omit<Announcement, 'id'>): Announcement {
  const db = ensureDataFile();
  const newAnnouncement: Announcement = {
    ...item,
    id: `ann-${Date.now()}`,
  };
  db.announcements.unshift(newAnnouncement);
  saveData(db);
  return newAnnouncement;
}

export function updateAnnouncement(id: string, updates: Partial<Announcement>): Announcement | null {
  const db = ensureDataFile();
  const idx = db.announcements.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  db.announcements[idx] = { ...db.announcements[idx], ...updates };
  saveData(db);
  return db.announcements[idx];
}

export function deleteAnnouncement(id: string): boolean {
  const db = ensureDataFile();
  const initialLength = db.announcements.length;
  db.announcements = db.announcements.filter((a) => a.id !== id);
  if (db.announcements.length !== initialLength) {
    saveData(db);
    return true;
  }
  return false;
}

// Bills
export function getBills(): BillRecord[] {
  return ensureDataFile().bills;
}

export function getBillByUnit(unitNumber: string): BillRecord | undefined {
  const db = ensureDataFile();
  const normalized = unitNumber.trim();
  return db.bills.find(
    (b) => b.unitNumber === normalized || b.unitNumber === normalized.replace(/[^0-9]/g, '')
  );
}

export function updateBill(id: string, updates: Partial<BillRecord>): BillRecord | null {
  const db = ensureDataFile();
  const idx = db.bills.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  db.bills[idx] = { ...db.bills[idx], ...updates };
  saveData(db);
  return db.bills[idx];
}

export function updateMultipleBills(bills: BillRecord[]): void {
  const db = ensureDataFile();
  db.bills = bills;
  saveData(db);
}

// Requests
export function getRequests(): ComplaintRequest[] {
  return ensureDataFile().requests;
}

export function addRequest(item: Omit<ComplaintRequest, 'id' | 'code' | 'createdAt' | 'status'>): ComplaintRequest {
  const db = ensureDataFile();
  const codeNum = 100 + db.requests.length + 1;
  const now = new Date();
  const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;

  const newReq: ComplaintRequest = {
    ...item,
    id: `req-${Date.now()}`,
    code: `REQ-${codeNum}`,
    status: 'Хүлээгдэж буй',
    createdAt,
  };
  db.requests.unshift(newReq);
  saveData(db);
  return newReq;
}

export function updateRequestStatus(
  id: string,
  status: ComplaintRequest['status'],
  adminNote?: string,
  assignedTo?: string
): ComplaintRequest | null {
  const db = ensureDataFile();
  const idx = db.requests.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  db.requests[idx].status = status;
  if (adminNote !== undefined) {
    db.requests[idx].adminNote = adminNote;
  }
  if (assignedTo !== undefined) {
    db.requests[idx].assignedTo = assignedTo;
  }
  saveData(db);
  return db.requests[idx];
}

// Reports
export function getReports(): FinancialReport[] {
  return ensureDataFile().reports;
}

export function addReport(item: Omit<FinancialReport, 'id' | 'publishedAt'>): FinancialReport {
  const db = ensureDataFile();
  const now = new Date();
  const publishedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')}`;

  const newReport: FinancialReport = {
    ...item,
    id: `rep-${Date.now()}`,
    publishedAt,
  };
  db.reports.unshift(newReport);
  saveData(db);
  return newReport;
}

// Polls
export function getPolls(): Poll[] {
  return ensureDataFile().polls;
}

export function createPoll(item: {
  title: string;
  description: string;
  options: string[];
  endDate: string;
}): Poll {
  const db = ensureDataFile();
  const poll: Poll = {
    id: `poll-${Date.now()}`,
    title: item.title,
    description: item.description,
    options: item.options.map((opt, i) => ({
      id: `opt-${i + 1}`,
      text: opt,
      votes: 0,
    })),
    status: 'Идэвхтэй',
    createdAt: new Date().toISOString().slice(0, 10),
    endDate: item.endDate,
    votedUnits: {},
    totalVotes: 0,
  };
  db.polls.unshift(poll);
  saveData(db);
  return poll;
}

export function votePoll(pollId: string, unitNumber: string, optionId: string): { success: boolean; message?: string; poll?: Poll } {
  const db = ensureDataFile();
  const poll = db.polls.find((p) => p.id === pollId);
  if (!poll) return { success: false, message: 'Санал асуулга олдсонгүй' };
  if (poll.status !== 'Идэвхтэй') return { success: false, message: 'Энэ санал асуулга хаагдсан байна' };

  const normUnit = unitNumber.trim();
  if (poll.votedUnits[normUnit]) {
    return { success: false, message: `${normUnit}-р тоот аль хэдийн санал өгсөн байна!` };
  }

  const opt = poll.options.find((o) => o.id === optionId);
  if (!opt) return { success: false, message: 'Сонголт олдсонгүй' };

  opt.votes += 1;
  poll.totalVotes += 1;
  poll.votedUnits[normUnit] = optionId;

  saveData(db);
  return { success: true, poll };
}

export function closePoll(pollId: string): boolean {
  const db = ensureDataFile();
  const poll = db.polls.find((p) => p.id === pollId);
  if (!poll) return false;
  poll.status = 'Хаагдсан';
  saveData(db);
  return true;
}

export function deletePoll(pollId: string): boolean {
  const db = ensureDataFile();
  const initial = db.polls.length;
  db.polls = db.polls.filter((p) => p.id !== pollId);
  if (db.polls.length !== initial) {
    saveData(db);
    return true;
  }
  return false;
}

// Payment Receipts
export function getReceipts(): PaymentReceipt[] {
  return ensureDataFile().receipts;
}

export function createReceipt(item: {
  unitNumber: string;
  amount: number;
  bankName: string;
  transactionNo: string;
  receiptImage?: string;
  note?: string;
}): PaymentReceipt {
  const db = ensureDataFile();
  const now = new Date();
  const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;

  const receipt: PaymentReceipt = {
    ...item,
    id: `rec-${Date.now()}`,
    status: 'Хүлээгдэж буй',
    createdAt,
  };
  db.receipts.unshift(receipt);
  saveData(db);
  return receipt;
}

export function approveReceipt(receiptId: string): { success: boolean; bill?: BillRecord } {
  const db = ensureDataFile();
  const receipt = db.receipts.find((r) => r.id === receiptId);
  if (!receipt) return { success: false };

  receipt.status = 'Баталгаажсан';
  receipt.verifiedAt = new Date().toISOString().slice(0, 10);

  const bill = db.bills.find((b) => b.unitNumber === receipt.unitNumber);
  if (bill) {
    bill.status = 'Төлсөн';
    bill.totalDue = 0;
    bill.paidDate = receipt.verifiedAt;
  }

  saveData(db);
  return { success: true, bill };
}

export function rejectReceipt(receiptId: string): boolean {
  const db = ensureDataFile();
  const receipt = db.receipts.find((r) => r.id === receiptId);
  if (!receipt) return false;
  receipt.status = 'Татгалзсан';
  saveData(db);
  return true;
}

// Vehicles & Parking
export function getVehicles(): VehicleRecord[] {
  return ensureDataFile().vehicles;
}

export function registerVehicle(item: Omit<VehicleRecord, 'id' | 'registeredAt'>): VehicleRecord {
  const db = ensureDataFile();
  const vehicle: VehicleRecord = {
    ...item,
    id: `veh-${Date.now()}`,
    registeredAt: new Date().toISOString().slice(0, 10),
  };
  db.vehicles.unshift(vehicle);
  saveData(db);
  return vehicle;
}

export function searchVehicle(query: string): VehicleRecord[] {
  const db = ensureDataFile();
  const q = query.replace(/\s+/g, '').toLowerCase();
  return db.vehicles.filter(
    (v) =>
      v.plateNumber.replace(/\s+/g, '').toLowerCase().includes(q) ||
      v.unitNumber.includes(q) ||
      v.ownerPhone.includes(q)
  );
}

export function deleteVehicle(id: string): boolean {
  const db = ensureDataFile();
  const initial = db.vehicles.length;
  db.vehicles = db.vehicles.filter((v) => v.id !== id);
  if (db.vehicles.length !== initial) {
    saveData(db);
    return true;
  }
  return false;
}

// ------------------------------------
// PHASE 2 FUNCTIONS
// ------------------------------------

// 1. Meters (Тоолуурын заалт)
export function getMeters(): MeterReading[] {
  return ensureDataFile().meters;
}

export function getMetersByUnit(unitNumber: string): MeterReading[] {
  const db = ensureDataFile();
  const norm = unitNumber.trim();
  return db.meters.filter((m) => m.unitNumber === norm);
}

export function addMeterReading(item: Omit<MeterReading, 'id' | 'submittedAt' | 'status'>): MeterReading {
  const db = ensureDataFile();
  const now = new Date();
  const submittedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;

  const reading: MeterReading = {
    ...item,
    id: `mtr-${Date.now()}`,
    submittedAt,
    status: 'Шинэ',
  };
  db.meters.unshift(reading);
  saveData(db);
  return reading;
}

export function updateMeterStatus(id: string, status: MeterReading['status']): MeterReading | null {
  const db = ensureDataFile();
  const idx = db.meters.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  db.meters[idx].status = status;
  saveData(db);
  return db.meters[idx];
}

// 2. Deliveries (Жижүүрийн илгээмж)
export function getDeliveries(): DeliveryItem[] {
  return ensureDataFile().deliveries;
}

export function getDeliveriesByUnit(unitNumber: string): DeliveryItem[] {
  const db = ensureDataFile();
  const norm = unitNumber.trim();
  return db.deliveries.filter((d) => d.unitNumber === norm);
}

export function addDelivery(item: Omit<DeliveryItem, 'id' | 'code' | 'arrivedAt' | 'status'>): DeliveryItem {
  const db = ensureDataFile();
  const codeNum = 100 + db.deliveries.length + 1;
  const now = new Date();
  const arrivedAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;

  const delivery: DeliveryItem = {
    ...item,
    id: `dlv-${Date.now()}`,
    code: `DLV-${codeNum}`,
    arrivedAt,
    status: 'Хүлээгдэж буй',
  };
  db.deliveries.unshift(delivery);
  saveData(db);
  return delivery;
}

export function markDeliveryPickedUp(id: string): DeliveryItem | null {
  const db = ensureDataFile();
  const idx = db.deliveries.findIndex((d) => d.id === id);
  if (idx === -1) return null;

  const now = new Date();
  const pickedUpAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;

  db.deliveries[idx].status = 'Хүлээн авсан';
  db.deliveries[idx].pickedUpAt = pickedUpAt;
  saveData(db);
  return db.deliveries[idx];
}

// 3. CCTV Requests
export function getCctvRequests(): CctvRequest[] {
  return ensureDataFile().cctvRequests;
}

export function addCctvRequest(item: Omit<CctvRequest, 'id' | 'code' | 'status' | 'createdAt'>): CctvRequest {
  const db = ensureDataFile();
  const codeNum = 100 + db.cctvRequests.length + 1;
  const now = new Date();
  const createdAt = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate()
  ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;

  const req: CctvRequest = {
    ...item,
    id: `cctv-${Date.now()}`,
    code: `CCTV-${codeNum}`,
    status: 'Хүлээгдэж буй',
    createdAt,
  };
  db.cctvRequests.unshift(req);
  saveData(db);
  return req;
}

export function updateCctvStatus(id: string, status: CctvRequest['status'], adminNote?: string): CctvRequest | null {
  const db = ensureDataFile();
  const idx = db.cctvRequests.findIndex((c) => c.id === id);
  if (idx === -1) return null;

  db.cctvRequests[idx].status = status;
  if (adminNote !== undefined) {
    db.cctvRequests[idx].adminNote = adminNote;
  }
  saveData(db);
  return db.cctvRequests[idx];
}

// 4. Expenses (Шилэн СӨХ Чекийн архив)
export function getExpenses(): ExpenseReceipt[] {
  return ensureDataFile().expenses;
}

export function addExpense(item: Omit<ExpenseReceipt, 'id' | 'createdAt'>): ExpenseReceipt {
  const db = ensureDataFile();
  const expense: ExpenseReceipt = {
    ...item,
    id: `exp-${Date.now()}`,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  db.expenses.unshift(expense);
  saveData(db);
  return expense;
}

export function deleteExpense(id: string): boolean {
  const db = ensureDataFile();
  const initial = db.expenses.length;
  db.expenses = db.expenses.filter((e) => e.id !== id);
  if (db.expenses.length !== initial) {
    saveData(db);
    return true;
  }
  return false;
}
