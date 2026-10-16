import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import type { TimelineStep } from "@/features/orders/utils";
import { AppText } from "@/shared/components/AppText";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

type OrderTimelineProps = {
  steps: TimelineStep[];
};

export function OrderTimeline({ steps }: OrderTimelineProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const active = step.state !== "pending";
        const iconColor = active ? colors.onPrimary : colors.textSecondary;

        return (
          <View key={step.id} style={styles.row}>
            <View style={styles.rail}>
              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor: active
                      ? colors.primary
                      : colors.surfaceMuted,
                  },
                ]}
              >
                {step.icon === "shop" && (
                  <Feather name="shopping-bag" size={18} color={iconColor} />
                )}
                {step.icon === "delivery" && (
                  <Ionicons name="bicycle" size={20} color={iconColor} />
                )}
                {step.icon === "address" && (
                  <Feather name="map-pin" size={18} color={iconColor} />
                )}
              </View>

              {!isLast && (
                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor:
                        step.state === "done" ? colors.primary : colors.border,
                    },
                  ]}
                />
              )}
            </View>

            <View style={[styles.text, !isLast && styles.textGap]}>
              <AppText size={15} weight="bold" numberOfLines={1}>
                {step.title}
              </AppText>
              <AppText size={12} weight="medium" color="textSecondary">
                {`${step.subtitle} · ${step.time}`}
              </AppText>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      gap: 14,
    },
    rail: {
      alignItems: "center",
      width: 40,
    },
    circle: {
      height: 40,
      width: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    line: {
      flex: 1,
      width: 2,
      minHeight: 20,
      marginVertical: 4,
      borderRadius: 1,
    },
    text: {
      flex: 1,
      gap: 3,
      justifyContent: "center",
    },
    textGap: {
      paddingBottom: 18,
    },
  });
