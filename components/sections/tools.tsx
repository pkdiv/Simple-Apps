import { PortfolioData } from "@/lib/data";

export function Tools({ data }: { data: PortfolioData['tools'] }) {
    if (!data || data.length === 0) return null;

    return (
        <section className="py-24 space-y-10 border-t border-border/50">
            <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Mini Apps & Tools</h2>
                <p className="text-muted-foreground text-lg">Small utilities built to solve specific problems.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((tool, idx) => (
                    <a key={idx} href={tool.url} target="_blank" rel="noreferrer" className="block group">
                        <article className="glass-panel p-6 h-full hover:bg-muted/50 transition-colors tech-border rounded-sm flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold text-foreground group-hover:text-accent flex items-center justify-between">
                                    {tool.title}
                                    <span className="text-muted-foreground group-hover:text-accent transition-colors">↗</span>
                                </h3>
                                <p className="text-sm text-foreground/80">
                                    {tool.description}
                                </p>
                            </div>
                        </article>
                    </a>
                ))}
            </div>
        </section>
    );
}
