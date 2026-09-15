import { Announcement, BillRecord, ComplaintRequest, FinancialReport, SohSettings } from './types';

export const initialSettings: SohSettings = {
  sohName: 'Marta Green Lake СӨХ',
  buildingName: 'Marta Green Lake хотхон',
  address: 'Улаанбаатар хот, Сүхбаатар дүүрэг, 9-р хороо, Marta Green Lake хотхон',
  emergencyPhones: [
    { title: 'СӨХ-ийн дарга', name: 'Б.Батболд', phone: '9911-2233' },
    { title: 'Байрны жижүүр', name: '24 цагийн жижүүр', phone: '9922-3344' },
    { title: 'Дуудлагын сантехникч', name: 'Д.Ганзориг', phone: '9933-4455' },
    { title: 'Дуудлагын цахилгаанчин', name: 'Т.Болд', phone: '9944-5566' },
    { title: 'Лифтний аваарийн алба', name: 'Лифт Сервис ХХК', phone: '7700-1122' },
  ],
  bankAccounts: [
    { bankName: 'Хаан Банк', accountNumber: '5012345678', accountName: 'Marta Green Lake СӨХ' },
    { bankName: 'Голомт Банк', accountNumber: '1605123456', accountName: 'Marta Green Lake СӨХ' },
  ],
  rules: [
    'Ажлын өдрүүдэд 09:00 - 18:00 цагийн хооронд дуу чимээтэй засварын ажил хийнэ үү. Амралтын өдрүүдэд дуу чимээ гаргахыг хориглоно.',
    'Хог хаягдлыг зориулалтын уутанд хийж, хогийн цэгт өглөөний 07:00 - 10:00, оройн 18:00 - 22:00 цагийн хооронд хаяна уу.',
    'Орц, коридор, шатны талбайд хувийн эд зүйл, дугуй, гутал тавихгүй байхыг анхаарна уу (Галын аюулгүй байдлын шаардлага).',
    'Авто машиныг бусдын орц гарц, явган хүний зам хааж зогсоохыг хатуу хориглоно.',
    'СӨХ-ийн сарын хураамжийг тухайн сарын 25-ны дотор төлж хэвшинэ үү.'
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

// Generate 48 realistic apartment units
export const initialBills: BillRecord[] = Array.from({ length: 48 }, (_, i) => {
  const unitNumber = String(i + 1);
  const monthlyAmount = (i % 3 === 0) ? 35000 : (i % 2 === 0) ? 28000 : 22000;
  const isPaid = i % 4 !== 0; // 75% paid
  const previousBalance = !isPaid ? (i % 3 === 0 ? monthlyAmount * 2 : 0) : 0;
  const totalDue = isPaid ? 0 : monthlyAmount + previousBalance;

  return {
    id: `bill-${unitNumber}`,
    apartmentNumber: 'Marta Green Lake',
    unitNumber,
    residentName: `${unitNumber}-р тоот`,
    month: '2026 оны 9-р сар',
    amount: monthlyAmount,
    previousBalance,
    totalDue,
    status: isPaid ? 'Төлсөн' : (previousBalance > 0 ? 'Дутуу төлсөн' : 'Төлөөгүй'),
    paidDate: isPaid ? '2026-09-12' : undefined
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
