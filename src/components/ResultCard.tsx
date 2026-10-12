import { useEffect, useState } from "react";
import clsx from "clsx";
import { copyToClipboard } from "../lib/utils";
import { CheckIcon, CopyIcon } from "./icons";

type ResultCardProps = {
  shortUrl: string;
};

export function ResultCard({ shortUrl }: ResultCardProps) {
  const [showCopiedPopup, setShowCopiedPopup] = useState(false);

  // Hide the "Copied" toast automatically.
  useEffect(() => {
    if (!showCopiedPopup) return;
    const handler = setTimeout(() => setShowCopiedPopup(false), 800);
    return () => clearTimeout(handler);
  }, [showCopiedPopup]);

  const handleCopy = () => {
    copyToClipboard(shortUrl).then(() => setShowCopiedPopup(true));
  };

  return (
    <section className="reveal-late w-full">
      <h3 className="font-mono text-xs uppercase tracking-[0.28em] text-ink-soft">
        shortened url
      </h3>

      {/* Result row — holds the short link and a single copy button. */}
      <div className="relative mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-l-4 border-vermilion bg-paper-shade px-5 py-4">
        <a
          href={shortUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="font-mono text-lg font-medium text-ink underline decoration-rule decoration-2 underline-offset-4 transition-colors hover:decoration-vermilion hover:text-vermilion sm:text-xl"
        >
          {shortUrl}
        </a>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy short link"
          title="Copy short link"
          className="flex h-10 items-center gap-2 border border-ink px-3 text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          <CopyIcon className="size-4" />
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.2em]">
            Copy
          </span>
        </button>

        {/* "Copied" toast */}
        <div
          aria-live="polite"
          className={clsx(
            "pointer-events-none absolute -bottom-9 left-0 inline-flex items-center gap-2 border border-forest/30 bg-forest-wash px-3 py-1 text-sm text-forest transition-opacity duration-300",
            showCopiedPopup ? "opacity-100" : "opacity-0"
          )}
        >
          <CheckIcon className="size-4" />
          <span>Copied</span>
        </div>
      </div>
    </section>
  );
}
