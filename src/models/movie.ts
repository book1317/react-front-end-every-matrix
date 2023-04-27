export interface Movie {
  id: number;
  original_title: string;
  poster_path: string;
  release_date: string;
}

export const initMovie: Movie = {
  id: 0,
  original_title: "",
  poster_path: "",
  release_date: "",
};

export interface IResponseMoive {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const initResponseMoive = {
  page: 0,
  results: [],
  total_pages: 0,
  total_results: 0,
};

export interface IAccount {
  id: number;
  username: string;
}

export const iniAccount = {
  id: 0,
  username: "",
};
