'use client';

import { useState, useRef, useEffect } from 'react';
import Papa from 'papaparse';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import BuyMeACoffee from './BuyMeACoffee';

interface ChartData {
  name: string;
  value: number;
}

export default function CSVToChart() {
  const [parsedData, setParsedData] = useState<Record<string, any>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [mode, setMode] = useState<'auto' | 'custom'>('auto');
  const [labelCol, setLabelCol] = useState<string>('');
  const [valueCol, setValueCol] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [inputType, setInputType] = useState<'file' | 'paste'>('file');
  const [csvText, setCsvText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const isMounted = useRef(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("csv-chart-theme");
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
    isMounted.current = true;
  }, []);

  useEffect(() => {
    if (isMounted.current) {
      localStorage.setItem("csv-chart-theme", theme);
    }
  }, [theme]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processResults(results);
      },
      error: (err) => {
        setError(`Error parsing CSV: ${err.message}`);
      },
    });
  };

  const handleCsvPaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCsvText(text);
    if (!text.trim()) {
      setParsedData([]);
      setColumns([]);
      return;
    }

    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processResults(results);
      },
      error: (err) => {
        setError(`Error parsing CSV: ${err.message}`);
      },
    });
  };

  const processResults = (results: Papa.ParseResult<unknown>) => {
    if (!results.data || results.data.length === 0) {
      setError('CSV data is empty');
      return;
    }

    const cols = Object.keys(results.data[0] as Record<string, any>);
    if (cols.length < 2) {
      setError('CSV must have at least 2 columns');
      return;
    }

    setParsedData(results.data as Record<string, any>[]);
    setColumns(cols);
    setLabelCol(cols[0]);
    setValueCol(cols[1]);
    setError('');
  };

  const getChartData = (): ChartData[] => {
    if (mode === 'auto' && columns.length < 2) return [];

    const lbl = mode === 'auto' ? columns[0] : labelCol;
    const val = mode === 'auto' ? columns[1] : valueCol;

    return parsedData.map((row) => ({
      name: String(row[lbl]),
      value: parseFloat(row[val]) || 0,
    }));
  };

  const chartData = getChartData();
  const maxLabelChars = Math.max(3, Math.floor(600 / (chartData.length || 1) / 8));

  return (
    <div
      className={`relative flex flex-1 w-full flex-col items-center px-4 py-8 sm:py-12 overflow-y-auto transition-colors duration-500 ${theme === "dark" ? "bg-zinc-950 text-white" : "bg-zinc-50 text-zinc-900"
        }`}
    >
      <div className="w-full max-w-4xl flex flex-col gap-8 my-auto">

        <div className="flex items-center justify-between">
          <p className={`text-xs font-medium uppercase tracking-widest ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`}>
            Data Visualizer
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

        {/* Input Type Selection */}
        <div className="flex gap-4 mb-2">
          <button
            onClick={() => setInputType('file')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${inputType === 'file'
              ? theme === "dark"
                ? "bg-zinc-800 text-white shadow-lg shadow-black/50"
                : "bg-white text-zinc-900 shadow-md"
              : theme === "dark"
                ? "text-zinc-600 hover:text-zinc-400"
                : "text-zinc-400 hover:text-zinc-600"
              }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setInputType('paste')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${inputType === 'paste'
              ? theme === "dark"
                ? "bg-zinc-800 text-white shadow-lg shadow-black/50"
                : "bg-white text-zinc-900 shadow-md"
              : theme === "dark"
                ? "text-zinc-600 hover:text-zinc-400"
                : "text-zinc-400 hover:text-zinc-600"
              }`}
          >
            Paste CSV
          </button>
        </div>

        {/* Input Area */}
        <div className={`rounded-2xl border p-6 sm:p-8 backdrop-blur-md transition-all ${theme === "dark"
            ? "border-zinc-800/50 bg-zinc-900/30"
            : "border-zinc-200 bg-white/50"
          }`}>
          {inputType === 'file' ? (
            <>
              <label className="block text-sm font-medium mb-3">Upload CSV file</label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className={`w-full text-sm ${theme === "dark" ? "file:bg-zinc-800 file:text-zinc-300" : "file:bg-zinc-100 file:text-zinc-700"} file:border-0 file:rounded-lg file:px-4 file:py-2 file:mr-4 file:font-medium hover:file:cursor-pointer hover:file:opacity-80 transition-all`}
              />
              <p className={`text-sm mt-2 ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`}>
                Select a CSV file to visualize
              </p>
            </>
          ) : (
            <>
              <label className="block text-sm font-medium mb-3">Paste CSV data</label>
              <textarea
                value={csvText}
                onChange={handleCsvPaste}
                placeholder="Name,Value&#10;Apples,10&#10;Bananas,20"
                className={`w-full h-32 text-sm p-4 rounded-lg border focus:outline-none transition-colors ${theme === "dark"
                    ? "bg-zinc-800/50 border-zinc-700 text-white focus:border-zinc-500"
                    : "bg-white border-zinc-300 text-zinc-900 focus:border-zinc-500"
                  }`}
              />
              <p className={`text-sm mt-2 ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`}>
                Paste raw CSV content with a header row
              </p>
            </>
          )}
          {error && (
            <p className="mt-4 text-sm text-red-500 font-medium">{error}</p>
          )}
        </div>

        {/* Config Section */}
        {columns.length > 0 && (
          <div className={`rounded-2xl border p-6 sm:p-8 backdrop-blur-md transition-all space-y-6 ${theme === "dark"
              ? "border-zinc-800/50 bg-zinc-900/30"
              : "border-zinc-200 bg-white/50"
            }`}>
            <div className="flex flex-col sm:flex-row gap-6">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="pt-0.5">
                  <input
                    type="radio"
                    name="mode"
                    value="auto"
                    checked={mode === 'auto'}
                    onChange={() => setMode('auto')}
                    className="w-4 h-4 accent-blue-500"
                  />
                </div>
                <div>
                  <span className="font-medium text-sm">Auto-detect</span>
                  <p className={`text-xs mt-1 ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`}>
                    Use first column as labels, second as values
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="pt-0.5">
                  <input
                    type="radio"
                    name="mode"
                    value="custom"
                    checked={mode === 'custom'}
                    onChange={() => setMode('custom')}
                    className="w-4 h-4 accent-blue-500"
                  />
                </div>
                <div>
                  <span className="font-medium text-sm">Custom selection</span>
                  <p className={`text-xs mt-1 ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"}`}>
                    Manually select data columns
                  </p>
                </div>
              </label>
            </div>

            {mode === 'custom' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-800/20 dark:border-zinc-800">
                <div>
                  <label className={`block text-xs mb-2 ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                    Labels column
                  </label>
                  <select
                    value={labelCol}
                    onChange={(e) => setLabelCol(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none transition-colors ${theme === "dark"
                        ? "bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500"
                        : "bg-white border-zinc-300 text-zinc-900 focus:border-zinc-500"
                      }`}
                  >
                    {columns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs mb-2 ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                    Values column
                  </label>
                  <select
                    value={valueCol}
                    onChange={(e) => setValueCol(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none transition-colors ${theme === "dark"
                        ? "bg-zinc-800 border-zinc-700 text-white focus:border-zinc-500"
                        : "bg-white border-zinc-300 text-zinc-900 focus:border-zinc-500"
                      }`}
                  >
                    {columns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chart */}
        {chartData.length > 0 && (
          <div className={`rounded-2xl border p-6 sm:p-8 backdrop-blur-md transition-all ${theme === "dark"
              ? "border-zinc-800/50 bg-zinc-900/30"
              : "border-zinc-200 bg-white/50"
            }`}>
            <h3 className="font-medium mb-4">Bar Chart</h3>
            <div style={{ width: '100%', height: '400px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    tick={{ fill: theme === 'dark' ? '#a1a1aa' : '#71717a', fontSize: 12 }}
                    tickFormatter={(value) => value.length > maxLabelChars ? value.substring(0, maxLabelChars) + '...' : value}
                    tickLine={false}
                    axisLine={{ stroke: theme === 'dark' ? '#3f3f46' : '#e4e4e7' }}
                  />
                  <YAxis
                    tick={{ fill: theme === 'dark' ? '#a1a1aa' : '#71717a', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#18181b' : '#ffffff',
                      borderColor: theme === 'dark' ? '#27272a' : '#e4e4e7',
                      borderRadius: '12px',
                      color: theme === 'dark' ? '#ffffff' : '#000000',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                    }}
                    itemStyle={{ color: theme === 'dark' ? '#ffffff' : '#000000' }}
                    cursor={{ fill: theme === 'dark' ? '#27272a' : '#f4f4f5', opacity: 0.5 }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-center pb-12">
          <BuyMeACoffee theme={theme} />
        </div>

      </div>
    </div>
  );
}