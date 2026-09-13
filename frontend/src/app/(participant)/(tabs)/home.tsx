import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import CategoryChip from "../../../components/CategoryChip";
import EventCard from "../../../components/EventCard";
import FeaturedEventCard from "../../../components/FeaturedEventCard";
import SectionHeader from "../../../components/SectionHeader";
import { useNavScroll } from "../../../context/NavScrollContext";
import {
  EventCategory,
  EventItem,
  MOCK_CATEGORIES,
  MOCK_EVENTS,
} from "../../../data/mockEvents";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { typography } from "../../../theme/typography";

export default function ParticipantHomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>("All");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(["evt-102"]);
  const { onScroll, onScrollEnd } = useNavScroll();

  const featuredEvents = MOCK_EVENTS.filter((e) => e.featured);
  const recommendedEvents = MOCK_EVENTS.filter((e) => e.rating && e.rating >= 4.8);
  const upcomingEvents = MOCK_EVENTS.filter((e) => e.status === "upcoming");
  const trendingEvents = MOCK_EVENTS.filter((e) => e.attendeesCount > 300);

  const toggleBookmark = (event: EventItem) => {
    setBookmarkedIds((prev) =>
      prev.includes(event.id)
        ? prev.filter((id) => id !== event.id)
        : [...prev, event.id]
    );
  };

  const handleEventPress = (event: EventItem) => {
    router.push({
      pathname: "/(participant)/event/[id]",
      params: { id: event.id },
    } as any);
  };

  const handleOpenSearch = (initialCategory?: string) => {
    router.push({
      pathname: "/(participant)/search",
      params: initialCategory ? { category: initialCategory } : undefined,
    } as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        onScrollEndDrag={onScrollEnd}
        onMomentumScrollEnd={onScrollEnd}
        scrollEventThrottle={16}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={colors.emerald} />
              <Text style={styles.locationText}>San Francisco, CA</Text>
              <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
            </View>
            <Text style={styles.greetingTitle}>Discover Events</Text>
          </View>

          <Pressable
            onPress={() => router.push("/(participant)/notifications" as any)}
            style={({ pressed }) => [
              styles.iconCircle,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color={colors.textPrimary}
            />
            <View style={styles.unreadDot} />
          </Pressable>
        </View>

        {/* Large Floating Search Bar Trigger */}
        <View style={styles.searchSection}>
          <Pressable
            onPress={() => handleOpenSearch()}
            style={({ pressed }) => [
              styles.largeFloatingSearchBar,
              pressed && styles.searchBarPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Search events"
          >
            <Ionicons
              name="search-outline"
              size={22}
              color={colors.emerald}
              style={styles.searchIcon}
            />
            <Text style={styles.searchPlaceholderText}>
              Search title, venue, organizer, or category...
            </Text>
            <View style={styles.filterIconButton}>
              <Ionicons name="options-outline" size={18} color={colors.primary} />
            </View>
          </Pressable>
        </View>

        {/* Weather Card Summary */}
        <View style={styles.weatherCard}>
          <View style={styles.weatherLeft}>
            <Ionicons name="sunny" size={24} color={colors.gold} />
            <View>
              <Text style={styles.weatherTemp}>72°F • Clear Sky</Text>
              <Text style={styles.weatherSub}>Great weather for campus events</Text>
            </View>
          </View>
          <View style={styles.weatherBadge}>
            <Text style={styles.weatherBadgeText}>Ideal Outdoor</Text>
          </View>
        </View>

        {/* Categories Bar */}
        <View style={styles.sectionHeaderMargin}>
          <SectionHeader title="Categories" />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {MOCK_CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              selected={selectedCategory === cat}
              onPress={() => {
                setSelectedCategory(cat);
                if (cat !== "All") {
                  handleOpenSearch(cat);
                }
              }}
            />
          ))}
        </ScrollView>

        {/* Featured Events Spotlight Carousel */}
        <View style={styles.section}>
          <SectionHeader
            title="Featured Spotlight"
            subtitle="Handpicked premium campus events"
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {featuredEvents.map((evt) => (
              <FeaturedEventCard
                key={evt.id}
                event={evt}
                onPress={handleEventPress}
              />
            ))}
          </ScrollView>
        </View>

        {/* Recommended Events */}
        <View style={styles.section}>
          <SectionHeader
            title="Recommended For You"
            actionText="Search All"
            onActionPress={() => handleOpenSearch()}
          />
          {recommendedEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onPress={handleEventPress}
              onBookmarkPress={toggleBookmark}
              isBookmarked={bookmarkedIds.includes(evt.id)}
            />
          ))}
        </View>

        {/* Trending Events Section */}
        <View style={styles.section}>
          <SectionHeader
            title="Trending & Popular"
            subtitle="High registration demand this week"
          />
          {trendingEvents.map((evt) => (
            <EventCard
              key={`trending-${evt.id}`}
              event={evt}
              onPress={handleEventPress}
              onBookmarkPress={toggleBookmark}
              isBookmarked={bookmarkedIds.includes(evt.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingBottom: 110, // Clearance for floating dock
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xs,
    marginBottom: spacing.md,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },

  locationText: {
    ...typography.label,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600",
  },

  greetingTitle: {
    ...typography.headlineLarge,
    fontSize: 26,
    color: colors.textPrimary,
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  pressed: {
    opacity: 0.7,
  },

  unreadDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.emeraldBright,
  },

  searchSection: {
    paddingHorizontal: spacing.screen,
    marginBottom: spacing.md,
  },

  largeFloatingSearchBar: {
    height: 54,
    backgroundColor: colors.surface,
    borderRadius: radius.xl, // 24px floating search bar
    borderWidth: 1.5,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },

  searchBarPressed: {
    transform: [{ scale: 0.985 }],
    borderColor: colors.primary,
  },

  searchIcon: {
    marginRight: 10,
  },

  searchPlaceholderText: {
    flex: 1,
    ...typography.bodyMedium,
    fontSize: 14.5,
    color: colors.textMuted,
  },

  filterIconButton: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },

  weatherCard: {
    marginHorizontal: spacing.screen,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  weatherLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  weatherTemp: {
    ...typography.titleMedium,
    fontSize: 13.5,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  weatherSub: {
    ...typography.bodySmall,
    fontSize: 11.5,
    color: colors.textSecondary,
  },

  weatherBadge: {
    backgroundColor: colors.emeraldSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
  },

  weatherBadgeText: {
    ...typography.label,
    fontSize: 10.5,
    color: colors.emerald,
  },

  sectionHeaderMargin: {
    paddingHorizontal: spacing.screen,
    marginBottom: 4,
  },

  categoryScroll: {
    paddingHorizontal: spacing.screen,
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },

  section: {
    paddingHorizontal: spacing.screen,
    marginTop: spacing.sm,
  },

  featuredScroll: {
    gap: spacing.md,
    paddingRight: spacing.screen,
    paddingBottom: spacing.md,
  },
});
