
// getEnv return a function (env, meta) that return a function (key, defaultValue) that return a string

const env = (meta: any) => (key: string, defaultValue: string = "") => {
  try {
    return meta[key] || defaultValue;
  } catch (error) {
    console.error(`Error reading environment variable ${key}`);
    return defaultValue;
  }
}


export const getEnv = env(process.env); // life hack should be import.meta.env but it's not working in jest config env. look at jest.config.js
