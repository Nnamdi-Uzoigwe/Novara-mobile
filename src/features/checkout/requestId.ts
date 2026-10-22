/** One id per checkout attempt, so a retry never creates a second order */
export const newRequestId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
