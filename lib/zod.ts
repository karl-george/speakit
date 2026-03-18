import { z } from "zod";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_PDF_TYPES,
  MAX_FILE_SIZE,
  MAX_IMAGE_SIZE,
} from "@/lib/constants";

export const UploadSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be less than 100 characters" }),
  author: z
    .string()
    .min(1, { message: "Author is required" })
    .max(100, { message: "Author must be less than 100 characters" }),
  persona: z.string().min(1, { message: "Please select a voice" }),
  pdfFile: z
    .instanceof(File, { message: "Please upload a PDF file" })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "File size must be less than 50MB",
    )
    .refine(
      (file) => ACCEPTED_PDF_TYPES.includes(file.type),
      "File type must be PDF",
    ),
  coverImage: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= MAX_IMAGE_SIZE,
      "Cover image size must be less than 10MB",
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Cover image type must be JPG, JPEG, PNG or WEBP",
    ),
});
