/**
 * Compatibility surface. The catalogue lives in `content/garments.ts`;
 * this module keeps the older `Product` names working for the cart and any
 * code that hasn't moved yet.
 */

export {
  garments as products,
  categories,
  getGarment as getProduct,
  getGarment,
  byGender,
  byDrop,
  liveGarments,
  waitlistGarments,
  newArrivals,
  related,
  hasSide,
  formatINR,
  SIZE_GUIDE,
} from "@/content/garments";

export type { Garment as Product, Garment, Gender, Category, Side, Placement, PrintSpec, PrintMark } from "@/content/garments";
