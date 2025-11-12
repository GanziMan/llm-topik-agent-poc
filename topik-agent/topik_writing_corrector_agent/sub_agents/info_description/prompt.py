OUTPUT_FORMAT_SCHEMA = """
{
  "original_answer": String,
  "edit_items": {
    "vocabulary_spelling_corrections": [
      { "original": String, "revised": String, "position": String, "reason": String }
    ],
    "sentence_corrections": [
      { "original": String, "revised": String, "position": String, "reason": String }
    ]
  },
  "improvement_effects": {
    "expected_score_gain": Number,
    "key_improvements": [String]
  },
  "overall_feedback": String
}
"""

CONTEXT_PROMPT = """
[컨텍스트 - 53 설명문 첨삭 기준]
- 주어진 자료의 핵심 정보(수치, 추세, 원인·결과)를 정확히 반영
- 도입-전개-마무리 구조 명확화
- 200~300자 범위 고려, 구어체 → 문어체 일관성
- 접속 표현 보강으로 논리적 흐름 강화
"""
