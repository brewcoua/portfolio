import { SkillCategory, SkillsData } from "@/types";

const skillsData: SkillsData = {
  skills: [
    {
      category: SkillCategory.LANGUAGES,
      items: [
        "Python",
        "JavaScript/TypeScript",
        "Java",
        "C++",
        "SQL"
      ]
    },
    {
      category: SkillCategory.WEB_TECHNOLOGIES,
      items: [
        "React",
        "Next.js",
        "Node.js",
        "HTML/CSS",
        "Tailwind CSS",
        "REST APIs",
        "GraphQL"
      ]
    },
    {
      category: SkillCategory.TOOLS_AND_FRAMEWORKS,
      items: [
        "Git",
        "Docker",
        "AWS",
        "MongoDB",
        "PostgreSQL",
        "Linux",
        "CI/CD"
      ]
    },
    {
      category: SkillCategory.CONCEPTS,
      items: [
        "Object-Oriented Programming",
        "Data Structures",
        "Algorithms",
        "System Design",
        "Agile Methodologies",
        "Test-Driven Development"
      ]
    }
  ]
};

export default skillsData; 