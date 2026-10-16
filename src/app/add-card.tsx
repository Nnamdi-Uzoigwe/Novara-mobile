import { useTheme } from "@/core/theme/ThemeProvider";
import type { ThemeColors } from "@/core/theme/colors";
import {
    brandTitle,
    detectBrand,
    formatCardNumber,
    formatExpiry,
    isExpiryValid,
    onlyDigits,
    passesLuhn,
} from "@/features/checkout/utils/card";
import { AppInput } from "@/shared/components/AppInput";
import { AppText } from "@/shared/components/AppText";
import { Button } from "@/shared/components/Button";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { usePaymentStore } from "@/store/paymentStore";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddCardScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const addMethod = usePaymentStore((s) => s.addMethod);

  // Raw card details live only in this screen's state and are discarded after saving
  const [number, setNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const digits = onlyDigits(number);

  const errors = {
    number: passesLuhn(digits) ? "" : "Enter a valid card number",
    holder: holder.trim().length >= 2 ? "" : "Enter the name on the card",
    expiry: isExpiryValid(expiry) ? "" : "Enter a valid date (MM/YY)",
    cvv: /^\d{3,4}$/.test(cvv) ? "" : "Enter the 3 or 4 digit code",
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleAdd = () => {
    setSubmitted(true);
    if (hasErrors) return;

    const type = detectBrand(digits);
    // TODO: send the card to your payment provider here and keep only the token it returns
    addMethod({
      id: `card-${Date.now()}`,
      type,
      title: brandTitle(type),
      detail: `**** **** **** ${digits.slice(-4)}`,
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScreenHeader title="Add New Card" />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <Field label="Card Number" error={submitted ? errors.number : ""}>
          <AppInput
            icon="credit-card"
            placeholder="Enter Card Number"
            value={number}
            onChangeText={(v) => setNumber(formatCardNumber(v))}
            keyboardType="number-pad"
            maxLength={23}
            textContentType="creditCardNumber"
            autoComplete="cc-number"
            error={submitted && !!errors.number}
          />
        </Field>

        <Field label="Card Holder Name" error={submitted ? errors.holder : ""}>
          <AppInput
            icon="user"
            placeholder="Enter Holder Name"
            value={holder}
            onChangeText={setHolder}
            autoCapitalize="words"
            textContentType="name"
            autoComplete="name"
            error={submitted && !!errors.holder}
          />
        </Field>

        <Field label="Expired" error={submitted ? errors.expiry : ""}>
          <AppInput
            icon="calendar"
            placeholder="MM/YY"
            value={expiry}
            onChangeText={(v) => setExpiry(formatExpiry(v))}
            keyboardType="number-pad"
            maxLength={5}
            autoComplete="cc-exp"
            error={submitted && !!errors.expiry}
          />
        </Field>

        <Field label="CVV Code" error={submitted ? errors.cvv : ""}>
          <AppInput
            icon="lock"
            placeholder="CVV"
            value={cvv}
            onChangeText={(v) => setCvv(onlyDigits(v).slice(0, 4))}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
            autoComplete="cc-csc"
            error={submitted && !!errors.cvv}
          />
        </Field>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Button label="Add Card" size="lg" onPress={handleAdd} />
      </View>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={fieldStyles.field}>
      <AppText size={16} weight="bold">
        {label}
      </AppText>
      {children}
      {!!error && (
        <AppText size={12} weight="semibold" color="danger">
          {error}
        </AppText>
      )}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  field: {
    gap: 8,
  },
});

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 24,
      gap: 20,
    },
    footer: {
      paddingHorizontal: 20,
      paddingTop: 12,
    },
  });
