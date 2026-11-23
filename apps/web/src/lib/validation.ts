import { z } from "zod";

const text = (max = 500) => z.string().trim().max(max).optional().transform((v) => (v ? v : undefined));
const phone = z
  .string({ error: "Enter your phone number" })
  .trim()
  .min(1, "Enter your phone number")
  .refine((v) => v.replace(/\D/g, "").length >= 7, "Enter a valid phone number");

/** Answers from the 4-step claim form, keyed as in `claimSteps` (src/content/site.ts). */
export const claimSchema = z.object({
  name: z.string({ error: "Enter your full name" }).trim().min(2, "Enter your full name").max(120),
  phone,
  email: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || z.email().safeParse(v).success, "Enter a valid email")
    .transform((v) => (v ? v : undefined)),
  owner: text(),
  business: text(160),
  what: text(500),
  years: text(),
  staff: text(),
  idea: text(4000),
  goal: text(),
  brand: text(),
  deposit: text(),
  start: text(),
  pay: text(),
});
export type ClaimInput = z.input<typeof claimSchema>;

/** Quick enquiry from the services-page contact drawer. */
export const contactSchema = z.object({
  interest: z.string().trim().min(1).max(60),
  name: z.string({ error: "Enter your name" }).trim().min(2, "Enter your name").max(120),
  phone,
  message: text(4000),
});
export type ContactInput = z.input<typeof contactSchema>;

/** First error message per field, for showing next to inputs. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}
