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
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AppButton from "../../../components/AppButton";
import SecondaryButton from "../../../components/SecondaryButton";
import StatusBadge from "../../../components/StatusBadge";
import { MOCK_EVENTS } from "../../../data/mockEvents";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { typography } from "../../../theme/typography";

export type ParticipantItem = {
  id: string;
  name: string;
  email: string;
  checkInStatus: "checked_in" | "pending";
  checkInTime?: string;
  pin: string;
};

const MOCK_PARTICIPANTS: ParticipantItem[] = [
  {
    id: "p1",
    name: "Alex Morgan",
    email: "alex.m@university.edu",
    checkInStatus: "checked_in",
    checkInTime: "09:14 AM",
    pin: "8492",
  },
  {
    id: "p2",
    name: "Samantha Lee",
    email: "sam.lee@stanford.edu",
    checkInStatus: "checked_in",
    checkInTime: "09:28 AM",
    pin: "8492",
  },
  {
    id: "p3",
    name: "David Chen",
    email: "d.chen@tech.org",
    checkInStatus: "pending",
    pin: "8492",
  },
  {
    id: "p4",
    name: "Elena Rostova",
    email: "elena@design.io",
    checkInStatus: "pending",
    pin: "8492",
  },
];

export default function OrganizerEventManagementScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = MOCK_EVENTS.find((e) => e.id === id) || MOCK_EVENTS[0];

  const [participants, setParticipants] = useState(MOCK_PARTICIPANTS);

  const toggleCheckIn = (participantId: string) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === participantId
          ? {
              ...p,
              checkInStatus:
                p.checkInStatus === "checked_in" ? "pending" : "checked_in",
              checkInTime:
                p.checkInStatus === "pending" ? "09:45 AM" : undefined,
            }
          : p
      )
    );
  };

  const checkedInCount = participants.filter(
    (p) => p.checkInStatus === "checked_in"
  ).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Event Management
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Main Event Info Card */}
        <View style={styles.eventCard}>
          <View style={styles.cardHeaderRow}>
            <StatusBadge status={event.status} />
            <View style={styles.pinTag}>
              <Ionicons name="key-outline" size={14} color="#F5B800" />
              <Text style={styles.pinText}>PIN: {event.pinCode || "8492"}</Text>
            </View>
          </View>

          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.sub}>{event.date} • {event.location.split("•")[0]}</Text>

          <View style={styles.statsBar}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{event.attendeesCount}</Text>
              <Text style={styles.statSub}>Total Reg.</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: "#0A0A0C" }]}>
                {checkedInCount}
              </Text>
              <Text style={styles.statSub}>Checked In</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>
                {event.maxCapacity - event.attendeesCount}
              </Text>
              <Text style={styles.statSub}>Available</Text>
            </View>
          </View>
        </View>

        {/* Action Bar */}
        <View style={styles.actionRow}>
          <AppButton
            title="Scan Passes (QR/PIN)"
            onPress={() =>
              router.push({
                pathname: "/(participant)/event/check-in",
                params: { id: event.id, pinCode: event.pinCode },
              } as any)
            }
            style={{ flex: 1, height: 44 }}
          />
        </View>

        {/* Registered Participants Section */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Attendee Roster</Text>
          <Text style={styles.listCount}>{participants.length} Registered</Text>
        </View>

        <FlatList
          data={participants}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.participantRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitials}>
                  {item.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Text>
              </View>

              <View style={styles.pInfo}>
                <Text style={styles.pName}>{item.name}</Text>
                <Text style={styles.pEmail}>{item.email}</Text>
              </View>

              <Pressable
                onPress={() => toggleCheckIn(item.id)}
                style={[
                  styles.checkInStatusBadge,
                  item.checkInStatus === "checked_in"
                    ? styles.statusCheckedIn
                    : styles.statusPending,
                ]}
              >
                <Ionicons
                  name={
                    item.checkInStatus === "checked_in"
                      ? "checkmark-circle"
                      : "ellipse-outline"
                  }
                  size={16}
                  color={
                    item.checkInStatus === "checked_in"
                      ? "#F5B800"
                      : colors.textMuted
                  }
                />
                <Text
                  style={[
                    styles.statusBadgeText,
                    item.checkInStatus === "checked_in"
                      ? styles.statusCheckedInText
                      : styles.statusPendingText,
                  ]}
                >
                  {item.checkInStatus === "checked_in"
                    ? `Checked (${item.checkInTime})`
                    : "Pending"}
                </Text>
              </Pressable>
            </View>
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
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.2,
  },

  eventCard: {
    marginHorizontal: spacing.screen,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },

  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  pinTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFDF0",
    borderWidth: 1,
    borderColor: "rgba(245, 184, 0, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },

  pinText: {
    ...typography.label,
    fontSize: 11.5,
    color: "#0A0A0C",
    fontWeight: "700",
  },

  title: {
    ...typography.titleLarge,
    fontSize: 18,
    color: colors.textPrimary,
  },

  sub: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },

  statsBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.md,
    paddingVertical: 10,
  },

  statBox: {
    alignItems: "center",
  },

  statNum: {
    ...typography.titleMedium,
    fontSize: 16,
    color: colors.primary,
    fontWeight: "700",
  },

  statSub: {
    ...typography.bodySmall,
    fontSize: 11,
    color: colors.textSecondary,
  },

  actionRow: {
    paddingHorizontal: spacing.screen,
    marginBottom: spacing.md,
  },

  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screen,
    marginBottom: 8,
  },

  listTitle: {
    ...typography.titleLarge,
    fontSize: 17,
    color: colors.textPrimary,
  },

  listCount: {
    ...typography.label,
    fontSize: 12,
    color: colors.textSecondary,
  },

  listContent: {
    paddingHorizontal: spacing.screen,
    paddingBottom: 110,
    gap: spacing.xs,
  },

  participantRow: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },

  avatarInitials: {
    ...typography.label,
    fontSize: 12,
    color: colors.primary,
    fontWeight: "700",
  },

  pInfo: {
    flex: 1,
  },

  pName: {
    ...typography.titleMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },

  pEmail: {
    ...typography.bodySmall,
    fontSize: 11.5,
    color: colors.textSecondary,
  },

  checkInStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
  },

  statusCheckedIn: {
    backgroundColor: "#FFFDF0",
    borderColor: "rgba(245, 184, 0, 0.4)",
  },

  statusPending: {
    backgroundColor: colors.surfaceSoft,
    borderColor: colors.borderSoft,
  },

  statusBadgeText: {
    ...typography.label,
    fontSize: 11,
  },

  statusCheckedInText: {
    color: "#0A0A0C",
    fontWeight: "700",
  },

  statusPendingText: {
    color: colors.textMuted,
  },
});
