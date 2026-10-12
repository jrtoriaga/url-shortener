import { WarningIcon } from "./icons";

type StatusMessageProps = {
  show: boolean;
  message: string;
};

export function StatusMessage({ show, message }: StatusMessageProps) {
  if (!show) return null;

  return (
    <div
      role="alert"
      className="reveal w-full border-l-4 border-vermilion bg-vermilion-wash px-5 py-4"
    >
      <div className="flex items-start gap-3 text-vermilion-deep">
        <WarningIcon className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.28em]">
            Off the press
          </p>
          <p className="mt-1 text-base leading-relaxed">
            {message ||
              "There was an error connecting to the server. Please try again later."}
          </p>
        </div>
      </div>
    </div>
  );
}
