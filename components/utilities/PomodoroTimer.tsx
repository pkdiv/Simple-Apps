"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import BuyMeACoffee from "./BuyMeACoffee";

const R = 88;
const CIRC = 2 * Math.PI * R;

function playNotification() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const beep = (freq: number, start: number, dur: number, vol: number) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, ctx.currentTime + start);
      g.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      o.start(ctx.currentTime + start);
      o.stop(ctx.currentTime + start + dur + 0.05);
    };
    beep(523.25, 0, 0.5, 0.2);
    beep(659.25, 0.15, 0.5, 0.2);
    beep(783.99, 0.3, 0.8, 0.2);
  } catch { }
}

type Mode = "focus" | "shortBreak" | "longBreak";

const MODE_CONFIG = {
  focus: { label: "Focus", color: "#3b82f6", duration: 25 * 60 },
  shortBreak: { label: "Short Break", color: "#4ade80", duration: 5 * 60 },
  longBreak: { label: "Long Break", color: "#8b5cf6", duration: 15 * 60 },
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>("focus");
  const [timeLeft, setTimeLeft] = useState(MODE_CONFIG.focus.duration);
  const [isActive, setIsActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const [settings, setSettings] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    const savedSound = localStorage.getItem("pomodoro-sound");
    const savedTheme = localStorage.getItem("pomodoro-theme");
    const savedSettings = localStorage.getItem("pomodoro-settings");
    const savedSessions = localStorage.getItem("pomodoro-sessions");

    if (savedSound !== null) setSoundEnabled(savedSound === "true");
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);

      if (!isActive) {
        setTimeLeft(parsed[mode] * 60);
      }
    }
    if (savedSessions) setSessionsCompleted(parseInt(savedSessions));

    isMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      localStorage.setItem("pomodoro-sound", soundEnabled.toString());
      localStorage.setItem("pomodoro-theme", theme);
      localStorage.setItem("pomodoro-settings", JSON.stringify(settings));
      localStorage.setItem("pomodoro-sessions", sessionsCompleted.toString());
    }
  }, [soundEnabled, theme, settings, sessionsCompleted]);

  const switchMode = useCallback((newMode: Mode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(settings[newMode] * 60);
  }, [settings]);

  const handleTimerComplete = useCallback(() => {
    if (soundEnabled) playNotification();

    if (mode === "focus") {
      const nextSessionCount = sessionsCompleted + 1;
      setSessionsCompleted(nextSessionCount);
      if (nextSessionCount % 4 === 0) {
        switchMode("longBreak");
      } else {
        switchMode("shortBreak");
      }
    } else {
      switchMode("focus");
    }
  }, [mode, sessionsCompleted, soundEnabled, switchMode]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, handleTimerComplete]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(settings[mode] * 60);
  };

  const skipMode = () => {
    if (mode === "focus") {
      setSessionsCompleted(s => s + 1);
      if ((sessionsCompleted + 1) % 4 === 0) {
        switchMode("longBreak");
      } else {
        switchMode("shortBreak");
      }
    } else {
      switchMode("focus");
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const pct = timeLeft / (settings[mode] * 60);
  const offset = CIRC * (1 - pct);

  return (
    <div
      className={`relative flex flex-1 w-full flex-col items-center justify-center gap-4 px-4 py-8 sm:gap-8 sm:py-12 transition-colors duration-500 ${theme === "dark" ? "bg-zinc-950 text-white" : "bg-zinc-50 text-zinc-900"
        }`}
    >
      <style>{`
        @keyframes rippleOut {
          from { opacity: 0.4; transform: scale(0.5); }
          to   { opacity: 0;   transform: scale(3);   }
        }
        .animate-ripple { animation: rippleOut 0.5s ease forwards; }
      `}</style>

      <div className="flex gap-2 mb-2">
        {(["focus", "shortBreak", "longBreak"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${mode === m
              ? theme === "dark"
                ? "bg-zinc-800 text-white shadow-lg shadow-black/50"
                : "bg-white text-zinc-900 shadow-md"
              : theme === "dark"
                ? "text-zinc-600 hover:text-zinc-400"
                : "text-zinc-400 hover:text-zinc-600"
              }`}
          >
            <span className="opacity-90">
              {MODE_CONFIG[m].label}
              <span className={`ml-4 tabular-nums text-[10px] font-normal opacity-40 ${mode === m
                ? theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
                : ''
                }`}>
                ({settings[m === 'focus' ? 'focus' : m === 'shortBreak' ? 'shortBreak' : 'longBreak']})
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="relative h-64 w-64 shrink-0">
        <svg
          width="256"
          height="256"
          viewBox="0 0 200 200"
          className="-rotate-90"
        >
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke={theme === "dark" ? "#27272a" : "#e4e4e7"}
            strokeWidth="6"
          />
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke={MODE_CONFIG[mode].color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="tabular-nums text-6xl font-bold tracking-tighter">
            {formatTime(timeLeft)}
          </span>
          <span className={`mt-2 text-xs font-medium uppercase tracking-widest ${theme === "dark" ? "text-zinc-600" : "text-zinc-400"}`}>
            {mode === "focus" ? "Focus Time" : "Break Time"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6 py-4">
        <button
          onClick={resetTimer}
          className={`group flex h-12 w-12 items-center justify-center rounded-2xl border shadow-xl backdrop-blur-md transition-all active:scale-90 ${theme === "dark"
            ? "border-zinc-800/50 bg-zinc-900/30 text-zinc-500 hover:border-zinc-600 hover:text-zinc-200"
            : "border-zinc-200 bg-white/50 text-zinc-400 hover:border-zinc-400 hover:text-zinc-700"
            }`}
          aria-label="Reset timer"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>

        <button
          onClick={toggleTimer}
          className={`group flex h-16 w-16 items-center justify-center rounded-3xl border shadow-2xl backdrop-blur-md transition-all active:scale-95 ${theme === "dark"
            ? "border-zinc-800/50 bg-zinc-900/30 text-zinc-500 hover:border-zinc-600 hover:bg-zinc-800/40 hover:text-zinc-200"
            : "border-zinc-200 bg-white/50 text-zinc-400 hover:border-zinc-400 hover:bg-zinc-100/80 hover:text-zinc-700"
            }`}
          aria-label={isActive ? "Pause timer" : "Start timer"}
        >
          {isActive ? (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg className="h-6 w-6 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
          )}
        </button>

        <button
          onClick={skipMode}
          className={`group flex h-12 w-12 items-center justify-center rounded-2xl border shadow-xl backdrop-blur-md transition-all active:scale-90 ${theme === "dark"
            ? "border-zinc-800/50 bg-zinc-900/30 text-zinc-500 hover:border-zinc-600 hover:text-zinc-200"
            : "border-zinc-200 bg-white/50 text-zinc-400 hover:border-zinc-400 hover:text-zinc-700"
            }`}
          aria-label="Skip mode"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 17 5-5-5-5" />
            <path d="m13 17 5-5-5-5" />
          </svg>
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-6">

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`rounded-lg border p-2 transition active:scale-95 ${theme === "dark"
              ? "border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:border-zinc-600 hover:text-white"
              : "border-zinc-200 bg-white text-zinc-400 hover:border-zinc-400 hover:text-zinc-900"
              }`}
            title={soundEnabled ? "Disable sound" : "Enable sound"}
          >
            {soundEnabled ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`rounded-lg border p-2 transition active:scale-95 ${theme === "dark"
              ? "border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:border-zinc-600 hover:text-white"
              : "border-zinc-200 bg-white text-zinc-400 hover:border-zinc-400 hover:text-zinc-900"
              }`}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center gap-1">
        <div className="flex gap-1">
          {[...Array(4)].map((_, i) => {
            const isCompleted = i < (sessionsCompleted % 4 || (sessionsCompleted > 0 && mode !== 'focus' ? 4 : 0));
            return (
              <div
                key={i}
                className={`h-1.5 w-6 rounded-full transition-all duration-500 ${isCompleted
                  ? "shadow-[0_0_8px] shadow-current"
                  : theme === 'dark' ? 'bg-zinc-900 border border-zinc-800' : 'bg-zinc-200 border border-zinc-300'
                  }`}
                style={{
                  backgroundColor: isCompleted ? MODE_CONFIG[mode].color : undefined,
                  color: isCompleted ? MODE_CONFIG[mode].color : undefined,
                }}
              />
            );
          })}
        </div>
        <p className={`text-[10px] uppercase tracking-widest ${theme === "dark" ? "text-zinc-700" : "text-zinc-300"}`}>
          Session {sessionsCompleted + 1}
        </p>
      </div>

      <div className="mt-8">
        <BuyMeACoffee theme={theme} />
      </div>
    </div>
  );
}
