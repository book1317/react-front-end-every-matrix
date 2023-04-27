import { FunctionComponent } from "react";
import css from "./catalogButton.module.scss";

interface ICatalogButtonProps {
  onClick?: () => void;
  isActive: boolean;
}

const CatalogButton: FunctionComponent<ICatalogButtonProps> = ({
  children,
  onClick,
  isActive,
}) => {
  return (
    <div
      className={`${css.catalogButton} ${isActive ? css.active : ""}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default CatalogButton;
