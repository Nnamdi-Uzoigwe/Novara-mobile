// import { useTheme } from "@/core/theme/ThemeProvider";
// import type { ThemeColors } from "@/core/theme/colors";
// import { AppText } from "@/shared/components/AppText";
// import * as Haptics from "expo-haptics";
// import React, { useMemo } from "react";
// import { StyleSheet, Switch, View } from "react-native";

// type ToggleRowProps = {
//   label: string;
//   value: boolean;
//   onValueChange: (value: boolean) => void;
//   disabled?: boolean;
// };

// export function ToggleRow({
//   label,
//   value,
//   onValueChange,
//   disabled = false,
// }: ToggleRowProps) {
//   const { colors } = useTheme();
//   const styles = useMemo(() => createStyles(colors), [colors]);

//   return (
//     <View style={styles.row}>
//       <AppText size={15} weight="semibold" style={styles.label}>
//         {label}
//       </AppText>

//       <Switch
//         value={value}
//         disabled={disabled}
//         onValueChange={(next) => {
//           Haptics.selectionAsync();
//           onValueChange(next);
//         }}
//         trackColor={{ false: colors.borderStrong, true: colors.primary }}
//         thumbColor="#FFFFFF"
//         ios_backgroundColor={colors.borderStrong}
//         accessibilityLabel={label}
//       />
//     </View>
//   );
// }

// type ToggleGroupProps = {
//   children: React.ReactNode;
// };

// /** Card that stacks toggle rows with a divider between them */
// export function ToggleGroup({ children }: ToggleGroupProps) {
//   const { colors } = useTheme();
//   const styles = useMemo(() => createStyles(colors), [colors]);

//   const items = React.Children.toArray(children);

//   return (
//     <View style={styles.group}>
//       {items.map((child, index) => (
//         <View key={index} style={index < items.length - 1 && styles.divider}>
//           {child}
//         </View>
//       ))}
//     </View>
//   );
// }

// const createStyles = (c: ThemeColors) =>
//   StyleSheet.create({
//     group: {
//       borderRadius: 14,
//       borderWidth: 1,
//       borderColor: c.border,
//       backgroundColor: c.surface,
//       paddingHorizontal: 16,
//     },
//     row: {
//       flexDirection: "row",
//       alignItems: "center",
//       justifyContent: "space-between",
//       minHeight: 56,
//     },
//     label: {
//       flex: 1,
//       paddingRight: 12,
//     },
//     divider: {
//       borderBottomWidth: 1,
//       borderBottomColor: c.border,
//     },
//   });

import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { AppText } from "@/shared/components/AppText";
import * as Haptics from "expo-haptics";
import React, { useMemo } from "react";
import { StyleSheet, Switch, View } from "react-native";

type ToggleRowProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

export function ToggleRow({
  label,
  value,
  onValueChange,
  disabled = false,
}: ToggleRowProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleValueChange = (nextValue: boolean) => {
    if (disabled) return;

    void Haptics.selectionAsync();
    onValueChange(nextValue);
  };

  return (
    <View style={styles.row}>
      <AppText size={15} weight="semibold" style={styles.label}>
        {label}
      </AppText>

      <View style={styles.switchContainer}>
        <Switch
          value={value}
          disabled={disabled}
          onValueChange={handleValueChange}
          trackColor={{
            false: colors.borderStrong,
            true: colors.primary,
          }}
          thumbColor="#FFFFFF"
          ios_backgroundColor={colors.borderStrong}
          accessibilityLabel={label}
          accessibilityRole="switch"
        />
      </View>
    </View>
  );
}

type ToggleGroupProps = {
  children: React.ReactNode;
};

/** Card that stacks toggle rows with dividers. */
export function ToggleGroup({ children }: ToggleGroupProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const items = React.Children.toArray(children);

  return (
    <View style={styles.group}>
      {items.map((child, index) => (
        <View
          key={index}
          style={index < items.length - 1 ? styles.divider : undefined}
        >
          {child}
        </View>
      ))}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    group: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
      paddingHorizontal: 16,
      overflow: "hidden",
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 60,
    },

    label: {
      flex: 1,
      paddingRight: 12,
    },

    switchContainer: {
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },

    divider: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.border,
    },
  });
