"""
TOPIK 쓰기 채점 시스템의 유틸리티 함수들
"""


def count_characters(text: str) -> int:
    """
    한국어 텍스트의 글자수를 정확히 계산합니다.
    공백, 구두점 포함.
    """
    if not text:
        return 0
    return len(text.strip())


def evaluate_character_count(char_count: int, question_number: int) -> str:
    """
    문항별 글자수 평가를 반환합니다.

    Args:
        char_count: 글자수
        question_number: 문항 번호 (53 또는 54)

    Returns:
        글자수 평가 문자열
    """
    if question_number == 53:
        if 200 <= char_count <= 300:
            return "적정 범위 내 (200~300자)"
        elif char_count < 200:
            return f"글자수 부족 ({char_count}자, 200자 미만)"
        else:
            return f"글자수 초과 ({char_count}자, 300자 초과)"

    elif question_number == 54:
        if 600 <= char_count <= 700:
            return "적정 범위 내 (600~700자)"
        elif char_count < 600:
            return f"글자수 부족 ({char_count}자, 600자 미만)"
        else:
            return f"글자수 초과 ({char_count}자, 700자 초과)"

    else:
        return "해당 없음"


def validate_score_range(score: int, max_score: int, score_name: str = "점수") -> bool:
    """
    점수가 유효한 범위 내에 있는지 검증합니다.

    Args:
        score: 검증할 점수
        max_score: 최대 점수
        score_name: 점수 항목명 (에러 메시지용)

    Returns:
        유효하면 True, 아니면 False

    Raises:
        ValueError: 점수가 범위를 벗어날 때
    """
    if not isinstance(score, (int, float)) or score < 0 or score > max_score:
        raise ValueError(
            f"{score_name}이 유효하지 않습니다: {score} (0~{max_score} 범위)")
    return True


def combine_prompts(role_prompt: str, system_prompt: str, context_prompt: str,
                    question_prompt: str, answer: str) -> str:
    """
    모든 프롬프트를 조합하여 LLM에 전달할 최종 프롬프트를 생성합니다.

    Args:
        role_prompt: 역할 프롬프트
        system_prompt: 시스템 프롬프트
        context_prompt: 컨텍스트 프롬프트
        question_prompt: 문제 프롬프트
        answer: 학생 답안

    Returns:
        조합된 최종 프롬프트
    """
    final_prompt = f"""
{role_prompt}

{system_prompt}

{context_prompt}

[문제]
{question_prompt}

[학생 답안]
{answer}

위 학생 답안을 채점하고 JSON 형식으로 결과를 반환해주세요.
"""
    return final_prompt.strip()


def format_grading_result(result: dict) -> str:
    """
    채점 결과를 보기 좋게 포맷팅합니다.

    Args:
        result: 채점 결과 딕셔너리

    Returns:
        포맷팅된 결과 문자열
    """
    formatted = "=" * 50 + "\n"
    formatted += "TOPIK 쓰기 채점 결과\n"
    formatted += "=" * 50 + "\n\n"

    # 점수 정보
    formatted += "📊 점수 정보:\n"
    scores = result.get("점수", {})
    for key, value in scores.items():
        if value is not None:
            formatted += f"  - {key}: {value}점\n"

    formatted += f"  - 총점: {result.get('총점', 0)}점\n\n"

    # 글자수 정보 (53, 54번만)
    if result.get("글자수") is not None:
        formatted += f"📝 글자수: {result.get('글자수')}자\n"
        formatted += f"📋 글자수 평가: {result.get('글자수_평가')}\n\n"

    # 강점
    strengths = result.get("강점", [])
    if strengths:
        formatted += "✅ 강점:\n"
        for strength in strengths:
            formatted += f"  • {strength}\n"
        formatted += "\n"

    # 약점
    weaknesses = result.get("약점", [])
    if weaknesses:
        formatted += "⚠️ 약점:\n"
        for weakness in weaknesses:
            formatted += f"  • {weakness}\n"
        formatted += "\n"

    # 개선 방안
    improvements = result.get("개선_방안", [])
    if improvements:
        formatted += "💡 개선 방안:\n"
        for improvement in improvements:
            formatted += f"  • {improvement}\n"
        formatted += "\n"

    # 총평
    overall = result.get("총평", "")
    if overall:
        formatted += "📄 총평:\n"
        formatted += f"  {overall}\n\n"

    formatted += "=" * 50
    return formatted
