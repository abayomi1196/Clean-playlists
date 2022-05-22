declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NODE_ENV: "development" | "production" | "test";
      readonly CLIENT_ID: string;
      readonly CLIENT_SECRET: string;
    }
  }
}

export {};
