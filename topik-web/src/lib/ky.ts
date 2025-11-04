import ky, { HTTPError } from "ky";

export const kyInstance = ky.create({
  prefixUrl: process.env.AGENT_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        if (!response.ok) {
          const errorBody = await response.json();
          const error = new HTTPError(response, request, options);

          error.message = `HTTP Error: ${response.status} ${
            response.statusText
          }. Body: ${JSON.stringify(errorBody)}`;

          throw error;
        }
        return response;
      },
    ],
  },
});
