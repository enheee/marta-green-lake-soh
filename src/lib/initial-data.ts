import { Announcement, BillRecord, ComplaintRequest, FinancialReport, SohSettings } from './types';

export const initialSettings: SohSettings = {
  sohName: 'Марта-8 СӨХ (102-р байр)',
  buildingName: 'Marta Green Lake (102-р байр)',
  address: 'Улаанбаатар хот, Сүхбаатар дүүрэг, 9-р хороо, Marta Green Lake хотхон, 102-р байр',
  emergencyPhones: [
    { title: 'СӨХ-ийн дарга', name: 'Б.Оюун-эрдэнэ', phone: '9701-1883' },
    { title: 'СӨХ-ийн санхүү хариуцсан', name: 'С.Энхтөр', phone: '9590-6645' },
    { title: 'Байрны жижүүр', name: '24 цагийн жижүүр', phone: '9922-3344' },
    { title: 'Дуудлагын сантехникч', name: 'Д.Ганзориг', phone: '9933-4455' },
    { title: 'Дуудлагын цахилгаанчин', name: 'Т.Болд', phone: '9944-5566' },
    { title: 'Лифтний аваарийн алба', name: 'Лифт Сервис ХХК', phone: '7700-1122' },
  ],
  bankAccounts: [
    { bankName: 'Төрийн Банк', accountNumber: 'MN 600054 109901002374', accountName: 'МАРТА-8 СӨХ' },
    { bankName: 'Хаан Банк', accountNumber: '5012345678', accountName: 'МАРТА-8 СӨХ' },
    { bankName: 'Голомт Банк', accountNumber: '1605123456', accountName: 'МАРТА-8 СӨХ' },
  ],
  rules: [
    'Ажлын өдрүүдэд 09:00 - 18:00 цагийн хооронд дуу чимээтэй засварын ажил хийнэ үү. Амралтын өдрүүдэд дуу чимээ гаргахыг хориглоно.',
    'Хог хаягдлыг зориулалтын уутанд хийж, хогийн цэгт өглөөний 07:00 - 10:00, оройн 18:00 - 22:00 цагийн хооронд хаяна уу.',
    'Орц, коридор, шатны талбайд хувийн эд зүйл, дугуй, гутал тавихгүй байхыг анхаарна уу (Галын аюулгүй байдлын шаардлага).',
    'Авто машиныг бусдын орц гарц, явган хүний зам хааж зогсоохыг хатуу хориглоно.',
    'СӨХ-ийн сарын хураамж (40,000₮)-ийг тухайн сарын 25-ны дотор төлж хэвшинэ үү.'
  ]
};

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Цахилгаан эрчим хүч түр хязгаарлах тухай',
    content: 'УБЦТС ТӨХК-аас хийгдэх урсгал засварын улмаас маргааш буюу 9-р сарын 16-ны 10:00-14:00 цагийн хооронд цахилгаан түр хязгаарлагдах тул цахилгаан хэрэгслээ сүлжээнээс салгаж, урьдчилан сэргийлнэ үү.',
    category: 'Яаралтай',
    isImportant: true,
    date: '2026-09-15',
    author: 'СӨХ-ийн Удирдах зөвлөл'
  },
  {
    id: 'ann-2',
    title: 'Намрын ээлжит нийтийн их цэвэрлэгээ зарлагдлаа',
    content: 'Ирэх Бямба гарагт 10:00 цагаас нийтийн эзэмшлийн талбай, хүүхдийн тоглоомын талбай, автомашины зогсоолын их цэвэрлэгээ зохион байгуулагдана. Оршин суугч та бүхнийг идэвхтэй оролцохыг уриалж байна. Бээлий, шуудайг СӨХ-өөс хангана.',
    category: 'Цэвэрлэгээ',
    isImportant: false,
    date: '2026-09-14',
    author: 'СӨХ-ийн Удирдах зөвлөл'
  },
  {
    id: 'ann-3',
    title: '2026 оны 9-р сарын СӨХ-ийн төлбөрийн нэхэмжлэх гарлаа',
    content: 'Эрхэм оршин суугчид та бүхэн өөрийн тоотоороо төлбөр шалгах цэс рүү орон төлбөрийн үлдэгдлээ шалгаж, заасан хугацаанд төлнө үү. Төлбөрөө цаг тухайд нь төлсөн та бүхэнд баярлалаа.',
    category: 'Төлбөр',
    isImportant: false,
    date: '2026-09-10',
    author: 'СӨХ-ийн Нягтлан'
  },
  {
    id: 'ann-4',
    title: 'Халаалтын шугам угаах, шалгах хуваарь',
    content: 'Өвлийн бэлтгэл ажлын хүрээнд 9-р сарын 20-ноос 22-ны хооронд халаалтын шугамд ус шахаж даралт шалгана. Радиатр (паар)-ны хаалтуудаа шалгаж, ус алдахаас сэргийлнэ үү.',
    category: 'Засвар',
    isImportant: false,
    date: '2026-09-08',
    author: 'СӨХ-ийн Инженер'
  }
];

