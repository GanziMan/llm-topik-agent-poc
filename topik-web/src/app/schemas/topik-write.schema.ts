import { QuestionId } from "@/types/topik.types";
import z from "zod";

export const topikWritingEvaluatorRequestSchema = z.object({
  questionNumber: z.enum(QuestionId),
  questionPrompt: z.string().min(1, "Question cannot be empty."),
  answer: z.union([
    z.string(),
    z.object({
      answer1: z.string(),
      answer2: z.string(),
    }),
  ]),
  imageUrl: z.string().optional(),
});

export type TopikWritingEvaluatorRequest = z.output<typeof topikWritingEvaluatorRequestSchema>;

export const topikWritingCorrectorRequestSchema = z.object({
  questionNumber: z.enum([QuestionId.Q53, QuestionId.Q54]),
  questionPrompt: z.string().min(1, "Question cannot be empty."),
  answer: z.string(),
  imageUrl: z.string().optional(),
});

export type TopikWritingCorrectorRequest = z.output<typeof topikWritingCorrectorRequestSchema>;

const evaluationResultSchema = z.object({
  total_score: z.number(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  improvement_suggestions: z.array(z.string()),
  overall_feedback: z.string(),
});

export const topikWritingCorrectorRequestSchemaWithEval = topikWritingCorrectorRequestSchema.extend({
  evaluationResult: evaluationResultSchema,
});
