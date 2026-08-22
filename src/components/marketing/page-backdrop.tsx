/**
 * Shorter cousin of the landing hero backdrop: same grid and star, but it
 * fades out to solid white so it can sit above ordinary page content without
 * leaving a seam where it ends.
 */
export function PageBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[560px] overflow-hidden"
    >
      <div className="blueprint-grid absolute inset-0" />
      <div className="star absolute -top-24 -right-16 size-[380px] bg-linear-150 from-[#CFE4D6] to-white opacity-60" />
      <div className="star absolute top-[210px] -left-24 size-[240px] bg-[#E8F1E9] max-lg:hidden" />
      <div className="absolute inset-0 bg-[radial-gradient(95%_80%_at_50%_0%,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.95)_62%,#fff_100%)]" />
    </div>
  );
}
