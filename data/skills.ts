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
        "SQL"
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
        "GitOps"
      ]
    },
    {
      category: SkillCategory.TOOLS_AND_FRAMEWORKS,
      items: [
        "Git",
        "GitHub",
        "AI/LLM Integration",
        "Chat GPT APIs",
        "Task Queue Systems",
        "Web Automation",
        "Actix Web",
        "PostgreSQL",
        "Redis",
        "RabbitMQ",
        "MongoDB"
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