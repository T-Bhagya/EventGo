import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
} from "react-native";

import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { typography } from "../theme/typography";

export type SecondaryButtonProps = {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
};

/**
 * SecondaryButton - A minimal, high-end outlined action button for EventGo.
 * Used for secondary actions (e.g., Cancel, Back, View Details).
 */
export function SecondaryButton({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
}: SecondaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        !disabled && pressed && styles.pressed,
        style,
      ]}
    >
      <Text style={[styles.text, disabled && styles.disabledText, textStyle]}>
        {title}
      </Text>
    </Pressable>
  );
}

export default SecondaryButton;

const styles = StyleSheet.create({
  button: {
    height: 48,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  disabled: {
    opacity: 0.5,
    borderColor: colors.borderSoft,
  },

  disabledText: {
    color: colors.textMuted,
  },

  pressed: {
    backgroundColor: colors.surfaceSoft,
    borderColor: colors.primary,
    transform: [{ scale: 0.985 }],
  },

  text: {
    color: colors.primary,
    ...typography.titleMedium,
  },
});
