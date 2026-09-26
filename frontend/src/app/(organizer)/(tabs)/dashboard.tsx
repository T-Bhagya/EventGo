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
            <Ionicons name="swap-horizontal" size={14} color="#111827" />
            <Text style={styles.switchPillText}>Attendee View</Text>
          </Pressable>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Ionicons name="calendar-outline" size={18} color="#0A0A0C" />
            </View>
            <Text style={styles.statVal}>4</Text>
            <Text style={styles.statLabel}>Active Events</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Ionicons name="people-outline" size={18} color="#0A0A0C" />
            </View>
            <Text style={styles.statVal}>1,205</Text>
            <Text style={styles.statLabel}>Registrations</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Ionicons name="checkmark-done-outline" size={18} color="#F5B800" />
            </View>
            <Text style={styles.statVal}>88%</Text>
            <Text style={styles.statLabel}>Check-In Rate</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconBox}>
              <Ionicons name="cash-outline" size={18} color="#0A0A0C" />
            </View>
            <Text style={styles.statVal}>$2,775</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.actionRow}>
          <AppButton
            title="+ Create Event"
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
            title="Published Events"
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
                      color="#0A0A0C"
                    />
                    <Text style={styles.footerInfoText}>PIN: {evt.pinCode || "8492"}</Text>
                  </View>

                  <View style={styles.manageBtn}>
                    <Text style={styles.manageBtnText}>Manage Event</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={14}
                      color="#0A0A0C"
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
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 110,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
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
    backgroundColor: "#F5B800",
  },

  badgeText: {
    fontSize: 11,
    letterSpacing: 1.2,
    color: "#0A0A0C",
    fontWeight: "800",
  },

  greetingTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },

  switchPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  switchPillText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#111827",
  },

  pressed: {
    opacity: 0.8,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    padding: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },

  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  statVal: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  statLabel: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "600",
  },

  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  section: {
    gap: 10,
  },

  eventManageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    padding: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 10,
  },

  eventHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  capacityLabel: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "#6B7280",
  },

  eventTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 2,
  },

  eventDate: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 12,
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },

  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F3F4F6",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#0A0A0C",
    borderRadius: 3,
  },

  progressPercent: {
    fontSize: 11,
    color: "#0A0A0C",
    fontWeight: "800",
  },

  cardFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },

  footerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  footerInfoText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },

  manageBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  manageBtnText: {
    fontSize: 13,
    color: "#0A0A0C",
    fontWeight: "700",
  },
});
