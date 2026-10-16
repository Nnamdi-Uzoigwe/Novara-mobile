import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import { LocationCard } from "@/features/checkout/components/LocationCard";
import { LOCATIONS } from "@/features/checkout/data/locations";
import { AppInput } from "@/shared/components/AppInput";
import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { useAddressStore } from "@/store/addressStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PIN_COLORS = ["#1FBFA5", "#6C5CE7", "#F25C7A"];

export default function AddressScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const saved = useAddressStore((s) => s.selected);
  const setSelected = useAddressStore((s) => s.setSelected);

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(saved?.id ?? LOCATIONS[0].id);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return LOCATIONS;
    return LOCATIONS.filter(
      (l) =>
        l.city.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q),
    );
  }, [query]);

  const handleConfirm = () => {
    const location = LOCATIONS.find((l) => l.id === selectedId);
    if (!location) return;
    setSelected(location);
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Address" />

      <View style={styles.top}>
        <AppText size={20} weight="bold">
          Choose your location
        </AppText>
        <AppText
          size={14}
          weight="medium"
          color="textSecondary"
          lineHeight={21}
        >
          Let's find your delivery address. Choose a location below to get
          started.
        </AppText>

        <AppInput
          variant="outlined"
          icon="map-pin"
          placeholder="Search city"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="words"
          returnKeyType="search"
          containerStyle={styles.search}
          right={
            <TouchableOpacity
              onPress={() => {
                // TODO: use expo-location to find the user's current city
              }}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Use my current location"
            >
              <Ionicons
                name="locate-outline"
                size={22}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          }
        />

        <AppText size={18} weight="bold" style={styles.listTitle}>
          Select location
        </AppText>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <LocationCard
            location={item}
            selected={item.id === selectedId}
            tint={PIN_COLORS[index % PIN_COLORS.length]}
            onPress={() => setSelectedId(item.id)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.gap} />}
        ListEmptyComponent={
          <AppText
            size={14}
            weight="medium"
            color="textSecondary"
            align="center"
          >
            No locations found
          </AppText>
        }
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      />

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button
          label="Confirm"
          size="lg"
          disabled={!results.some((l) => l.id === selectedId)}
          onPress={handleConfirm}
        />
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
    top: {
      paddingHorizontal: 20,
      paddingTop: 8,
      gap: 8,
    },
    search: {
      marginTop: 12,
    },
    listTitle: {
      marginTop: 12,
      marginBottom: 4,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingVertical: 12,
    },
    gap: {
      height: 12,
    },
    footer: {
      paddingHorizontal: 20,
      paddingTop: 12,
    },
  });
