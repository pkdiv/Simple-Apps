import { Metadata } from "next";
import GraphClient from "./GraphClient";
import graphImg from "@/public/previews/graph.webp";

export const metadata: Metadata = {
    title: "Data Visualizer | Instant CSV Charts",
    description: "Visualize your data instantly. Upload or paste CSV data to generate beautiful bar charts with a minimalist interface.",
    keywords: ["csv visualizer", "chart generator", "data visualization", "online chart maker", "bar chart", "csv to chart"],
    openGraph: {
        title: "Data Visualizer | Instant CSV Charts",
        description: "Upload or paste CSV data and generate beautiful bar charts instantly.",
        type: "website",
        images: graphImg.src,
    },
    twitter: {
        card: "summary_large_image",
        title: "Data Visualizer | Instant CSV Charts",
        description: "Upload or paste CSV data and generate beautiful bar charts instantly.",
        images: graphImg.src,
    },
};

export default function Page() {
    return (
        <main className="h-screen flex flex-col overflow-hidden">
            <GraphClient />
        </main>
    );
}