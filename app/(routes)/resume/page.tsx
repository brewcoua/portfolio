"use client";

import { useState } from "react";
import resumeJson from "@/public/resume.json";
import { ResumeData } from "@/types/resume";
import { SkillPresetId } from "@/lib/resumePresets";
import { ResumeHeader } from "./components/ResumeHeader";
import { ContactCard } from "./components/ContactCard";
import { ExperienceSection } from "./components/ExperienceSection";
import { EducationSection } from "./components/EducationSection";
import { CertificatesSection } from "./components/CertificatesSection";
import { LanguagesSection } from "./components/LanguagesSection";

const baseResume = resumeJson as ResumeData;

export default function ResumePage() {
  const [selectedPreset, setSelectedPreset] =
    useState<SkillPresetId>("general");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resume: baseResume, preset: selectedPreset }),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        const message =
          (errorPayload?.details as string | undefined) ??
          "Failed to generate PDF";
        throw new Error(message);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${baseResume.personal.name.replace(/\s+/g, "_")}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 pt-24 pb-16 sm:px-6 lg:px-8">
      <ResumeHeader
        personal={baseResume.personal}
        isGenerating={isGenerating}
        selectedPreset={selectedPreset}
        onPresetChange={setSelectedPreset}
        onDownload={handleDownloadPDF}
      />

      <ContactCard personal={baseResume.personal} />

      <ExperienceSection experience={baseResume.experience} />

      <EducationSection education={baseResume.education} />

      <CertificatesSection certifications={baseResume.certifications} />

      <LanguagesSection languages={baseResume.languages} />
    </div>
  );
}
