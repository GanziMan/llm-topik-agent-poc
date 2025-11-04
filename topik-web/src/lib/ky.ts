import ky from "ky";

export const kyInstance = ky.create({
  prefixUrl: process.env.AGENT_BASE_URL,
  timeout: 310000, // 310 seconds, slightly longer than the agent's timeout
  headers: {
    "Content-Type": "application/json",
  },
});
