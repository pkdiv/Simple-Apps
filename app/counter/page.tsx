import LimitCounter from "@/components/utilities/LimitCounter";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tap Counter | Minimal & Beautiful Tally Counter",
    description: "A sleek, minimal tap counter with customizable limits, haptic-style ripples, and a beautiful dark interface. Perfect for tracking counts, gym sets, or anything else.",
    keywords: ["tap counter", "tally counter", "online counter", "minimalist counter", "set tracker", "limit counter"],
    openGraph: {
        title: "Tap Counter | Minimal & Beautiful Tally Counter",
        description: "Minimalist online tally counter with beautiful animations and customizable limits.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Tap Counter | Minimal & Beautiful Tally Counter",
        description: "Minimalist online tally counter with beautiful animations and customizable limits.",
    },
};

export default function Page() {
    return (
        <main className="h-screen flex flex-col overflow-hidden">
            <LimitCounter />
        </main>
    );
}