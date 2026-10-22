import { errorMessage } from "@/core/api/ApiClientError";
import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { OrderTimeline } from "@/features/orders/components/OrderTimeline";
import { TrackingMap } from "@/features/orders/components/TrackingMap";
import { COURIER } from "@/features/orders/data/mock";
import { useCompleteOrder, useOrder } from "@/features/orders/hooks";
import { useBuyAgain } from "@/features/orders/hooks/useBuyAgain";
import { STATUS_LABEL, STATUS_TONE } from "@/features/orders/status";
import { buildTimeline } from "@/features/orders/utils";
import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import { ErrorState } from "@/shared/components/ErrorState";
import { OverlayHeader } from "@/shared/components/OverlayHeader";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { Skeleton } from "@/shared/components/Skeleton";
import { StatusBadge } from "@/shared/components/StatusBadge";
import Feather from "@expo/vector-icons/Feather";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SHEET_RADIUS = 28;

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { data: order, isLoading, error, refetch } = useOrder(id);
  const complete = useCompleteOrder();
  const buyAgain = useBuyAgain();

  const timeline = useMemo(() => (order ? buildTimeline(order) : []), [order]);

  if (!order) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Order Tracking" />
        {isLoading ? (
          <View style={styles.loading}>
            <Skeleton width="100%" height={220} radius={16} />
            <Skeleton width="100%" height={90} radius={14} />
          </View>
        ) : (
          <ErrorState error={error} onRetry={() => refetch()} />
        )}
      </View>
    );
  }

  const mapHeight = Math.round(height * 0.42);
  const arrived = order.status === "shipped" || order.status === "delivered";
  const finished = order.status === "completed" || order.status === "cancelled";

  const handleMarkDone = () => {
    if (!arrived) {
      Alert.alert("Not yet", "Your order hasn't arrived yet.");
      return;
    }

    Alert.alert("Mark as done?", "Confirm that you have received your order.", [
      { text: "Not yet", style: "cancel" },
      {
        text: "Yes, received",
        onPress: async () => {
          try {
            await complete.mutateAsync(order.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.navigate({
              pathname: "/(tabs)/orders",
              params: { tab: "history" },
            });
          } catch (err) {
            Alert.alert("Couldn't update the order", errorMessage(err));
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        <TrackingMap height={mapHeight} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.statusRow}>
            <AppText size={13} weight="semibold" color="textSecondary">
              {`Order ${order.number}`}
            </AppText>
            <StatusBadge
              label={STATUS_LABEL[order.status]}
              tone={STATUS_TONE[order.status]}
            />
          </View>

          {/* Courier */}
          <View style={styles.courierCard}>
            <View style={styles.avatar}>
              <Feather name="user" size={22} color={colors.primary} />
            </View>

            <View style={styles.courierText}>
              <AppText size={15} weight="bold">
                {COURIER.name}
              </AppText>
              <AppText size={12} weight="medium" color="textSecondary">
                {COURIER.role}
              </AppText>
            </View>

            <TouchableOpacity
              style={styles.contactBtn}
              onPress={() => {
                // TODO: open a chat with the courier
              }}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Message courier"
            >
              <Feather
                name="message-circle"
                size={20}
                color={colors.textPrimary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactBtn}
              onPress={() => {
                // TODO: call the courier with Linking.openURL(`tel:${COURIER.phone}`)
              }}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Call courier"
            >
              <Feather name="phone" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Progress */}
          <AppText size={18} weight="bold">
            Progress of your Order
          </AppText>
          <OrderTimeline steps={timeline} />
        </View>
      </ScrollView>

      <OverlayHeader title="Order Tracking" />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        {finished ? (
          <Button label="Buy Again" size="lg" onPress={() => buyAgain(order)} />
        ) : (
          <>
            {!arrived && (
              <AppText
                size={12}
                weight="medium"
                color="textSecondary"
                align="center"
              >
                Available once your order is on its way
              </AppText>
            )}
            <Button
              label="Mark as Done"
              size="lg"
              variant="outline"
              loading={complete.isPending}
              disabled={!arrived}
              onPress={handleMarkDone}
            />
          </>
        )}
      </View>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    loading: {
      paddingHorizontal: 20,
      gap: 16,
    },
    sheet: {
      marginTop: -SHEET_RADIUS,
      borderTopLeftRadius: SHEET_RADIUS,
      borderTopRightRadius: SHEET_RADIUS,
      backgroundColor: c.background,
      paddingHorizontal: 20,
      paddingTop: 10,
      gap: 20,
    },
    handle: {
      alignSelf: "center",
      width: 44,
      height: 5,
      borderRadius: 3,
      backgroundColor: c.handle,
    },
    statusRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    courierCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    avatar: {
      height: 46,
      width: 46,
      borderRadius: 23,
      backgroundColor: c.primary + "22",
      alignItems: "center",
      justifyContent: "center",
    },
    courierText: {
      flex: 1,
      gap: 2,
    },
    contactBtn: {
      height: 38,
      width: 38,
      borderRadius: 19,
      backgroundColor: c.surfaceMuted,
      alignItems: "center",
      justifyContent: "center",
    },
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 20,
      paddingTop: 12,
      gap: 8,
      backgroundColor: c.background,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
  });
