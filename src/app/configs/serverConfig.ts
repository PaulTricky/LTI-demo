export const configs = {
  API_KEY: process.env.LTIAAS_API_KEY,
  LTIAAS_URL: process.env.LTIAAS_URL,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
};

export const getLtikAuthHeader = (ltik: string) =>
  `LTIK-AUTH-V2 2e11fa50-d6f5-48d7-9b65-d7700e4ef804:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoibHRpayIsInRpZCI6IjdYbVZJQVJScnJqQ2VXTEtYUHdNIiwiaWF0IjoxNzE5NDExOTAwLCJleHAiOjE3MTk0OTgzMDB9.eedcpBqcixeiwtGDJCXAEgPKNvyEwOd4syPEUnq0dsg`;

export const getServiceAuthHeader = (ltik: string) =>
  `SERVICE-AUTH-V1 ${configs.API_KEY}:${ltik}`;
