import Link from "next/link";
import { PortfolioData } from "@/lib/data";

export function Hero({ data }: { data: PortfolioData['personal'] }) {
    return (
        <section className="py-24 sm:py-32 flex flex-col justify-center min-h-[80vh]">
            <div className="space-y-6 animate-fade-in max-w-3xl">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                    <span className="block text-accent text-lg sm:text-xl font-mono mb-4">Hi, I&apos;m {data.name}.</span>
                    {data.role} building secure and scalable systems.
                </h1>

                <div className="space-y-2 text-lg sm:text-xl text-muted-foreground">
                    {data.bio_lines.map((line, idx) => (
                        <p key={idx} dangerouslySetInnerHTML={{ __html: line }} />
                    ))}
                </div>

                <div className="pt-8 flex flex-wrap gap-4">
                    <Link
                        href="#projects"
                        className="inline-flex h-11 items-center justify-center bg-foreground text-background px-8 text-sm font-medium transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 rounded-sm"
                    >
                        View Projects
                    </Link>
                    <Link
                        href="#blog"
                        className="inline-flex h-11 items-center justify-center border border-border bg-background px-8 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 rounded-sm"
                    >
                        Blog
                    </Link>
                </div>
            </div>
        </section>
    );
}
