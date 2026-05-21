export const phonePrefix = "+90";

export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("90") && digits.length === 12) {
    return digits.slice(2);
  }

  if (digits.startsWith("0") && digits.length === 11) {
    return digits.slice(1);
  }

  return digits;
}

export function isValidTurkishMobile(phone: string) {
  const normalizedPhone = normalizePhone(phone);
  return normalizedPhone.length === 10 && normalizedPhone.startsWith("5");
}

export function formatTurkishMobileInput(value: string) {
  const digits = value.replace(/\D/g, "");
  let remainingDigits = "";

  if (digits.startsWith("90")) {
    remainingDigits = digits.slice(2);
  } else if (digits.startsWith("05")) {
    remainingDigits = digits.slice(1);
  } else {
    remainingDigits = digits;
  }

  const rest = remainingDigits.slice(0, 10);
  const groups = [
    rest.slice(0, 3),
    rest.slice(3, 6),
    rest.slice(6, 8),
    rest.slice(8, 10),
  ].filter(Boolean);

  return groups.length ? `${phonePrefix} ${groups.join(" ")}` : phonePrefix;
}
