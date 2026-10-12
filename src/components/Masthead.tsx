export function Masthead() {
  return (
    <header className="reveal w-full">
      {/* Kicker rule — the "masthead" strip of a printed page. */}
      <div className="flex items-center justify-between gap-4 font-mono text-[0.62rem] uppercase tracking-[0.35em] text-ink-soft sm:text-[0.7rem]">
        <span>Vol. 01</span>
        <span className="hidden sm:inline">Type &amp; Links</span>
        <span>Est. 2026</span>
      </div>

      <div className="mt-3 border-t-2 border-rule-strong" />
      <div className="mt-[3px] border-t border-rule" />

      <p className="mt-8 font-mono text-xs uppercase tracking-[0.4em] text-vermilion">
        Set in Fraunces &amp; Newsreader
      </p>

      <h1 className="mt-5 font-display text-[clamp(2.9rem,10vw,6.5rem)] font-semibold leading-[0.86] tracking-[-0.035em] text-ink">
        Shorten
        <span className="block pl-[0.08em] italic font-light text-vermilion">
          the link.
        </span>
      </h1>

      <p className="mt-7 max-w-[46ch] text-lg leading-relaxed text-ink-soft sm:text-xl">
        Paste an unwieldy address. We&rsquo;ll set it in a tighter edition &mdash;
        one short link, ready to clip.
      </p>
    </header>
  );
}
