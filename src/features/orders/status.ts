import type { OrderStatus } from "./types";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  awaiting_payment: "Awaiting payment",
  processing: "Preparing",
  shipped: "On the way",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_TONE: Record<
  OrderStatus,
  "primary" | "success" | "danger" | "warning"
> = {
  awaiting_payment: "warning",
  processing: "primary",
  shipped: "primary",
  delivered: "success",
  completed: "success",
  cancelled: "danger",
};
