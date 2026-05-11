import { motion } from "framer-motion";
import { AlertTriangle, Mail, Link2, MessageSquare, Usb, MonitorSmartphone } from "lucide-react";
import type { Scenario } from "@/lib/scenarios";

const iconFor = {
  email: Mail,
  message: MessageSquare,
  popup: AlertTriangle,
  url: Link2,
  device: Usb,
} as const;

export function ScenarioPreview({ scenario }: { scenario: Scenario }) {
  const Icon = iconFor[scenario.preview.type] ?? MonitorSmartphone;
  const p = scenario.preview;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl border border-border bg-cardx shadow-cardx scanline"
    >
      <div className="flex items-center justify-between border-b border-border bg-secondary/40 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-warning/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-success/80" />
          </div>
          <span className="ml-3 font-mono text-[11px] uppercase text-muted-foreground">
            {p.type} · intercepted
          </span>
        </div>
        <Icon className="h-4 w-4 text-cyber" />
      </div>

      <div className="p-5 space-y-3 font-mono text-sm">
        {p.from && (
          <div className="flex gap-2">
            <span className="text-muted-foreground w-16 shrink-0">From:</span>
            <span className="text-foreground break-all">{p.from}</span>
          </div>
        )}
        {p.subject && (
          <div className="flex gap-2">
            <span className="text-muted-foreground w-16 shrink-0">Subject:</span>
            <span className="text-foreground">{p.subject}</span>
          </div>
        )}
        {p.url && (
          <div className="flex gap-2">
            <span className="text-muted-foreground w-16 shrink-0">URL:</span>
            <span className="text-warning break-all">{p.url}</span>
          </div>
        )}
        <div className="border-t border-border pt-3 text-foreground/90 leading-relaxed font-display">
          {p.body}
        </div>
      </div>
    </motion.div>
  );
}
