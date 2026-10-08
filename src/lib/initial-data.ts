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
    id: 'ann-5',
    title: 'СӨХ-ийн сарын хураамж 40,000₮ болж буурсан тухай мэдэгдэл',
    content: 'Эрхэм 102-р байрны оршин суугчдын анхааралд:\n\nУлаанбаатар хот болон дүүргийн шийдвэрийн дагуу ахуйн хог хаягдлын тээвэрлэлтийн зохион байгуулалт, хураамж улсын нэгдсэн систем рүү шилжсэн билээ.\n\nҮүнтэй холбогдуулан манай "Марта-8" СӨХ-ийн сарын хураамжаас хог тээврийн зардал хасагдаж, 2026 оны 10-р сараас эхлэн сарын суурь төлбөр 50,000 төгрөг байснаас 40,000 төгрөг болж буурсан болохыг мэдэгдэж байна.\n\nСанамж:\n1. 2026 оны 10-р сарын төлбөрөөс эхлэн сарын 40,000 төгрөгөөр тооцогдоно.\n2. Өмнөх 2-9 сарын хураамжийн үлдэгдэлтэй айл өрхүүд тухайн саруудын хураамжаа хуучин тарифаар буюу сарын 50,000 төгрөгөөр тооцон төлөхийг анхаарна уу.\n3. Та цахим системийн "Төлбөр" цэсээр болон Төрийн банкны дансаар (MN 600054 109901002374) төлбөрөө хугацаандаа төлж хэвшинэ үү.\n\nХамтран ажилладаг нийт оршин суугч та бүхэндээ талархал илэрхийлье!',
    category: 'Төлбөр',
    isImportant: true,
    date: '2026-10-08',
    author: 'СӨХ-ийн Удирдах зөвлөл'
  },
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
export const initialBills: BillRecord[] = [
  {
    "id": "bill-1",
    "apartmentNumber": "102-р байр",
    "unitNumber": "1",
    "residentName": "1-р тоот",
    "floor": 2,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-2",
    "apartmentNumber": "102-р байр",
    "unitNumber": "2",
    "residentName": "2-р тоот",
    "floor": 2,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 100000,
    "totalDue": 140000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-3",
    "apartmentNumber": "102-р байр",
    "unitNumber": "3",
    "residentName": "3-р тоот",
    "floor": 2,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 400000,
    "totalDue": 440000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-4",
    "apartmentNumber": "102-р байр",
    "unitNumber": "4",
    "residentName": "4-р тоот",
    "floor": 2,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 250000,
    "totalDue": 290000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-5",
    "apartmentNumber": "102-р байр",
    "unitNumber": "5",
    "residentName": "5-р тоот",
    "floor": 2,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 100000,
    "totalDue": 140000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-6",
    "apartmentNumber": "102-р байр",
    "unitNumber": "6",
    "residentName": "6-р тоот",
    "floor": 2,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 100000,
    "totalDue": 140000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-7",
    "apartmentNumber": "102-р байр",
    "unitNumber": "7",
    "residentName": "7-р тоот",
    "floor": 2,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 50000,
    "totalDue": 90000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-8",
    "apartmentNumber": "102-р байр",
    "unitNumber": "8",
    "residentName": "8-р тоот",
    "floor": 2,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-9",
    "apartmentNumber": "102-р байр",
    "unitNumber": "9",
    "residentName": "9-р тоот",
    "floor": 3,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-10",
    "apartmentNumber": "102-р байр",
    "unitNumber": "10",
    "residentName": "10-р тоот",
    "floor": 3,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 150000,
    "totalDue": 190000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-11",
    "apartmentNumber": "102-р байр",
    "unitNumber": "11",
    "residentName": "11-р тоот",
    "floor": 3,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 150000,
    "totalDue": 190000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-12",
    "apartmentNumber": "102-р байр",
    "unitNumber": "12",
    "residentName": "12-р тоот",
    "floor": 3,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 50000,
    "totalDue": 90000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-13",
    "apartmentNumber": "102-р байр",
    "unitNumber": "13",
    "residentName": "13-р тоот",
    "floor": 3,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 400000,
    "totalDue": 440000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-14",
    "apartmentNumber": "102-р байр",
    "unitNumber": "14",
    "residentName": "14-р тоот",
    "floor": 3,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-15",
    "apartmentNumber": "102-р байр",
    "unitNumber": "15",
    "residentName": "15-р тоот",
    "floor": 3,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-16",
    "apartmentNumber": "102-р байр",
    "unitNumber": "16",
    "residentName": "16-р тоот",
    "floor": 3,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 300000,
    "totalDue": 340000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-17",
    "apartmentNumber": "102-р байр",
    "unitNumber": "17",
    "residentName": "17-р тоот",
    "floor": 3,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 350000,
    "totalDue": 390000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-18",
    "apartmentNumber": "102-р байр",
    "unitNumber": "18",
    "residentName": "18-р тоот",
    "floor": 3,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 100000,
    "totalDue": 140000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-19",
    "apartmentNumber": "102-р байр",
    "unitNumber": "19",
    "residentName": "19-р тоот",
    "floor": 4,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 300000,
    "totalDue": 340000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-20",
    "apartmentNumber": "102-р байр",
    "unitNumber": "20",
    "residentName": "20-р тоот",
    "floor": 4,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-21",
    "apartmentNumber": "102-р байр",
    "unitNumber": "21",
    "residentName": "21-р тоот",
    "floor": 4,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 400000,
    "totalDue": 440000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-22",
    "apartmentNumber": "102-р байр",
    "unitNumber": "22",
    "residentName": "22-р тоот",
    "floor": 4,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 400000,
    "totalDue": 440000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-23",
    "apartmentNumber": "102-р байр",
    "unitNumber": "23",
    "residentName": "23-р тоот",
    "floor": 4,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 400000,
    "totalDue": 440000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-24",
    "apartmentNumber": "102-р байр",
    "unitNumber": "24",
    "residentName": "24-р тоот",
    "floor": 4,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 200000,
    "totalDue": 240000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-25",
    "apartmentNumber": "102-р байр",
    "unitNumber": "25",
    "residentName": "25-р тоот",
    "floor": 4,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-26",
    "apartmentNumber": "102-р байр",
    "unitNumber": "26",
    "residentName": "26-р тоот",
    "floor": 4,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 0,
    "status": "Төлсөн",
    "paidDate": "2026-10-02",
    "monthHistory": {
      "10-р сар": {
        "status": "Төлсөн",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-27",
    "apartmentNumber": "102-р байр",
    "unitNumber": "27",
    "residentName": "27-р тоот",
    "floor": 4,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 100000,
    "totalDue": 140000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-28",
    "apartmentNumber": "102-р байр",
    "unitNumber": "28",
    "residentName": "28-р тоот",
    "floor": 4,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 100000,
    "totalDue": 140000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-29",
    "apartmentNumber": "102-р байр",
    "unitNumber": "29",
    "residentName": "29-р тоот",
    "floor": 5,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-30",
    "apartmentNumber": "102-р байр",
    "unitNumber": "30",
    "residentName": "30-р тоот",
    "floor": 5,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 50000,
    "totalDue": 90000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-31",
    "apartmentNumber": "102-р байр",
    "unitNumber": "31",
    "residentName": "31-р тоот",
    "floor": 5,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 50000,
    "totalDue": 90000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-32",
    "apartmentNumber": "102-р байр",
    "unitNumber": "32",
    "residentName": "32-р тоот",
    "floor": 5,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 50000,
    "totalDue": 90000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-33",
    "apartmentNumber": "102-р байр",
    "unitNumber": "33",
    "residentName": "33-р тоот",
    "floor": 5,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 250000,
    "totalDue": 290000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-34",
    "apartmentNumber": "102-р байр",
    "unitNumber": "34",
    "residentName": "34-р тоот",
    "floor": 5,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 200000,
    "totalDue": 240000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-35",
    "apartmentNumber": "102-р байр",
    "unitNumber": "35",
    "residentName": "35-р тоот",
    "floor": 5,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-36",
    "apartmentNumber": "102-р байр",
    "unitNumber": "36",
    "residentName": "36-р тоот",
    "floor": 5,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 100000,
    "totalDue": 140000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-37",
    "apartmentNumber": "102-р байр",
    "unitNumber": "37",
    "residentName": "37-р тоот",
    "floor": 5,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 100000,
    "totalDue": 140000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-38",
    "apartmentNumber": "102-р байр",
    "unitNumber": "38",
    "residentName": "38-р тоот",
    "floor": 5,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-39",
    "apartmentNumber": "102-р байр",
    "unitNumber": "39",
    "residentName": "39-р тоот",
    "floor": 6,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-40",
    "apartmentNumber": "102-р байр",
    "unitNumber": "40",
    "residentName": "40-р тоот",
    "floor": 6,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-41",
    "apartmentNumber": "102-р байр",
    "unitNumber": "41",
    "residentName": "41-р тоот",
    "floor": 6,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 400000,
    "totalDue": 440000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-42",
    "apartmentNumber": "102-р байр",
    "unitNumber": "42",
    "residentName": "42-р тоот",
    "floor": 6,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 400000,
    "totalDue": 440000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-43",
    "apartmentNumber": "102-р байр",
    "unitNumber": "43",
    "residentName": "43-р тоот",
    "floor": 6,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-44",
    "apartmentNumber": "102-р байр",
    "unitNumber": "44",
    "residentName": "44-р тоот",
    "floor": 6,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-45",
    "apartmentNumber": "102-р байр",
    "unitNumber": "45",
    "residentName": "45-р тоот",
    "floor": 6,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 100000,
    "totalDue": 140000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-46",
    "apartmentNumber": "102-р байр",
    "unitNumber": "46",
    "residentName": "46-р тоот",
    "floor": 6,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 50000,
    "totalDue": 90000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-47",
    "apartmentNumber": "102-р байр",
    "unitNumber": "47",
    "residentName": "47-р тоот",
    "floor": 7,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 250000,
    "totalDue": 290000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-48",
    "apartmentNumber": "102-р байр",
    "unitNumber": "48",
    "residentName": "48-р тоот",
    "floor": 7,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 50000,
    "totalDue": 90000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-49",
    "apartmentNumber": "102-р байр",
    "unitNumber": "49",
    "residentName": "49-р тоот",
    "floor": 7,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 100000,
    "totalDue": 140000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-50",
    "apartmentNumber": "102-р байр",
    "unitNumber": "50",
    "residentName": "50-р тоот",
    "floor": 7,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-51",
    "apartmentNumber": "102-р байр",
    "unitNumber": "51",
    "residentName": "51-р тоот",
    "floor": 7,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-52",
    "apartmentNumber": "102-р байр",
    "unitNumber": "52",
    "residentName": "52-р тоот",
    "floor": 7,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 300000,
    "totalDue": 340000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-53",
    "apartmentNumber": "102-р байр",
    "unitNumber": "53",
    "residentName": "53-р тоот",
    "floor": 7,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 50000,
    "totalDue": 90000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-54",
    "apartmentNumber": "102-р байр",
    "unitNumber": "54",
    "residentName": "54-р тоот",
    "floor": 7,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 400000,
    "totalDue": 440000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-55",
    "apartmentNumber": "102-р байр",
    "unitNumber": "55",
    "residentName": "55-р тоот",
    "floor": 8,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-56",
    "apartmentNumber": "102-р байр",
    "unitNumber": "56",
    "residentName": "56-р тоот",
    "floor": 8,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 0,
    "status": "Төлсөн",
    "paidDate": "2026-10-02",
    "monthHistory": {
      "10-р сар": {
        "status": "Төлсөн",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-57",
    "apartmentNumber": "102-р байр",
    "unitNumber": "57",
    "residentName": "57-р тоот",
    "floor": 8,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-58",
    "apartmentNumber": "102-р байр",
    "unitNumber": "58",
    "residentName": "58-р тоот",
    "floor": 8,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-59",
    "apartmentNumber": "102-р байр",
    "unitNumber": "59",
    "residentName": "59-р тоот",
    "floor": 8,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 50000,
    "totalDue": 90000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-60",
    "apartmentNumber": "102-р байр",
    "unitNumber": "60",
    "residentName": "60-р тоот",
    "floor": 8,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-61",
    "apartmentNumber": "102-р байр",
    "unitNumber": "61",
    "residentName": "61-р тоот",
    "floor": 9,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 200000,
    "totalDue": 240000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-62",
    "apartmentNumber": "102-р байр",
    "unitNumber": "62",
    "residentName": "62-р тоот",
    "floor": 9,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-63",
    "apartmentNumber": "102-р байр",
    "unitNumber": "63",
    "residentName": "63-р тоот",
    "floor": 9,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-64",
    "apartmentNumber": "102-р байр",
    "unitNumber": "64",
    "residentName": "64-р тоот",
    "floor": 9,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 100000,
    "totalDue": 140000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-65",
    "apartmentNumber": "102-р байр",
    "unitNumber": "65",
    "residentName": "65-р тоот",
    "floor": 9,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-66",
    "apartmentNumber": "102-р байр",
    "unitNumber": "66",
    "residentName": "66-р тоот",
    "floor": 9,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 50000,
    "totalDue": 90000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-67",
    "apartmentNumber": "102-р байр",
    "unitNumber": "67",
    "residentName": "67-р тоот",
    "floor": 9,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 100000,
    "totalDue": 140000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-68",
    "apartmentNumber": "102-р байр",
    "unitNumber": "68",
    "residentName": "68-р тоот",
    "floor": 9,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 200000,
    "totalDue": 240000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-69",
    "apartmentNumber": "102-р байр",
    "unitNumber": "69",
    "residentName": "69-р тоот",
    "floor": 9,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 150000,
    "totalDue": 190000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-70",
    "apartmentNumber": "102-р байр",
    "unitNumber": "70",
    "residentName": "70-р тоот",
    "floor": 9,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 300000,
    "totalDue": 340000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-71",
    "apartmentNumber": "102-р байр",
    "unitNumber": "71",
    "residentName": "71-р тоот",
    "floor": 9,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 400000,
    "totalDue": 440000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-72",
    "apartmentNumber": "102-р байр",
    "unitNumber": "72",
    "residentName": "72-р тоот",
    "floor": 9,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-73",
    "apartmentNumber": "102-р байр",
    "unitNumber": "73",
    "residentName": "73-р тоот",
    "floor": 10,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 150000,
    "totalDue": 190000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-74",
    "apartmentNumber": "102-р байр",
    "unitNumber": "74",
    "residentName": "74-р тоот",
    "floor": 10,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 250000,
    "totalDue": 290000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-75",
    "apartmentNumber": "102-р байр",
    "unitNumber": "75",
    "residentName": "75-р тоот",
    "floor": 10,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 150000,
    "totalDue": 190000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-76",
    "apartmentNumber": "102-р байр",
    "unitNumber": "76",
    "residentName": "76-р тоот",
    "floor": 10,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 400000,
    "totalDue": 440000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-77",
    "apartmentNumber": "102-р байр",
    "unitNumber": "77",
    "residentName": "77-р тоот",
    "floor": 10,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-78",
    "apartmentNumber": "102-р байр",
    "unitNumber": "78",
    "residentName": "78-р тоот",
    "floor": 10,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 100000,
    "totalDue": 140000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-79",
    "apartmentNumber": "102-р байр",
    "unitNumber": "79",
    "residentName": "79-р тоот",
    "floor": 10,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 250000,
    "totalDue": 290000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-80",
    "apartmentNumber": "102-р байр",
    "unitNumber": "80",
    "residentName": "80-р тоот",
    "floor": 10,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-81",
    "apartmentNumber": "102-р байр",
    "unitNumber": "81",
    "residentName": "81-р тоот",
    "floor": 11,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-82",
    "apartmentNumber": "102-р байр",
    "unitNumber": "82",
    "residentName": "82-р тоот",
    "floor": 11,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 400000,
    "totalDue": 440000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-83",
    "apartmentNumber": "102-р байр",
    "unitNumber": "83",
    "residentName": "83-р тоот",
    "floor": 11,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 400000,
    "totalDue": 440000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-84",
    "apartmentNumber": "102-р байр",
    "unitNumber": "84",
    "residentName": "84-р тоот",
    "floor": 11,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 400000,
    "totalDue": 440000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-85",
    "apartmentNumber": "102-р байр",
    "unitNumber": "85",
    "residentName": "85-р тоот",
    "floor": 11,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-86",
    "apartmentNumber": "102-р байр",
    "unitNumber": "86",
    "residentName": "86-р тоот",
    "floor": 11,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 50000,
    "totalDue": 90000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-87",
    "apartmentNumber": "102-р байр",
    "unitNumber": "87",
    "residentName": "87-р тоот",
    "floor": 11,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 0,
    "status": "Төлсөн",
    "paidDate": "2026-10-02",
    "monthHistory": {
      "10-р сар": {
        "status": "Төлсөн",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-88",
    "apartmentNumber": "102-р байр",
    "unitNumber": "88",
    "residentName": "88-р тоот",
    "floor": 11,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 50000,
    "totalDue": 90000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-89",
    "apartmentNumber": "102-р байр",
    "unitNumber": "89",
    "residentName": "89-р тоот",
    "floor": 11,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-90",
    "apartmentNumber": "102-р байр",
    "unitNumber": "90",
    "residentName": "90-р тоот",
    "floor": 11,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 50000,
    "totalDue": 90000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-91",
    "apartmentNumber": "102-р байр",
    "unitNumber": "91",
    "residentName": "91-р тоот",
    "floor": 12,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 250000,
    "totalDue": 290000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-92",
    "apartmentNumber": "102-р байр",
    "unitNumber": "92",
    "residentName": "92-р тоот",
    "floor": 12,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-93",
    "apartmentNumber": "102-р байр",
    "unitNumber": "93",
    "residentName": "93-р тоот",
    "floor": 12,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 50000,
    "totalDue": 90000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-94",
    "apartmentNumber": "102-р байр",
    "unitNumber": "94",
    "residentName": "94-р тоот",
    "floor": 12,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-95",
    "apartmentNumber": "102-р байр",
    "unitNumber": "95",
    "residentName": "95-р тоот",
    "floor": 12,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 50000,
    "totalDue": 90000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-96",
    "apartmentNumber": "102-р байр",
    "unitNumber": "96",
    "residentName": "96-р тоот",
    "floor": 12,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 100000,
    "totalDue": 140000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-97",
    "apartmentNumber": "102-р байр",
    "unitNumber": "97",
    "residentName": "97-р тоот",
    "floor": 12,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 250000,
    "totalDue": 290000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-98",
    "apartmentNumber": "102-р байр",
    "unitNumber": "98",
    "residentName": "98-р тоот",
    "floor": 12,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-99",
    "apartmentNumber": "102-р байр",
    "unitNumber": "99",
    "residentName": "99-р тоот",
    "floor": 13,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 0,
    "status": "Төлсөн",
    "paidDate": "2026-10-02",
    "monthHistory": {
      "10-р сар": {
        "status": "Төлсөн",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-100",
    "apartmentNumber": "102-р байр",
    "unitNumber": "100",
    "residentName": "100-р тоот",
    "floor": 13,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 250000,
    "totalDue": 290000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-101",
    "apartmentNumber": "102-р байр",
    "unitNumber": "101",
    "residentName": "101-р тоот",
    "floor": 13,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-102",
    "apartmentNumber": "102-р байр",
    "unitNumber": "102",
    "residentName": "102-р тоот",
    "floor": 13,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-103",
    "apartmentNumber": "102-р байр",
    "unitNumber": "103",
    "residentName": "103-р тоот",
    "floor": 13,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 100000,
    "totalDue": 140000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-104",
    "apartmentNumber": "102-р байр",
    "unitNumber": "104",
    "residentName": "104-р тоот",
    "floor": 13,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 50000,
    "totalDue": 90000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-105",
    "apartmentNumber": "102-р байр",
    "unitNumber": "105",
    "residentName": "105-р тоот",
    "floor": 13,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 50000,
    "totalDue": 90000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-106",
    "apartmentNumber": "102-р байр",
    "unitNumber": "106",
    "residentName": "106-р тоот",
    "floor": 13,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 300000,
    "totalDue": 340000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-107",
    "apartmentNumber": "102-р байр",
    "unitNumber": "107",
    "residentName": "107-р тоот",
    "floor": 13,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 50000,
    "totalDue": 90000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-108",
    "apartmentNumber": "102-р байр",
    "unitNumber": "108",
    "residentName": "108-р тоот",
    "floor": 13,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 0,
    "status": "Төлсөн",
    "paidDate": "2026-10-02",
    "monthHistory": {
      "10-р сар": {
        "status": "Төлсөн",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-109",
    "apartmentNumber": "102-р байр",
    "unitNumber": "109",
    "residentName": "109-р тоот",
    "floor": 14,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-110",
    "apartmentNumber": "102-р байр",
    "unitNumber": "110",
    "residentName": "110-р тоот",
    "floor": 14,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 300000,
    "totalDue": 340000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-111",
    "apartmentNumber": "102-р байр",
    "unitNumber": "111",
    "residentName": "111-р тоот",
    "floor": 14,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 100000,
    "totalDue": 140000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-112",
    "apartmentNumber": "102-р байр",
    "unitNumber": "112",
    "residentName": "112-р тоот",
    "floor": 14,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-113",
    "apartmentNumber": "102-р байр",
    "unitNumber": "113",
    "residentName": "113-р тоот",
    "floor": 14,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 100000,
    "totalDue": 140000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-114",
    "apartmentNumber": "102-р байр",
    "unitNumber": "114",
    "residentName": "114-р тоот",
    "floor": 14,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 100000,
    "totalDue": 140000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-115",
    "apartmentNumber": "102-р байр",
    "unitNumber": "115",
    "residentName": "115-р тоот",
    "floor": 14,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 250000,
    "totalDue": 290000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-116",
    "apartmentNumber": "102-р байр",
    "unitNumber": "116",
    "residentName": "116-р тоот",
    "floor": 14,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 300000,
    "totalDue": 340000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-117",
    "apartmentNumber": "102-р байр",
    "unitNumber": "117",
    "residentName": "117-р тоот",
    "floor": 16,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 0,
    "totalDue": 40000,
    "status": "Төлөөгүй",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-118",
    "apartmentNumber": "102-р байр",
    "unitNumber": "118",
    "residentName": "118-р тоот",
    "floor": 16,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 150000,
    "totalDue": 190000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-119",
    "apartmentNumber": "102-р байр",
    "unitNumber": "119",
    "residentName": "119-р тоот",
    "floor": 16,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 250000,
    "totalDue": 290000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-120",
    "apartmentNumber": "102-р байр",
    "unitNumber": "120",
    "residentName": "120-р тоот",
    "floor": 16,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 300000,
    "totalDue": 340000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  },
  {
    "id": "bill-121",
    "apartmentNumber": "102-р байр",
    "unitNumber": "121",
    "residentName": "121-р тоот",
    "floor": 16,
    "month": "2026 оны 10-р сар",
    "amount": 40000,
    "previousBalance": 250000,
    "totalDue": 290000,
    "status": "Дутуу төлсөн",
    // paidDate omitted

    "monthHistory": {
      "10-р сар": {
        "status": "Төлөөгүй",
        "amount": 40000
      },
      "9-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "8-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "7-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "6-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "5-р сар": {
        "status": "Төлөөгүй",
        "amount": 50000
      },
      "4-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "3-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      },
      "2-р сар": {
        "status": "Төлсөн",
        "amount": 50000
      }
    },
    "breakdown": {
      "cleaning": 12000,
      "security": 14000,
      "elevator": 8000,
      "management": 4000,
      "waste": 2000
    }
  }
];

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
