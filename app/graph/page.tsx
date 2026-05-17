import CSVToChart from '@/components/utilities/CSVToChart';
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Data Visualizer | Instant CSV Charts",
    description: "Visualize your data instantly. Upload or paste CSV data to generate beautiful bar charts with a minimalist interface.",
    keywords: ["csv visualizer", "chart generator", "data visualization", "online chart maker", "bar chart", "csv to chart"],
};

export default function Page() {
    return (
        <main className="h-screen flex flex-col overflow-hidden">
            <CSVToChart />
        </main>
    );
}