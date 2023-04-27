import { FunctionComponent } from "react";
import css from "./loader.module.scss";

interface ILoaderProps {}

const Loader: FunctionComponent<ILoaderProps> = () => {
  return (
    <div className={css.loader}>
      <div className={css.spiner} />
    </div>
  );
};

export default Loader;
