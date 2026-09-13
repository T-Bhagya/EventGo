import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

export type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionText?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * SectionHeader - Minimalist section title with optional action button ("See All").
 */
export function SectionHeader({
  title,
  subtitle,
  actionText,
  onActionPress,
  style,
}: SectionHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.textColumn}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {actionText && onActionPress ? (
        <Pressable
          onPress={onActionPress}
          style={({ pressed }) => [pressed && styles.pressed]}
          accessibilityRole="button"
        >
          <Text style={styles.actionText}>{actionText}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export default SectionHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  textColumn: {
    flex: 1,
    paddingRight: 12,
  },

  title: {
    ...typography.titleLarge,
    fontSize: 19,
    color: colors.textPrimary,
  },

  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },

  actionText: {
    ...typography.titleMedium,
    fontSize: 13.5,
    fontWeight: "600",
    color: colors.emerald,
  },

  pressed: {
    opacity: 0.6,
  },
});
