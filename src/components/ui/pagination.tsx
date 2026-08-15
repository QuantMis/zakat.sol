import { Button } from "@/components/ui/button";

type PaginationProps = {
  /** 1-based, and expected to already be within range. */
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
  /** Plural noun for what is being paged, read in the summary and the label. */
  label: string;
};

/**
 * Pages a long list. Renders nothing when everything already fits, so a small
 * wallet's table looks exactly as it did before there was pagination at all.
 *
 * The range rather than a page counter: "11–20 of 37" says where you are and
 * how much is left in one line, which is what the panel headings do too.
 */
export function Pagination({ page, pageSize, total, onChange, label }: PaginationProps) {
  const pageCount = Math.ceil(total / pageSize);
  if (pageCount <= 1) return null;

  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <nav
      aria-label={`${label} pages`}
      className="flex items-center justify-between gap-4 border-t border-line-soft px-5 py-3"
    >
      <p aria-live="polite" className="text-[12.5px] tabular-nums text-muted">
        {first}–{last} of {total} {label}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(page + 1)}
          disabled={page === pageCount}
        >
          Next
        </Button>
      </div>
    </nav>
  );
}
