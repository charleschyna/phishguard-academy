import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Lock,
  Mail,
  MessageSquare,
  RotateCcw,
  Usb,
  X,
} from "lucide-react";
import type { Scenario } from "@/lib/scenarios";

export function ScenarioPreview({ scenario }: { scenario: Scenario }) {
  const p = scenario.preview;
  return (
    <motion.div
      key={scenario.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-border shadow-cardx"
    >
      {p.type === "email" ? (
        <EmailPreview preview={p} />
      ) : p.type === "message" ? (
        <MessagePreview preview={p} />
      ) : p.type === "url" ? (
        <UrlPreview preview={p} />
      ) : p.type === "popup" ? (
        <PopupPreview preview={p} />
      ) : (
        <DevicePreview preview={p} />
      )}
    </motion.div>
  );
}

// ── Shared window chrome ──────────────────────────────────────────────────────

function WindowBar({ label, icon }: { label: string; icon?: ReactNode }) {
  return (
    <div className="flex items-center gap-2 border-b border-white/10 bg-[#12122a] px-4 py-2.5">
      <div className="flex gap-1.5">
        <div className="h-3 w-3 rounded-full bg-destructive/80" />
        <div className="h-3 w-3 rounded-full bg-warning/80" />
        <div className="h-3 w-3 rounded-full bg-success/80" />
      </div>
      <span className="flex-1 text-center font-mono text-[10px] uppercase tracking-widest text-white/30">
        {label}
      </span>
      {icon && <div className="text-white/30">{icon}</div>}
    </div>
  );
}

// ── Email ─────────────────────────────────────────────────────────────────────

function senderColor(from: string): string {
  let h = 0;
  for (let i = 0; i < from.length; i++) h = from.charCodeAt(i) + ((h << 5) - h);
  const palette = ["#dc2626", "#ea580c", "#7c3aed", "#2563eb", "#0891b2", "#db2777"];
  return palette[Math.abs(h) % palette.length];
}

function EmailPreview({ preview }: { preview: Scenario["preview"] }) {
  const initial = preview.from ? preview.from[0].toUpperCase() : "?";
  const color = senderColor(preview.from ?? "");
  const senderName = preview.from?.split("@")[0] ?? "Unknown";

  return (
    <div className="bg-[#0f0f1e] font-sans text-sm">
      <WindowBar label="Mail — Inbox" icon={<Mail className="h-3.5 w-3.5" />} />

      {/* email header */}
      <div className="border-b border-white/10 px-5 py-4">
        <h3 className="mb-3 text-base font-semibold text-white">
          {preview.subject}
        </h3>
        <div className="flex items-start gap-3">
          <div
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-white/90">{senderName}</span>
              <span className="font-mono text-[10px] text-white/30">Today, 09:42</span>
            </div>
            <div className="mt-0.5 font-mono text-[11px] text-red-400">
              {preview.from}
            </div>
            <div className="mt-0.5 text-[11px] text-white/40">to: me</div>
          </div>
        </div>
      </div>

      {/* body */}
      <div className="min-h-16 px-5 py-4 leading-relaxed text-white/75">
        {preview.body}
      </div>

      {/* action bar */}
      <div className="flex gap-2 border-t border-white/10 px-5 py-3">
        {["Reply", "Forward", "Delete"].map((a) => (
          <span
            key={a}
            className="cursor-default rounded border border-white/10 px-3 py-1 font-mono text-[10px] uppercase text-white/30"
          >
            {a}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Message (SMS / Slack / DM) ────────────────────────────────────────────────

function MessagePreview({ preview }: { preview: Scenario["preview"] }) {
  const isPhone = preview.from?.startsWith("+");

  return (
    <div className="bg-[#0f0f1e] font-sans text-sm">
      <WindowBar
        label={isPhone ? "Messages" : "Direct Message"}
        icon={<MessageSquare className="h-3.5 w-3.5" />}
      />

      {/* contact header */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-[#12122a] px-4 py-3">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-600 text-xs font-bold text-white">
          {preview.from?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div>
          <div className="text-sm font-medium text-white">{preview.from}</div>
          <div className="font-mono text-[10px] text-emerald-400">
            {isPhone ? "Mobile · Unknown caller" : "Online"}
          </div>
        </div>
      </div>

      {/* message thread */}
      <div className="min-h-20 space-y-3 px-4 py-4">
        <div className="flex items-end gap-2">
          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-600 text-xs font-bold text-white">
            {preview.from?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div className="max-w-[82%] rounded-2xl rounded-bl-sm bg-[#1e1e38] px-4 py-2.5 text-white/85 shadow">
            {preview.body}
          </div>
        </div>
        <div className="flex justify-end">
          <span className="font-mono text-[10px] text-white/25">Delivered · 10:15</span>
        </div>
      </div>

      {/* input bar */}
      <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
        <div className="flex-1 rounded-full bg-white/8 px-4 py-2 font-mono text-[11px] text-white/25">
          Message...
        </div>
        <div className="grid h-7 w-7 place-items-center rounded-full bg-blue-600">
          <ArrowRight className="h-3.5 w-3.5 text-white" />
        </div>
      </div>
    </div>
  );
}

// ── URL / Browser ─────────────────────────────────────────────────────────────

function UrlPreview({ preview }: { preview: Scenario["preview"] }) {
  const url = preview.url ?? "";
  let displayHost = url;
  let displayPath = "";
  try {
    const u = new URL(url);
    displayHost = u.host;
    displayPath = u.pathname + u.search;
  } catch {
    /* ignore */
  }

  return (
    <div className="bg-[#0f0f1e] font-sans text-sm">
      {/* window chrome */}
      <div className="border-b border-white/10 bg-[#12122a]">
        <div className="flex items-center gap-3 px-4 pt-3 pb-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-destructive/80" />
            <div className="h-3 w-3 rounded-full bg-warning/80" />
            <div className="h-3 w-3 rounded-full bg-success/80" />
          </div>
          <div className="flex gap-0.5">
            <button className="rounded p-1.5 hover:bg-white/10">
              <ArrowLeft className="h-3 w-3 text-white/35" />
            </button>
            <button className="rounded p-1.5 hover:bg-white/10">
              <ArrowRight className="h-3 w-3 text-white/35" />
            </button>
            <button className="rounded p-1.5 hover:bg-white/10">
              <RotateCcw className="h-3 w-3 text-white/35" />
            </button>
          </div>
        </div>
        {/* address bar */}
        <div className="mx-4 mb-3 flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2">
          <Lock className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
          <span className="min-w-0 flex-1 truncate font-mono text-xs">
            <span className="text-amber-300">{displayHost}</span>
            <span className="text-white/45">{displayPath}</span>
          </span>
        </div>
      </div>

      {/* page area */}
      <div className="px-5 py-4">
        <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-white/25">
          Page content
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-white/65 leading-relaxed">
          {preview.body}
        </div>
        <div className="mt-3 flex items-center gap-2 font-mono text-[10px] text-amber-400/80">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          Domain does not match any trusted bookmark
        </div>
      </div>
    </div>
  );
}

// ── Popup / Browser Alert ─────────────────────────────────────────────────────

function PopupPreview({ preview }: { preview: Scenario["preview"] }) {
  return (
    <div className="flex min-h-44 items-center justify-center bg-[#0f0f1e] p-6">
      <div className="w-full max-w-sm overflow-hidden rounded-xl border border-white/15 bg-[#1e1e38] shadow-2xl">
        {/* dialog title bar */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#16162e] px-4 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-semibold text-white">Browser Alert</span>
          </div>
          <button className="grid h-5 w-5 place-items-center rounded-full bg-white/10">
            <X className="h-3 w-3 text-white/50" />
          </button>
        </div>

        {/* body */}
        <div className="px-5 py-4 text-sm leading-relaxed text-white/75">
          {preview.body}
        </div>

        {/* action row */}
        <div className="flex justify-end gap-2 border-t border-white/10 px-5 py-3">
          <button className="rounded-md border border-white/15 px-4 py-1.5 text-xs text-white/50">
            Cancel
          </button>
          <button className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow">
            Install Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Device (USB drop) ─────────────────────────────────────────────────────────

function DevicePreview({ preview }: { preview: Scenario["preview"] }) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center gap-5 bg-[#0f0f1e] px-5 py-8">
      {/* USB illustration */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative h-20 w-12 overflow-hidden rounded-t-sm rounded-b-lg border-2 border-slate-500 bg-slate-600">
          {/* connector notch */}
          <div className="absolute bottom-0 left-1/2 h-4 w-5 -translate-x-1/2 rounded-b-sm bg-slate-400" />
          {/* chip */}
          <div className="mx-2 mt-3 h-5 rounded-sm bg-slate-500" />
          <div className="mx-2 mt-1.5 h-1.5 rounded-sm bg-slate-400" />
          <div className="mx-2 mt-1 h-1.5 rounded-sm bg-slate-400" />
        </div>
        <div className="rounded bg-white/90 px-3 py-0.5 text-center font-mono text-[11px] font-bold text-slate-900">
          Salaries 2025
        </div>
        <Usb className="h-4 w-4 text-white/30" />
      </div>

      <p className="max-w-52 text-center text-sm leading-relaxed text-white/55">
        {preview.body}
      </p>

      <div className="flex items-center gap-2 font-mono text-[11px] text-amber-400/80">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        Unknown physical media — source unverified
      </div>
    </div>
  );
}
