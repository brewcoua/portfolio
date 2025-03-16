import { SkillCategory, SkillsData } from "@/types";

const skillsData: SkillsData = {
  skills: [
    {
      category: SkillCategory.LANGUAGES,
      items: [
        "TypeScript/JavaScript",
        "Python",
        "Java",
        "Rust",
        "C",
        "C++",
        "SQL",
        "Bash/Shell Script"
      ]
    },
    {
      category: SkillCategory.WEB_TECHNOLOGIES,
      items: [
        "React",
        "Next.js",
        "NestJS",
        "AngularJS",
        "Tailwind CSS",
        "REST APIs",
        "Playwright",
        "Docker",
        "Kubernetes",
        "AWS",
        "CI/CD",
        "GitOps",
        "JWT Authentication",
        "DOM API",
        "Web APIs",
        "Shadcn UI",
        "Markdown",
        "Responsive Design"
      ]
    },
    {
      category: SkillCategory.TOOLS_AND_FRAMEWORKS,
      items: [
        "Git",
        "GitHub",
        "AI/LLM Integration",
        "OpenAI API",
        "Chat GPT APIs",
        "Task Queue Systems",
        "Web Automation",
        "Actix Web",
        "PostgreSQL",
        "Redis",
        "RabbitMQ",
        "MongoDB",
        "Tokio",
        "Clap-rs",
        "Reqwest",
        "Flume",
        "Flate2"
      ]
    },
    {
      category: SkillCategory.CONCEPTS,
      items: [
        "Cloud Computing",
        "Systems Programming",
        "Cybersecurity",
        "Async Programming",
        "Concurrent Programming",
        "Distributed Systems",
        "Microservices Architecture",
        "Performance Optimization",
        "Memory Management"
      ]
    },
    {
      category: SkillCategory.LANGUAGES_SPOKEN,
      items: [
        "English (Bilingual)",
        "French (Native)",
        "German (Elementary)",
        "Korean (Elementary)"
      ]
    }
  ]
};

export default skillsData; 