import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AppButton from "../../../components/AppButton";
import EventCard from "../../../components/EventCard";
import StatusBadge from "../../../components/StatusBadge";
import { EventItem, MOCK_EVENTS } from "../../../data/mockEvents";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { typography } from "../../../theme/typography";

export default function MyEventsScreen() {
  const [activeTab, setActiveTab] = useState<"registered" | "past" | "saved">(
    "registered"
  );

  const registeredEvents = MOCK_EVENTS.filter(
    (e) => e.status === "registered" || e.id === "evt-101"
  );
  const pastEvents = MOCK_EVENTS.filter((e) => e.status === "completed");
  const savedEvents = MOCK_EVENTS.filter((e) => e.id === "evt-102");

  const displayEvents =
    activeTab === "registered"
      ? registeredEvents
      : activeTab === "past"
      ? pastEvents
      : savedEvents;

  const handleEventPress = (event: EventItem) => {
    router.push({
      pathname: "/(participant)/event/[id]",
      params: { id: event.id },
    } as any);
  };

  const handleCheckInPress = (event: EventItem) => {
    router.push({
      pathname: "/(participant)/event/check-in",
      params: { id: event.id, pinCode: event.pinCode },
    } as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Events & Passes</Text>
          <Text style={styles.subtitle}>
            Manage registered tickets, QR check-in & saved events
          </Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <Pressable
            onPress={() => setActiveTab("registered")}
            style={[
              styles.tabButton,
              activeTab === "registered" && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "registered" && styles.tabTextActive,
              ]}
            >
              Registered ({registeredEvents.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("saved")}
            style={[
              styles.tabButton,
              activeTab === "saved" && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "saved" && styles.tabTextActive,
              ]}
            >
              Saved ({savedEvents.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("past")}
            style={[
              styles.tabButton,
              activeTab === "past" && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "past" && styles.tabTextActive,
              ]}
            >
              History
            </Text>
          </Pressable>
        </View>

        {/* Event List */}
        <FlatList
          data={displayEvents}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.ticketCardWrapper}>
              <EventCard event={item} onPress={handleEventPress} />

              {/* Quick Check-in Banner for registered events */}
              {activeTab === "registered" ? (
                <View style={styles.checkInActionRow}>
                  <View style={styles.ticketPinGroup}>
                    <Ionicons name="key-outline" size={16} color={colors.emerald} />
                    <Text style={styles.ticketPinLabel}>PIN: </Text>
                    <Text style={styles.ticketPinValue}>
                      {item.pinCode || "4892"}
                    </Text>
                  </View>

                  <AppButton
                    title="Check-In UI"
                    onPress={() => handleCheckInPress(item)}
                    style={styles.checkInButton}
                  />
                </View>
              ) : null}
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="ticket-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No events in this list</Text>
              <Text style={styles.emptySub}>
                Explore upcoming campus events and register to view passes here.
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

  tabContainer: {
    flexDirection: "row",
    marginHorizontal: spacing.screen,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.sm,
  },

  tabButtonActive: {
    backgroundColor: colors.surface,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  tabText: {
    ...typography.label,
    fontSize: 12.5,
    color: colors.textSecondary,
  },

  tabTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },

  listContent: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.xl,
  },

  ticketCardWrapper: {
    marginBottom: spacing.md,
  },

  checkInActionRow: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  ticketPinGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  ticketPinLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  ticketPinValue: {
    ...typography.titleMedium,
    fontSize: 15,
    color: colors.primary,
    letterSpacing: 1,
    fontWeight: "700",
  },

  checkInButton: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.emerald,
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
