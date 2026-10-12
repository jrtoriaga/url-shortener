import { useEffect, useState, type FormEvent } from "react";
import clsx from "clsx";
import { pasteFromClipboard } from "../lib/utils";
import { CheckIcon, PasteIcon, SendIcon, Spinner, WarningIcon } from "./icons";

type UrlFormProps = {
  value: string;
  loading: boolean;
  isValid: boolean;
  showClientError: boolean;
  clientErrorMessage: string;
  onInputChange: (value: string) => void;
  onShorten: () => void;
};

export function UrlForm({
  value,
  loading,
  isValid,
  showClientError,
  clientErrorMessage,
  onInputChange,
  onShorten,
}: UrlFormProps) {
  const [showPastedPopup, setShowPastedPopup] = useState(false);

  // Hide the "Pasted" toast automatically.
  useEffect(() => {
    if (!showPastedPopup) return;
    const handler = setTimeout(() => setShowPastedPopup(false), 800);
    return () => clearTimeout(handler);
  }, [showPastedPopup]);

  const handlePaste = async () => {
    const text = await pasteFromClipboard();
    if (!text) return;
    onInputChange(text);
    setShowPastedPopup(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || loading) return;
    onShorten();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="reveal-late w-full">
      <label
        htmlFor="url-input"
        className="block font-mono text-xs uppercase tracking-[0.28em] text-ink-soft"
      >
        The long address
      </label>

      {/* Input row — this element carries `flex` and owns the two buttons. */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative grow pb-2">
          <input
            id="url-input"
            role="url-input"
            type="url"
            autoComplete="off"
            spellCheck={false}
            placeholder="https://a-very-long-address.example.com/…"
            className="peer w-full bg-transparent pb-1 font-mono text-base text-ink placeholder:text-ink-faint focus:outline-none disabled:text-ink-faint sm:text-lg"
            value={value}
            onChange={(event) => onInputChange(event.target.value)}
            disabled={loading}
          />
          {/* The underline "rule" thickens and inks up on focus. */}
          <span
            aria-hidden
            className={clsx(
              "pointer-events-none absolute inset-x-0 bottom-0 h-px transition-colors duration-300 peer-focus:bg-vermilion",
              isValid ? "bg-vermilion" : "bg-rule"
            )}
          />
          <span
            aria-hidden
            className={clsx(
              "pointer-events-none absolute inset-x-0 -bottom-px h-[3px] origin-left bg-vermilion transition-transform duration-300 ease-out peer-focus:scale-x-100",
              isValid ? "scale-x-100" : "scale-x-0"
            )}
          />
        </div>

        {/* Paste from clipboard */}
        <button
          type="button"
          onClick={handlePaste}
          aria-label="Paste from clipboard"
          title="Paste from clipboard"
          className="flex h-12 items-center justify-center gap-2 border border-rule px-4 text-ink-soft transition-colors hover:border-ink hover:text-ink focus-visible:outline-none"
        >
          <PasteIcon className="size-5" />
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.2em]">
            Paste
          </span>
        </button>

        {/* Send / spinner */}
        {loading ? (
          <div className="flex h-12 w-12 items-center justify-center bg-ink text-paper">
            <span role="status">
              <Spinner className="size-5 spin" />
              <span className="sr-only">Loading…</span>
            </span>
          </div>
        ) : (
          <button
            type="submit"
            aria-label="Shorten URL"
            title="Shorten URL"
            disabled={!isValid}
            className="flex h-12 w-12 shrink-0 items-center justify-center bg-ink text-paper transition-colors hover:bg-vermilion disabled:cursor-not-allowed disabled:bg-rule disabled:text-ink-faint"
          >
            <SendIcon className="size-5" />
          </button>
        )}
      </div>

      {/* Client-side validation message */}
      {showClientError && clientErrorMessage && (
        <p
          role="alert"
          className="mt-3 flex items-center gap-2 text-sm text-vermilion"
        >
          <WarningIcon className="size-4 shrink-0" />
          {clientErrorMessage}
        </p>
      )}

      {/* "Pasted from clipboard" toast */}
      <div aria-live="polite" className="mt-3 h-7">
        <div
          className={clsx(
            "inline-flex items-center gap-2 border border-forest/30 bg-forest-wash px-3 py-1 text-sm text-forest transition-opacity duration-300",
            showPastedPopup ? "opacity-100" : "opacity-0"
          )}
        >
          <CheckIcon className="size-4" />
          <span>Pasted from clipboard</span>
        </div>
      </div>
    </form>
  );
}
