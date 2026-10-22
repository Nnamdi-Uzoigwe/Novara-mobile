import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { AddressOptionCard } from "@/features/addresses/components/AddressOptionCard";
import { useAddresses, useSelectedAddress } from "@/features/addresses/hooks";
import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { Skeleton } from "@/shared/components/Skeleton";
import { useAddressStore } from "@/store/addressStore";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddressScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { data, isLoading, error, refetch } = useAddresses();
  const { address: current } = useSelectedAddress();
  const select = useAddressStore((s) => s.select);

  const [pendingId, setPendingId] = useState<string | null>(null);
  const activeId = pendingId ?? current?.id ?? null;

  const addresses = data ?? [];

  const handleConfirm = () => {
    if (activeId) select(activeId);
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Address" />

      {isLoading ? (
        <View style={styles.content}>
          {[0, 1].map((i) => (
            <Skeleton key={i} width="100%" height={110} radius={14} />
          ))}
        </View>
      ) : error && addresses.length === 0 ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : addresses.length === 0 ? (
        <EmptyState
          icon="map-pin"
          title="No saved addresses"
          subtitle="Add the address where your orders should be delivered."
          actionLabel="Add address"
          onAction={() => router.push("/address-form" as any)}
        />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <AppText size={20} weight="bold">
              Choose your address
            </AppText>
            <AppText size={14} weight="medium" color="textSecondary">
              Orders will be delivered to the address you select.
            </AppText>

            {addresses.map((address) => (
              <AddressOptionCard
                key={address.id}
                address={address}
                selected={address.id === activeId}
                onPress={() => setPendingId(address.id)}
                onEdit={() =>
                  router.push({
                    pathname: "/address-form" as any,
                    params: { id: address.id },
                  })
                }
              />
            ))}

            <Pressable
              style={styles.addRow}
              onPress={() => router.push("/address-form" as any)}
              accessibilityRole="button"
            >
              <Feather name="plus-circle" size={22} color={colors.primary} />
              <AppText size={14} weight="bold" color="primary">
                Add new address
              </AppText>
            </Pressable>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
            <Button
              label="Confirm"
              size="lg"
              disabled={!activeId}
              onPress={handleConfirm}
            />
          </View>
        </>
      )}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 24,
      gap: 14,
    },
    addRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      height: 56,
      borderRadius: 14,
      borderWidth: 1.5,
      borderStyle: "dashed",
      borderColor: c.primary,
    },
    footer: {
      paddingHorizontal: 20,
      paddingTop: 12,
    },
  });
