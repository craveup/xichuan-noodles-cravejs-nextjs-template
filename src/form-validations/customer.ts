// src/form-validations/customer.ts
import { z } from "zod";
import { isValidPhoneNumber } from 'react-phone-number-input';

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export const customerSchema = z
  .object({
    customerName: z
      .string()
      .trim()
      .min(2, "Please enter your full name"),

    // UI toggle to choose email or phone mode
    isPhoneInput: z.boolean().default(false),

    // Separate fields for best UX
    emailAddress: z
      .string()
      .trim()
      .optional(),
    phoneNumber: z
      .string()
      .trim()
      .optional(),
  })
  .superRefine((val, ctx) => {
    const email = val.emailAddress ?? "";
    const phone = val.phoneNumber ?? "";

    if (val.isPhoneInput) {
      // Phone required; email must be blank/undefined
      if (!phone || !isValidPhoneNumber(phone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phoneNumber"],
          message: "Enter a valid phone number",
        });
      }
      if (email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["emailAddress"],
          message: "Leave email empty when using phone",
        });
      }
    } else {
      // Email required; phone must be blank/undefined
      if (!email || !emailRegex.test(email)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["emailAddress"],
          message: "Enter a valid email address",
        });
      }
      if (phone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phoneNumber"],
          message: "Leave phone empty when using email",
        });
      }
    }
  });

export type CustomerFormValues = z.infer<typeof customerSchema>;
