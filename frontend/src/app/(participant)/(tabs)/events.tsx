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

export default function EventsHubScreen() {
  // Main view mode: "my_events" (shows segment bar) | "explore" (HIDES segment bar)
  const [viewMode, setViewMode] = useState<"my_events" | "explore">("my_events");
  // Sub-segment under my_events: "upcoming" | "past"
  const [activeSegment, setActiveSegment] = useState<"upcoming" | "past">("upcoming");
  
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>("All");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { onScroll, onScrollEnd } = useNavScroll();

  // User's registered upcoming events
  const registeredUpcomingEvents = MOCK_EVENTS.filter(
    (e) => e.status === "registered" || e.id === "evt-101"
  );
  // User's past attended events
  const pastAttendedEvents = MOCK_EVENTS.filter(
    (e) => e.status === "completed" || e.id === "evt-104"
  );

  // Filtered dataset based on current mode
  let displayedEvents: EventItem[] = [];
  if (viewMode === "explore") {
    displayedEvents = MOCK_EVENTS.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        selectedCategory === "All" || e.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  } else if (activeSegment === "upcoming") {
    displayedEvents = registeredUpcomingEvents.filter(
      (e) =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } else {
    displayedEvents = pastAttendedEvents.filter(
      (e) =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const handleEventPress = (event: EventItem) => {
    router.push({
      pathname: "/(participant)/event/[id]",
      params: { id: event.id },
    } as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* ═══════════════════════════════════════════════════════════════════
            § HEADER TOP BAR
            ═══════════════════════════════════════════════════════════════════ */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {viewMode === "explore" ? (
              <Pressable
                onPress={() => setViewMode("my_events")}
                style={({ pressed }) => [styles.headerBtn, pressed && styles.pressed]}
                accessibilityLabel="Back to My Events"
              >
                <Ionicons name="arrow-back" size={22} color="#111827" />
              </Pressable>
            ) : null}
            <Text style={styles.headerTitle}>
              {viewMode === "explore" ? "Explore Events" : "Events"}
            </Text>
          </View>

          <View style={styles.headerRight}>
            <Pressable
              onPress={() => setShowSearch((prev) => !prev)}
              style={({ pressed }) => [styles.headerBtn, pressed && styles.pressed]}
              accessibilityLabel="Search events"
            >
              <Ionicons
                name={showSearch ? "close" : "search-outline"}
                size={20}
                color="#111827"
              />
            </Pressable>

            <Pressable
              onPress={() =>
                setViewMode((prev) => (prev === "my_events" ? "explore" : "my_events"))
              }
              style={({ pressed }) => [styles.headerBtn, pressed && styles.pressed]}
              accessibilityLabel="Toggle mode"
            >
              <Ionicons name="ellipsis-vertical" size={20} color="#111827" />
            </Pressable>
          </View>
        </View>

        {/* Search Input Input */}
        {showSearch && (
          <View style={styles.searchBarWrap}>
            <Ionicons name="search-outline" size={18} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search event title or venue..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            § SEGMENTED PILL BAR — ONLY SHOWN IN MY EVENTS MODE
            (Hidden when user clicks EXPLORE EVENTS)
            ═══════════════════════════════════════════════════════════════════ */}
        {viewMode === "my_events" && (
          <View style={styles.segmentContainer}>
            <Pressable
              onPress={() => setActiveSegment("upcoming")}
              style={[
                styles.segmentTab,
                activeSegment === "upcoming" && styles.segmentTabActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  activeSegment === "upcoming" && styles.segmentTextActive,
                ]}
              >
                UPCOMING
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveSegment("past")}
              style={[
                styles.segmentTab,
                activeSegment === "past" && styles.segmentTabActive,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  activeSegment === "past" && styles.segmentTextActive,
                ]}
              >
                PAST EVENTS
              </Text>
            </Pressable>
          </View>
        )}

        {/* Category Filter Chips (Shown in Explore Mode) */}
        {viewMode === "explore" && (
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
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            § SCREEN CONTENT: EMPTY STATE vs EVENT LIST
            ═══════════════════════════════════════════════════════════════════ */}
        {viewMode === "my_events" &&
        activeSegment === "upcoming" &&
        registeredUpcomingEvents.length === 0 ? (
          /* ── EMPTY STATE (No Upcoming Registered Events) ─────────────── */
          <View style={styles.emptyView}>
            <View style={styles.illustrationCircle}>
              <View style={styles.calendarGraphicCard}>
                <View style={styles.calendarGraphicHeader}>
                  <View style={styles.calendarRingLeft} />
                  <View style={styles.calendarRingRight} />
                </View>
                <View style={styles.calendarGraphicBody}>
                  {[...Array(12)].map((_, i) => (
                    <View key={i} style={styles.calendarDot} />
                  ))}
                </View>
                <View style={styles.clockBadge}>
                  <Ionicons name="time" size={24} color="#F5B800" />
                </View>
              </View>
            </View>

            <Text style={styles.emptyTitle}>No Upcoming Event</Text>
            <Text style={styles.emptySubtitle}>
              You haven't registered for any upcoming events yet
            </Text>

            {/* Bottom CTA Button: EXPLORE EVENTS */}
            <View style={styles.exploreBtnContainer}>
              <Pressable
                onPress={() => setViewMode("explore")}
                style={({ pressed }) => [styles.exploreBtn, pressed && styles.exploreBtnPressed]}
                accessibilityRole="button"
                accessibilityLabel="Explore Events"
              >
                <Text style={styles.exploreBtnText}>EXPLORE EVENTS</Text>
                <View style={styles.exploreArrowCircle}>
                  <Ionicons name="arrow-forward" size={16} color="#000" />
                </View>
              </Pressable>
            </View>
          </View>
        ) : (
          /* ── EVENT CARDS LIST VIEW ────────────────────────────────────── */
          <FlatList
            data={displayedEvents}
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
                {/* Thumbnail Image */}
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.cardImage}
                  contentFit="cover"
                  transition={200}
                />

                {/* Right Info */}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardDate}>
                    {item.date} • {item.time.split("-")[0].trim()}
                  </Text>
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
              <View style={styles.listEmptyContainer}>
                <Ionicons name="calendar-outline" size={44} color="#9CA3AF" />
                <Text style={styles.listEmptyTitle}>
                  {activeSegment === "past"
                    ? "No past attended events"
                    : "No events found"}
                </Text>
                {viewMode === "my_events" && activeSegment === "upcoming" ? (
                  <Pressable
                    onPress={() => setViewMode("explore")}
                    style={{ marginTop: 12 }}
                  >
                    <Text style={styles.clearSearchText}>
                      EXPLORE EVENTS TO REGISTER
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            }
          />
        )}
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

  // ── Header Top Bar ────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },
  pressed: {
    opacity: 0.7,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  searchBarWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    marginHorizontal: 16,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },

  // ── Segmented Control Pill Bar ───────────────────────────────────────────
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 9999,
    padding: 4,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9999,
  },
  segmentTabActive: {
    backgroundColor: "#0A0A0C",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9CA3AF",
    letterSpacing: 0.5,
  },
  segmentTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  // Categories strip in Explore mode
  categoriesSection: {
    marginBottom: 12,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },

  // ── Empty State View ──────────────────────────────────────────────────────
  emptyView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: 80,
  },
  illustrationCircle: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  calendarGraphicCard: {
    width: 110,
    height: 100,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    overflow: "hidden",
  },
  calendarGraphicHeader: {
    height: 28,
    backgroundColor: "#EF4444",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    alignItems: "center",
  },
  calendarRingLeft: {
    width: 6,
    height: 10,
    borderRadius: 3,
    backgroundColor: "#93C5FD",
    marginTop: -8,
  },
  calendarRingRight: {
    width: 6,
    height: 10,
    borderRadius: 3,
    backgroundColor: "#93C5FD",
    marginTop: -8,
  },
  calendarGraphicBody: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    gap: 6,
    justifyContent: "center",
  },
  calendarDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#3B82F6",
  },
  clockBadge: {
    position: "absolute",
    bottom: -6,
    right: -6,
    backgroundColor: "#0A0A0C",
    borderRadius: 20,
    padding: 4,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 13.5,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },

  exploreBtnContainer: {
    position: "absolute",
    bottom: 88,
    left: 24,
    right: 24,
    alignItems: "center",
    zIndex: 10,
  },
  exploreBtn: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#0A0A0C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  exploreBtnPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  exploreBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.8,
  },
  exploreArrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5B800",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },

  // ── Event Cards List View ─────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
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
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
  },
  cardInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },
  cardDate: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D97706",
    marginBottom: 3,
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

  listEmptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  listEmptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
    marginTop: 12,
  },
  clearSearchText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#D97706",
    marginTop: 6,
  },
});
