import {
  Fragment,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from "react";
import css from "./moviePage.module.scss";
import { IAccount, Movie, iniAccount } from "../../models/movie";
import Loader from "../../components/Loader";
import SearchBar from "./SearchBar/SearchBar";
import MovieApi from "../../api/MovieApi";
import MovieItem from "./MovieItem/MovieItem";
import CatalogButton from "../CatalogButton/CatalogButton";
import useOnScreen from "../../utils/useOnScreen";

export enum CatagoryType {
  default,
  favorite,
}

interface IMoviePageProps {}
let serachTimeout: number;

const MoviePage: FunctionComponent<IMoviePageProps> = (props) => {
  const loadMoreButtonRef = useRef(null);
  const isLoadMoreOnScreen = useOnScreen(loadMoreButtonRef);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState<string>("");
  const [account, setAccount] = useState<IAccount>(iniAccount);
  const [catagory, setCatagory] = useState<CatagoryType>(CatagoryType.default);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [pageInfo, setPageInfo] = useState<{
    page: number;
    total_pages: number;
  }>({ page: 1, total_pages: 0 });

  useEffect(() => {
    onLoading(initPage, true);
  }, []);

  useEffect(() => {
    if (isLoadMoreOnScreen) {
      onLoading(async () => {
        await onLoadMore();
      });
    }
  }, [isLoadMoreOnScreen]);

  useEffect(() => {
    onLoading(async () => {
      const moviesInfo = await getMoviesList(pageInfo.page);
      setPageInfo({
        page: moviesInfo.page,
        total_pages: moviesInfo.total_pages,
      });
    });
  }, [search, catagory]);

  async function initPage() {
    const expiresAt = localStorage.getItem("expires_at") || "";
    const requestToken = localStorage.getItem("request_token") || "";
    let sessionId = localStorage.getItem("session_id") || "";

    if (
      requestToken &&
      new Date(expiresAt).getTime() > new Date().getTime() &&
      !sessionId
    ) {
      sessionId = await createSession(requestToken);
    }

    if (sessionId) {
      const account = await getAccount(sessionId);
      setAccount(account);
    }
  }

  async function onLoading(call: () => Promise<any>, test?: any) {
    setIsLoading(true);
    const result = await call();
    setIsLoading(false);

    if (result) {
      return result;
    }
  }

  async function getMovies(page: number) {
    const moviesInfo = await MovieApi.getMovies({ params: { page } });
    return moviesInfo;
  }

  async function getFavoriteMovies(page: number) {
    const sessionId = localStorage.getItem("session_id") || "";
    const moviesInfo = await MovieApi.getFavoritesMovies({
      accountId: account.id,
      sessionId,
      page,
    });
    return moviesInfo;
  }

  async function searchMovies(page: number) {
    const moviesInfo = await MovieApi.searchMovies({
      query: search,
      page: page,
    });
    return moviesInfo;
  }

  async function markAsFavorite(movieId: number, accountId: number) {
    const result = await MovieApi.markAsFavorite({
      account_id: accountId,
      media_type: "movie",
      media_id: movieId,
      favorite: true,
      session_id: localStorage.getItem("session_id") || "",
    });
    if (result.success) {
      alert("Mark as favorite success");
    }
  }

  async function removeFromFavorite(movieId: number, accountId: number) {
    const result = await MovieApi.markAsFavorite({
      account_id: accountId,
      media_type: "movie",
      media_id: movieId,
      favorite: false,
      session_id: localStorage.getItem("session_id") || "",
    });
    if (result.success) {
      getFavoriteMovies(pageInfo.page);
    }
  }

  async function createSession(request_token: string) {
    const result = await MovieApi.createSession(request_token);
    if (result.success) {
      localStorage.setItem("session_id", result.session_id);
      localStorage.setItem("account_id", result.account_id);
    }
    return result.session_id;
  }

  async function getAccount(sessionId: string) {
    const result = await MovieApi.getAccount(sessionId);
    return result;
  }

  async function getMoviesList(page: number) {
    let moviesInfo = undefined;

    switch (catagory) {
      case CatagoryType.default:
        if (search) {
          moviesInfo = await searchMovies(page);
        } else {
          moviesInfo = await getMovies(page);
        }
        break;
      case CatagoryType.favorite:
        moviesInfo = await getFavoriteMovies(page);
        break;
    }

    if (page > 1) {
      setMovies([...movies, ...moviesInfo.results]);
    } else {
      setMovies(moviesInfo.results);
    }

    return moviesInfo;
  }

  async function onLogin() {
    onLoading(async () => {
      const { request_token, expires_at } = await MovieApi.createRequestToken();
      localStorage.setItem("expires_at", expires_at);
      localStorage.setItem("request_token", request_token);
      localStorage.removeItem("session_id");
      window.open(
        `https://www.themoviedb.org/authenticate/${request_token}?redirect_to=${window.location.origin}`
      );
    });
  }

  async function onLogout() {
    onLoading(async () => {
      localStorage.clear();
      setAccount(iniAccount);
      await initPage();
    });
  }

  async function onChangeSearch(text: string) {
    clearTimeout(serachTimeout);
    serachTimeout = setTimeout(() => {
      setPageInfo({ page: 1, total_pages: 0 });
      setCatagory(CatagoryType.default);
      setSearch(text);
    }, 500);
  }

  async function onSwitchCatagoly(type: CatagoryType) {
    setPageInfo({ page: 1, total_pages: 0 });
    setCatagory(type);
  }

  async function onMarkAsFavorite(movieId: number) {
    onLoading(async () => {
      await markAsFavorite(movieId, account.id);
    });
  }

  async function onRemoveFromFavorite(movieId: number) {
    onLoading(async () => {
      await removeFromFavorite(movieId, account.id);
      const moviesInfo = await getMoviesList(pageInfo.page);
      setPageInfo({
        page: moviesInfo.page,
        total_pages: moviesInfo.total_pages,
      });
    });
  }

  async function onLoadMore() {
    onLoading(async () => {
      const { page, total_pages } = pageInfo;

      if (total_pages > 0 && page < total_pages) {
        const moviesInfo = await getMoviesList(pageInfo.page + 1);
        setPageInfo({
          page: moviesInfo.page,
          total_pages: moviesInfo.total_pages,
        });
      }
    });
  }

  return (
    <div className={css.moviePage}>
      {isLoading && <Loader />}
      <div className={css.authContainer}>
        <div
          className={css.loginButton}
          onClick={() => {
            if (account.id !== 0) {
              onLogout();
            } else {
              onLogin();
            }
          }}
        >
          {account.id !== 0 ? "Logout" : "Login"}
        </div>
        {account.username && <div>username: {account.username}</div>}
      </div>
      <SearchBar onChange={onChangeSearch} />
      <div className={css.movieCatalog}>
        <CatalogButton
          isActive={catagory === CatagoryType.default}
          onClick={() => {
            onSwitchCatagoly(CatagoryType.default);
          }}
        >
          Movie Catagories
        </CatalogButton>
        <CatalogButton
          isActive={catagory === CatagoryType.favorite}
          onClick={() => {
            onSwitchCatagoly(CatagoryType.favorite);
          }}
        >
          Favorite Movies
        </CatalogButton>
      </div>
      <div className={css.moviesContianer}>
        {movies.map((movie) => (
          <Fragment key={movie.id}>
            <MovieItem
              movie={movie}
              onMarkAsFavorite={onMarkAsFavorite}
              onRemoveFromFavorite={onRemoveFromFavorite}
              catagory={catagory}
            />
          </Fragment>
        ))}
      </div>
      <div
        ref={loadMoreButtonRef}
        className={css.loadMoreButton}
        onClick={onLoadMore}
      >
        Load More
      </div>
    </div>
  );
};

export default MoviePage;
