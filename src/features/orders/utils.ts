import type { Order } from "@/features/orders/types";

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

/** Short readable reference, such as "#482913" */
export const shortId = (id: string) => `#${id.replace(/\D/g, "").slice(-6)}`;

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

// TODO: replace with real tracking events from your backend
export const buildTimeline = (order: Order): TimelineStep[] => {
  const completed = order.status === "completed";
  const at = (minutes: number) =>
    formatTime(order.createdAt + minutes * 60_000);

  return [
    {
      id: "shop",
      title: "Novara Store",
      subtitle: "Shop",
      time: at(10),
      icon: "shop",
      state: "done",
    },
    {
      id: "delivery",
      title: "On the way",
      subtitle: "Delivery",
      time: at(50),
      icon: "delivery",
      state: completed ? "done" : "current",
    },
    {
      id: "address",
      title: `${order.address.line1}, ${order.address.city}`,
      subtitle: order.address.label,
      time: at(90),
      icon: "address",
      state: completed ? "done" : "pending",
    },
  ];
};
