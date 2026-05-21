import type { PriceOfferItem, PriceOfferStatus } from "../types";

export function generateTrackingNo(existingTrackingNos: string[] = [], date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const prefix = `FBS-${year}-${month}-${day}`;
  const sequence = existingTrackingNos.filter((trackingNo) =>
    trackingNo.startsWith(`${prefix}-`),
  ).length + 1;

  return `${prefix}-${String(sequence).padStart(3, "0")}`;
}

export function formatCurrency(amount: number) {
  return `${new Intl.NumberFormat("tr-TR", {
    maximumFractionDigits: 0,
  }).format(amount)}₺`;
}

export function getOfferItemsWithStatus(items: PriceOfferItem[] = []) {
  return items.map((item) => ({
    ...item,
    status: item.status ?? ("Bekliyor" as PriceOfferStatus),
  }));
}

export function sumOfferItemsByStatus(
  items: PriceOfferItem[] = [],
  status?: PriceOfferStatus,
) {
  return getOfferItemsWithStatus(items)
    .filter((item) => !status || item.status === status)
    .reduce((total, item) => total + item.amount, 0);
}
