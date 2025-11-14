/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";

type EOIEditorProps = {
  template: string;
};

export const EOIEditor = ({ template }: EOIEditorProps) => {
  const [draft, setDraft] = useState(template);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (error) {
      console.error("Failed to copy", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted">
          Edit the text below, then copy into your preferred document format or email response.
        </p>
        <button
          onClick={copyToClipboard}
          className="rounded-full border border-ocean/40 bg-ocean px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-ocean/90"
        >
          {copied ? "Copied!" : "Copy to clipboard"}
        </button>
      </div>
      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="h-[420px] w-full rounded-2xl border border-slate/20 bg-white/80 p-4 font-mono text-sm text-slate shadow-inner focus:border-ocean focus:outline-none focus:ring-2 focus:ring-ocean/20"
      />
    </div>
  );
};

