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

import { colors } from "../../theme/colors";
import { radius } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "registration" | "reminder" | "update" | "alert";
};

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Registration Confirmed!",
    message: "Your ticket for AI & Future Tech Summit 2026 is confirmed. PIN: 8492.",
    time: "10 mins ago",
    read: false,
    type: "registration",
  },
  {
    id: "notif-2",
    title: "Event Starts Tomorrow",
    message: "Minimalist UI/UX Masterclass starts at 02:00 PM tomorrow. Have your QR pass ready.",
    time: "2 hours ago",
    read: false,
    type: "reminder",
  },
  {
    id: "notif-3",
    title: "Venue Room Updated",
    message: "Campus Acoustic Night has moved to Central Courtyard Lawn due to popular demand.",
    time: "Yesterday",
    read: true,
    type: "update",
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getTypeIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "registration":
        return "checkmark-circle-outline";
      case "reminder":
        return "alarm-outline";
      case "update":
        return "information-circle-outline";
      default:
        return "notifications-outline";
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        {/* Header Bar */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          >
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </Pressable>

          <Text style={styles.headerTitle}>Notifications</Text>

          <Pressable
            onPress={markAllRead}
            style={({ pressed }) => [pressed && styles.pressed]}
          >
            <Text style={styles.markReadText}>Mark all read</Text>
          </Pressable>
        </View>

        {/* List */}
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View
              style={[
                styles.card,
                !item.read && styles.cardUnread,
              ]}
            >
              <View
                style={[
                  styles.iconBox,
                  !item.read && styles.iconBoxUnread,
                ]}
              >
                <Ionicons
                  name={getTypeIcon(item.type)}
                  size={20}
                  color={!item.read ? colors.emerald : colors.textSecondary}
                />
              </View>

              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <Text style={styles.cardMessage}>{item.message}</Text>
              </View>
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
    marginBottom: spacing.md,
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
    opacity: 0.6,
  },

  headerTitle: {
    ...typography.titleLarge,
    fontSize: 18,
    color: colors.textPrimary,
  },

  markReadText: {
    ...typography.titleMedium,
    fontSize: 13,
    color: colors.emerald,
    fontWeight: "600",
  },

  listContent: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.md,
    flexDirection: "row",
    gap: spacing.md,
  },

  cardUnread: {
    borderColor: "rgba(15, 118, 110, 0.3)",
    backgroundColor: colors.surface,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  iconBoxUnread: {
    backgroundColor: colors.emeraldSoft,
  },

  cardContent: {
    flex: 1,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  cardTitle: {
    ...typography.titleMedium,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "600",
  },

  timeText: {
    ...typography.bodySmall,
    fontSize: 11,
    color: colors.textMuted,
  },

  cardMessage: {
    ...typography.bodyMedium,
    fontSize: 13.5,
    color: colors.textSecondary,
    lineHeight: 19,
  },
});
