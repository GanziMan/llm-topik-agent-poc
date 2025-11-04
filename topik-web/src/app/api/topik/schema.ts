import z from "zod";

export const topikWritingEvaluatorRequestSchema = z.object({
  problemId: z.enum(["51", "52", "53", "54"]),
  questionPrompt: z.string().min(1, "Question cannot be empty."),
  answer: z.union([
    z.string(),
    z.object({
      answer1: z.string(),
      answer2: z.string(),
    }),
  ]),
  charCount: z.number().optional(),
});

export type TopikWritingEvaluatorRequest = z.output<
  typeof topikWritingEvaluatorRequestSchema
>;
