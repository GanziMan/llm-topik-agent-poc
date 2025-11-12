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
[컨텍스트 - 54 논술문 첨삭 기준]
- 서론-본론-결론 구조를 명확히 유지
- 견해-근거-예시의 논리적 연결 강화
- 600~700자 범위 고려, 고급 어휘·표현 사용
- 문체 통일(문어체), 접속·지시어 활용으로 응집성 확보
"""
