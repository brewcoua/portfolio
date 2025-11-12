"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDown } from "lucide-react";
import { ResumeData } from "@/types/resume";
import { SKILL_PRESETS, SkillPresetId } from "@/lib/resumePresets";

interface ResumeHeaderProps {
  personal: ResumeData["personal"];
  isGenerating: boolean;
  selectedPreset: SkillPresetId;
  onPresetChange: (preset: SkillPresetId) => void;
  onDownload: () => void;
}

export function ResumeHeader({
  personal,
  isGenerating,
  selectedPreset,
  onPresetChange,
  onDownload,
}: ResumeHeaderProps) {
  const selectedPresetDefinition =
    SKILL_PRESETS.find((preset) => preset.id === selectedPreset) ?? SKILL_PRESETS[0];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight">{personal.name}</h1>
        <p className="text-lg text-muted-foreground">{personal.title}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button disabled={isGenerating} className="w-full sm:w-auto">
            <FileDown className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Download PDF"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72 space-y-3 p-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Preset:
            </span>
            <Select
              value={selectedPreset}
              onValueChange={(value) => onPresetChange(value as SkillPresetId)}
              disabled={isGenerating}
            >
              <SelectTrigger className="h-8 flex-1 border-transparent bg-transparent px-2 text-sm font-medium hover:bg-muted/40 focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Select preset" />
              </SelectTrigger>
              <SelectContent>
                {SKILL_PRESETS.map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={onDownload}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating
              ? "Generating..."
              : `Download ${selectedPresetDefinition.label} PDF`}
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

