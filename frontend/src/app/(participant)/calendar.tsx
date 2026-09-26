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
import { Image } from "expo-image";

import { EventItem, MOCK_EVENTS } from "../../data/mockEvents";

export default function CalendarScreen() {
  const [selectedDay, setSelectedDay] = useState<number>(10);
  const [currentMonth, setCurrentMonth] = useState<string>("October 2026");
  const [selectedFilter, setSelectedFilter] = useState<string>("All Events");

  // Dates with registered events (10, 12, 15, 18, 24)
  const registeredDates = [10, 12, 15, 18, 24];

  // Map of events per day
  const eventsMap: Record<number, EventItem[]> = {
    10: [
      {
        id: "evt-102",
        title: "Food Competition Event",
        organizer: "Creative Collective SL",
        category: "Music",
        date: "Oct 10, 2026",
        time: "07:00 PM - 10:00 PM",
        location: "Mirpur, Dhaka",
        price: "Rs. 1,500",
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
        description: "Annual food and culinary competition with live music performances.",
        attendeesCount: 185,
        maxCapacity: 200,
        status: "registered",
      },
      {
        id: "evt-101",
        title: "Basketball Final Match",
        organizer: "SLIIT Sports Hub",
        category: "Sports",
        date: "Oct 10, 2026",
        time: "04:00 PM - 07:00 PM",
        location: "Uttara, Dhaka",
        price: "Free",
        imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80",
        description: "Championship final basketball match between top campus teams.",
        attendeesCount: 420,
        maxCapacity: 500,
        status: "registered",
      },
    ],
    12: [
      MOCK_EVENTS[2], // Minimal Systems & UI Workshop
    ],
    15: [
      MOCK_EVENTS[3], // Sunset Artisan Food Fair
    ],
    18: [
      MOCK_EVENTS[4], // Global Student Pitchfest
    ],
    24: [
      MOCK_EVENTS[0], // AI & Future Tech Summit
    ],
  };

  const currentEvents = eventsMap[selectedDay] || [];

  const handleEventPress = (event: EventItem) => {
    router.push({
      pathname: "/(participant)/event/[id]",
      params: { id: event.id },
    } as any);
  };

  // Calendar Days Array (1..31)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* ── § 1. HEADER TOP BAR ───────────────────────────────────────── */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </Pressable>

          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>Calendar</Text>
            <Ionicons name="caret-up" size={14} color="#111827" />
          </View>

          <Pressable
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
            accessibilityLabel="Options"
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#111827" />
          </Pressable>
        </View>

        {/* ── § 2. FILTER CONTROLS BAR ──────────────────────────────────── */}
        <View style={styles.filterRow}>
          <Pressable style={styles.filterDropdown}>
            <Text style={styles.filterDropdownText}>{selectedFilter}</Text>
            <Ionicons name="chevron-down" size={14} color="#6B7280" />
          </Pressable>

          <Pressable style={styles.filterBtn}>
            <Ionicons name="options-outline" size={16} color="#374151" />
            <Text style={styles.filterBtnText}>Filter</Text>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* ── § 3. CALENDAR CARD VIEW ──────────────────────────────────── */}
          <View style={styles.calendarCard}>
            {/* Month Header & Controls */}
            <View style={styles.monthHeader}>
              <Text style={styles.monthTitle}>{currentMonth}</Text>
              <View style={styles.monthNav}>
                <Pressable style={styles.monthNavBtn}>
                  <Ionicons name="chevron-back" size={16} color="#9CA3AF" />
                </Pressable>
                <Pressable style={styles.monthNavBtn}>
                  <Ionicons name="chevron-forward" size={16} color="#F5B800" />
                </Pressable>
              </View>
            </View>

            {/* Weekday Headers */}
            <View style={styles.weekRow}>
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                <Text key={day} style={styles.weekText}>
                  {day}
                </Text>
              ))}
            </View>

            {/* Days Grid (7 columns) */}
            <View style={styles.daysGrid}>
              {daysInMonth.map((day) => {
                const isSelected = selectedDay === day;
                const hasRegisteredEvent = registeredDates.includes(day);

                return (
                  <Pressable
                    key={day}
                    onPress={() => setSelectedDay(day)}
                    style={styles.dayCell}
                  >
                    <View
                      style={[
                        styles.dayNumberCircle,
                        isSelected && styles.dayNumberSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          isSelected && styles.dayTextSelected,
                        ]}
                      >
                        {day}
                      </Text>
                    </View>

                    {/* Golden Yellow Dot under registered event dates */}
                    {hasRegisteredEvent && (
                      <View
                        style={[
                          styles.yellowDot,
                          isSelected && styles.yellowDotActive,
                        ]}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* ── § 4. REGISTERED EVENTS FOR SELECTED DATE ─────────────────── */}
          <View style={styles.eventsSection}>
            <View style={styles.dateHeadingRow}>
              <View style={styles.dateBadgeBox}>
                <Text style={styles.dateBadgeMonth}>Oct</Text>
                <Text style={styles.dateBadgeDay}>{selectedDay}</Text>
              </View>

              <Text style={styles.dateHeadingText}>
                WED, {selectedDay}TH OCTOBER, 2026
              </Text>
            </View>

            {/* List of Registered Events for selected date */}
            {currentEvents.length > 0 ? (
              currentEvents.map((evt) => (
                <Pressable
                  key={evt.id}
                  onPress={() => handleEventPress(evt)}
                  style={({ pressed }) => [
                    styles.eventCard,
                    pressed && styles.eventCardPressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`View ${evt.title}`}
                >
                  <Image
                    source={{ uri: evt.imageUrl }}
                    style={styles.eventImage}
                    contentFit="cover"
                  />

                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle} numberOfLines={1}>
                      {evt.title}
                    </Text>

                    <View style={styles.eventSubRow}>
                      <Text style={styles.eventDateText}>
                        {selectedDay} October, 26
                      </Text>
                      <View style={styles.orangeDot} />
                      <Text style={styles.eventLocationText} numberOfLines={1}>
                        {evt.location.split("•")[0].trim()}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))
            ) : (
              <View style={styles.emptyEventsBox}>
                <Ionicons name="calendar-outline" size={36} color="#9CA3AF" />
                <Text style={styles.emptyEventsText}>
                  No registered events for October {selectedDay}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  // ── Header Top Bar ────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },

  // ── Filter Controls Row ───────────────────────────────────────────────────
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterDropdown: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterDropdownText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#374151",
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterBtnText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#374151",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  // ── Calendar Card View ─────────────────────────────────────────────────────
  calendarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  monthNavBtn: {
    padding: 4,
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  weekText: {
    width: "14%",
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
  },

  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 4,
  },
  dayNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dayNumberSelected: {
    backgroundColor: "#F5B800", // Golden Yellow active highlight
  },
  dayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  dayTextSelected: {
    color: "#000000",
    fontWeight: "800",
  },

  // Golden Yellow Dot under dates with registered events
  yellowDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#F5B800",
    position: "absolute",
    bottom: 2,
  },
  yellowDotActive: {
    backgroundColor: "#000000",
  },

  // ── Registered Events Section at Bottom ───────────────────────────────────
  eventsSection: {
    gap: 12,
  },
  dateHeadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  dateBadgeBox: {
    backgroundColor: "#FFFDF0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(245, 184, 0, 0.4)",
  },
  dateBadgeMonth: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#D97706",
  },
  dateBadgeDay: {
    fontSize: 16,
    fontWeight: "800",
    color: "#D97706",
    lineHeight: 18,
  },
  dateHeadingText: {
    fontSize: 12.5,
    fontWeight: "800",
    color: "#6B7280",
    letterSpacing: 0.8,
  },

  eventCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  eventCardPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.94,
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
  },
  eventInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  eventSubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  eventDateText: {
    fontSize: 11.5,
    color: "#9CA3AF",
    fontWeight: "600",
  },
  orangeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#F5B800",
  },
  eventLocationText: {
    fontSize: 11.5,
    color: "#6B7280",
    fontWeight: "600",
    flex: 1,
  },

  emptyEventsBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    marginTop: 4,
  },
  emptyEventsText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 8,
  },
});
