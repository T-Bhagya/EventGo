import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

export type CategoryChipProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
};

/**
 * CategoryChip - Pill chip used for event discovery & filter categories.
 */
export function CategoryChip({
  label,
  selected = false,
  onPress,
  iconName,
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
      {iconName ? (
        <Ionicons
          name={iconName}
          size={16}
          color={selected ? colors.white : colors.textSecondary}
          style={styles.icon}
        />
      ) : null}

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
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },

  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  chipUnselected: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },

  icon: {
    marginRight: 6,
  },

  label: {
    ...typography.bodyMedium,
    fontSize: 13.5,
    fontWeight: "500",
  },

  labelSelected: {
    color: colors.white,
    fontWeight: "600",
  },

  labelUnselected: {
    color: colors.textPrimary,
  },
});
