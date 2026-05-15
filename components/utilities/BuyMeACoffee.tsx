export default function BuyMeACoffee({ theme = "dark" }: { theme?: "light" | "dark" }) {
  return (
    <a
      href="https://buymeachai.ezee.li/pkdiv"
      target="_blank"
      rel="noopener noreferrer"
      className={`z-10 mt-4 flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider transition active:scale-95 ${theme === "dark"
        ? "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-300"
        : "border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-600"
        }`}
    >
      <span>Buy me a chai</span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3 w-3 text-yellow-600"
      >
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    </a>
  );
}
