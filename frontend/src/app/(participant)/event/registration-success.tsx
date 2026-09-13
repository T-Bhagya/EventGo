import React from "react";
import {
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
import { MOCK_EVENTS } from "../../../data/mockEvents";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { typography } from "../../../theme/typography";

export default function RegistrationSuccessScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = MOCK_EVENTS.find((e) => e.id === id) || MOCK_EVENTS[0];
  const pinCode = event.pinCode || "8492";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}
        <View style={styles.successIconBadge}>
          <Ionicons name="checkmark-sharp" size={36} color={colors.white} />
        </View>

        {/* Title */}
        <Text style={styles.title}>You're Registered!</Text>
        <Text style={styles.subtitle}>
          Your pass for <Text style={styles.eventHighlight}>{event.title}</Text> has been saved to your account.
        </Text>

        {/* Pass Card */}
        <View style={styles.passCard}>
          <View style={styles.passHeader}>
            <View style={styles.brandRow}>
              <View style={styles.dot} />
              <Text style={styles.brandText}>EVENTGO PASS</Text>
            </View>
            <View style={styles.confirmedBadge}>
              <Text style={styles.confirmedText}>Confirmed</Text>
            </View>
          </View>

          <Text style={styles.passEventTitle}>{event.title}</Text>
          <Text style={styles.passDate}>{event.date} • {event.time.split("-")[0]}</Text>
          <Text style={styles.passLocation}>{event.location}</Text>

          <View style={styles.ticketDividerRow}>
            <View style={styles.ticketNotchLeft} />
            <View style={styles.dashedLine} />
            <View style={styles.ticketNotchRight} />
          </View>

          {/* Simulated QR Code Visual */}
          <View style={styles.qrSection}>
            <View style={styles.qrBox}>
              <Ionicons name="qr-code-outline" size={100} color={colors.primary} />
            </View>
            <Text style={styles.qrHelpText}>Present QR code or PIN at check-in counter</Text>
          </View>

          {/* PIN Display */}
          <View style={styles.pinCard}>
            <Text style={styles.pinLabel}>Attendance Check-in PIN</Text>
            <Text style={styles.pinValue}>{pinCode}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionColumn}>
          <AppButton
            title="Check-In UI / Passes"
            onPress={() =>
              router.replace({
                pathname: "/(participant)/event/check-in",
                params: { id: event.id, pinCode },
              } as any)
            }
          />

          <SecondaryButton
            title="Back to Discover"
            onPress={() => router.replace("/(participant)/(tabs)/home" as any)}
          />
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: "center",
  },

  successIconBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.emerald,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    shadowColor: colors.emerald,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },

  title: {
    ...typography.headlineLarge,
    color: colors.textPrimary,
    textAlign: "center",
  },

  subtitle: {
    ...typography.bodyLarge,
    fontSize: 14.5,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },

  eventHighlight: {
    color: colors.primary,
    fontWeight: "700",
  },

  passCard: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },

  passHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.emerald,
  },

  brandText: {
    ...typography.label,
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.textPrimary,
  },

  confirmedBadge: {
    backgroundColor: colors.emeraldSoft,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
  },

  confirmedText: {
    ...typography.label,
    fontSize: 11,
    color: colors.emerald,
  },

  passEventTitle: {
    ...typography.titleLarge,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 4,
  },

  passDate: {
    ...typography.bodyMedium,
    fontSize: 13.5,
    color: colors.emerald,
    fontWeight: "600",
  },

  passLocation: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },

  ticketDividerRow: {
    position: "relative",
    height: 20,
    justifyContent: "center",
    marginHorizontal: -spacing.lg,
    marginVertical: spacing.md,
  },

  dashedLine: {
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderStyle: "dashed",
  },

  ticketNotchLeft: {
    position: "absolute",
    left: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },

  ticketNotchRight: {
    position: "absolute",
    right: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },

  qrSection: {
    alignItems: "center",
    marginBottom: spacing.md,
  },

  qrBox: {
    backgroundColor: colors.surfaceSoft,
    padding: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    marginBottom: 8,
  },

  qrHelpText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontSize: 11.5,
  },

  pinCard: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },

  pinLabel: {
    ...typography.label,
    fontSize: 11,
    color: colors.textSecondary,
  },

  pinValue: {
    ...typography.display,
    fontSize: 26,
    letterSpacing: 4,
    color: colors.primary,
    marginTop: 2,
  },

  actionColumn: {
    width: "100%",
    gap: spacing.sm,
  },
});
