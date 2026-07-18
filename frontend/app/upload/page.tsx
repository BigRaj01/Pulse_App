"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { uploadSchema, UploadFormValues } from "@/lib/upload-schema";
import { uploadService } from "@/services/upload.service";
import { GENRES } from "@/constants/mock-data";
import { Dropzone } from "@/components/features/dropzone";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const PAYMENT_METHODS = ["USDC", "ETH", "SOL"];

export default function UploadPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: { genre: "", paymentMethod: "" },
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const genre = watch("genre");
  const paymentMethod = watch("paymentMethod");

  async function onSubmit(values: UploadFormValues) {
    if (!coverImage || !audioFile) {
      toast.error("Please upload both a cover image and an audio file.");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      await uploadService.uploadTrack(
        { ...values, coverImage, audioFile },
        (percent) => setProgress(percent)
      );
      toast.success("Track uploaded successfully!");
      reset();
      setCoverImage(null);
      setAudioFile(null);
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }

  return (
    <div className="pb-24 px-4 md:px-6 pt-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Upload Music</h1>
      <p className="text-muted-foreground mb-8">
        Share your track with the world.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Track Name</label>
          <Input {...register("trackName")} placeholder="e.g. Lily Way" />
          {errors.trackName && (
            <p className="text-xs text-destructive mt-1">
              {errors.trackName.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Artist Name</label>
          <Input {...register("artistName")} placeholder="e.g. Nova Reyes" />
          {errors.artistName && (
            <p className="text-xs text-destructive mt-1">
              {errors.artistName.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Genre</label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setValue("genre", g, { shouldValidate: true })}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  genre === g
                    ? "bg-primary text-primary-foreground"
                    : "bg-card/50 text-muted-foreground hover:text-foreground"
                )}
              >
                {g}
              </button>
            ))}
          </div>
          {errors.genre && (
            <p className="text-xs text-destructive mt-1">{errors.genre.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Description</label>
          <textarea
            {...register("description")}
            rows={3}
            placeholder="Tell listeners about this track..."
            className="w-full rounded-xl border border-border bg-card/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Dropzone
          label="Cover Image"
          accept="image/*"
          file={coverImage}
          onChange={setCoverImage}
          icon="image"
        />

        <Dropzone
          label="Audio File"
          accept="audio/*"
          file={audioFile}
          onChange={setAudioFile}
          icon="audio"
        />

        <div>
          <label className="text-sm font-medium mb-2 block">
            Payment Wallet Address
          </label>
          <Input
            {...register("walletAddress")}
            placeholder="0x..."
            className="font-mono"
          />
          {errors.walletAddress && (
            <p className="text-xs text-destructive mt-1">
              {errors.walletAddress.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Payment Method</label>
          <div className="flex gap-2">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method}
                type="button"
                onClick={() =>
                  setValue("paymentMethod", method, { shouldValidate: true })
                }
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  paymentMethod === method
                    ? "bg-primary text-primary-foreground"
                    : "bg-card/50 text-muted-foreground hover:text-foreground"
                )}
              >
                {method}
              </button>
            ))}
          </div>
          {errors.paymentMethod && (
            <p className="text-xs text-destructive mt-1">
              {errors.paymentMethod.message}
            </p>
          )}
        </div>

        {isUploading && (
          <div className="flex flex-col gap-2">
            <Progress value={progress} />
            <p className="text-xs text-muted-foreground text-center">
              Uploading... {progress}%
            </p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isUploading || !coverImage || !audioFile}
          className="w-full"
        >
          {isUploading
            ? "Uploading..."
            : !coverImage || !audioFile
            ? "Attach cover image and audio file to continue"
            : "Upload Track"}
        </Button>
      </form>
    </div>
  );
}