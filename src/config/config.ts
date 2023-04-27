// @ts-ignore
const envConfig = window._env_;

const config = {
  movieBaseUrl: envConfig?.REACT_APP_MOVIE_BASE_URL || "http://localhost:3001",
  apiKey: envConfig?.REACT_APP_API_KEY,
  imageBaseUrl: envConfig?.REACT_APP_IMAGE_BASE_URL,
};

export default config;
