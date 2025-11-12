import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { ResumeData } from "@/types/resume";

export function escapeLatex(text: string): string {
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/[&%$#_{}]/g, "\\$&")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/~/g, "\\textasciitilde{}");
}

function formatDateRange(start: string, end: string): string {
  if (end === "present") {
    return `${start} -- Present`;
  }
  return `${start} -- ${end}`;
}

function generateEducationItems(education: ResumeData["education"]): string {
  return education
    .map((edu) => {
      // Add GPA to degree title if available
      const degreeWithGpa = edu.gpa ? `${edu.degree} | ${edu.gpa}` : edu.degree;
      const detailItems = (edu.details ?? [])
        .slice(0, 2)
        .map((detail) => `\\item \\small{${escapeLatex(detail)}}`)
        .join("\n        ");
      const detailsBlock = detailItems
        ? `
      \\resumeItemListStart
        ${detailItems}
      \\resumeItemListEnd`
        : "";
      const exchangesBlock = (edu.exchanges ?? [])
        .map((exchange) => {
          const exchangeTitleParts = [
            escapeLatex(exchange.institution),
            exchange.program ? `\\emph{${escapeLatex(exchange.program)}}` : null,
            exchange.location ? `\\small{${escapeLatex(exchange.location)}}` : null,
          ].filter(Boolean) as string[];
          const exchangeHeader = exchangeTitleParts.join(" $\\vert$ ");
          const exchangeDetails = [
            exchange.gpa ? `\\item \\small{${escapeLatex(exchange.gpa)}}` : null,
            ...(exchange.details ?? [])
              .slice(0, 2)
              .map(
                (detail) => `\\item \\small{${escapeLatex(detail)}}`,
              ),
          ]
            .filter(Boolean)
            .join("\n        ");
          const exchangeDetailBlock = exchangeDetails
            ? `
      \\resumeItemListStart
        ${exchangeDetails}
      \\resumeItemListEnd`
            : "";

          return `\\resumeSubSubheading{${exchangeHeader}}{${formatDateRange(
            exchange.startDate,
            exchange.endDate,
          )}}${exchangeDetailBlock}`;
        })
        .join("\n    ");

      return `\\resumeSubheading
      {${escapeLatex(edu.institution)}}{${escapeLatex(edu.location)}}
      {${escapeLatex(degreeWithGpa)}}{${formatDateRange(edu.startDate, edu.endDate)}}${detailsBlock}${
        exchangesBlock ? `\n    ${exchangesBlock}` : ""
      }`;
    })
    .join("\n    ");
}

function generateExperienceItems(experience: ResumeData["experience"]): string {
  return experience
    .map((exp) => {
      const achievements = exp.achievements
        .slice(0, 3)
        .map((a) => `\\item \\small{${escapeLatex(a)}}`)
        .join("\n        ");

      return `\\resumeSubheading
      {${escapeLatex(exp.position)}}{${formatDateRange(exp.startDate, exp.endDate)}}
      {${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}
      \\resumeItemListStart
        ${achievements}
      \\resumeItemListEnd`;
    })
    .join("\n    ");
}

function generateProjectItems(projects: ResumeData["projects"]): string {
  return projects
    .map((proj) => {
      const highlights = proj.highlights
        .slice(0, 2)
        .map((h) => `\\item \\small{${escapeLatex(h)}}`)
        .join("\n        ");
      const tech = proj.technologies.slice(0, 3).join(", ");

      return `\\resumeSubheading
      {\\textbf{${escapeLatex(proj.name)}} $|$ \\emph{${escapeLatex(tech)}}}{\\href{https://${proj.link}}{${proj.link}}}
      {${escapeLatex(proj.description)}}{}
      \\resumeItemListStart
        ${highlights}
      \\resumeItemListEnd`;
    })
    .join("\n      ");
}

function generateCertifications(
  certifications: ResumeData["certifications"],
): string {
  return certifications
    .map(
      (cert) =>
        `\\item \\small{\\textbf{${escapeLatex(cert.name)}}: ${escapeLatex(cert.score)} (${escapeLatex(cert.issuer)}, ${cert.year})}`,
    )
    .join("\n    ");
}

function generateSpokenLanguages(languages: ResumeData["languages"]): string {
  return languages
    .slice(0, 3)
    .map(
      (lang) =>
        `\\item \\small{\\textbf{${escapeLatex(lang.language)}}: ${escapeLatex(lang.proficiency)}}`,
    )
    .join("\n    ");
}

export async function fillTemplate(
  data: ResumeData,
  templateContent: string,
): Promise<string> {
  let latex = templateContent;

  // Replace personal info
  latex = latex.replace("{{NAME}}", escapeLatex(data.personal.name));
  latex = latex.replace("{{TITLE}}", escapeLatex(data.personal.title));
  latex = latex.replace("{{PHONE}}", data.personal.phone);
  latex = latex.replace(/{{EMAIL}}/g, data.personal.email);
  latex = latex.replace(/{{WEBSITE}}/g, data.personal.website);
  latex = latex.replace(/{{LINKEDIN}}/g, data.personal.linkedin);
  latex = latex.replace(/{{GITHUB}}/g, data.personal.github);

  // Replace sections
  latex = latex.replace(
    "{{EDUCATION_ITEMS}}",
    generateEducationItems(data.education),
  );
  latex = latex.replace(
    "{{EXPERIENCE_ITEMS}}",
    generateExperienceItems(data.experience),
  );
  latex = latex.replace(
    "{{PROJECT_ITEMS}}",
    generateProjectItems(data.projects),
  );

  // Replace skills
  latex = latex.replace("{{LANGUAGES}}", data.skills.languages.join(", "));
  latex = latex.replace("{{FRAMEWORKS}}", data.skills.frameworks.join(", "));
  latex = latex.replace("{{TOOLS}}", data.skills.tools.join(", "));
  latex = latex.replace("{{OTHER_SKILLS}}", data.skills.other.join(", "));

  // Replace certifications and languages
  latex = latex.replace(
    "{{CERTIFICATIONS}}",
    generateCertifications(data.certifications),
  );
  latex = latex.replace(
    "{{SPOKEN_LANGUAGES}}",
    generateSpokenLanguages(data.languages),
  );

  return latex;
}

export async function getTemplateContent(): Promise<string> {
  const templatePath = path.join(process.cwd(), "public", "resume.tex");
  return await fs.readFile(templatePath, "utf-8");
}

// In-memory cache for resume data (keyed by hash)
const resumeDataCache = new Map<string, ResumeData>();

export function storeResumeData(data: ResumeData, preferredHash?: string): string {
  // Generate a hash from the resume data when one is not provided
  const dataString = JSON.stringify(data);
  const hash =
    preferredHash ??
    crypto.createHash("sha256").update(dataString).digest("hex").substring(0, 16);

  // Store in cache (with TTL - we'll clean up old entries periodically)
  resumeDataCache.set(hash, data);

  // Clean up entries older than 1 hour (simple approach: limit cache size)
  if (resumeDataCache.size > 100) {
    // Remove oldest entries (simple FIFO)
    const firstKey = resumeDataCache.keys().next().value;
    if (firstKey) {
      resumeDataCache.delete(firstKey);
    }
  }

  return hash;
}

export function getResumeData(hash: string): ResumeData | undefined {
  return resumeDataCache.get(hash);
}

