import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";

const execAsync = promisify(exec);

interface ResumeData {
  personal: {
    name: string;
    title: string;
    phone: string;
    email: string;
    website: string;
    github: string;
    linkedin: string;
  };
  education: Array<{
    institution: string;
    degree: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    details?: string[];
  }>;
  experience: Array<{
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate: string;
    achievements: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    link: string;
    technologies: string[];
    highlights: string[];
  }>;
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    other: string[];
  };
  languages: Array<{
    language: string;
    proficiency: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    score: string;
    year: string;
  }>;
}

function escapeLatex(text: string): string {
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

      return `\\resumeSubheading
      {${escapeLatex(edu.institution)}}{${escapeLatex(edu.location)}}
      {${escapeLatex(degreeWithGpa)}}{${formatDateRange(edu.startDate, edu.endDate)}}`;
    })
    .join("\n    ");
}

function generateExperienceItems(experience: ResumeData["experience"]): string {
  return experience
    .map((exp) => {
      const achievements = exp.achievements
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
        .map((h) => `\\item \\small{${escapeLatex(h)}}`)
        .join("\n        ");
      const tech = proj.technologies.join(", ");

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
    .map(
      (lang) =>
        `\\item \\small{\\textbf{${escapeLatex(lang.language)}}: ${escapeLatex(lang.proficiency)}}`,
    )
    .join("\n    ");
}

async function fillTemplate(
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

async function compilePDF(
  texFilePath: string,
  outputDir: string,
): Promise<void> {
  const command = `pdflatex -output-directory="${outputDir}" -interaction=nonstopmode "${texFilePath}"`;

  // Run twice for proper rendering
  await execAsync(command);
  await execAsync(command);
}

export async function POST(request: NextRequest) {
  let tempDir: string | null = null;

  try {
    const data: ResumeData = await request.json();

    // Create temp directory
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "resume-"));

    // Read template
    const templatePath = path.join(process.cwd(), "public", "resume.tex");
    const templateContent = await fs.readFile(templatePath, "utf-8");

    // Fill template
    const filledLatex = await fillTemplate(data, templateContent);

    // Generate unique filename
    const filename = `resume_${Date.now()}`;
    const texFilePath = path.join(tempDir, `${filename}.tex`);
    const pdfFilePath = path.join(tempDir, `${filename}.pdf`);

    // Write .tex file
    await fs.writeFile(texFilePath, filledLatex);

    // Compile to PDF
    await compilePDF(texFilePath, tempDir);

    // Read PDF
    const pdfBuffer = await fs.readFile(pdfFilePath);

    // Cleanup temp directory
    await fs.rm(tempDir, { recursive: true, force: true });

    // Return PDF
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${data.personal.name.replace(/\s+/g, "_")}_Resume.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);

    // Cleanup on error
    if (tempDir) {
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
    }

    await fs.writeFile(
      path.join(process.cwd(), "error.txt"),
      JSON.stringify(error, null, 2),
    );

    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
