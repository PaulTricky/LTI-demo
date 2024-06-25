export const configs = {
  API_KEY: process.env.LTIAAS_API_KEY,
  LTIAAS_URL: process.env.LTIAAS_URL,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
};

export const getLtikAuthHeader = (ltik: string) =>
  `LTIK-AUTH-V2 ${configs.API_KEY}:${ltik}`;

export const getServiceAuthHeader = (ltik: string) =>
  `SERVICE-AUTH-V1 ${configs.API_KEY}:${ltik}`;
