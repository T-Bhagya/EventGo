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

export default function ParticipantProfileScreen() {
  const user = {
    name: "Alex Morgan",
    email: "alex.morgan@university.edu",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    role: "Attendee",
    eventsAttended: 12,
    savedEvents: 5,
    reviewsGiven: 8,
    interests: ["Tech", "Design", "Music", "Startups"],
  };

  const handleSwitchToOrganizer = () => {
    router.replace("/(organizer)/dashboard" as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Participant Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user.role}</Text>
            </View>
          </View>

          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          {/* Interests Pills */}
          <View style={styles.interestsRow}>
            {user.interests.map((interest) => (
              <View key={interest} style={styles.interestPill}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user.eventsAttended}</Text>
            <Text style={styles.statLabel}>Attended</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user.savedEvents}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user.reviewsGiven}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Switch Role Banner */}
        <View style={styles.switchBanner}>
          <View style={styles.switchTextGroup}>
            <Text style={styles.switchTitle}>Are you an Event Organizer?</Text>
            <Text style={styles.switchSub}>
              Switch to Organizer mode to create and publish campus events.
            </Text>
          </View>
          <SecondaryButton
            title="Switch Mode"
            onPress={handleSwitchToOrganizer}
            style={styles.switchButton}
          />
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}>
            <Ionicons name="person-outline" size={20} color={colors.textPrimary} />
            <Text style={styles.menuText}>Edit Personal Info</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>

          <Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}>
            <Ionicons name="heart-outline" size={20} color={colors.textPrimary} />
            <Text style={styles.menuText}>Manage Event Interests</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>

          <Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}>
            <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
            <Text style={styles.menuText}>Notification Settings</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>

          <Pressable
            onPress={() => router.replace("/role-selection" as any)}
            style={({ pressed }) => [styles.menuItem, styles.menuItemLast, pressed && styles.pressed]}
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
    paddingBottom: spacing.xl,
  },

  header: {
    marginBottom: spacing.md,
  },

  title: {
    ...typography.headlineLarge,
    color: colors.textPrimary,
  },

  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: "center",
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },

  avatarWrapper: {
    position: "relative",
    marginBottom: spacing.md,
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surfaceSoft,
  },

  roleBadge: {
    position: "absolute",
    bottom: -4,
    alignSelf: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
  },

  roleText: {
    ...typography.label,
    fontSize: 10.5,
    color: colors.white,
  },

  userName: {
    ...typography.headlineMedium,
    fontSize: 20,
    color: colors.textPrimary,
  },

  userEmail: {
    ...typography.bodyMedium,
    fontSize: 13.5,
    color: colors.textSecondary,
    marginTop: 2,
  },

  interestsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: spacing.md,
    justifyContent: "center",
  },

  interestPill: {
    backgroundColor: colors.surfaceSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },

  interestText: {
    ...typography.label,
    fontSize: 11,
    color: colors.textSecondary,
  },

  statsContainer: {
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

  statNumber: {
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

  switchBanner: {
    backgroundColor: colors.emeraldSoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(15, 118, 110, 0.2)",
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },

  switchTextGroup: {
    gap: 2,
  },

  switchTitle: {
    ...typography.titleMedium,
    fontSize: 15,
    color: colors.emerald,
    fontWeight: "700",
  },

  switchSub: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  switchButton: {
    height: 42,
    borderColor: colors.emerald,
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
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
    gap: 12,
  },

  menuItemLast: {
    borderBottomWidth: 0,
  },

  pressed: {
    backgroundColor: colors.surfaceSoft,
  },

  menuText: {
    ...typography.titleMedium,
    fontSize: 14.5,
    color: colors.textPrimary,
    flex: 1,
  },
});
