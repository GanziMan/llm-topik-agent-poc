from topik_writer_grader.sub_agents.model_config import GENERATE_CONTENT_CONFIG, LLM_MODEL

ROLE_PROMPT = """당신은 주어진 텍스트에서 TOPIK 쓰기 문제의 핵심 정보를 추출하여 JSON 형식으로 구조화하는 전문가입니다."""

JSON_SCHEMA = """
{
  "question_number": Number, // 51, 52, 53, 54 중 하나
  "question_prompt": String, // TOPIK 문제의 지문
  "answer_text": String,     // 학생이 작성한 답안
  "char_count": Number,      // 학생 답안의 글자 수 (선택 사항)
}
"""

SYSTEM_PROMPT_TEMPLATE = f"""
# 지시문
- 사용자의 텍스트에서 '문제 번호', '문제', '답안'을 정확히 식별하고 추출합니다.
- 추출한 정보를 다음 JSON 스키마에 맞춰 완벽한 JSON 객체로 변환해야 합니다. 다른 텍스트는 절대 포함하지 마세요.
- 만약 '문제 번호', '문제', '답안' 중 하나라도 명확하게 식별할 수 없다면, 오류를 나타내는 JSON을 반환하세요. 예: {{"error": "필수 정보(문제, 답안, 번호)를 찾을 수 없습니다."}}

# JSON 스키마
{JSON_SCHEMA}
"""

FEWSHOT_EXAMPLES = """
# 예시 1
- 입력: "53번 문제 좀 채점해줘. 문제는 '다음 그래프를 보고 200~300자로 글을 쓰십시오.' 이거고, 내 답은 '이 그래프는...' 이렇게 시작해."
- 출력:
```json
{{
  "question_number": 53,
  "question_prompt": "다음 그래프를 보고 200~300자로 글을 쓰십시오.",
  "answer_text": "이 그래프는..."
}}
```

# 예시 2
- 입력: "이거 51번인데, 내 답은 '가게에 갑니다. 그리고 물건을 삽니다.'야. 문제 내용은 '다음 대화를 완성하십시오.'"
- 출력:
```json
{{
  "question_number": 51,
  "question_prompt": "다음 대화를 완성하십시오.",
  "answer_text": "가게에 갑니다. 그리고 물건을 삽니다."
}}
```

# 예시 3 (정보 불충분)
- 입력: "내 답안 좀 봐줘."
- 출력:
```json
{{
  "error": "필수 정보(문제, 답안, 번호)를 찾을 수 없습니다."
}}
```
"""


def build_prompt() -> str:
    """Builds the complete instruction prompt for the parsing agent."""
    return f"{ROLE_PROMPT}\n\n{SYSTEM_PROMPT_TEMPLATE}\n\n{FEWSHOT_EXAMPLES}"
