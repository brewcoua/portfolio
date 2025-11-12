import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  SERVER_DOMAIN: z
    .string()
    .optional()
    .transform((value) => value ?? "http://localhost:3000")
    .refine(
      (value) => {
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
      { message: "SERVER_DOMAIN must be a valid URL" },
    ),
  MONGO_USER: z.string().min(1, "MONGO_USER is required"),
  MONGO_PASSWORD: z.string().min(1, "MONGO_PASSWORD is required"),
  MONGO_CLUSTER: z.string().min(1, "MONGO_CLUSTER is required"),
  MONGO_DB_NAME: z.string().min(1).default("portfolio"),
  PDF_CACHE_TTL: z
    .string()
    .optional()
    .transform((value) => (value ? Number.parseInt(value, 10) : 3600))
    .refine((value) => Number.isFinite(value) && value > 0, {
      message: "PDF_CACHE_TTL must be a positive integer",
    }),
});

const parsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  SERVER_DOMAIN: process.env.SERVER_DOMAIN,
  MONGO_USER: process.env.MONGO_USER,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_CLUSTER: process.env.MONGO_CLUSTER,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME,
  PDF_CACHE_TTL: process.env.PDF_CACHE_TTL,
});

if (!parsed.success) {
  console.error("❌ Invalid environment configuration");
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error("Invalid environment configuration");
}

export const env = parsed.data;
