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
        {/* Top Header Bar */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Pressable
            onPress={() => {}}
            style={({ pressed }) => [styles.settingsBtn, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Settings"
          >
            <Ionicons name="settings-outline" size={20} color="#111827" />
          </Pressable>
        </View>

        {/* ── 1. PROFILE CARD ────────────────────────────────────────────── */}
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

        {/* ── 2. STATS ROW ───────────────────────────────────────────────── */}
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

        {/* ── 3. ORGANIZER SWITCH BANNER (Black & Yellow Theme) ─────────── */}
        <View style={styles.switchBanner}>
          <View style={styles.switchBannerHeader}>
            <View style={styles.switchIconBadge}>
              <Ionicons name="briefcase" size={18} color="#F5B800" />
            </View>
            <View style={styles.switchTextGroup}>
              <Text style={styles.switchTitle}>Are you an Event Organizer?</Text>
              <Text style={styles.switchSub}>
                Switch to Organizer mode to create and publish campus events.
              </Text>
            </View>
          </View>

          <Pressable
            onPress={handleSwitchToOrganizer}
            style={({ pressed }) => [styles.switchBtn, pressed && styles.switchBtnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Switch to Organizer Mode"
          >
            <Text style={styles.switchBtnText}>Switch Mode</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* ── 4. MENU ITEMS LIST ─────────────────────────────────────────── */}
        <View style={styles.menuContainer}>
          <Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}>
            <View style={styles.menuIconBox}>
              <Ionicons name="person-outline" size={18} color="#111827" />
            </View>
            <Text style={styles.menuText}>Edit Personal Info</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </Pressable>

          <Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}>
            <View style={styles.menuIconBox}>
              <Ionicons name="heart-outline" size={18} color="#111827" />
            </View>
            <Text style={styles.menuText}>Manage Event Interests</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </Pressable>

          <Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}>
            <View style={styles.menuIconBox}>
              <Ionicons name="notifications-outline" size={18} color="#111827" />
            </View>
            <Text style={styles.menuText}>Notification Settings</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </Pressable>

          <Pressable
            onPress={() => router.replace("/role-selection" as any)}
            style={({ pressed }) => [styles.menuItem, styles.menuItemLast, pressed && styles.pressed]}
          >
            <View style={[styles.menuIconBox, { backgroundColor: "#FEE2E2" }]}>
              <Ionicons name="log-out-outline" size={18} color="#EF4444" />
            </View>
            <Text style={[styles.menuText, { color: "#EF4444" }]}>Log Out</Text>
          </Pressable>
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

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Profile Card ──────────────────────────────────────────────────────────
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    padding: 20,
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F3F4F6",
  },
  roleBadge: {
    position: "absolute",
    bottom: -6,
    alignSelf: "center",
    backgroundColor: "#0A0A0C",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  roleText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.4,
  },

  userName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  userEmail: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  interestsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 14,
    justifyContent: "center",
  },
  interestPill: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  interestText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#4B5563",
  },

  // ── Stats Container ───────────────────────────────────────────────────────
  statsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0A0A0C",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#E5E7EB",
  },

  // ── Organizer Switch Banner ────────────────────────────────────────────────
  switchBanner: {
    backgroundColor: "#FFFDF0",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(245, 184, 0, 0.35)",
    padding: 16,
    marginBottom: 14,
  },
  switchBannerHeader: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  switchIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#0A0A0C",
    alignItems: "center",
    justifyContent: "center",
  },
  switchTextGroup: {
    flex: 1,
    justifyContent: "center",
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  switchSub: {
    fontSize: 12.5,
    color: "#6B7280",
    lineHeight: 18,
    marginTop: 2,
  },

  switchBtn: {
    height: 46,
    borderRadius: 23,
    backgroundColor: "#0A0A0C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  switchBtnPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  switchBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  // ── Menu Container ────────────────────────────────────────────────────────
  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 12,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  pressed: {
    backgroundColor: "#F9FAFB",
  },
});
