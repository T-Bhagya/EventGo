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
import StatusBadge from "../../../components/StatusBadge";
import { EventItem, MOCK_EVENTS } from "../../../data/mockEvents";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { typography } from "../../../theme/typography";

export default function PublishedEventsScreen() {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const eventsList = MOCK_EVENTS.filter((e) => {
    if (filter === "active") return e.status === "upcoming" || e.status === "registered";
    if (filter === "completed") return e.status === "completed";
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Published Events</Text>
          <Text style={styles.subtitle}>
            Manage registrations, edit details, and track attendance
          </Text>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          <Pressable
            onPress={() => setFilter("all")}
            style={[styles.pill, filter === "all" && styles.pillActive]}
          >
            <Text style={[styles.pillText, filter === "all" && styles.pillTextActive]}>
              All ({MOCK_EVENTS.length})
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setFilter("active")}
            style={[styles.pill, filter === "active" && styles.pillActive]}
          >
            <Text style={[styles.pillText, filter === "active" && styles.pillTextActive]}>
              Active
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setFilter("completed")}
            style={[styles.pill, filter === "completed" && styles.pillActive]}
          >
            <Text style={[styles.pillText, filter === "completed" && styles.pillTextActive]}>
              Completed
            </Text>
          </Pressable>
        </View>

        {/* Event List */}
        <FlatList
          data={eventsList}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(organizer)/event/[id]",
                  params: { id: item.id },
                } as any)
              }
              style={({ pressed }) => [
                styles.eventCard,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.cardHeader}>
                <StatusBadge status={item.status} />
                <Text style={styles.priceTag}>{item.price}</Text>
              </View>

              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDate}>{item.date} • {item.location}</Text>

              <View style={styles.statsRow}>
                <View style={styles.statGroup}>
                  <Text style={styles.statNum}>{item.attendeesCount}</Text>
                  <Text style={styles.statLabel}>Registered</Text>
                </View>
                <View style={styles.statGroup}>
                  <Text style={styles.statNum}>{item.maxCapacity}</Text>
                  <Text style={styles.statLabel}>Cap</Text>
                </View>
                <View style={styles.statGroup}>
                  <Text style={styles.statNum}>{item.pinCode || "8492"}</Text>
                  <Text style={styles.statLabel}>Check-In PIN</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.manageLink}>Manage Registrations & Attendance</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.emerald} />
              </View>
            </Pressable>
          )}
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

  filterRow: {
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.screen,
    marginBottom: spacing.md,
  },

  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  pillText: {
    ...typography.label,
    fontSize: 12,
    color: colors.textSecondary,
  },

  pillTextActive: {
    color: colors.white,
    fontWeight: "600",
  },

  listContent: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },

  eventCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },

  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.99 }],
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  priceTag: {
    ...typography.titleMedium,
    fontSize: 14,
    color: colors.emerald,
    fontWeight: "700",
  },

  eventTitle: {
    ...typography.titleLarge,
    fontSize: 17,
    color: colors.textPrimary,
  },

  eventDate: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.md,
    paddingVertical: 10,
    marginBottom: spacing.md,
  },

  statGroup: {
    alignItems: "center",
  },

  statNum: {
    ...typography.titleMedium,
    fontSize: 16,
    color: colors.primary,
    fontWeight: "700",
  },

  statLabel: {
    ...typography.bodySmall,
    fontSize: 11,
    color: colors.textSecondary,
  },

  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },

  manageLink: {
    ...typography.titleMedium,
    fontSize: 13.5,
    color: colors.emerald,
    fontWeight: "600",
  },
});
