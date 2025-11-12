import { ResumeData } from "@/types/resume";

export type SkillPresetId = "general" | "frontend" | "backend" | "fullstack" | "systems";

export interface SkillPreset {
  id: SkillPresetId;
  label: string;
  description: string;
  skills: Partial<ResumeData["skills"]>;
}

const PRESET_DEFINITIONS: Record<SkillPresetId, SkillPreset> = {
  general: {
    id: "general",
    label: "General",
    description: "Balanced profile showcasing the full skill set.",
    skills: {},
  },
  frontend: {
    id: "frontend",
    label: "Frontend",
    description: "Focus on UI technologies and web tooling.",
    skills: {
      languages: ["JavaScript", "TypeScript"],
      frameworks: ["React", "AngularJS"],
      tools: ["Git", "GitHub", "Playwright"],
      other: ["Web Automation", "Good Practices"],
    },
  },
  backend: {
    id: "backend",
    label: "Backend",
    description: "Highlight server-side development experience.",
    skills: {
      languages: ["Rust", "TypeScript", "Python"],
      frameworks: ["NestJS", "Node.js", "Actix Web"],
      tools: ["Docker", "RabbitMQ", "Redis", "PostgreSQL"],
      other: ["API Design", "Distributed Systems", "Microservices Architecture"],
    },
  },
  fullstack: {
    id: "fullstack",
    label: "Full-stack",
    description: "Blend of frontend and backend capabilities.",
    skills: {
      languages: ["Rust", "TypeScript", "Python"],
      frameworks: ["React", "NestJS", "Node.js"],
      tools: ["Git", "Docker", "Playwright", "PostgreSQL"],
      other: ["LLM Integration", "Distributed Systems", "Performance Optimization"],
    },
  },
  systems: {
    id: "systems",
    label: "Systems",
    description: "Lean into systems programming and low-level skills.",
    skills: {
      languages: ["Rust", "C++", "Python"],
      frameworks: ["Actix Web", "Node.js"],
      tools: ["Docker", "Redis", "RabbitMQ"],
      other: [
        "System Programming",
        "Concurrent Programming",
        "Distributed Systems",
        "Memory Management",
        "Performance Optimization",
      ],
    },
  },
};

function filterSkills(
  source: string[],
  targetOverride: string[] | undefined,
): string[] {
  if (!targetOverride) {
    return [...source];
  }

  const normalizedTarget = targetOverride.map((skill) => skill.trim());

  // Ensure we only return skills that exist in either the override list or the original data
  const existingSkills = normalizedTarget.filter((skill) =>
    source.includes(skill),
  );

  const additionalSkills = normalizedTarget.filter((skill) => !source.includes(skill));

  return [...existingSkills, ...additionalSkills];
}

export function applySkillPreset(
  resume: ResumeData,
  preset: SkillPresetId,
): ResumeData {
  const definition = PRESET_DEFINITIONS[preset];
  if (!definition || preset === "general") {
    return {
      ...resume,
      skills: {
        languages: [...resume.skills.languages],
        frameworks: [...resume.skills.frameworks],
        tools: [...resume.skills.tools],
        other: [...resume.skills.other],
      },
    };
  }

  return {
    ...resume,
    skills: {
      languages: filterSkills(resume.skills.languages, definition.skills.languages),
      frameworks: filterSkills(resume.skills.frameworks, definition.skills.frameworks),
      tools: filterSkills(resume.skills.tools, definition.skills.tools),
      other: filterSkills(resume.skills.other, definition.skills.other),
    },
  };
}

export const SKILL_PRESETS = Object.values(PRESET_DEFINITIONS);

