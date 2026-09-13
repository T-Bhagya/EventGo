import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { typography } from "../theme/typography";

export type EventStatus =
  | "upcoming"
  | "ongoing"
  | "live"
  | "completed"
  | "cancelled"
  | "registered"
  | "draft";

export type StatusBadgeProps = {
  status: EventStatus;
  label?: string;
  showDot?: boolean;
  style?: StyleProp<ViewStyle>;
};

const STATUS_CONFIG: Record<
  EventStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  upcoming: {
    label: "Upcoming",
    bg: colors.emeraldSoft,
    text: colors.emerald,
    dot: colors.emerald,
  },
  ongoing: {
    label: "Live Now",
    bg: "#FFF7ED",
    text: "#C2410C",
    dot: "#EA580C",
  },
  live: {
    label: "Live Now",
    bg: "#FFF7ED",
    text: "#C2410C",
    dot: "#EA580C",
  },
  registered: {
    label: "Registered",
    bg: colors.emeraldSoft,
    text: colors.emerald,
    dot: colors.emeraldBright,
  },
  completed: {
    label: "Completed",
    bg: colors.surfaceSoft,
    text: colors.textSecondary,
    dot: colors.textMuted,
  },
  cancelled: {
    label: "Cancelled",
    bg: colors.errorSoft,
    text: colors.error,
    dot: colors.error,
  },
  draft: {
    label: "Draft",
    bg: colors.surfaceSoft,
    text: colors.textMuted,
    dot: colors.textMuted,
  },
};

/**
 * StatusBadge - High-end pill status badge for events and registration states.
 */
export function StatusBadge({
  status,
  label,
  showDot = true,
  style,
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.upcoming;
  const displayText = label || config.label;

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, style]}>
      {showDot ? (
        <View style={[styles.dot, { backgroundColor: config.dot }]} />
      ) : null}
      <Text style={[styles.text, { color: config.text }]}>{displayText}</Text>
    </View>
  );
}

export default StatusBadge;

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: "flex-start",
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },

  text: {
    ...typography.label,
    fontSize: 11.5,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
