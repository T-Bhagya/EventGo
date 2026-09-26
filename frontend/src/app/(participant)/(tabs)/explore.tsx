import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

import CategoryChip from "../../../components/CategoryChip";
import { useNavScroll } from "../../../context/NavScrollContext";
import {
  EventCategory,
  EventItem,
  MOCK_CATEGORIES,
  MOCK_EVENTS,
} from "../../../data/mockEvents";

export default function ExploreEventsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>("All");
  const [filterType, setFilterType] = useState<"all" | "free" | "virtual">("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
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
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore Events</Text>
        </View>

        {/* Search Bar Row with Integrated Filter Button */}
        <View style={styles.searchRow}>
          <View style={styles.searchBarWrap}>
            <Ionicons name="search-outline" size={18} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search event title or venue..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")} style={{ padding: 2 }}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </Pressable>
            )}
          </View>

          {/* Integrated Filter Button */}
          <Pressable
            onPress={() => setShowFilterMenu((prev) => !prev)}
            style={({ pressed }) => [
              styles.filterBtn,
              filterType !== "all" && styles.filterBtnActive,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Filter events"
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={filterType !== "all" ? "#FFFFFF" : "#111827"}
            />
            {filterType !== "all" && <View style={styles.activeFilterDot} />}
          </Pressable>
        </View>

        {/* Dropdown Filter Options inside Search Bar area */}
        {showFilterMenu && (
          <View style={styles.inlineFilterMenu}>
            <Text style={styles.filterMenuLabel}>Quick Filter:</Text>
            <View style={styles.filterMenuOptions}>
              <Pressable
                onPress={() => {
                  setFilterType("all");
                  setShowFilterMenu(false);
                }}
                style={[
                  styles.filterMenuOption,
                  filterType === "all" && styles.filterMenuOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterMenuOptionText,
                    filterType === "all" && styles.filterMenuOptionTextActive,
                  ]}
                >
                  All
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setFilterType("free");
                  setShowFilterMenu(false);
                }}
                style={[
                  styles.filterMenuOption,
                  filterType === "free" && styles.filterMenuOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterMenuOptionText,
                    filterType === "free" && styles.filterMenuOptionTextActive,
                  ]}
                >
                  Free Entry
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setFilterType("virtual");
                  setShowFilterMenu(false);
                }}
                style={[
                  styles.filterMenuOption,
                  filterType === "virtual" && styles.filterMenuOptionActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterMenuOptionText,
                    filterType === "virtual" && styles.filterMenuOptionTextActive,
                  ]}
                >
                  Virtual
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Category Scroll Strip */}
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

        {/* Event List */}
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
            <Pressable
              onPress={() => handleEventPress(item)}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              accessibilityRole="button"
              accessibilityLabel={`View ${item.title}`}
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.cardImage}
                contentFit="cover"
                transition={200}
              />

              <View style={styles.cardInfo}>
                <View style={styles.cardTopMeta}>
                  <Text style={styles.cardDate}>
                    {item.date} • {item.time.split("-")[0].trim()}
                  </Text>
                  <Text style={styles.cardPrice}>{item.price}</Text>
                </View>

                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.title}
                </Text>

                <View style={styles.cardLocationRow}>
                  <Ionicons name="location" size={13} color="#9CA3AF" />
                  <Text style={styles.cardLocationText} numberOfLines={1}>
                    {item.location}
                  </Text>
                </View>
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="compass-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No matching events found</Text>
              <Text style={styles.emptySub}>
                Try adjusting your search query or resetting category filters.
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
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  // ── Search Bar + Integrated Filter Button ────────────────────────────────
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 10,
  },
  searchBarWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },

  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterBtnActive: {
    backgroundColor: "#0A0A0C",
    borderColor: "#0A0A0C",
  },
  pressed: {
    opacity: 0.7,
  },
  activeFilterDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#F5B800",
  },

  // ── Inline Filter Menu ───────────────────────────────────────────────────
  inlineFilterMenu: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    marginHorizontal: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
    gap: 10,
  },
  filterMenuLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
  },
  filterMenuOptions: {
    flexDirection: "row",
    gap: 6,
    flex: 1,
  },
  filterMenuOption: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
    backgroundColor: "#E5E7EB",
  },
  filterMenuOptionActive: {
    backgroundColor: "#0A0A0C",
  },
  filterMenuOptionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },
  filterMenuOptionTextActive: {
    color: "#FFFFFF",
  },

  // ── Categories Section ───────────────────────────────────────────────────
  categoriesSection: {
    marginBottom: 12,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },

  // ── Event Cards List View ─────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 110,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    alignItems: "center",
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.94,
  },
  cardImage: {
    width: 84,
    height: 84,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
  },
  cardInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  cardTopMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  cardDate: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D97706",
  },
  cardPrice: {
    fontSize: 12,
    fontWeight: "800",
    color: "#0A0A0C",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 20,
    marginBottom: 4,
  },
  cardLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardLocationText: {
    fontSize: 12,
    color: "#6B7280",
    flex: 1,
  },

  emptyContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
  },
});
