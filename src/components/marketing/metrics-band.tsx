import { metrics } from "@/data/metrics";

export function MetricsBand() {
  return (
    <dl className="mt-16 grid w-full max-w-[1120px] gap-4 sm:grid-cols-3 lg:mt-20">
      {metrics.map((metric) => (
        // Reversed so the figure reads first while the label stays the term.
        <div
          key={metric.label}
          className="flex flex-col-reverse gap-2 rounded-[14px] border border-line bg-white p-6"
        >
          <dt className="text-[14.5px] text-muted">{metric.label}</dt>
          <dd className="text-[36px] font-semibold tracking-[-0.02em] text-brand tabular-nums lg:text-[44px]">
            {metric.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
