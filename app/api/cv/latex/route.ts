import { NextRequest, NextResponse } from "next/server";
import { fillTemplate, getTemplateContent, getResumeData } from "../shared";
import { ResumeData } from "@/types/resume";

// Support both GET (for latexonline.cc) and POST (for direct access)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hash = searchParams.get("id");

    if (!hash) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 },
      );
    }

    // Retrieve resume data from cache
    const data = getResumeData(hash);
    if (!data) {
      return NextResponse.json(
        { error: "Resume data not found or expired" },
        { status: 404 },
      );
    }

    // Read template
    const templateContent = await getTemplateContent();

    // Fill template
    const filledLatex = await fillTemplate(data, templateContent);

    // Return LaTeX file
    return new NextResponse(filledLatex, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("LaTeX Generation Error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate LaTeX",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: ResumeData = await request.json();

    // Read template
    const templateContent = await getTemplateContent();

    // Fill template
    const filledLatex = await fillTemplate(data, templateContent);

    // Return LaTeX file
    return new NextResponse(filledLatex, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("LaTeX Generation Error:", error);

    return NextResponse.json(
      {
        error: "Failed to generate LaTeX",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

