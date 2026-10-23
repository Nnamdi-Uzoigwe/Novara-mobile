export type NotificationKind = "purchase" | "message" | "promo" | "shipping";

export type AppNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  read: boolean;
  createdAt: number;
  /** Set for notifications about an order */
  orderId?: string;
};

export type NotificationsData = {
  items: AppNotification[];
  unreadCount: number;
};

export type NotificationSettings = {
  payment: boolean;
  tracking: boolean;
  completeOrder: boolean;
  general: boolean;
};

// What the server sends
export type ApiNotification = {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  orderId: string | null;
};
