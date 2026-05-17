"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import BuyMeACoffee from "./BuyMeACoffee";

const R = 88;
const CIRC = 2 * Math.PI * R;

let audioCtx: AudioContext | null = null;
function getAudioCtx() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playAlarm() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const beep = (freq: number, start: number, dur: number) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.type = "square";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.3, ctx.currentTime + start);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      o.start(ctx.currentTime + start);
      o.stop(ctx.currentTime + start + dur + 0.05);
    };
    beep(880, 0, 0.15);
    beep(880, 0.18, 0.15);
    beep(1100, 0.36, 0.3);
  } catch { }
}

function playTapSound() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = "sine";
    o.frequency.value = 600;
    g.gain.setValueAtTime(0.1, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + 0.15);
  } catch { }
}

function playUntapSound() {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = "sine";
    o.frequency.value = 400;
    g.gain.setValueAtTime(0.1, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + 0.15);
  } catch { }
}

export default function LimitCounter() {
  const [count, setCount] = useState(0);
  const [limit, setLimit] = useState(0);
  const [inputVal, setInputVal] = useState("0");
  const [shaking, setShaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number; type: 'increase' | 'decrease' | 'alarm' }[]
  >([]);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const alarmedRef = useRef(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rippleId = useRef(0);
  const isMounted = useRef(false);

  useEffect(() => {
    const savedCount = localStorage.getItem("tap-counter-count");
    const savedLimit = localStorage.getItem("tap-counter-limit");
    const savedSound = localStorage.getItem("tap-counter-sound");
    const savedTheme = localStorage.getItem("tap-counter-theme");
    if (savedCount !== null) setCount(parseInt(savedCount));
    if (savedLimit !== null) {
      setLimit(parseInt(savedLimit));
      setInputVal(savedLimit);
    }
    if (savedSound !== null) setSoundEnabled(savedSound === "true");
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
    isMounted.current = true;
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      localStorage.setItem("tap-counter-count", count.toString());
      localStorage.setItem("tap-counter-limit", limit.toString());
      localStorage.setItem("tap-counter-sound", soundEnabled.toString());
      localStorage.setItem("tap-counter-theme", theme);
    }
  }, [count, limit, soundEnabled, theme]);

  const isInfinite = limit === 0;
  const pct = isInfinite ? 0 : Math.min(count / limit, 1);
  const offset = isInfinite ? CIRC : CIRC * (1 - pct);
  const ringColor = isInfinite
    ? "#3b82f6"
    : pct >= 1
      ? "#E24B4A"
      : pct >= 0.75
        ? "#EF9F27"
        : "#4ade80";

  const addRipple = useCallback((x: number, y: number, type: 'increase' | 'decrease' | 'alarm') => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const id = rippleId.current++;
    setRipples((prev) => [
      ...prev,
      { id, x: x - rect.left, y: y - rect.top, type },
    ]);
    setTimeout(
      () => setRipples((prev) => prev.filter((r) => r.id !== id)),
      520
    );
  }, []);

  const tap = useCallback(
    (x: number, y: number) => {
      setCount((prev) => {
        if (!isInfinite && prev >= limit) return prev;
        const next = prev + 1;
        if (!isInfinite && next >= limit && !alarmedRef.current) {
          alarmedRef.current = true;
          if (soundEnabled) playAlarm();
          setShaking(true);
          setTimeout(() => setShaking(false), 500);
        } else {
          if (soundEnabled) playTapSound();
        }
        addRipple(x, y, (!isInfinite && next >= limit) ? 'alarm' : 'increase');
        return next;
      });
    },
    [limit, isInfinite, addRipple, soundEnabled]
  );

  const untap = useCallback((x?: number, y?: number) => {
    setCount((prev) => {
      if (!isInfinite && prev >= limit) return prev;
      const next = Math.max(0, prev - 1);
      if (!isInfinite && next < limit) {
        alarmedRef.current = false;
      }
      if (prev !== next && soundEnabled) {
        playUntapSound();
      }
      if (x !== undefined && y !== undefined) {
        addRipple(x, y, 'decrease');
      }
      return next;
    });
  }, [limit, isInfinite, addRipple, soundEnabled]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("input")) return;

      const isArrow = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key);
      const isSpace = e.key === " ";

      if (isArrow || isSpace) {

        if (isSpace && target.closest("button")) return;

        e.preventDefault();
        if (["ArrowUp", "ArrowRight", " "].includes(e.key)) {
          const rect = wrapRef.current?.getBoundingClientRect();
          if (rect) {
            tap(rect.left + rect.width / 2, rect.top + rect.height / 2);
          }
        } else {
          const rect = wrapRef.current?.getBoundingClientRect();
          if (rect) {
            untap(rect.left + rect.width / 2, rect.top + rect.height / 2);
          } else {
            untap();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [tap, untap]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("input")) return;

    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    if (x < rect.width / 2) {
      untap(e.clientX, e.clientY);
    } else {
      tap(e.clientX, e.clientY);
    }
  };

  const handleSet = () => {
    const v = parseInt(inputVal);
    if (!isNaN(v) && v >= 0) {
      setLimit(v);
      setCount(0);
      alarmedRef.current = false;
    }
  };

  const handleReset = () => {
    setCount(0);
    alarmedRef.current = false;
  };

  return (
    <div
      ref={wrapRef}
      onPointerDown={handlePointerDown}
      className={`relative flex flex-1 w-full cursor-pointer select-none flex-col items-center justify-center gap-4 px-4 py-8 sm:gap-8 sm:py-12 touch-none transition-colors duration-500 ${theme === "dark" ? "bg-zinc-950" : "bg-zinc-50"
        } ${shaking ? "animate-shake" : ""
        }`}
    >
      <style>{`
        /* Hide number input arrows */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
        @keyframes rippleOut {
          from { opacity: 0.4; transform: scale(0.5); }
          to   { opacity: 0;   transform: scale(3);   }
        }
        .animate-shake  { animation: shake     0.5s ease; }
        .animate-ripple { animation: rippleOut 0.5s ease forwards; }
      `}</style>

      <p className={`text-xs font-medium uppercase tracking-widest ${theme === "dark" ? "text-zinc-600" : "text-zinc-400"}`}>
        Tap Counter
      </p>



      <div className="relative h-52 w-52 shrink-0">
        <svg
          width="208"
          height="208"
          viewBox="0 0 200 200"
          className="-rotate-90"
        >
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke={theme === "dark" ? "#27272a" : "#e4e4e7"}
            strokeWidth="8"
          />
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke={ringColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.2s ease, stroke 0.3s" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`tabular-nums text-8xl font-semibold transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>
            {count}
          </span>
          <span className={`mt-1 text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
            {isInfinite ? "No Limit" : `of ${limit}`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-8 py-4">
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            untap(e.clientX, e.clientY);
          }}
          disabled={!isInfinite && count >= limit}
          className={`group relative flex h-16 w-16 items-center justify-center rounded-3xl border shadow-2xl backdrop-blur-md transition-all ${theme === "dark"
            ? "border-zinc-800/50 bg-zinc-900/30 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800/40 hover:text-zinc-200"
            : "border-zinc-200 bg-white/50 text-zinc-500 hover:border-zinc-400 hover:bg-zinc-100/80 hover:text-zinc-700"
            } ${!isInfinite && count >= limit
              ? "opacity-20 cursor-not-allowed"
              : "active:scale-95"
            }`}
          aria-label="Decrease count"
        >
          <svg
            className="h-6 w-6 transition-transform group-active:scale-90"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            tap(e.clientX, e.clientY);
          }}
          disabled={!isInfinite && count >= limit}
          className={`group relative flex h-16 w-16 items-center justify-center rounded-3xl border shadow-2xl backdrop-blur-md transition-all ${theme === "dark"
            ? "border-zinc-800/50 bg-zinc-900/30 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800/40 hover:text-zinc-200"
            : "border-zinc-200 bg-white/50 text-zinc-500 hover:border-zinc-400 hover:bg-zinc-100/80 hover:text-zinc-700"
            } ${!isInfinite && count >= limit
              ? "opacity-20 cursor-not-allowed"
              : "active:scale-95"
            }`}
          aria-label="Increase count"
        >
          <svg
            className="h-6 w-6 transition-transform group-active:scale-90"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
        <div className="flex items-center gap-3">
          <label className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>Limit</label>
          <div className={`flex items-center overflow-hidden rounded-lg border transition-colors ${theme === "dark"
            ? "border-zinc-800 bg-zinc-900/50 focus-within:border-zinc-600"
            : "border-zinc-200 bg-white focus-within:border-zinc-400"
            }`}>
            <input
              type="number"
              value={inputVal}
              min={0}
              onChange={(e) => setInputVal(e.target.value)}
              className={`w-16 bg-transparent px-3 py-1.5 text-center text-sm focus:outline-none ${theme === "dark" ? "text-white" : "text-zinc-900"}`}
            />
            <button
              onClick={handleSet}
              className={`border-l px-3 py-1.5 text-xs font-medium transition ${theme === "dark"
                ? "border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                : "border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
            >
              Set
            </button>
          </div>
        </div>

        <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

        <button
          onClick={handleReset}
          className={`rounded-lg border px-4 py-1.5 text-xs font-medium transition active:scale-95 ${theme === "dark"
            ? "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:text-white"
            : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-900"
            }`}
        >
          Reset
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setSoundEnabled(!soundEnabled);
          }}
          className={`rounded-lg border p-1.5 transition active:scale-95 ${theme === "dark"
            ? "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:text-white"
            : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-900"
            }`}
          title={soundEnabled ? "Disable sound" : "Enable sound"}
        >
          {soundEnabled ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setTheme(theme === "dark" ? "light" : "dark");
          }}
          className={`rounded-lg border p-1.5 transition active:scale-95 ${theme === "dark"
            ? "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:text-white"
            : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-900"
            }`}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>

      <p className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>tap on the right to increase and left to decrease</p>

      {ripples.map((r) => (
        <div
          key={r.id}
          className="animate-ripple pointer-events-none absolute rounded-full"
          style={{
            left: r.x,
            top: r.y,
            width: 80,
            height: 80,
            marginLeft: -40,
            marginTop: -40,
            background: r.type === 'decrease' ? "#ef4444" : r.type === 'increase' ? "#22c55e" : "#E24B4A",
          }}
        />
      ))}

      <div className="mt-8">
        <BuyMeACoffee theme={theme} />
      </div>
    </div>
  );
}