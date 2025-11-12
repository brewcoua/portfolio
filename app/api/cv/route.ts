import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ResumeData } from "@/types/resume";
import { storeResumeData } from "./shared";
import { env } from "@/lib/env";
import { connectToDatabase } from "@/lib/mongodb";
import { PdfCacheModel } from "@/models/pdfCache";
import { applySkillPreset, SkillPresetId } from "@/lib/resumePresets";
import { createStableHash } from "@/lib/hash";

const skillPresetSchema = z.union([
  z.literal("general"),
  z.literal("frontend"),
  z.literal("backend"),
  z.literal("fullstack"),
  z.literal("systems"),
]);

const exchangeSchema = z.object({
  institution: z.string(),
  program: z.string().optional(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  gpa: z.string().optional(),
  details: z.array(z.string()).optional(),
});

const educationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  gpa: z.string().optional(),
  details: z.array(z.string()).optional(),
  exchanges: z.array(exchangeSchema).optional(),
});

const experienceSchema = z.object({
  company: z.string(),
  position: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  achievements: z.array(z.string()),
});

const projectSchema = z.object({
  name: z.string(),
  description: z.string(),
  link: z.string(),
  technologies: z.array(z.string()),
  highlights: z.array(z.string()),
});

const resumeSchema = z.object({
  personal: z.object({
    name: z.string(),
    title: z.string(),
    phone: z.string().min(1),
    email: z.string().email(),
    website: z.string().min(1),
    github: z.string().min(1),
    linkedin: z.string().min(1),
  }),
  education: z.array(educationSchema),
  experience: z.array(experienceSchema),
  projects: z.array(projectSchema),
  skills: z.object({
    languages: z.array(z.string()),
    frameworks: z.array(z.string()),
    tools: z.array(z.string()),
    other: z.array(z.string()),
  }),
  languages: z.array(
    z.object({
      language: z.string(),
      proficiency: z.string(),
    }),
  ),
  certifications: z.array(
    z.object({
      name: z.string(),
      issuer: z.string(),
      score: z.string(),
      year: z.string(),
    }),
  ),
});

const requestSchema = z
  .object({
    resume: resumeSchema,
    preset: skillPresetSchema.optional(),
  })
  .or(resumeSchema);

async function compilePDF(latexUrl: string): Promise<Buffer> {
  const apiUrl = `https://latexonline.cc/compile?url=${encodeURIComponent(latexUrl)}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`LaTeX compilation failed: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function normalizeRequestPayload(
  payload: z.infer<typeof requestSchema>,
): { resume: ResumeData; preset: SkillPresetId } {
  if ("resume" in payload) {
    return {
      resume: payload.resume,
      preset: payload.preset ?? "general",
    };
  }

  return {
    resume: payload,
    preset: "general",
  };
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();
    const parsedBody = requestSchema.safeParse(rawBody);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: "Invalid request payload",
          details: parsedBody.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { resume, preset } = normalizeRequestPayload(parsedBody.data);

    // Apply preset server-side to ensure cache consistency
    const normalizedResume = applySkillPreset(resume, preset);

    const cacheKey = createStableHash({ resume: normalizedResume, preset });

    // Check cache
    await connectToDatabase();
    const cachedEntry = await PdfCacheModel.findOne({ hash: cacheKey }).lean();

    const isCacheValid =
      cachedEntry?.createdAt instanceof Date
        ? Date.now() - cachedEntry.createdAt.getTime() < env.PDF_CACHE_TTL * 1000
        : false;

    // Determine whether to return the latexonline.cc URL directly
    const { searchParams } = new URL(request.url);
    const returnUrl = searchParams.get("returnUrl") === "true";

    if (!returnUrl && cachedEntry && isCacheValid) {
      return new NextResponse(new Uint8Array(cachedEntry.pdf), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${normalizedResume.personal.name.replace(/\s+/g, "_")}_Resume.pdf"`,
        },
      });
    }

    const hashForLatex = storeResumeData(normalizedResume, cacheKey);
    const latexUrl = `${env.SERVER_DOMAIN}/api/cv/latex?id=${hashForLatex}`;

    if (returnUrl) {
      const apiUrl = `https://latexonline.cc/compile?url=${encodeURIComponent(latexUrl)}`;
      return NextResponse.json({ url: apiUrl });
    }

    const pdfBuffer = await compilePDF(latexUrl);

    await PdfCacheModel.findOneAndUpdate(
      { hash: cacheKey },
      {
        hash: cacheKey,
        preset,
        pdf: pdfBuffer,
        createdAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${normalizedResume.personal.name.replace(/\s+/g, "_")}_Resume.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
