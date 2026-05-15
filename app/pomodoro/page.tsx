import PomodoroTimer from "@/components/utilities/PomodoroTimer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pomodoro Timer | Minimalist Focus Tool",
    description: "A sleek, minimal Pomodoro timer to help you stay focused and productive. Features customizable focus and break intervals, a beautiful circular progress interface, and dark mode support.",
    keywords: ["pomodoro timer", "focus tool", "productivity app", "online timer", "minimalist timer", "study timer"],
    openGraph: {
        title: "Pomodoro Timer | Minimalist Focus Tool",
        description: "Sleek, minimal Pomodoro timer with customizable intervals and beautiful animations.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Pomodoro Timer | Minimalist Focus Tool",
        description: "Sleek, minimal Pomodoro timer with customizable intervals and beautiful animations.",
    },
};

export default function Page() {
    return (
        <main className="h-screen flex flex-col overflow-hidden">
            <PomodoroTimer />
        </main>
    );
}
