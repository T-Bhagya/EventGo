import React from "react";
import {
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

import SecondaryButton from "../../../components/SecondaryButton";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { typography } from "../../../theme/typography";

export default function OrganizerProfileScreen() {
  const organizer = {
    name: "Stanford Innovation Hub",
    email: "events@stanford-innovation.edu",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    role: "Official Organization",
    publishedEvents: 14,
    totalAttendees: 1420,
    avgRating: 4.9,
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Organizer Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: organizer.avatar }}
            style={styles.avatar}
            contentFit="cover"
          />

          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-done-circle" size={14} color="#F5B800" />
            <Text style={styles.verifiedText}>Verified Publisher</Text>
          </View>

          <Text style={styles.name}>{organizer.name}</Text>
          <Text style={styles.email}>{organizer.email}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{organizer.publishedEvents}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{organizer.totalAttendees}</Text>
            <Text style={styles.statLabel}>Attendees</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{organizer.avgRating} ★</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Mode Switch */}
        <View style={styles.switchBox}>
          <Text style={styles.switchTitle}>Participant Mode</Text>
          <Text style={styles.switchSub}>Switch back to attendee mode to explore campus events.</Text>
          <SecondaryButton
            title="Switch to Participant View"
            onPress={() => router.replace("/(participant)/(tabs)/home" as any)}
            style={{ marginTop: spacing.xs }}
          />
        </View>

        {/* Options List */}
        <View style={styles.menuContainer}>
          <Pressable
            onPress={() => router.replace("/role-selection" as any)}
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.error} />
            <Text style={[styles.menuText, { color: colors.error }]}>Log Out</Text>
          </Pressable>
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
    paddingBottom: 110,
  },

  header: {
    marginBottom: spacing.md,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.3,
  },

  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: "center",
    marginBottom: spacing.md,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: spacing.md,
  },

  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFDF0",
    borderWidth: 1,
    borderColor: "rgba(245, 184, 0, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginBottom: spacing.xs,
  },

  verifiedText: {
    ...typography.label,
    fontSize: 11,
    color: "#0A0A0C",
    fontWeight: "700",
  },

  name: {
    ...typography.headlineMedium,
    fontSize: 20,
    color: colors.textPrimary,
  },

  email: {
    ...typography.bodyMedium,
    fontSize: 13.5,
    color: colors.textSecondary,
    marginTop: 2,
  },

  statsRow: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: spacing.md,
  },

  statBox: {
    alignItems: "center",
    flex: 1,
  },

  statNum: {
    ...typography.titleLarge,
    fontSize: 20,
    color: colors.primary,
    fontWeight: "700",
  },

  statLabel: {
    ...typography.bodySmall,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },

  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.borderSoft,
  },

  switchBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 4,
    marginBottom: spacing.md,
  },

  switchTitle: {
    ...typography.titleMedium,
    fontSize: 15,
    color: colors.textPrimary,
  },

  switchSub: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  menuContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    gap: 12,
  },

  pressed: {
    backgroundColor: colors.surfaceSoft,
  },

  menuText: {
    ...typography.titleMedium,
    fontSize: 14.5,
    flex: 1,
  },
});
