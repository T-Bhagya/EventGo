import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { typography } from "../theme/typography";

export type CategoryChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * CategoryChip — Fully-rounded capsule pill for category filtering.
 *
 * Active   → Solid amber fill (#F5B800), bold black text centered.
 * Inactive → White fill, subtle grey border, centered dark text.
 */
export function CategoryChip({
  label,
  selected = false,
  onPress,
  style,
}: CategoryChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.chipSelected : styles.chipUnselected,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          selected ? styles.labelSelected : styles.labelUnselected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default CategoryChip;

const styles = StyleSheet.create({
  chip: {
    height: 38,
    borderRadius: radius.full,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },

  chipSelected: {
    backgroundColor: colors.amber,
    borderColor: colors.amber,
    borderWidth: 1,
    shadowColor: colors.amber,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },

  chipUnselected: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },

  label: {
    ...typography.bodyMedium,
    fontSize: 13.5,
    fontWeight: "600",
    textAlign: "center",
  },

  labelSelected: {
    color: "#000000",
    fontWeight: "700",
  },

  labelUnselected: {
    color: "#1E293B",
  },
});
