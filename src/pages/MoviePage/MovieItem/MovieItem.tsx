import { FunctionComponent } from "react";
import css from "./movieItem.module.scss";
import { Movie } from "../../../models/movie";
import config from "../../../config/config";
import { AiOutlineHeart, AiOutlineClose } from "react-icons/ai";
import { CatagoryType } from "../MoviePage";

interface IMovieItemProps {
  onMarkAsFavorite?: (movieId: number) => void;
  onRemoveFromFavorite?: (movieId: number) => void;
  movie: Movie;
  catagory: CatagoryType;
}

const MovieItem: FunctionComponent<IMovieItemProps> = ({
  movie,
  catagory,
  onMarkAsFavorite,
  onRemoveFromFavorite,
}) => {
  return (
    <div className={css.movieItem}>
      <img
        className={css.movieImage}
        src={`${config.imageBaseUrl}/${movie.poster_path}`}
      />
      {catagory === CatagoryType.default ? (
        <AiOutlineHeart
          className={css.favoriteButton}
          onClick={() => {
            if (onMarkAsFavorite) {
              onMarkAsFavorite(movie.id);
            }
          }}
        />
      ) : (
        <AiOutlineClose
          className={css.favoriteButton}
          onClick={() => {
            if (onRemoveFromFavorite) {
              onRemoveFromFavorite(movie.id);
            }
          }}
        />
      )}
      <div className={css.textContainer}>
        <div className={css.title}>{movie.original_title}</div>
        <div className={css.releaseDate}>
          {new Date(movie.release_date).toDateString()}
        </div>
      </div>
    </div>
  );
};

export default MovieItem;
