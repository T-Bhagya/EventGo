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

export type FeaturedEventCardProps = {
  event: EventItem;
  onPress: (event: EventItem) => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * FeaturedEventCard - Premium hero carousel card for spotlight events.
 */
export function FeaturedEventCard({
  event,
  onPress,
  style,
}: FeaturedEventCardProps) {
  return (
    <Pressable
      onPress={() => onPress(event)}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`View featured event ${event.title}`}
    >
      <Image
        source={{ uri: event.imageUrl }}
        style={styles.image}
        contentFit="cover"
        transition={400}
      />

      {/* Subtle Gradient / Dark Overlay */}
      <View style={styles.overlay} />

      {/* Top Header Tags */}
      <View style={styles.topRow}>
        <View style={styles.featuredBadge}>
          <Ionicons name="sparkles" size={12} color={colors.gold} />
          <Text style={styles.featuredText}>FEATURED</Text>
        </View>

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>
      </View>

      {/* Bottom Content Info */}
      <View style={styles.bottomContent}>
        <Text style={styles.dateText}>
          {event.date} • {event.time.split("-")[0].trim()}
        </Text>

        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.locationGroup}>
            <Ionicons name="location" size={14} color="rgba(255,255,255,0.85)" />
            <Text style={styles.locationText} numberOfLines={1}>
              {event.location.split("•")[0].trim()}
            </Text>
          </View>

          <View style={styles.pricePill}>
            <Text style={styles.pricePillText}>{event.price}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default FeaturedEventCard;

const styles = StyleSheet.create({
  card: {
    width: 290,
    height: 320,
    borderRadius: radius.xl, // 24px
    overflow: "hidden",
    position: "relative",
    backgroundColor: colors.primary,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },

  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.96,
  },

  image: {
    ...StyleSheet.absoluteFill,
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(18, 19, 22, 0.45)",
  },

  topRow: {
    position: "absolute",
    top: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  featuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(18, 19, 22, 0.85)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: "rgba(191, 161, 95, 0.4)",
  },

  featuredText: {
    ...typography.label,
    fontSize: 10,
    color: colors.gold,
    letterSpacing: 0.8,
  },

  categoryBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
  },

  categoryText: {
    ...typography.label,
    fontSize: 11,
    color: colors.white,
  },

  bottomContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: "rgba(18, 19, 22, 0.75)",
  },

  dateText: {
    ...typography.label,
    fontSize: 11.5,
    color: colors.emeraldBright,
    letterSpacing: 0.4,
    marginBottom: 4,
  },

  title: {
    ...typography.titleLarge,
    fontSize: 18,
    lineHeight: 24,
    color: colors.white,
    marginBottom: 10,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  locationGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
    paddingRight: 8,
  },

  locationText: {
    ...typography.bodySmall,
    color: "rgba(255,255,255,0.9)",
  },

  pricePill: {
    backgroundColor: colors.emerald,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },

  pricePillText: {
    ...typography.label,
    fontSize: 11.5,
    color: colors.white,
    fontWeight: "700",
  },
});
