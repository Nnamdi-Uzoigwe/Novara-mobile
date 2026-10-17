export type Faq = {
  id: string;
  question: string;
  answer: string;
};

// TODO: replace with your real questions and answers, and add your return and refund policy
export const FAQS: Faq[] = [
  {
    id: "track",
    question: "How do I track my order?",
    answer:
      "Open the My Order tab and tap Tracking on your order. You will see the courier and each step of the delivery.",
  },
  {
    id: "address",
    question: "How do I change my delivery address?",
    answer:
      "On the Payment screen, before you pay, tap Edit next to your address and choose a new location.",
  },
  {
    id: "payment",
    question: "How do I add a payment method?",
    answer:
      "On the Payment screen, tap the payment method row, choose Add Payment Method, and enter your card details.",
  },
  {
    id: "password",
    question: "How do I change my password?",
    answer:
      "Go to Profile, then Change Password. If you are signed out, use Forgot Password on the login screen.",
  },
  {
    id: "history",
    question: "Where can I see my past orders?",
    answer:
      "Open the My Order tab and switch to History to see completed orders. Tap Buy Again to order the same items.",
  },
];
