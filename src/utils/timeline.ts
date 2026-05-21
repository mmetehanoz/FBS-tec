import { serviceStatuses } from "../data/mockData";
import type { ServiceStatus, TimelineItem } from "../types";

export function buildTimelineForStatus(
  timeline: TimelineItem[],
  currentStatus: ServiceStatus,
  note?: string,
): TimelineItem[] {
  const currentIndex = serviceStatuses.indexOf(currentStatus);
  const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;
  const now = new Date().toLocaleString("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return serviceStatuses.slice(0, safeCurrentIndex + 1).map((status, index) => {
    const existingItem = timeline.find((item) => item.status === status);
    const isCurrent = status === currentStatus;

    return {
      status,
      date: existingItem?.date ?? (isCurrent ? now : ""),
      note: existingItem?.note ?? (isCurrent ? note ?? "Servis durumu güncellendi." : ""),
      completed: index < safeCurrentIndex,
    };
  });
}
