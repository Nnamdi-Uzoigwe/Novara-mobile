export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

const FILLER =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare quam velit facilisis feugiat amet sagittis arcu. Sapien, consequat ultrices nec at amet aliquet ut viverra. Odio vulputate est id sit amet fames.";

// TODO: replace this placeholder with your real Terms and Privacy Policy, reviewed by a lawyer
export const LEGAL_SECTIONS: LegalSection[] = [
  {
    id: "terms",
    title: "Terms",
    paragraphs: [FILLER, FILLER],
  },
  {
    id: "changes",
    title: "Changes to the Service and/or Terms",
    paragraphs: [FILLER, FILLER],
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    paragraphs: [FILLER, FILLER],
  },
];
