"use client";

import { useState, useRef, DragEvent } from "react";
import { Upload, X, FileImage, FileAudio } from "lucide-react";
import { cn } from "@/lib/utils";

export function Dropzone({
  label,
  accept,
  file,
  onChange,
  icon,
}: {
  label: string;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
  icon: "image" | "audio";
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const Icon = icon === "image" ? FileImage : FileAudio;

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) onChange(droppedFile);
  }

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">{label}</label>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 cursor-pointer transition-colors",
          isDragging
            ? "border-primary bg-primary/10"
            : "border-border bg-card/30 hover:bg-card/50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
        {file ? (
          <div className="flex items-center gap-2 text-sm">
            <Icon className="h-4 w-4 text-primary" />
            <span className="truncate max-w-[200px]">{file.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">
              Drag and drop, or click to browse
            </p>
          </>
        )}
      </div>
    </div>
  );
}