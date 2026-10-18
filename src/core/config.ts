const url = process.env.EXPO_PUBLIC_API_URL;

if (!url) {
  console.warn(
    "EXPO_PUBLIC_API_URL is not set. Add it to .env, for example http://192.168.1.20:4000/api/v1",
  );
}

export const API_URL = (url ?? "http://localhost:4000/api/v1").replace(
  /\/$/,
  "",
);
