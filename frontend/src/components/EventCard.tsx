import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

import { EventItem } from "../data/mockEvents";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import StatusBadge from "./StatusBadge";

export type EventCardProps = {
  event: EventItem;
  onPress: (event: EventItem) => void;
  onBookmarkPress?: (event: EventItem) => void;
  isBookmarked?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * EventCard - Minimalist card component for standard event list displays.
 */
export function EventCard({
  event,
  onPress,
  onBookmarkPress,
  isBookmarked = false,
  style,
}: EventCardProps) {
  return (
    <Pressable
      onPress={() => onPress(event)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${event.title}`}
    >
      {/* Image Thumbnail */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: event.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={300}
        />

        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>

        {onBookmarkPress ? (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onBookmarkPress(event);
            }}
            style={({ pressed: bookmarkPressed }) => [
              styles.bookmarkButton,
              bookmarkPressed && styles.bookmarkPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Bookmark event"
          >
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={18}
              color={isBookmarked ? colors.emerald : colors.textPrimary}
            />
          </Pressable>
        ) : null}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <StatusBadge status={event.status} showDot={false} />
          <Text style={styles.priceText}>{event.price}</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        <Text style={styles.organizerText} numberOfLines={1}>
          {event.organizer}
        </Text>

        <View style={styles.footerRow}>
          <View style={styles.infoGroup}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={styles.infoText} numberOfLines={1}>
              {event.date}
            </Text>
          </View>

          <View style={styles.infoGroup}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={styles.infoText} numberOfLines={1}>
              {event.location.split("•")[0].trim()}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default EventCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: spacing.md,
  },

  pressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.95,
  },

  imageContainer: {
    width: "100%",
    height: 155,
    backgroundColor: colors.surfaceSoft,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  categoryTag: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(18, 19, 22, 0.75)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },

  categoryText: {
    ...typography.label,
    fontSize: 11,
    color: colors.white,
    letterSpacing: 0.3,
  },

  bookmarkButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  bookmarkPressed: {
    transform: [{ scale: 0.9 }],
  },

  content: {
    padding: spacing.md,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  priceText: {
    ...typography.titleMedium,
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },

  title: {
    ...typography.titleLarge,
    fontSize: 16.5,
    lineHeight: 22,
    color: colors.textPrimary,
    marginBottom: 4,
  },

  organizerText: {
    ...typography.bodySmall,
    fontSize: 12.5,
    color: colors.textSecondary,
    marginBottom: 12,
  },

  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },

  infoGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 1,
  },

  infoText: {
    ...typography.bodySmall,
    fontSize: 12,
    color: colors.textSecondary,
  },
});
