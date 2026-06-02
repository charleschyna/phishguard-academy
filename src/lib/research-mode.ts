import { useEffect, useState, useCallback } from "react";

const KEY = "phishguard:research";

let _active = false;
const _listeners: Array<() => void> = [];

function _emit() {
  _listeners.forEach((l) => l());
}

export function useResearchMode() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    _active = typeof window !== "undefined" && localStorage.getItem(KEY) === "1";
    setOn(_active);
    const l = () => setOn(_active);
    _listeners.push(l);
    return () => {
      const idx = _listeners.indexOf(l);
      if (idx !== -1) _listeners.splice(idx, 1);
    };
  }, []);

  const toggle = useCallback(() => {
    _active = !_active;
    if (typeof window !== "undefined") {
      localStorage.setItem(KEY, _active ? "1" : "0");
    }
    _emit();
  }, []);

  return { on, toggle };
}
