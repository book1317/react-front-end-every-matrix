import { FunctionComponent, memo, useState } from "react";
import css from "./searchBar.module.scss";

interface ISearchBarProps {
  onChange: (text: string) => void;
}

const SearchBar: FunctionComponent<ISearchBarProps> = ({ onChange }) => {
  return (
    <div className={css.searchBar}>
      <div className={css.searchLabel}>Search Movies</div>
      <input
        onChange={(e) => {
          onChange(e.target.value);
        }}
        className={css.input}
      />
    </div>
  );
};

export default SearchBar;
