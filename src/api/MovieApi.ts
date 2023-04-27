import axios from "axios";
import config from "../config/config";
import {
  IAccount,
  IResponseMoive,
  iniAccount,
  initResponseMoive,
} from "../models/movie";
import ApiManager from "./ApiManager";

interface IMarkAsFavoriteRequest {
  account_id: number;
  media_type: "movie";
  media_id: number;
  favorite: boolean;
  session_id: string;
}

const movieBaseUrl = config.movieBaseUrl;
const apiKey = config.apiKey;

const getMoviesPath = "/discover/movie";
const getFavoriteMoviesPath = "/account/{account_id}/favorite/movies";
const searchMoviesPath = "/search/movie";
const markAsFavoritePath = "/account/{account_id}/favorite";
const createRequestTokenPath = "/authentication/token/new";
const createSessionPath = "/authentication/session/new";
const getAccountPath = "/account";

const instance = axios.create({
  timeout: 30000,
  baseURL: movieBaseUrl,
  headers: { "Content-Type": "application/json" },
  params: {
    api_key: apiKey,
  },
});

const Api = new ApiManager(instance);

const MovieApi = {
  getMovies: async ({ params }: { params: { page?: number } }) => {
    try {
      const response = await Api.get({
        url: getMoviesPath,
        params,
      });
      const data: IResponseMoive = response;
      return data;
    } catch (error) {
      return initResponseMoive;
    }
  },
  getFavoritesMovies: async ({
    accountId,
    sessionId,
    page,
  }: {
    accountId: number;
    sessionId: string;
    page: number;
  }) => {
    try {
      const response = await Api.get({
        url: getFavoriteMoviesPath.replace(
          "{account_id}",
          accountId.toString()
        ),
        params: { session_id: sessionId, page: page },
      });
      const data: IResponseMoive = response;
      return data;
    } catch (error) {
      return initResponseMoive;
    }
  },
  searchMovies: async (params: { query: string; page: number }) => {
    try {
      const url = searchMoviesPath;
      const response: IResponseMoive = await Api.get({
        url,
        params: {
          query: params.query,
          page: params.page,
        },
      });
      return response;
    } catch (error) {
      return initResponseMoive;
    }
  },
  markAsFavorite: async (data: IMarkAsFavoriteRequest) => {
    try {
      const url = markAsFavoritePath.replace(
        "{account_id}",
        data.account_id.toString()
      );
      const result = await Api.post({
        url,
        body: data,
        params: { session_id: data.session_id },
      });
      return result;
    } catch (error) {
      return { success: false };
    }
  },
  removeFromFavorite: async (data: IMarkAsFavoriteRequest) => {
    try {
      const url = markAsFavoritePath.replace(
        "{account_id}",
        data.account_id.toString()
      );
      const result = await Api.post({
        url,
        body: data,
        params: { session_id: data.session_id },
      });
      return result;
    } catch (error) {
      return { success: false };
    }
  },
  createRequestToken: async () => {
    try {
      const url = createRequestTokenPath;
      const response = await Api.get({ url });
      return response;
    } catch (error) {
      return { request_token: "", expires_at: "" };
    }
  },
  createSession: async (requestToken: string) => {
    try {
      const response = await Api.post({
        url: createSessionPath,
        body: { request_token: requestToken },
      });
      const data = response;
      return data;
    } catch (error) {
      return { success: false, session_id: "" };
    }
  },
  getAccount: async (sessionId: string) => {
    try {
      const response = await Api.get({
        url: getAccountPath,
        params: { session_id: sessionId },
      });
      const data: IAccount = response;
      return data;
    } catch (error) {
      return iniAccount;
    }
  },
};

export default MovieApi;
