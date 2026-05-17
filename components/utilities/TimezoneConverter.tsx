'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import BuyMeACoffee from './BuyMeACoffee';

interface Timezone {
    name: string;
    displayName: string;
}

const ALL_TIMEZONES: Timezone[] = [
    { name: 'America/New_York', displayName: 'New York' },
    { name: 'America/Chicago', displayName: 'Chicago' },
    { name: 'America/Denver', displayName: 'Denver' },
    { name: 'America/Los_Angeles', displayName: 'Los Angeles' },
    { name: 'America/Phoenix', displayName: 'Phoenix' },
    { name: 'America/Anchorage', displayName: 'Anchorage' },
    { name: 'Pacific/Honolulu', displayName: 'Honolulu' },
    { name: 'America/Toronto', displayName: 'Toronto' },
    { name: 'America/Vancouver', displayName: 'Vancouver' },
    { name: 'America/Mexico_City', displayName: 'Mexico City' },
    { name: 'America/Sao_Paulo', displayName: 'São Paulo' },
    { name: 'America/Buenos_Aires', displayName: 'Buenos Aires' },
    { name: 'America/Santiago', displayName: 'Santiago' },
    { name: 'Europe/London', displayName: 'London' },
    { name: 'Europe/Paris', displayName: 'Paris' },
    { name: 'Europe/Berlin', displayName: 'Berlin' },
    { name: 'Europe/Amsterdam', displayName: 'Amsterdam' },
    { name: 'Europe/Rome', displayName: 'Rome' },
    { name: 'Europe/Madrid', displayName: 'Madrid' },
    { name: 'Europe/Istanbul', displayName: 'Istanbul' },
    { name: 'Europe/Moscow', displayName: 'Moscow' },
    { name: 'Europe/Kiev', displayName: 'Kiev' },
    { name: 'Africa/Cairo', displayName: 'Cairo' },
    { name: 'Africa/Johannesburg', displayName: 'Johannesburg' },
    { name: 'Africa/Lagos', displayName: 'Lagos' },
    { name: 'Africa/Nairobi', displayName: 'Nairobi' },
    { name: 'Africa/Casablanca', displayName: 'Casablanca' },
    { name: 'Asia/Dubai', displayName: 'Dubai' },
    { name: 'Asia/Kolkata', displayName: 'Kolkata' },
    { name: 'Asia/Bangkok', displayName: 'Bangkok' },
    { name: 'Asia/Hong_Kong', displayName: 'Hong Kong' },
    { name: 'Asia/Shanghai', displayName: 'Shanghai' },
    { name: 'Asia/Tokyo', displayName: 'Tokyo' },
    { name: 'Asia/Seoul', displayName: 'Seoul' },
    { name: 'Asia/Singapore', displayName: 'Singapore' },
    { name: 'Asia/Jakarta', displayName: 'Jakarta' },
    { name: 'Asia/Manila', displayName: 'Manila' },
    { name: 'Asia/Tehran', displayName: 'Tehran' },
    { name: 'Asia/Jerusalem', displayName: 'Jerusalem' },
    { name: 'Australia/Sydney', displayName: 'Sydney' },
    { name: 'Australia/Melbourne', displayName: 'Melbourne' },
    { name: 'Australia/Brisbane', displayName: 'Brisbane' },
    { name: 'Australia/Perth', displayName: 'Perth' },
    { name: 'Australia/Adelaide', displayName: 'Adelaide' },
    { name: 'Pacific/Auckland', displayName: 'Auckland' },
    { name: 'Pacific/Fiji', displayName: 'Fiji' },
];

