import { QPayConfig, QPayInvoiceData, QPayBankDeeplink } from './types';
import { getSettings } from './store';

const MONGOLIAN_BANKS: { name: string; description: string; scheme: string; logo: string }[] = [
  {
    name: 'Хаан Банк',
    description: 'Khan Bank App',
    scheme: 'khanbank://q?qPay_QRcode=',
    logo: 'https://play-lh.googleusercontent.com/yG1T6Y7k1_FqKx7h9XJz3uB9oB8i9q0=s96-rw',
  },
  {
    name: 'SocialPay',
    description: 'Голомт Банк SocialPay',
    scheme: 'socialpay://qpay?qPay_QRcode=',
    logo: 'https://play-lh.googleusercontent.com/5V3M2l6tK_6q7=s96-rw',
  },
  {
    name: 'Төрийн Банк',
    description: 'State Bank 3.0',
    scheme: 'statebank://q?qPay_QRcode=',
    logo: 'https://play-lh.googleusercontent.com/4N3=s96-rw',
  },
  {
    name: 'Хас Банк',
    description: 'XacBank App',
    scheme: 'xacbank://q?qPay_QRcode=',
    logo: 'https://play-lh.googleusercontent.com/Xac=s96-rw',
  },
  {
    name: 'ХХБ (TDB)',
    description: 'Trade and Development Bank',
    scheme: 'tdbonline://q?qPay_QRcode=',
    logo: 'https://play-lh.googleusercontent.com/TDB=s96-rw',
  },
  {
    name: 'Most Money',
    description: 'Most Money App',
    scheme: 'most://q?qPay_QRcode=',
    logo: 'https://play-lh.googleusercontent.com/Most=s96-rw',
  },
  {
    name: 'MonPay',
    description: 'Мобифинанс Monpay',
    scheme: 'monpay://q?qPay_QRcode=',
    logo: 'https://play-lh.googleusercontent.com/Monpay=s96-rw',
  },
  {
    name: 'Toki App',
    description: 'Toki Payments',
    scheme: 'toki://q?qPay_QRcode=',
    logo: 'https://play-lh.googleusercontent.com/Toki=s96-rw',
  },
];

export async function createQPayInvoice(params: {
  billId: string;
  unitNumber: string;
  amount: number;
  month: string;
}): Promise<QPayInvoiceData> {
  const settings = getSettings();
  const config = settings.qpayConfig;

  const isRealApiConfigured =
    config?.enabled &&
    config?.clientId &&
    config?.clientSecret &&
    config?.invoiceCode;

  if (isRealApiConfigured) {
    try {
      // 1. Get OAuth Token from QPay
      const authRes = await fetch('https://merchant.qpay.mn/v2/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
        },
      });

      if (!authRes.ok) {
        throw new Error('QPay нэвтрэх токен авахад алдаа гарлаа');
      }

      const authData = await authRes.json();
      const accessToken = authData.access_token;

      // 2. Create Invoice
      const invoicePayload = {
        invoice_code: config.invoiceCode,
        sender_invoice_no: `INV-${params.unitNumber}-${Date.now().toString().slice(-6)}`,
        invoice_receiver_code: `MGL-${params.unitNumber}`,
        invoice_description: `Marta Green Lake СӨХ ${params.unitNumber} тоот - ${params.month} төлбөр`,
        amount: params.amount,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://marta-green-lake-soh.vercel.app'}/api/qpay/callback?billId=${params.billId}`,
      };

      const invRes = await fetch('https://merchant.qpay.mn/v2/invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(invoicePayload),
      });

      if (invRes.ok) {
        const invData = await invRes.json();
        return {
          invoiceId: invData.invoice_id,
          qrText: invData.qr_text,
          qrImage: invData.qr_image, // base64 image data
          shortUrl: invData.qPay_shortUrl,
          urls: invData.urls || [],
        };
      }
    } catch (err) {
      console.error('QPay API error, using test mode fallback:', err);
    }
  }

  // --- Test / Demo Mode Fallback ---
  // Generates interactive QPay mock QR code with all Mongolian bank deeplinks
  const invoiceId = `qpay-mock-${params.billId}-${Date.now()}`;
  const qrString = `QPAY|MARTA_GREEN_LAKE_SOH|${params.unitNumber}|${params.amount}|${invoiceId}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrString)}`;

  const bankUrls: QPayBankDeeplink[] = MONGOLIAN_BANKS.map((b) => ({
    name: b.name,
    description: b.description,
    logo: b.logo,
    link: `${b.scheme}${encodeURIComponent(qrString)}`,
  }));

  return {
    invoiceId,
    qrText: qrString,
    qrImage: qrImageUrl,
    shortUrl: `https://qpay.mn/p/${invoiceId}`,
    urls: bankUrls,
  };
}

export async function checkQPayInvoiceStatus(invoiceId: string): Promise<{ paid: boolean; paidDate?: string }> {
  const settings = getSettings();
  const config = settings.qpayConfig;

  // Real API check
  if (config?.enabled && config?.clientId && !invoiceId.startsWith('qpay-mock-')) {
    try {
      const authRes = await fetch('https://merchant.qpay.mn/v2/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
        },
      });

      if (authRes.ok) {
        const authData = await authRes.json();
        const checkRes = await fetch('https://merchant.qpay.mn/v2/payment/check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authData.access_token}`,
          },
          body: JSON.stringify({
            object_type: 'INVOICE',
            object_id: invoiceId,
          }),
        });

        if (checkRes.ok) {
          const checkData = await checkRes.json();
          const isPaid = checkData.rows && checkData.rows.length > 0 && checkData.rows[0].payment_status === 'PAID';
          if (isPaid) {
            return { paid: true, paidDate: checkData.rows[0].payment_date || new Date().toISOString() };
          }
        }
      }
    } catch (e) {
      console.error('QPay check error:', e);
    }
  }

  // Simulated check for test mode:
  return { paid: false };
}
