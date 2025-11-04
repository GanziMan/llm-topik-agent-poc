from google.genai import types

GENERATE_CONTENT_CONFIG = types.GenerateContentConfig(
    temperature=0,
    top_p=0.9,
)


class LLM_MODEL:
    GEMINI_25FLASH = "gemini-2.5-flash"
    GEMINI_20FLASH = "gemini-2.0-flash"
