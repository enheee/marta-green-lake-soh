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
}

export interface ComplaintRequest {
  id: string;
  code: string; // e.g. "REQ-104"
  unitNumber: string;
  residentName: string;
  phone: string;
  category: 'Сантехник' | 'Цахилгаан' | 'Цэвэрлэгээ' | 'Лифт' | 'Орчны дуу чимээ' | 'Бусад';
  title: string;
  description: string;
  status: 'Хүлээгдэж буй' | 'Хянаж байна' | 'Шийдвэрлэсэн';
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
}
