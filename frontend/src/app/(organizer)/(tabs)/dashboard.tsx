import React from "react";
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

import AppButton from "../../../components/AppButton";
import SecondaryButton from "../../../components/SecondaryButton";
import SectionHeader from "../../../components/SectionHeader";
import StatusBadge from "../../../components/StatusBadge";
import { MOCK_EVENTS } from "../../../data/mockEvents";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { typography } from "../../../theme/typography";

export default function OrganizerDashboardScreen() {
  const publishedEvents = MOCK_EVENTS;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.badgeRow}>
              <View style={styles.dot} />
              <Text style={styles.badgeText}>PUBLISHER PORTAL</Text>
            </View>
            <Text style={styles.greetingTitle}>Organizer Studio</Text>
          </View>

          <Pressable
            onPress={() => router.replace("/(participant)/(tabs)/home" as any)}
            style={({ pressed }) => [
              styles.switchPill,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="swap-horizontal" size={14} color={colors.emerald} />
            <Text style={styles.switchPillText}>Attendee View</Text>
          </Pressable>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Ionicons name="calendar-outline" size={18} color={colors.emerald} />
            </View>
            <Text style={styles.statVal}>4</Text>
            <Text style={styles.statLabel}>Active Events</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Ionicons name="people-outline" size={18} color={colors.emerald} />
            </View>
            <Text style={styles.statVal}>1,205</Text>
            <Text style={styles.statLabel}>Registrations</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Ionicons name="checkmark-done-outline" size={18} color={colors.gold} />
            </View>
            <Text style={styles.statVal}>88%</Text>
            <Text style={styles.statLabel}>Check-In Rate</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Ionicons name="cash-outline" size={18} color={colors.primary} />
            </View>
            <Text style={styles.statVal}>$2,775</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.actionRow}>
          <AppButton
            title="+ Create New Event"
            onPress={() => router.push("/(organizer)/(tabs)/create" as any)}
            style={{ flex: 1 }}
          />

          <SecondaryButton
            title="Scan Passes"
            onPress={() => router.push("/(participant)/event/check-in" as any)}
            style={{ flex: 1 }}
          />
        </View>

        {/* Active Published Events List */}
        <View style={styles.section}>
          <SectionHeader
            title="Published Events Management"
            actionText="View All"
            onActionPress={() => router.push("/(organizer)/(tabs)/events" as any)}
          />

          {publishedEvents.map((evt) => {
            const fillPercentage = Math.round(
              (evt.attendeesCount / evt.maxCapacity) * 100
            );

            return (
              <Pressable
                key={evt.id}
                onPress={() =>
                  router.push({
                    pathname: "/(organizer)/event/[id]",
                    params: { id: evt.id },
                  } as any)
                }
                style={({ pressed }) => [
                  styles.eventManageCard,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.eventHeaderRow}>
                  <StatusBadge status={evt.status} />
                  <Text style={styles.capacityLabel}>
                    {evt.attendeesCount} / {evt.maxCapacity} Registered
                  </Text>
                </View>

                <Text style={styles.eventTitle}>{evt.title}</Text>
                <Text style={styles.eventDate}>
                  {evt.date} • {evt.location.split("•")[0]}
                </Text>

                <View style={styles.progressRow}>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${fillPercentage}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressPercent}>{fillPercentage}%</Text>
                </View>

                <View style={styles.cardFooterRow}>
                  <View style={styles.footerInfo}>
                    <Ionicons
                      name="qr-code-outline"
                      size={14}
                      color={colors.emerald}
                    />
                    <Text style={styles.footerInfoText}>PIN: {evt.pinCode || "8492"}</Text>
                  </View>

                  <View style={styles.manageBtn}>
                    <Text style={styles.manageBtnText}>Manage Event</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={14}
                      color={colors.primary}
                    />
                  </View>
                </View>
              </Pressable>
            );
          })}
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
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xl,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.emerald,
  },

  badgeText: {
    ...typography.label,
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.emerald,
    fontWeight: "700",
  },

  greetingTitle: {
    ...typography.headlineLarge,
    fontSize: 26,
    color: colors.textPrimary,
  },

  switchPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.emeraldSoft,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: "rgba(15, 118, 110, 0.2)",
  },

  switchPillText: {
    ...typography.label,
    fontSize: 11.5,
    color: colors.emerald,
  },

  pressed: {
    opacity: 0.8,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  statCard: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },

  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },

  statVal: {
    ...typography.display,
    fontSize: 22,
    color: colors.textPrimary,
  },

  statLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontSize: 12,
  },

  actionRow: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },

  section: {
    gap: spacing.sm,
  },

  eventManageCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: spacing.sm,
  },

  eventHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  capacityLabel: {
    ...typography.label,
    fontSize: 11.5,
    color: colors.textSecondary,
  },

  eventTitle: {
    ...typography.titleLarge,
    fontSize: 16.5,
    color: colors.textPrimary,
    marginBottom: 2,
  },

  eventDate: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceSoft,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: colors.emerald,
    borderRadius: 3,
  },

  progressPercent: {
    ...typography.label,
    fontSize: 11,
    color: colors.emerald,
    fontWeight: "700",
  },

  cardFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },

  footerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  footerInfoText: {
    ...typography.bodySmall,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "600",
  },

  manageBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  manageBtnText: {
    ...typography.titleMedium,
    fontSize: 13,
    color: colors.primary,
    fontWeight: "600",
  },
});
