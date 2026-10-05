export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Засвар' | 'Хурал' | 'Цэвэрлэгээ' | 'Төлбөр' | 'Яаралтай' | 'Бусад';
  isImportant: boolean;
  date: string;
  author: string;
}

export interface BillRecord {
  id: string;
  apartmentNumber: string; // e.g., "Marta Green Lake"
  unitNumber: string; // e.g., "45"
  residentName: string;
  month: string; // e.g., "2026 оны 9-р сар"
  amount: number; // monthly fee e.g., 25,000
  previousBalance: number; // өмнөх үлдэгдэл
  totalDue: number; // Нийт төлөх
  status: 'Төлсөн' | 'Төлөөгүй' | 'Дутуу төлсөн';
  paidDate?: string;
  // Breakdown of monthly fee
  breakdown?: {
    cleaning: number;
    security: number;
    elevator: number;
    management: number;
    waste: number;
  };
}

export interface ComplaintRequest {
  id: string;
  code: string; // e.g. "REQ-104"
  unitNumber: string;
  residentName: string;
  phone: string;
  category: 'Сантехник' | 'Цахилгаан' | 'Цэвэрлэгээ' | 'Лифт' | 'Орчны дуу чимээ' | 'Дулаан/Паар' | 'Бусад';
  title: string;
  description: string;
  status: 'Хүлээгдэж буй' | 'Хянаж байна' | 'Шийдвэрлэсэн';
  assignedTo?: string; // e.g. "Сантехникч Д.Ганзориг"
  createdAt: string;
  adminNote?: string;
}

export interface FinancialReport {
  id: string;
  title: string;
  period: string; // e.g. "2026 оны 8-р сар"
  income: number; // Нийт орлого
  expense: number; // Нийт зарлага
  balance: number; // Үлдэгдэл
  fileUrl?: string;
  publishedAt: string;
}

export interface SohSettings {
  sohName: string;
  buildingName: string;
  address: string;
  emergencyPhones: {
    title: string;
    name: string;
    phone: string;
  }[];
  bankAccounts: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  }[];
  rules: string[];
  qpayConfig?: QPayConfig;
}

export interface QPayConfig {
  enabled: boolean;
  merchantId?: string;
  clientId?: string;
  clientSecret?: string;
  invoiceCode?: string;
}

export interface QPayBankDeeplink {
  name: string;
  description: string;
  logo: string;
  link: string;
}

export interface QPayInvoiceData {
  invoiceId: string;
  qrText: string;
  qrImage: string;
  shortUrl: string;
  urls: QPayBankDeeplink[];
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  status: 'Идэвхтэй' | 'Хаагдсан';
  createdAt: string;
  endDate: string;
  votedUnits: { [unitNumber: string]: string }; // unitNumber -> optionId
  totalVotes: number;
}

export interface PaymentReceipt {
  id: string;
  unitNumber: string;
  amount: number;
  bankName: string;
  transactionNo: string;
  receiptImage?: string; // base64 data URI
  note?: string;
  status: 'Хүлээгдэж буй' | 'Баталгаажсан' | 'Татгалзсан';
  createdAt: string;
  verifiedAt?: string;
}

export interface VehicleRecord {
  id: string;
  plateNumber: string; // e.g., "1234 УБА"
  unitNumber: string;
  carModel: string; // e.g., "Prius 30", "Land Cruiser 200"
  ownerName: string;
  ownerPhone: string;
  registeredAt: string;
  isGuest?: boolean;
  guestUntil?: string;
}

// ------------------------------------
// NEW PHASE 2 TYPES
// ------------------------------------

export interface MeterReading {
  id: string;
  unitNumber: string;
  residentName?: string;
  period: string; // e.g., "2026 оны 10-р сар"
  coldWater: number; // m3
  hotWater: number; // m3
  electricity?: number; // kWh
  photoUrl?: string; // base64 photo
  submittedAt: string;
  status: 'Хянагдсан' | 'Шинэ';
}

export interface DeliveryItem {
  id: string;
  code: string; // e.g. "DLV-102"
  unitNumber: string;
  courierCompany: string; // e.g. "Toki", "Shoppy", "Mongol Post", "Хүргэлт"
  itemDescription: string;
  photoUrl?: string; // base64 photo of parcel
  status: 'Хүлээгдэж буй' | 'Хүлээн авсан';
  arrivedAt: string;
  pickedUpAt?: string;
}

export interface CctvRequest {
  id: string;
  code: string; // e.g. "CCTV-101"
  unitNumber: string;
  phone: string;
  date: string; // e.g. "2026-10-05"
  timeRange: string; // e.g. "14:00 - 15:30"
  location: string; // e.g. "Зүүн талын ил зогсоол", "1-р орцны үүд", "Хүүхдийн талбай"
  reason: string; // e.g. "Машин шүргэсэн сэжигтэй", "Хүүхдийн дугуй алдагдсан"
  status: 'Хүлээгдэж буй' | 'Шалгаж байна' | 'Бичлэг олдсон' | 'Шийдвэрлэсэн';
  adminNote?: string;
  createdAt: string;
}

export interface ExpenseReceipt {
  id: string;
  title: string; // e.g. "Паарны хаалт 4ш, жийргэвч"
  category: 'Сэлбэг хэрэгсэл' | 'Цэвэрлэгээ үйлчилгээ' | 'Цахилгаан, сантехник' | 'Тохижилт, хашаа' | 'Бусад';
  amount: number;
  date: string;
  storeName: string; // e.g. "100 айл сантехник", "Номин Их дэлгүүр"
  photoUrl?: string; // Photo of receipt / e-barimt
  createdAt: string;
}
