import { CheckCircle2, Circle } from "lucide-react";
import { serviceStatuses } from "../data/mockData";
import type { TimelineItem } from "../types";
import { cn } from "../utils/cn";

export function Timeline({ items }: { items: TimelineItem[] }) {
  const mapped = serviceStatuses.map((status) => {
    const item: TimelineItem | undefined = items.find((timeline) => timeline.status === status);
    return {
      status,
      date: item?.date,
      note: item?.note,
      completed: Boolean(item?.completed),
      active: item ? !item.completed : false,
    };
  });

  return (
    <div className="space-y-1">
      {mapped.map((item, index) => (
        <div key={item.status} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "grid h-9 w-9 place-items-center rounded-full border-2 bg-white",
                item.completed && "border-emerald-500 text-emerald-600",
                item.active && "border-brand-600 text-brand-700",
                !item.completed && !item.active && "border-slate-200 text-slate-300",
              )}
            >
              {item.completed ? <CheckCircle2 size={19} /> : <Circle size={15} />}
            </div>
            {index < mapped.length - 1 ? <div className="h-10 w-px bg-slate-200" /> : null}
          </div>
          <div className="min-w-0 pb-5">
            <p
              className={cn(
                "text-sm font-black",
                item.completed || item.active ? "text-slate-950" : "text-slate-400",
              )}
            >
              {item.status}
            </p>
            {item.date ? <p className="mt-1 text-xs font-semibold text-slate-500">{item.date}</p> : null}
            {item.note ? <p className="mt-1 text-sm leading-6 text-slate-600">{item.note}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
