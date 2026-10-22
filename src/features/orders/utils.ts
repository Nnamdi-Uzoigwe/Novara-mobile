import type { Order } from "./types";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const formatTime = (ms: number) => {
  const date = new Date(ms);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

export const formatOrderDate = (ms: number) => {
  const date = new Date(ms);
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} at ${formatTime(ms)}`;
};

export const totalQuantity = (order: Order) =>
  order.items.reduce((sum, item) => sum + item.quantity, 0);

export type TimelineStep = {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  icon: "shop" | "delivery" | "address";
  state: "done" | "current" | "pending";
};

/** Builds the tracking steps from the real events saved on the order */
export const buildTimeline = (order: Order): TimelineStep[] => {
  const at = (status: Order["status"]) =>
    order.events.find((event) => event.status === status)?.at;

  const placedAt = at("processing") ?? order.createdAt;
  const shippedAt = at("shipped");
  const arrivedAt = at("delivered") ?? at("completed");

  const arrived = order.status === "delivered" || order.status === "completed";
  const onTheWay = order.status === "shipped";

  const time = (value?: number) => (value ? formatTime(value) : "Pending");

  return [
    {
      id: "shop",
      title: "Novara Store",
      subtitle: "Shop",
      time: time(placedAt),
      icon: "shop",
      state: "done",
    },
    {
      id: "delivery",
      title: "On the way",
      subtitle: "Delivery",
      time: time(shippedAt),
      icon: "delivery",
      state: arrived ? "done" : onTheWay ? "current" : "pending",
    },
    {
      id: "address",
      title: `${order.address.line1}, ${order.address.city}`,
      subtitle: order.address.label,
      time: time(arrivedAt),
      icon: "address",
      state: arrived ? "done" : "pending",
    },
  ];
};
