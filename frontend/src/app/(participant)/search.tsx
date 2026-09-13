import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import CategoryChip from "../../components/CategoryChip";
import EventCard from "../../components/EventCard";
import SearchBar from "../../components/SearchBar";
import {
  EventCategory,
  EventItem,
  MOCK_CATEGORIES,
  MOCK_EVENTS,
} from "../../data/mockEvents";
import { colors } from "../../theme/colors";
import { radius } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

export default function SearchResultsScreen() {
  const params = useLocalSearchParams<{ query?: string; category?: string }>();
  const [searchQuery, setSearchQuery] = useState(params.query || "");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>(
    (params.category as EventCategory) || "All"
  );
  const [filterType, setFilterType] = useState<"all" | "free" | "virtual">("all");

  const filteredEvents = MOCK_EVENTS.filter((e) => {
    const matchesCategory =
      selectedCategory === "All" || e.category === selectedCategory;
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      filterType === "all"
        ? true
        : filterType === "free"
        ? e.price === "Free"
        : e.isVirtual;
    return matchesCategory && matchesSearch && matchesType;
  });

  const handleEventPress = (event: EventItem) => {
    router.push({
      pathname: "/(participant)/event/[id]",
      params: { id: event.id },
    } as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Search Events</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Search Input Bar */}
        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search title, venue, organizer..."
            autoFocus
          />
        </View>

        {/* Filter Pills */}
        <View style={styles.filterPillsRow}>
          <Pressable
            onPress={() => setFilterType("all")}
            style={[
              styles.filterPill,
              filterType === "all" && styles.filterPillActive,
            ]}
          >
            <Text
              style={[
                styles.filterPillText,
                filterType === "all" && styles.filterPillTextActive,
              ]}
            >
              All Events
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setFilterType("free")}
            style={[
              styles.filterPill,
              filterType === "free" && styles.filterPillActive,
            ]}
          >
            <Text
              style={[
                styles.filterPillText,
                filterType === "free" && styles.filterPillTextActive,
              ]}
            >
              Free Entry
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setFilterType("virtual")}
            style={[
              styles.filterPill,
              filterType === "virtual" && styles.filterPillActive,
            ]}
          >
            <Text
              style={[
                styles.filterPillText,
                filterType === "virtual" && styles.filterPillTextActive,
              ]}
            >
              Virtual
            </Text>
          </Pressable>
        </View>

        {/* Categories Horizontal Scroll */}
        <View style={styles.categoriesSection}>
          <FlatList
            horizontal
            data={MOCK_CATEGORIES}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
            renderItem={({ item }) => (
              <CategoryChip
                label={item}
                selected={selectedCategory === item}
                onPress={() => setSelectedCategory(item)}
              />
            )}
          />
        </View>

        {/* Search Results List */}
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <EventCard event={item} onPress={handleEventPress} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No matching events found</Text>
              <Text style={styles.emptySub}>
                Try searching for a different keyword or clearing category filters.
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flex: 1,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xs,
    marginBottom: spacing.sm,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  pressed: {
    opacity: 0.7,
  },

  headerTitle: {
    ...typography.titleLarge,
    fontSize: 18,
    color: colors.textPrimary,
  },

  searchSection: {
    paddingHorizontal: spacing.screen,
    marginBottom: spacing.sm,
  },

  filterPillsRow: {
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.screen,
    marginBottom: spacing.sm,
  },

  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  filterPillActive: {
    backgroundColor: colors.emeraldSoft,
    borderColor: "rgba(15, 118, 110, 0.3)",
  },

  filterPillText: {
    ...typography.label,
    fontSize: 12,
    color: colors.textSecondary,
  },

  filterPillTextActive: {
    color: colors.emerald,
    fontWeight: "600",
  },

  categoriesSection: {
    marginBottom: spacing.sm,
  },

  categoryScroll: {
    paddingHorizontal: spacing.screen,
    gap: spacing.sm,
  },

  listContent: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xl,
  },

  emptyContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.md,
  },

  emptyTitle: {
    ...typography.titleMedium,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },

  emptySub: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
});
