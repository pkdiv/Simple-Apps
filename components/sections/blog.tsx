"use client"

import { useEffect, useState } from "react";
import { ExternalLink, Calendar, ArrowRight } from "lucide-react";

type BlogPost = {
    title: string;
    link: string;
    pubDate: string;
    excerpt: string;
};

const fallbackPosts: BlogPost[] = [
    {
        title: "Cloud Reliability Notes",
        link: "https://pkdiv.medium.com",
        pubDate: "Latest",
        excerpt: "Practical notes on incident response, observability, and keeping production systems resilient under load...",
    },
    {
        title: "Security Engineering Write-ups",
        link: "https://pkdiv.medium.com",
        pubDate: "Latest",
        excerpt: "Hands-on security learnings around hardening infrastructure, reducing attack surface, and automation-first controls...",
    },
    {
        title: "Systems and Infrastructure Deep Dives",
        link: "https://pkdiv.medium.com",
        pubDate: "Latest",
        excerpt: "Technical deep dives on architecture decisions, trade-offs, and implementation details from real-world projects...",
    },
];

export function BlogSection({ rssUrl, blogUrl }: { rssUrl: string; blogUrl: string }) {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchRSS() {
            try {
                setIsLoading(true);
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 7000);

                const res = await fetch(
                    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`,
                    { signal: controller.signal }
                );
                clearTimeout(timeout);

                const data = await res.json();
                const fetchedPosts = Array.isArray(data?.items)
                    ? data.items.slice(0, 6).map((item: {
                        title?: string;
                        link?: string;
                        pubDate?: string;
                        description?: string;
                    }) => ({
                        title: item.title || "Untitled",
                        link: item.link || blogUrl,
                        pubDate: item.pubDate
                            ? new Date(item.pubDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })
                            : "Latest",
                        excerpt:
                            (item.description || "")
                                .replace(/<[^>]+>/g, "")
                                .replace(/\s+/g, " ")
                                .trim()
                                .slice(0, 150) + "...",
                    }))
                    : [];

                setPosts(fetchedPosts.length > 0 ? fetchedPosts : fallbackPosts);
            } catch (error) {
                console.error("Error fetching blog posts:", error);
                setPosts(fallbackPosts);
            } finally {
                setIsLoading(false);
            }
        }

        if (rssUrl) fetchRSS();
    }, [rssUrl]);

    return (
        <section id="blog" className="py-24 space-y-12 border-t border-border/50">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Latest Articles</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Technical deep dives, engineering notes, and thoughts on system reliability.
                    </p>
                </div>
                <a
                    href={blogUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                >
                    Visit Blog <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-64 glass-panel animate-pulse rounded-sm border border-border/50" />
                    ))
                ) : posts.length > 0 ? (
                    posts.map((post, idx) => (
                        <a
                            key={idx}
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group h-full"
                        >
                            <article className="h-full glass-panel p-6 space-y-4 hover:bg-muted/50 transition-all duration-300 tech-border rounded-sm flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                                        <Calendar className="w-3 h-3" />
                                        {post.pubDate}
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-foreground/70 leading-relaxed line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                </div>

                                <div className="pt-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                                    Read Post <ExternalLink className="w-3 h-3" />
                                </div>
                            </article>
                        </a>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center glass-panel border border-dashed border-border/50">
                        <p className="text-muted-foreground">Unable to load latest posts. Please visit my blog directly.</p>
                        <a
                            href={blogUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-4 text-accent hover:underline"
                        >
                            Visit Blog ↗
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}
