import { FunctionComponent, useState } from "react";
import css from "./popup.module.scss";

interface IPopupProps {
  content: string;
}

const Popup: FunctionComponent<IPopupProps> = ({ content }) => {
  return (
    <div className={css.popup}>
      <div className={css.content}>{content}</div>
    </div>
  );
};

export default Popup;
