import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface PortfolioData {
    personal: {
        name: string;
        role: string;
        bio_lines: string[];
        email: string;
        resume_url: string;
        blog_url: string;
        rss_url: string;
        socials: {
            github: string;
            linkedin: string;
        };
    };
    experiences: {
        role: string;
        company: string;
        period: string;
        description: string;
    }[];
    projects: {
        title: string;
        problem: string;
        architecture: string;
        decisions: string[];
        challenges: string;
        outcome: string;
        github?: string;
        demo?: string;
        tags: string[];
    }[];
    tools: {
        title: string;
        description: string;
        url: string;
    }[];
}

export async function getPortfolioData(): Promise<PortfolioData> {
    const filePath = path.join(process.cwd(), 'data', 'portfolio.yaml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(fileContents) as PortfolioData;

    return data;
}
