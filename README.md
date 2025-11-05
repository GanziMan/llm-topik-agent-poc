# TOPIK AI 쓰기 채점 도우미

TOPIK(한국어능력시험) 쓰기 문제(51~54번)를 자동으로 채점하고 상세한 피드백을 제공하는 웹 애플리케이션입니다.

## 주요 기능

- **AI 기반 자동 채점:** 사용자가 TOPIK 쓰기 답안을 제출하면, AI 에이전트가 채점 기준에 따라 종합 점수와 상세 피드백을 제공합니다.
- **문제 유형별 전문 에이전트:** TOPIK 51/52번(문장 완성), 53번(정보 설명), 54번(의견 논술) 각 유형에 최적화된 전문 LLM 에이전트가 채점을 수행하여 정확도를 높였습니다.
- **계층적 에이전트 아키텍처:** 중앙 감독관 에이전트(`TopikWritingEvaluator`)가 사용자 요청을 분석하여 가장 적합한 전문 채점 에이전트에게 작업을 분배하는 효율적인 구조를 가집니다.

## 기술 스택

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, ky
- **Backend:** Python, Google Agent Development Kit (ADK), Google Gemini (LLM)
- **API & Communication:** REST API (Next.js Route Handlers)

## 아키텍처

- **Frontend (`topik-web`):** Next.js App Router 기반의 웹 애플리케이션으로, 사용자 입력을 받아 백엔드 API 서버에 채점을 요청합니다.
- **Backend (`topik-agent`):** Google ADK를 사용하여 구축된 Python 서버입니다. Supervisor Agent가 문제 유형에 따라 Sub-Agent에게 라우팅하여 LLM 호출을 통해 채점을 수행하고 결과를 반환합니다.

## 시작하기

1. **Frontend (`topik-web`)**

   ```bash
   cd topik-web
   npm install
   npm run dev
   ```

   브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속합니다.

2. **Backend (`topik-agent`)**
   ```bash
   cd topik-agent
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   python main.py
   ```
   백엔드 서버는 `http://localhost:3001`에서 실행됩니다.

## 프로젝트 구조

**`topik-web`**

```
src/
├── app/             # Next.js 앱 라우터
│   ├── (question)/  # 문제 풀이 페이지 그룹
│   └── api/         # API 라우트 핸들러
├── components/      # 공통 컴포넌트
├── lib/             # 유틸리티 함수 (ky, adk 통신 등)
├── types/           # 타입 정의
└── schemas/         # Zod 스키마

```

**`topik-agent`**

```
topik_writing_evaluator_agent/
├── evaluators_agents/ # 문제 유형별 전문 에이전트
├── agent.py           # Root Agent 정의
└── topik_writing_evaluator.py # Supervisor Agent 구현
```
