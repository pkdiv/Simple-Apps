import Link from "next/link";

const IFRAME_W = 1024;
const IFRAME_H = 640;
const SCALE = 0.35;

interface PreviewCardProps {
    name: string;
    description: string;
    href: string;
    previewSrc: string;
    external?: boolean;
}

export default function PreviewCard({
    name,
    description,
    href,
    previewSrc,
    external = false,
}: PreviewCardProps) {
    return (
        <Link
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition-all duration-200 hover:border-zinc-600 hover:scale-[1.02] active:scale-[0.99]"
        >
            <div
                className="relative w-full overflow-hidden bg-zinc-950"
                style={{ height: IFRAME_H * SCALE }}
            >
                <iframe
                    src={previewSrc}
                    title={`Preview of ${name}`}
                    tabIndex={-1}
                    aria-hidden="true"
                    scrolling="no"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: "50%",
                        marginLeft: -(IFRAME_W / 2),
                        width: IFRAME_W,
                        height: IFRAME_H,
                        border: "none",
                        transformOrigin: "top center",
                        transform: `scale(${SCALE})`,
                        pointerEvents: "none",
                    }}
                />

                <div className="absolute inset-0" />
            </div>

            <div className="flex items-center justify-between px-5 py-4">
                <div className="flex flex-col gap-0.5">
                    <h2 className="text-sm font-semibold text-white">{name}</h2>
                    <p className="text-xs leading-relaxed text-zinc-500">{description}</p>
                </div>
                <svg
                    className="ml-3 h-4 w-4 shrink-0 text-zinc-700 transition group-hover:translate-x-0.5 group-hover:text-zinc-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </Link>
    );
}