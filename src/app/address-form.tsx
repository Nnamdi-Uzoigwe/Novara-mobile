import { errorMessage, fieldErrorsFrom } from "@/core/api/ApiClientError";
import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import {
    useAddresses,
    useDeleteAddress,
    useSaveAddress,
} from "@/features/addresses/hooks";
import type { Address, AddressInput } from "@/features/addresses/types";
import { AppInput } from "@/shared/components/AppInput";
import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import { Chip } from "@/shared/components/Chip";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { ErrorState } from "@/shared/components/ErrorState";
import { FormField } from "@/shared/components/FormField";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { Skeleton } from "@/shared/components/Skeleton";
import { ToggleGroup, ToggleRow } from "@/shared/components/ToggleRow";
import { useAddressStore } from "@/store/addressStore";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LABELS = ["Home", "Office", "Other"];
const PHONE_REGEX = /^\+?[\d\s\-()]{7,20}$/;

type Fields =
  | "recipientName"
  | "phone"
  | "line1"
  | "city"
  | "region"
  | "postalCode";

export default function AddressFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { data, isLoading, error, refetch } = useAddresses();
  const initial = id ? data?.find((a) => a.id === id) : undefined;

  if (id && isLoading) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Edit Address" />
        <View style={styles.content}>
          <Skeleton width="100%" height={52} radius={12} />
          <Skeleton width="100%" height={52} radius={12} />
          <Skeleton width="100%" height={52} radius={12} />
        </View>
      </View>
    );
  }

  if (id && !initial) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Edit Address" />
        <ErrorState
          error={error}
          message={error ? undefined : "This address no longer exists."}
          onRetry={error ? () => refetch() : undefined}
        />
      </View>
    );
  }

  return <AddressFormBody key={id ?? "new"} initial={initial} />;
}

function AddressFormBody({ initial }: { initial?: Address }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const editing = !!initial;
  const save = useSaveAddress();
  const remove = useDeleteAddress();
  const selectedId = useAddressStore((s) => s.selectedId);
  const select = useAddressStore((s) => s.select);

  const [label, setLabel] = useState(initial?.label ?? "Home");
  const [recipientName, setRecipientName] = useState(
    initial?.recipientName ?? "",
  );
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [line1, setLine1] = useState(initial?.line1 ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [region, setRegion] = useState(initial?.region ?? "");
  const [postalCode, setPostalCode] = useState(initial?.postalCode ?? "");
  const [isDefault, setIsDefault] = useState(initial?.isDefault ?? false);

  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState<
    Partial<Record<Fields, string>>
  >({});
  const [formError, setFormError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const errors: Partial<Record<Fields, string>> = {
    recipientName:
      recipientName.trim().length >= 2 ? "" : "Enter the recipient's name",
    phone: PHONE_REGEX.test(phone.trim()) ? "" : "Enter a valid phone number",
    line1: line1.trim().length >= 3 ? "" : "Enter the street address",
    city: city.trim().length >= 2 ? "" : "Enter the city",
    region: region.trim().length >= 2 ? "" : "Enter the state or region",
  };

  const shown = (field: Fields) =>
    (submitted ? errors[field] : "") || serverErrors[field] || "";

  const handleSave = async () => {
    setSubmitted(true);
    setServerErrors({});
    setFormError("");

    if (Object.values(errors).some(Boolean) || save.isPending) return;

    const input: AddressInput = {
      label,
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      line1: line1.trim(),
      city: city.trim(),
      region: region.trim(),
      postalCode: postalCode.trim() || undefined,
      isDefault: isDefault || undefined,
    };

    try {
      const saved = await save.mutateAsync({ id: initial?.id, input });
      if (!editing) select(saved.id);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err) {
      const fields = fieldErrorsFrom(err) as Partial<Record<Fields, string>>;
      if (Object.keys(fields).length > 0) setServerErrors(fields);
      else setFormError(errorMessage(err));
    }
  };

  const handleDelete = async () => {
    if (!initial) return;
    setConfirmDelete(false);

    try {
      await remove.mutateAsync(initial.id);
      if (selectedId === initial.id) select(null);
      router.back();
    } catch (err) {
      setFormError(errorMessage(err));
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScreenHeader title={editing ? "Edit Address" : "New Address"} />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.chips}>
          {LABELS.map((item) => (
            <Chip
              key={item}
              label={item}
              selected={label === item}
              onPress={() => setLabel(item)}
            />
          ))}
        </View>

        <FormField label="Recipient" error={shown("recipientName")}>
          <AppInput
            variant="outlined"
            icon="user"
            placeholder="Full name"
            value={recipientName}
            onChangeText={setRecipientName}
            autoCapitalize="words"
            textContentType="name"
            error={!!shown("recipientName")}
          />
        </FormField>

        <FormField label="Phone" error={shown("phone")}>
          <AppInput
            variant="outlined"
            icon="phone"
            placeholder="Phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            error={!!shown("phone")}
          />
        </FormField>

        <FormField label="Street address" error={shown("line1")}>
          <AppInput
            variant="outlined"
            icon="map-pin"
            placeholder="House number and street"
            value={line1}
            onChangeText={setLine1}
            autoCapitalize="words"
            textContentType="streetAddressLine1"
            error={!!shown("line1")}
          />
        </FormField>

        <FormField label="City" error={shown("city")}>
          <AppInput
            variant="outlined"
            icon="home"
            placeholder="City"
            value={city}
            onChangeText={setCity}
            autoCapitalize="words"
            textContentType="addressCity"
            error={!!shown("city")}
          />
        </FormField>

        <FormField label="State or region" error={shown("region")}>
          <AppInput
            variant="outlined"
            icon="map"
            placeholder="State or region"
            value={region}
            onChangeText={setRegion}
            autoCapitalize="words"
            textContentType="addressState"
            error={!!shown("region")}
          />
        </FormField>

        <FormField label="Postal code (optional)" error={shown("postalCode")}>
          <AppInput
            variant="outlined"
            icon="hash"
            placeholder="Postal code"
            value={postalCode}
            onChangeText={setPostalCode}
            autoCapitalize="characters"
            textContentType="postalCode"
            error={!!shown("postalCode")}
          />
        </FormField>

        {!initial?.isDefault && (
          <ToggleGroup>
            <ToggleRow
              label="Set as default address"
              value={isDefault}
              onValueChange={setIsDefault}
            />
          </ToggleGroup>
        )}

        {!!formError && (
          <AppText size={13} weight="semibold" color="danger" align="center">
            {formError}
          </AppText>
        )}

        {editing && (
          <Button
            label="Delete address"
            variant="outline"
            fullWidth={false}
            onPress={() => setConfirmDelete(true)}
          />
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button
          label={editing ? "Save Changes" : "Save Address"}
          size="lg"
          loading={save.isPending}
          onPress={handleSave}
        />
      </View>

      <ConfirmDialog
        visible={confirmDelete}
        title="Delete this address?"
        confirmLabel="Delete"
        destructive
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
      />
    </KeyboardAvoidingView>
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
      gap: 18,
    },
    chips: {
      flexDirection: "row",
      gap: 10,
    },
    footer: {
      paddingHorizontal: 20,
      paddingTop: 12,
    },
  });
