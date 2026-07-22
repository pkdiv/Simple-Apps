import { Metadata } from "next";
import TimezoneClient from "./TimezoneClient";
import timezoneImg from "@/public/previews/timezone.webp";

export const metadata: Metadata = {
    title: "Timezone Converter | Global Time Comparison",
    description: "Compare times across different time zones with a minimalist, easy-to-use interface. Perfect for remote teams and global travelers.",
    keywords: ["timezone converter", "world clock", "time comparison", "global time", "timezone tool"],
    openGraph: {
        title: "Timezone Converter | Global Time Comparison",
        description: "Compare times across time zones with a minimalist interface — perfect for remote teams and global travelers.",
        type: "website",
        images: timezoneImg.src,
    },
    twitter: {
        card: "summary_large_image",
        title: "Timezone Converter | Global Time Comparison",
        description: "Compare times across time zones with a minimalist interface — perfect for remote teams and global travelers.",
        images: timezoneImg.src,
    },
};

export default function Page() {
    return (
        <main className="h-screen flex flex-col overflow-hidden">
            <TimezoneClient />
        </main>
    );
}
