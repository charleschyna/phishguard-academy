import { useEffect, useRef, useState } from "react";

export function CountdownTimer({
  seconds,
  onExpire,
  paused,
}: {
  seconds: number;
  onExpire: () => void;
  paused?: boolean;
}) {
  const [remaining, setRemaining] = useState(seconds);
  const expiredRef = useRef(false);

  useEffect(() => {
    setRemaining(seconds);
    expiredRef.current = false;
  }, [seconds]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          if (!expiredRef.current) {
            expiredRef.current = true;
            onExpire();
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [paused, onExpire]);

  const pct = Math.max(0, (remaining / seconds) * 100);
  const danger = pct < 30;

  return (
    <div className="space-y-1">
      <div className="flex justify-between font-mono text-[11px] uppercase">
        <span className="text-muted-foreground">Time Pressure</span>
        <span className={danger ? "text-destructive" : "text-neon"}>{remaining}s</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full transition-all duration-1000 ${
            danger ? "bg-destructive" : "bg-neon-gradient"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
