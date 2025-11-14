import { QuestionId } from "@/types/topik.types";

export const QUESTION_IDS = [QuestionId.Q51, QuestionId.Q52, QuestionId.Q53, QuestionId.Q54];

export const TOTAL_SCORE_INFO = {
  [QuestionId.Q51]: {
    total: 10,
    char: 100,
    answer1: 5,
    answer2: 5,
  },
  [QuestionId.Q52]: {
    total: 10,
    char: 100,
    answer1: 5,
    answer2: 5,
  },
  [QuestionId.Q53]: {
    total: 30,
    char: 300,
    task_performance: 7,
    structure: 7,
    language_use: 16,
  },
  [QuestionId.Q54]: {
    total: 50,
    char: 700,
    task_performance: 12,
    structure: 12,
    language_use: 26,
  },
};

export const IMAGE_MIME_TYPES_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};
