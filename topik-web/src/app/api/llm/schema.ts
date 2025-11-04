import z from "zod";

export const topikWritingEvaluatorRequestSchema = z.object({
  problem_id: z.enum(["51", "52", "53", "54"]),
  question_prompt: z.string().min(1, "Question cannot be empty."),
  answer: z.union([
    z.string(),
    z.object({
      answer1: z.string(),
      answer2: z.string(),
    }),
  ]),
  char_count: z.number().optional(),
});

export type TopikWritingEvaluatorRequest = z.output<
  typeof topikWritingEvaluatorRequestSchema
>;
