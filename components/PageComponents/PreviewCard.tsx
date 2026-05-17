"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useState } from "react";

const IFRAME_W = 1024;
const IFRAME_H = 640;
const SCALE = 0.35;

interface PreviewCardProps {
    name: string;
    description: string;
    href: string;
    previewSrc: string;
    previewImage?: string | StaticImageData;
    external?: boolean;
}

export default function PreviewCard({
    name,
    description,
    href,
    previewSrc,
    previewImage,
    external = false,
}: PreviewCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <Link
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition-all duration-300 hover:border-zinc-500 hover:scale-[1.02] active:scale-[0.99] shadow-lg hover:shadow-zinc-900/50"
        >
            <div
                className="relative w-full overflow-hidden bg-zinc-950"
                style={{ height: IFRAME_H * SCALE }}
            >
                {/* Static Preview Image */}
                {previewImage && (
                    <div className={`absolute inset-0 transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}>
                        <Image
                            src={previewImage}
                            alt={`Preview of ${name}`}
                            fill
                            className="object-cover opacity-60 grayscale-[0.2] transition-all duration-500 group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0"
                            sizes="(max-width: 768px) 100vw, 400px"
                        />
                    </div>
                )}

                {/* Live Preview Iframe (Loaded on Hover) */}
                {isHovered && (
                    <iframe
                        src={previewSrc}
                        title={`Preview of ${name}`}
                        tabIndex={-1}
                        aria-hidden="true"
                        scrolling="no"
                        onLoad={() => setIsLoaded(true)}
                        className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
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
                )}

                {/* Overlay to prevent interaction with iframe and add depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent opacity-60" />
            </div>

            <div className="flex items-center justify-between px-5 py-4">
                <div className="flex flex-col gap-0.5">
                    <h2 className="text-sm font-semibold text-white tracking-tight">{name}</h2>
                    <p className="text-[11px] leading-relaxed text-zinc-400 line-clamp-1">{description}</p>
                </div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800/50 transition-colors group-hover:bg-zinc-700/50">
                    <svg
                         className="h-3.5 w-3.5 text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-zinc-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </Link>
    );
}