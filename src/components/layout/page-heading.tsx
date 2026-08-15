import type { ReactNode } from "react";

type PageHeadingProps = {
  title: string;
  subtitle: ReactNode;
  action?: ReactNode;
};

export function PageHeading({ title, subtitle, action }: PageHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[26px] tracking-[-0.02em]">{title}</h1>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