// Generate 120 units across floors 2 to 16 for Marta-8 1024-р байр
// Based on actual SOH paper report: Monthly fee 40,000 MNT, real balances
export const initialBills: BillRecord[] = Array.from({ length: 120 }, (_, i) => {
  const unitNumber = String(i + 1);
  // Calculate floor: Floor 2 has units 1-8, Floor 3 has units 9-16, etc. (8 units per floor, up to 16th floor)
  const floor = Math.min(16, Math.floor(i / 8) + 2);
  const monthlyAmount = 40000;

  // Realistically mimic the paper report:
  // Units with different balances:
  // - around 30% are fully paid (0 balance)
  // - around 25% owe just current month (40,000)
  // - around 20% owe 2-3 months (80,000 - 120,000)
  // - around 15% owe 4-6 months (160,000 - 240,000)
  // - around 10% owe long-term (280,000 - 440,000)
  let unpaidMonthsCount = 0;
  if ((i + 1) % 17 === 0) unpaidMonthsCount = 11; // 440,000 MNT (like unit 4, 21, 54 on paper)
  else if ((i + 1) % 13 === 0) unpaidMonthsCount = 7; // 280,000 MNT
  else if ((i + 1) % 7 === 0) unpaidMonthsCount = 4; // 160,000 MNT
  else if ((i + 1) % 5 === 0) unpaidMonthsCount = 2; // 80,000 MNT
  else if ((i + 1) % 3 === 0) unpaidMonthsCount = 1; // 40,000 MNT (current month only)
  else if ((i + 1) % 4 === 0) unpaidMonthsCount = 0; // 0 MNT (Fully paid)
  else if (i % 2 === 0) unpaidMonthsCount = 1;
  else unpaidMonthsCount = 0;

  const isCurrentPaid = unpaidMonthsCount === 0;
  const previousBalance = unpaidMonthsCount > 1 ? (unpaidMonthsCount - 1) * monthlyAmount : 0;
  const currentMonthDue = unpaidMonthsCount > 0 ? monthlyAmount : 0;
  const totalDue = currentMonthDue + previousBalance;

  // Month history for the Matrix board: 2-р сараас 10-р сар хүртэл
  const months = ['2-р сар', '3-р сар', '4-р сар', '5-р сар', '6-р сар', '7-р сар', '8-р сар', '9-р сар', '10-р сар'];
  const monthHistory: { [key: string]: { status: 'Төлсөн' | 'Төлөөгүй'; amount: number } } = {};
  
  months.forEach((m, mIdx) => {
    // If unpaidMonthsCount covers this month counting backwards from 10-р сар
    const isUnpaidInThisMonth = (months.length - 1 - mIdx) < unpaidMonthsCount;
    monthHistory[m] = {
      status: isUnpaidInThisMonth ? 'Төлөөгүй' : 'Төлсөн',
      amount: monthlyAmount,
    };
  });

  return {
    id: `bill-${unitNumber}`,
    apartmentNumber: '102-р байр',
    unitNumber,
    residentName: `${unitNumber}-р тоот`,
    floor,
    month: '2026 оны 10-р сар',
    amount: monthlyAmount,
    previousBalance,
    totalDue,
    status: isCurrentPaid ? 'Төлсөн' : (previousBalance > 0 ? 'Дутуу төлсөн' : 'Төлөөгүй'),
    paidDate: isCurrentPaid ? '2026-10-02' : undefined,
    monthHistory,
    breakdown: {
      cleaning: 12000,
      security: 14000,
      elevator: 8000,
      management: 4000,
      waste: 2000,
    },
  };
});

export const initialRequests: ComplaintRequest[] = [
  {
    id: 'req-1',
    code: 'REQ-101',
    unitNumber: '14',
    residentName: 'Э.Тэмүүлэн',
    phone: '9911-0022',
    category: 'Сантехник',
    title: 'Орцны бохирын хоолойгоос ус дусаж байна',
    description: '1-р орцны 2 давхрын нийтийн эзэмшлийн бохирын босоо хоолой залгаасаараа бага зэрэг дусаж эхэлсэн байна, шалгаж өгнө үү.',
    status: 'Хянаж байна',
    createdAt: '2026-09-14 14:20',
    adminNote: 'Сантехникч Д.Ганзоригт 9/15-ны өглөө үзэх даалгавар өгсөн.'
  },
  {
    id: 'req-2',
    code: 'REQ-102',
    unitNumber: '28',
    residentName: 'Б.Ариунболд',
    phone: '9512-3344',
    category: 'Цахилгаан',
    title: '4 давхрын коридорын гэрэл асахгүй байна',
    description: '4 давхрын лифтний урд талын мэдрэгчтэй гэрэл шатсан бололтой асахгүй харанхуй байна.',
    status: 'Шийдвэрлэсэн',
    createdAt: '2026-09-12 19:10',
    adminNote: 'Цахилгаанчин чийдэнг LED лампаар сольж дууссан.'
  },
  {
    id: 'req-3',
    code: 'REQ-103',
    unitNumber: '35',
    residentName: 'Ц.Сүрэн',
    phone: '8801-9988',
    category: 'Орчны дуу чимээ',
    title: 'Шөнөөр хөгжим чанга тавьж байна',
    description: 'Дээд айл шөнийн 23 цагаас хойш дуу чимээ их гаргаж байна, СӨХ-өөс сануулга өгч өгнө үү.',
    status: 'Хүлээгдэж буй',
    createdAt: '2026-09-15 08:30'
  }
];

export const initialReports: FinancialReport[] = [
  {
    id: 'rep-1',
    title: '2026 оны 8-р сарын санхүүгийн нэгдсэн тайлан',
    period: '2026 оны 8-р сар',
    income: 1420000,
    expense: 1180000,
    balance: 240000,
    publishedAt: '2026-09-05'
  },
  {
    id: 'rep-2',
    title: '2026 оны 7-р сарын санхүүгийн нэгдсэн тайлан',
    period: '2026 оны 7-р сар',
    income: 1390000,
    expense: 1250000,
    balance: 140000,
    publishedAt: '2026-08-05'
  },
  {
    id: 'rep-3',
    title: '2026 оны 6-р сарын санхүүгийн нэгдсэн тайлан',
    period: '2026 оны 6-р сар',
    income: 1450000,
    expense: 1310000,
    balance: 140000,
    publishedAt: '2026-07-05'
  }
];
