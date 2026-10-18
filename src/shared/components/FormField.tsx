import { AppText } from "@/shared/components/AppText";
import React from "react";
import { StyleSheet, View } from "react-native";

type FormFieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <View style={styles.field}>
      <AppText size={18} weight="bold">
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

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
});
