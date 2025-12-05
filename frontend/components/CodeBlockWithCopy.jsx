import { useState } from "react";

export default function CodeBlockWithCopy({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 200);
  };

  return (
    <div
      className="
        relative rounded-lg
        bg-zinc-900 text-zinc-100 dark:bg-zinc-800
        p-4 font-mono text-sm shadow-md
        overflow-x-auto max-h-[400px] overflow-y-auto
        wrap-break-word whitespace-pre-wrap
      "
    >
      <button
        onClick={handleCopy}
        className="
          sticky top-2 right-2
          z-10 text-xs px-2 py-1
          rounded-md bg-zinc-700 hover:bg-zinc-600
          transition text-white float-right
        "
      >
        {copied ? "Copied!" : "Copy"}
      </button>

      {text}
    </div>
  );
}
