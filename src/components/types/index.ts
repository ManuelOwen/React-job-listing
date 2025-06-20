export interface Job{
    id :number;
    title: string;
    description: string;
    featured: boolean;
    position: string;
    logo: string;
    company: string;
    new: boolean;
    role: string;
    level: string;
    postedAt: string;
    contract: string;
    location: string;
    languages: string[];
    tools: string[];
}
export type filterType = "all" | "frontend" | "backend" | "fullstack" | "HTML" | "CSS" | "JavaScript" | "React" | "Node.js" | "Python" | "Ruby" | "Java" | "C#" | "PHP" | "Vue.js" | "Angular" | "TypeScript" | "GraphQL" | "Django" | "Flask" | "Express.js" | "Spring Boot" | "Laravel" | "ASP.NET Core" | "Ruby on Rails" | "Swift" | "Kotlin" | "Go" | "Rust";