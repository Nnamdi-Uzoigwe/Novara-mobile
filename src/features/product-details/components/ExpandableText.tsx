import { AppText } from "@/shared/components/AppText";
import { useState } from "react";

type ExpandableTextProps = {
  text: string;
  /** Characters shown before "Read More" appears. Defaults to 120 */
  maxChars?: number;
};

export function ExpandableText({ text, maxChars = 120 }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const needsToggle = text.length > maxChars;

  const visible =
    expanded || !needsToggle
      ? text
      : `${text.slice(0, maxChars).trimEnd()}... `;

  return (
    <AppText size={14} weight="medium" color="textSecondary" lineHeight={22}>
      {visible}
      {needsToggle && (
        <AppText
          size={14}
          weight="semibold"
          color="primary"
          lineHeight={22}
          onPress={() => setExpanded((prev) => !prev)}
        >
          {expanded ? " Show Less" : "Read More"}
        </AppText>
      )}
    </AppText>
  );
}
