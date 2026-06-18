export function Header() {
  return (
    <header className="w-full border-b border-border/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2.5">
          {/* Logo doré S'investir (reproduction simplifiée de l'identité). */}
          <span
            aria-hidden
            className="grid h-8 w-8 place-items-center rounded-md font-bold text-background"
            style={{ background: "var(--gold)" }}
          >
            S
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            S&apos;investir<span className="text-muted"> · Simulateurs</span>
          </span>
        </div>
        <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
          Simulateur Crypto
        </span>
      </div>
    </header>
  );
}
