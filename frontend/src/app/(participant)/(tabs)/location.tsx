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
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AppButton from "../../../components/AppButton";
import SearchBar from "../../../components/SearchBar";
import { useNavScroll } from "../../../context/NavScrollContext";
import { EventItem, MOCK_EVENTS } from "../../../data/mockEvents";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { typography } from "../../../theme/typography";

export default function LocationScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "registered">("registered");
  const [selectedEventId, setSelectedEventId] = useState<string>("evt-101");
  const { onScroll, onScrollEnd } = useNavScroll();

  // Registered Events
  const registeredEvents = MOCK_EVENTS.filter(
    (e) => e.status === "registered" || e.id === "evt-101"
  );

  // Filter events based on active tab and search query
  const baseList = activeFilter === "registered" ? registeredEvents : MOCK_EVENTS;
  const filteredEvents = baseList.filter((e) => {
    const query = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(query) ||
      e.location.toLowerCase().includes(query) ||
      e.organizer.toLowerCase().includes(query)
    );
  });

  const selectedEvent =
    MOCK_EVENTS.find((e) => e.id === selectedEventId) || registeredEvents[0] || MOCK_EVENTS[0];

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
          <Text style={styles.title}>Event Locations & Map</Text>
          <Text style={styles.subtitle}>
            Find venues, registered event locations & directions
          </Text>
        </View>

        {/* Search Bar for Events & Locations */}
        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search event title, venue name, or hall..."
          />
        </View>

        {/* Filter Switcher: My Registered vs All Venues */}
        <View style={styles.filterRow}>
          <Pressable
            onPress={() => setActiveFilter("registered")}
            style={[
              styles.filterPill,
              activeFilter === "registered" && styles.filterPillActive,
            ]}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={14}
              color={activeFilter === "registered" ? colors.emerald : colors.textSecondary}
            />
            <Text
              style={[
                styles.filterPillText,
                activeFilter === "registered" && styles.filterPillTextActive,
              ]}
            >
              My Registered ({registeredEvents.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveFilter("all")}
            style={[
              styles.filterPill,
              activeFilter === "all" && styles.filterPillActive,
            ]}
          >
            <Ionicons
              name="map-outline"
              size={14}
              color={activeFilter === "all" ? colors.emerald : colors.textSecondary}
            />
            <Text
              style={[
                styles.filterPillText,
                activeFilter === "all" && styles.filterPillTextActive,
              ]}
            >
              All Venues ({MOCK_EVENTS.length})
            </Text>
          </Pressable>
        </View>

        {/* Interactive Map Visual Container */}
        <View style={styles.mapContainer}>
          <View style={styles.mapBackgroundPlaceholder}>
            {/* Map Grid Pattern Visual */}
            <View style={styles.mapGridLine1} />
            <View style={styles.mapGridLine2} />
            <View style={styles.mapRoad1} />
            <View style={styles.mapRoad2} />

            {/* Selected Location Marker Banner */}
            <View style={styles.mapActiveBanner}>
              <Ionicons name="location-sharp" size={18} color={colors.emerald} />
              <View style={{ flex: 1 }}>
                <Text style={styles.mapActiveTitle} numberOfLines={1}>
                  {selectedEvent.title}
                </Text>
                <Text style={styles.mapActiveSub} numberOfLines={1}>
                  {selectedEvent.location}
                </Text>
              </View>
              <Pressable
                onPress={() => handleEventPress(selectedEvent)}
                style={styles.mapDetailBtn}
              >
                <Text style={styles.mapDetailBtnText}>Details</Text>
              </Pressable>
            </View>

            {/* Map Pins for Events */}
            {MOCK_EVENTS.slice(0, 4).map((evt, idx) => {
              const isSelected = evt.id === selectedEvent.id;
              const isUserRegistered = evt.status === "registered" || evt.id === "evt-101";
              // Position mock pins across the map area
              const positions = [
                { top: "35%" as const, left: "25%" as const },
                { top: "45%" as const, left: "65%" as const },
                { top: "60%" as const, left: "38%" as const },
                { top: "25%" as const, left: "75%" as const },
              ];
              const pos = positions[idx % positions.length];

              return (
                <Pressable
                  key={evt.id}
                  onPress={() => setSelectedEventId(evt.id)}
                  style={[
                    styles.mapPin,
                    pos,
                    isSelected && styles.mapPinSelected,
                  ]}
                >
                  <Ionicons
                    name={isUserRegistered ? "ticket" : "location"}
                    size={16}
                    color={isSelected ? colors.white : colors.primary}
                  />
                  {isUserRegistered && <View style={styles.registeredDot} />}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Venue Location List Header */}
        <View style={styles.listHeader}>
          <Text style={styles.listHeaderTitle}>
            {activeFilter === "registered" ? "Registered Event Venues" : "Venue Locations"}
          </Text>
          <Text style={styles.listHeaderCount}>
            {filteredEvents.length} location{filteredEvents.length !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* Location & Venue Cards List */}
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          onScrollEndDrag={onScrollEnd}
          onMomentumScrollEnd={onScrollEnd}
          scrollEventThrottle={16}
          renderItem={({ item }) => {
            const isSelected = item.id === selectedEvent.id;
            const isRegistered = item.status === "registered" || item.id === "evt-101";

            return (
              <Pressable
                onPress={() => setSelectedEventId(item.id)}
                style={[
                  styles.venueCard,
                  isSelected && styles.venueCardSelected,
                ]}
              >
                <View style={styles.venueCardHeader}>
                  <View style={styles.venueBadgeRow}>
                    <Ionicons
                      name="location-sharp"
                      size={16}
                      color={colors.emerald}
                    />
                    <Text style={styles.venueName} numberOfLines={1}>
                      {item.location.split("•")[0].trim()}
                    </Text>
                  </View>

                  {isRegistered && (
                    <View style={styles.registeredBadge}>
                      <Text style={styles.registeredBadgeText}>Registered</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.eventTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.eventDate}>
                  {item.date} • {item.time}
                </Text>

                <View style={styles.addressBox}>
                  <Ionicons
                    name="navigate-outline"
                    size={14}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.fullAddress} numberOfLines={2}>
                    {item.location}
                  </Text>
                </View>

                <View style={styles.cardActionRow}>
                  <AppButton
                    title="Get Directions"
                    onPress={() => handleEventPress(item)}
                    style={styles.directionsBtn}
                  />
                  <Pressable
                    onPress={() => handleEventPress(item)}
                    style={styles.viewEventLink}
                  >
                    <Text style={styles.viewEventLinkText}>View Event</Text>
                    <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                  </Pressable>
                </View>
              </Pressable>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="map-outline" size={44} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No locations found</Text>
              <Text style={styles.emptySub}>
                Try adjusting your search term to find registered venues.
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
    marginBottom: spacing.xs,
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
    marginBottom: spacing.xs,
  },

  filterRow: {
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.screen,
    marginBottom: spacing.sm,
  },

  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
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
    fontWeight: "700",
  },

  mapContainer: {
    height: 170,
    marginHorizontal: spacing.screen,
    borderRadius: radius.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },

  mapBackgroundPlaceholder: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    position: "relative",
  },

  mapGridLine1: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "40%",
    width: 1,
    backgroundColor: "#E2E8F0",
  },

  mapGridLine2: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#E2E8F0",
  },

  mapRoad1: {
    position: "absolute",
    top: "30%",
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: "#CBD5E1",
    transform: [{ rotate: "-5deg" }],
  },

  mapRoad2: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "55%",
    width: 8,
    backgroundColor: "#CBD5E1",
  },

  mapActiveBanner: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  mapActiveTitle: {
    ...typography.label,
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: "700",
  },

  mapActiveSub: {
    ...typography.bodySmall,
    fontSize: 10.5,
    color: colors.textSecondary,
  },

  mapDetailBtn: {
    backgroundColor: colors.emerald,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },

  mapDetailBtnText: {
    ...typography.label,
    fontSize: 10.5,
    color: colors.white,
  },

  mapPin: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  mapPinSelected: {
    backgroundColor: colors.emerald,
    borderColor: colors.white,
    transform: [{ scale: 1.15 }],
  },

  registeredDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.emerald,
    borderWidth: 1.5,
    borderColor: colors.white,
  },

  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screen,
    marginBottom: spacing.xs,
  },

  listHeaderTitle: {
    ...typography.titleMedium,
    color: colors.textPrimary,
    fontWeight: "700",
  },

  listHeaderCount: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  listContent: {
    paddingHorizontal: spacing.screen,
    paddingBottom: 100, // Dock clearance
  },

  venueCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },

  venueCardSelected: {
    borderColor: colors.emerald,
    borderWidth: 1.5,
    backgroundColor: "#F0FDF4",
  },

  venueCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  venueBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },

  venueName: {
    ...typography.titleMedium,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "700",
  },

  registeredBadge: {
    backgroundColor: colors.emeraldSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },

  registeredBadgeText: {
    ...typography.label,
    fontSize: 10.5,
    color: colors.emerald,
    fontWeight: "600",
  },

  eventTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: 2,
  },

  eventDate: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 8,
  },

  addressBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: colors.surfaceSoft,
    padding: 8,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },

  fullAddress: {
    ...typography.bodySmall,
    fontSize: 11.5,
    color: colors.textSecondary,
    flex: 1,
  },

  cardActionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  directionsBtn: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    backgroundColor: colors.emerald,
  },

  viewEventLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  viewEventLinkText: {
    ...typography.label,
    fontSize: 12,
    color: colors.primary,
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
