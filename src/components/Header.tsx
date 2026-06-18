import Image from "next/image";

export function Header() {
  return (
    <header className="w-full border-b border-border/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="S'investir" width={32} height={32} priority />
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
