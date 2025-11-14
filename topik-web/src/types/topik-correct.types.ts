export interface CorrectionChangeItem {
  original: string;
  revised: string;
  position: string;
  reason: string;
}

export interface CorrectionChangeSet {
  vocabulary_spelling_corrections: CorrectionChangeItem[];
  sentence_corrections: CorrectionChangeItem[];
}

export interface CorrectionImprovement {
  expected_score_gain: string;
  key_improvements: string[];
}

export interface CorrectionResponse {
  original_answer: string;
  corrected_answer: string;
  edit_items: CorrectionChangeSet;
  improvement_effects: CorrectionImprovement;
  overall_feedback: string;
}
