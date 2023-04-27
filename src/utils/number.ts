import { IDiscountedTimePeriod } from "../models/movie";
import { isTimeBetween } from "./date";

export const getCaculatedPrice = (price: number, discountedPercent: number) => {
  return ((100 - discountedPercent) / 100) * price;
};

export const haveDiscount = (
  discountedPercent: number,
  discountedTimePeriod?: IDiscountedTimePeriod
) => {
  return (
    (discountedPercent > 0 && !discountedTimePeriod) ||
    (discountedPercent > 0 &&
      discountedTimePeriod &&
      isTimeBetween(discountedTimePeriod.begin, discountedTimePeriod.end))
  );
};
