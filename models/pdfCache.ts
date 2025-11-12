import mongoose, { Schema } from "mongoose";
import { env } from "@/lib/env";

const PdfCacheSchema = new Schema(
  {
    hash: { type: String, required: true, unique: true, index: true },
    preset: { type: String, required: false },
    pdf: { type: Buffer, required: true },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: env.PDF_CACHE_TTL,
    },
  },
  {
    versionKey: false,
  },
);

export type PdfCacheDocument = mongoose.InferSchemaType<typeof PdfCacheSchema>;

export const PdfCacheModel =
  (mongoose.models.PdfCache as mongoose.Model<PdfCacheDocument>) ??
  mongoose.model<PdfCacheDocument>("PdfCache", PdfCacheSchema);