export default function TimezoneConverter() {
    const [selectedTzs, setSelectedTzs] = useState<string[]>([
        'America/New_York',
        'Europe/London',
        'Asia/Tokyo',
    ]);
    const [time, setTime] = useState<string>('');
    const [search, setSearch] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [baselineSearch, setBaselineSearch] = useState('');
    const [showBaselineSuggestions, setShowBaselineSuggestions] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [theme, setTheme] = useState<"light" | "dark">("dark");
    const [userTz, setUserTz] = useState<string>('');
    const [baselineTz, setBaselineTz] = useState<string>('');
    const isMounted = useRef(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const baselineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
            if (baselineRef.current && !baselineRef.current.contains(event.target as Node)) {
                setShowBaselineSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setUserTz(localTz);
        setBaselineTz(localTz);
        const savedTzs = localStorage.getItem("timezone-selected");
        const savedTheme = localStorage.getItem("timezone-theme");
        if (savedTzs) setSelectedTzs(JSON.parse(savedTzs));
        if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
        isMounted.current = true;
    }, []);

    useEffect(() => {
        if (isMounted.current) {
            localStorage.setItem("timezone-selected", JSON.stringify(selectedTzs));
            localStorage.setItem("timezone-theme", theme);
        }
    }, [selectedTzs, theme]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getDate = () => {
        if (time && baselineTz) {
            const [hours, minutes] = time.split(':').map(Number);
            const date = new Date();
            date.setHours(hours, minutes, 0, 0);
            
            // Convert to UTC based on baselineTz offset
            const localTime = date.getTime();
            const tzTime = new Date(date.toLocaleString('en-US', { timeZone: baselineTz })).getTime();
            const offset = tzTime - localTime;
            return new Date(localTime - offset);
        }
        return currentTime;
    };

    const formatTime = (tz: string, date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }).format(date);
    };

    const formatDate = (tz: string, date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        }).format(date);
    };

    const getOffset = (tz: string, date: Date) => {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            timeZoneName: 'shortOffset',
        });
        const parts = formatter.formatToParts(date);
        return parts.find(p => p.type === 'timeZoneName')?.value || '';
    };

    const filteredSuggestions = ALL_TIMEZONES.filter(
        (tz) =>
            !selectedTzs.includes(tz.name) &&
            (tz.displayName.toLowerCase().includes(search.toLowerCase()) || 
             tz.name.toLowerCase().includes(search.toLowerCase()))
    ).slice(0, 8);

    const filteredBaselineSuggestions = ALL_TIMEZONES.filter(
        (tz) =>
            (tz.displayName.toLowerCase().includes(baselineSearch.toLowerCase()) || 
             tz.name.toLowerCase().includes(baselineSearch.toLowerCase()))
    ).slice(0, 8);

    const date = getDate();

    return (
        <div
            className={`relative flex flex-1 w-full flex-col items-center px-4 py-8 sm:py-12 overflow-y-auto transition-colors duration-500 ${theme === "dark" ? "bg-zinc-950 text-white" : "bg-zinc-50 text-zinc-900"
                }`}
        >
            <div className="w-full max-w-4xl flex flex-col gap-8 my-auto">
                <div className="flex items-center justify-between">
                    <p className={`text-xs font-medium uppercase tracking-widest ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`}>
                        Timezone Converter
                    </p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Time Input */}
                    <div className={`rounded-2xl border p-6 transition-all ${theme === "dark" ? "border-zinc-800 bg-zinc-900" : "border-zinc-200 bg-white"}`}>
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-xs font-medium uppercase tracking-widest text-zinc-500">Set baseline time</label>
                            {userTz && (
                                <span className={`text-[10px] font-bold uppercase tracking-tighter ${theme === "dark" ? "text-zinc-700" : "text-zinc-300"}`}>
                                    {userTz.replace(/_/g, ' ')}
                                </span>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div ref={baselineRef} className="relative">
                                <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2 ${theme === "dark" ? "text-zinc-600" : "text-zinc-400"}`}>Baseline Location</label>
                                <div 
                                    onClick={() => setShowBaselineSuggestions(true)}
                                    className={`w-full rounded-xl border px-4 py-3 flex items-center justify-between cursor-pointer transition-all ${theme === "dark"
                                            ? "bg-zinc-800/50 border-zinc-700 text-white hover:border-zinc-500"
                                            : "bg-white border-zinc-300 text-zinc-900 hover:border-zinc-400"
                                        }`}
                                >
                                    <span className="font-medium">
                                        {ALL_TIMEZONES.find(t => t.name === baselineTz)?.displayName || baselineTz.split('/').pop()?.replace(/_/g, ' ') || 'Select location'}
                                    </span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 opacity-40">
                                        <path d="m6 9 6 6 6-6"/>
                                    </svg>
                                </div>

                                {showBaselineSuggestions && (
                                    <div className={`absolute top-full left-0 right-0 mt-2 z-[60] rounded-xl border shadow-2xl overflow-hidden backdrop-blur-xl ${theme === "dark" ? "bg-zinc-900/95 border-zinc-800" : "bg-white/95 border-zinc-200"}`}>
                                        <div className={`p-2 border-b ${theme === "dark" ? "border-zinc-800" : "border-zinc-100"}`}>
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="Search city..."
                                                value={baselineSearch}
                                                onChange={(e) => setBaselineSearch(e.target.value)}
                                                className={`w-full bg-transparent px-3 py-2 text-sm focus:outline-none ${theme === "dark" ? "text-white" : "text-zinc-900"}`}
                                            />
                                        </div>
                                        <div className="max-h-60 overflow-y-auto">
                                            {filteredBaselineSuggestions.map((tz) => (
                                                <button
                                                    key={tz.name}
                                                    onClick={() => {
                                                        setBaselineTz(tz.name);
                                                        setBaselineSearch('');
                                                        setShowBaselineSuggestions(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${theme === "dark" ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-zinc-100 text-zinc-700"} ${baselineTz === tz.name ? (theme === "dark" ? "bg-zinc-800/50" : "bg-zinc-50") : ""}`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            {tz.displayName}
                                                            <span className="ml-2 text-[10px] opacity-40 uppercase">{tz.name}</span>
                                                        </div>
                                                        {baselineTz === tz.name && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2 ${theme === "dark" ? "text-zinc-600" : "text-zinc-400"}`}>Baseline Time</label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className={`w-full rounded-xl border px-4 py-3 text-2xl font-bold tracking-tighter tabular-nums focus:outline-none transition-all ${theme === "dark"
                                            ? "bg-zinc-800/50 border-zinc-700 text-white focus:border-zinc-500"
                                            : "bg-white border-zinc-300 text-zinc-900 focus:border-zinc-500"
                                        }`}
                                />
                            </div>
                        </div>
                        <p className={`text-[10px] uppercase tracking-tighter mt-3 ${theme === "dark" ? "text-zinc-600" : "text-zinc-400"}`}>
                            Leave blank to use current real-time
                        </p>
                    </div>

                    {/* Add Timezone */}
                    <div 
                        ref={searchRef}
                        className={`rounded-2xl border p-6 transition-all relative ${theme === "dark" ? "border-zinc-800 bg-zinc-900" : "border-zinc-200 bg-white"}`}
                    >
                        <label className="block text-xs font-medium uppercase tracking-widest text-zinc-500 mb-4">Add location</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search city or timezone..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none transition-all ${theme === "dark"
                                        ? "bg-zinc-800/50 border-zinc-700 text-white focus:border-zinc-500"
                                        : "bg-white border-zinc-300 text-zinc-900 focus:border-zinc-500"
                                    }`}
                            />

                            {/* Suggestions */}
                            {showSuggestions && search && (
                                <div className={`absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border shadow-2xl max-h-64 overflow-y-auto ${theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200"}`}>
                                    {filteredSuggestions.length > 0 ? (
                                        filteredSuggestions.map((tz) => (
                                            <button
                                                key={tz.name}
                                                onClick={() => {
                                                    setSelectedTzs([...selectedTzs, tz.name]);
                                                    setSearch('');
                                                    setShowSuggestions(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 text-sm transition-colors ${theme === "dark" ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-zinc-100 text-zinc-700"}`}
                                            >
                                                {tz.displayName}
                                                <span className="ml-2 text-[10px] opacity-40 uppercase">{tz.name}</span>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-xs text-zinc-500 italic">No results found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Timezone Cards */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {[...selectedTzs].sort().map((tz) => {
                        const tzData = ALL_TIMEZONES.find((t) => t.name === tz);
                        const displayName = tzData?.displayName || tz.split('/').pop()?.replace(/_/g, ' ');

                        return (
                            <div
                                key={tz}
                                className={`group relative rounded-2xl border p-5 flex flex-col justify-between transition-all hover:scale-[1.02] ${theme === "dark"
                                        ? "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60"
                                        : "border-zinc-200 bg-white hover:shadow-lg"
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${theme === "dark" ? "text-zinc-600" : "text-zinc-400"}`}>
                                        {displayName}
                                    </p>
                                    <button
                                        onClick={() => setSelectedTzs(selectedTzs.filter((t) => t !== tz))}
                                        className={`rounded-full p-1 transition-opacity opacity-0 group-hover:opacity-100 ${theme === "dark" ? "hover:bg-zinc-800 text-zinc-500" : "hover:bg-zinc-100 text-zinc-400"}`}
                                        aria-label="Remove timezone"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold tracking-tighter tabular-nums mb-1">
                                        {formatTime(tz, date)}
                                    </p>
                                    <div className={`flex items-center gap-2 text-[10px] uppercase tracking-tight ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`}>
                                        <span>{formatDate(tz, date)}</span>
                                        <span className="opacity-20">•</span>
                                        <span>{getOffset(tz, date)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {selectedTzs.length === 0 && (
                        <div className={`col-span-full py-12 rounded-2xl border border-dashed text-center flex flex-col items-center justify-center gap-2 ${theme === "dark" ? "border-zinc-800 text-zinc-700" : "border-zinc-200 text-zinc-400"}`}>
                            <p className="text-sm">No locations added</p>
                            <p className="text-[10px] uppercase tracking-widest">Search above to add timezones</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-center pb-12">
                    <BuyMeACoffee theme={theme} />
                </div>
            </div>

        </div>
    );
}