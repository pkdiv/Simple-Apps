import { PortfolioData } from "@/lib/data";

export function FeaturedProjects({ data }: { data: PortfolioData['projects'] }) {
    return (
        <section id="projects" className="py-24 space-y-12 border-t border-border/50">
            <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Featured Systems</h2>
                <p className="text-muted-foreground text-lg">Deep dives into recent architecture and technical decisions.</p>
            </div>

            <div className="grid gap-16">
                {data.map((project, idx) => (
                    <article key={idx} className="space-y-8">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-semibold text-foreground flex items-center gap-3">
                                {project.title}
                                {project.github && (
                                    <a href={project.github} target="_blank" rel="noreferrer" className="text-sm font-normal text-muted-foreground hover:text-accent transition-colors">
                                        GitHub ↗
                                    </a>
                                )}
                            </h3>
                            <div className="flex gap-2 flex-wrap">
                                {project.tags.map(tag => (
                                    <span key={tag} className="text-xs font-mono px-2 py-1 bg-muted text-muted-foreground rounded-sm">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">The Problem</h4>
                                <p className="text-foreground/90">{project.problem}</p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Key Decisions</h4>
                                <ul className="list-disc pl-5 space-y-1 text-foreground/90">
                                    {project.decisions.map((decision, dIdx) => (
                                        <li key={dIdx}>{decision}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Challenges</h4>
                                <p className="text-foreground/90">{project.challenges}</p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-accent">Outcome</h4>
                                <p className="text-foreground">{project.outcome}</p>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
