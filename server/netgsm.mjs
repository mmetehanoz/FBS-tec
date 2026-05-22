/**
 * NetGSM SMS & OTP integration
 * REST v2 API — HTTP Basic Authentication
 *
 * Env variables required:
 *   NETGSM_USERNAME   - Abone numarası (850xxxxxxx / 312XXXXXXX)
 *   NETGSM_PASSWORD   - Alt kullanıcı şifresi (API Kullanıcısı türü)
 *   NETGSM_HEADER     - Tanımlı gönderici adı / mesaj başlığı (maks 11 karakter)
 *   NETGSM_APPNAME    - (opsiyonel) Uygulama adı
 */

const SMS_URL = "https://api.netgsm.com.tr/sms/rest/v2/send";
const OTP_URL = "https://api.netgsm.com.tr/sms/rest/v2/otp";

function getCredentials() {
  const username = process.env.NETGSM_USERNAME;
  const password = process.env.NETGSM_PASSWORD;

  if (!username || !password) {
    throw new Error("NETGSM_USERNAME ve NETGSM_PASSWORD ortam değişkenleri tanımlı değil.");
  }

  const token = Buffer.from(`${username}:${password}`).toString("base64");
  return { username, token };
}

function normalizeRecipient(phone) {
  // Ensure format: 5XXXXXXXXX (10 digits, no leading 0 or country code)
  const digits = String(phone).replace(/\D/g, "");

  if (digits.startsWith("90") && digits.length === 12) {
    return digits.slice(2);
  }

  if (digits.startsWith("0") && digits.length === 11) {
    return digits.slice(1);
  }

  return digits;
}

/**
 * Send one or more SMS messages.
 * @param {Array<{phone: string, message: string}>} recipients
 * @returns {Promise<{success: boolean, jobid: string|null, code: string, description: string}>}
 */
export async function sendSms(recipients) {
  const { token } = getCredentials();
  const header = process.env.NETGSM_HEADER;
  const appname = process.env.NETGSM_APPNAME ?? "FBS Teknik Servis";

  if (!header) {
    throw new Error("NETGSM_HEADER ortam değişkeni tanımlı değil.");
  }

  const body = {
    msgheader: header,
    messages: recipients.map((r) => ({
      msg: r.message,
      no: normalizeRecipient(r.phone),
    })),
    encoding: "TR",
    iysfilter: "0",
    appname,
  };

  const response = await fetch(SMS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => String(response.status));
    throw new Error(`NetGSM HTTP hatası: ${response.status} — ${text}`);
  }

  const result = await response.json();

  return {
    success: result.code === "00" || result.code === "01" || result.code === "02",
    jobid: result.jobid ?? null,
    code: result.code,
    description: result.description ?? "",
  };
}

/**
 * Send a single SMS to one recipient (convenience wrapper).
 */
export async function sendSingleSms(phone, message) {
  return sendSms([{ phone, message }]);
}

/**
 * Send an OTP SMS.
 * Note: NetGSM OTP service requires a separate OTP package on the account.
 * OTP messages CANNOT contain Turkish characters.
 * @param {string} phone  - 10-digit Turkish mobile (5XXXXXXXXX)
 * @param {string} msg    - Message text (no Turkish chars, max 155 chars with header)
 * @returns {Promise<{success: boolean, jobid: string|null, code: string, description: string}>}
 */
export async function sendOtpSms(phone, msg) {
  const { token } = getCredentials();
  const header = process.env.NETGSM_HEADER;
  const appname = process.env.NETGSM_APPNAME ?? "FBS Teknik Servis";

  if (!header) {
    throw new Error("NETGSM_HEADER ortam değişkeni tanımlı değil.");
  }

  const body = {
    msgheader: header,
    msg,
    no: normalizeRecipient(phone),
    appname,
  };

  const response = await fetch(OTP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => String(response.status));
    throw new Error(`NetGSM OTP HTTP hatası: ${response.status} — ${text}`);
  }

  const result = await response.json();

  return {
    success: result.code === "00",
    jobid: result.jobid ?? null,
    code: result.code,
    description: result.description ?? "",
  };
}

/**
 * Generate a 6-digit OTP code.
 */
export function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Status-based SMS message templates.
 * OTP service does not support Turkish chars — use Latin equivalents.
 */
export const STATUS_SMS_TEMPLATES = {
  "Talep Alındı": (trackingNo) =>
    `FBS Teknik Servis: Servis talebiniz (${trackingNo}) alindi. Ekibimiz en kisa surede sizinle iletisime gececek.`,
  "Fiyat Onayı Bekleniyor": (trackingNo) =>
    `FBS Teknik Servis: ${trackingNo} numarali talebiniz icin fiyat teklifi hazirlandi. Onay icin musteri panelinizi ziyaret edin.`,
  "Teslime Hazır": (trackingNo) =>
    `FBS Teknik Servis: ${trackingNo} numarali cihaziniz teslime hazir. Teslim almak icin bizimle iletisime gecebilirsiniz.`,
};
