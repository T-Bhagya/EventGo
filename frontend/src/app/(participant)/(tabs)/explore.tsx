import React, { useState } from "react";
import {
  FlatList,
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
import SearchBar from "../../../components/SearchBar";
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

export default function ExploreEventsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>("All");
  const [filterType, setFilterType] = useState<"all" | "free" | "virtual">("all");
  const { onScroll, onScrollEnd } = useNavScroll();

  const filteredEvents = MOCK_EVENTS.filter((e) => {
    const matchesCategory =
      selectedCategory === "All" || e.category === selectedCategory;
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Explore & Search</Text>
          <Text style={styles.subtitle}>
            Find academic, social and technical events across campus
          </Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search title, venue, campus..."
          />
        </View>

        {/* Quick Filter Pill Options */}
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

        {/* Categories Bar */}
        <View style={styles.categoriesSection}>
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
                onPress={() => setSelectedCategory(cat)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Results List */}
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          onScrollEndDrag={onScrollEnd}
          onMomentumScrollEnd={onScrollEnd}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <EventCard event={item} onPress={handleEventPress} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="compass-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No matching events</Text>
              <Text style={styles.emptySub}>
                Try adjusting your search criteria or changing category filters.
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

  header: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xs,
    marginBottom: spacing.md,
  },

  title: {
    ...typography.headlineLarge,
    color: colors.textPrimary,
  },

  subtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: 2,
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
    paddingBottom: 100, // Clearance for floating dock
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
