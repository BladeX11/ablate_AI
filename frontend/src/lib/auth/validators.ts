import { z } from "zod";

export const loginSchema = z.object({
  email: z.email().transform((value) => value.trim().toLowerCase()),
  password: z.string().min(1),
});

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().transform((value) => value.trim().toLowerCase()),
  password: z.string().min(8).max(128),
});

export const forgotPasswordSchema = z.object({
  email: z.email().transform((value) => value.trim().toLowerCase()),
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(10),
  newPassword: z.string().min(8).max(128),
});

export const createModelSchema = z.object({
  name: z.string().trim().min(2),
  version: z.string().trim().min(1),
  ownerTeam: z.string().trim().min(2),
  status: z.string().trim().min(2),
});

export const createUnlearningRequestSchema = z.object({
  modelId: z.string().trim().min(1),
  datasetRef: z.string().trim().min(2),
  reason: z.string().trim().min(10),
  priority: z.enum(["low", "medium", "high"]),
});
