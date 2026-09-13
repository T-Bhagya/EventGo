import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AppButton from "../../../components/AppButton";
import StatusBadge from "../../../components/StatusBadge";
import { MOCK_EVENTS } from "../../../data/mockEvents";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { typography } from "../../../theme/typography";

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = MOCK_EVENTS.find((e) => e.id === id) || MOCK_EVENTS[0];

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showConfirmSheet, setShowConfirmSheet] = useState(false);
  const insets = useSafeAreaInsets();

  const handleRegisterConfirm = () => {
    setShowConfirmSheet(false);
    router.push({
      pathname: "/(participant)/event/registration-success",
      params: { id: event.id },
    } as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Image Section */}
          <View style={styles.heroContainer}>
            <Image
              source={{ uri: event.imageUrl }}
              style={styles.heroImage}
              contentFit="cover"
            />
            <View style={styles.heroOverlay} />

            {/* Top Bar Actions */}
            <View style={styles.topBar}>
              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
              >
                <Ionicons name="arrow-back" size={20} color={colors.white} />
              </Pressable>

              <Pressable
                onPress={() => setIsBookmarked((prev) => !prev)}
                style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
              >
                <Ionicons
                  name={isBookmarked ? "bookmark" : "bookmark-outline"}
                  size={20}
                  color={isBookmarked ? colors.gold : colors.white}
                />
              </Pressable>
            </View>

            {/* Category Pill Tag */}
            <View style={styles.heroCategoryPill}>
              <Text style={styles.heroCategoryText}>{event.category}</Text>
            </View>
          </View>

          {/* Details Body */}
          <View style={styles.body}>
            <View style={styles.statusRow}>
              <StatusBadge status={event.status} />
              <Text style={styles.priceText}>{event.price}</Text>
            </View>

            <Text style={styles.title}>{event.title}</Text>

            {/* Organizer Row */}
            <View style={styles.organizerRow}>
              <Image
                source={{
                  uri:
                    event.organizerAvatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
                }}
                style={styles.organizerAvatar}
                contentFit="cover"
              />
              <View style={styles.organizerInfo}>
                <Text style={styles.organizerName}>{event.organizer}</Text>
                <Text style={styles.organizerLabel}>Event Publisher</Text>
              </View>
            </View>

            {/* Date & Time Info Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <Ionicons name="calendar-outline" size={20} color={colors.emerald} />
                </View>
                <View style={styles.infoTextGroup}>
                  <Text style={styles.infoTitle}>{event.date}</Text>
                  <Text style={styles.infoSub}>{event.time}</Text>
                </View>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <Ionicons name="location-outline" size={20} color={colors.emerald} />
                </View>
                <View style={styles.infoTextGroup}>
                  <Text style={styles.infoTitle}>{event.location}</Text>
                  <Text style={styles.infoSub}>
                    {event.isVirtual ? "Virtual Online Event" : "In-Person Campus Venue"}
                  </Text>
                </View>
              </View>
            </View>

            {/* About / Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About this event</Text>
              <Text style={styles.descriptionText}>{event.description}</Text>
            </View>

            {/* Capacity Meter */}
            <View style={styles.capacityCard}>
              <View style={styles.capacityHeader}>
                <Text style={styles.capacityTitle}>Registrations & Seats</Text>
                <Text style={styles.capacityCount}>
                  {event.attendeesCount} / {event.maxCapacity} Seats Filled
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(
                        (event.attendeesCount / event.maxCapacity) * 100,
                        100
                      )}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Floating Action Bar */}
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <View style={styles.bottomPriceGroup}>
            <Text style={styles.bottomPriceLabel}>Registration Fee</Text>
            <Text style={styles.bottomPriceValue}>{event.price}</Text>
          </View>

          <AppButton
            title="Register Now"
            onPress={() => setShowConfirmSheet(true)}
            style={styles.registerButton}
          />
        </View>

        {/* Confirmation Modal Sheet */}
        {showConfirmSheet ? (
          <View style={styles.sheetOverlay}>
            <Pressable
              style={styles.sheetBackdrop}
              onPress={() => setShowConfirmSheet(false)}
            />
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Confirm Registration</Text>
              <Text style={styles.sheetSub}>
                You are about to register for{"\n"}
                <Text style={{ fontWeight: "700", color: colors.primary }}>
                  {event.title}
                </Text>
              </Text>

              <View style={styles.sheetSummaryCard}>
                <View style={styles.sheetRow}>
                  <Text style={styles.sheetRowLabel}>Date</Text>
                  <Text style={styles.sheetRowVal}>{event.date}</Text>
                </View>
                <View style={styles.sheetRow}>
                  <Text style={styles.sheetRowLabel}>Time</Text>
                  <Text style={styles.sheetRowVal}>{event.time.split("-")[0]}</Text>
                </View>
                <View style={styles.sheetRow}>
                  <Text style={styles.sheetRowLabel}>Fee</Text>
                  <Text style={styles.sheetRowVal}>{event.price}</Text>
                </View>
              </View>

              <AppButton
                title="Confirm Registration"
                onPress={handleRegisterConfirm}
                style={{ width: "100%", marginTop: spacing.md }}
              />

              <Pressable
                onPress={() => setShowConfirmSheet(false)}
                style={styles.sheetCancelBtn}
              >
                <Text style={styles.sheetCancelText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
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

  scrollContent: {
    paddingBottom: 100,
  },

  heroContainer: {
    height: 260,
    width: "100%",
    position: "relative",
    backgroundColor: colors.primary,
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(18, 19, 22, 0.4)",
  },

  topBar: {
    position: "absolute",
    top: spacing.md,
    left: spacing.screen,
    right: spacing.screen,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(18, 19, 22, 0.65)",
    alignItems: "center",
    justifyContent: "center",
  },

  pressed: {
    opacity: 0.7,
  },

  heroCategoryPill: {
    position: "absolute",
    bottom: spacing.md,
    left: spacing.screen,
    backgroundColor: colors.emerald,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.full,
  },

  heroCategoryText: {
    ...typography.label,
    fontSize: 11.5,
    color: colors.white,
  },

  body: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.lg,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },

  priceText: {
    ...typography.titleLarge,
    fontSize: 18,
    color: colors.emerald,
    fontWeight: "700",
  },

  title: {
    ...typography.headlineLarge,
    fontSize: 24,
    lineHeight: 32,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  organizerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },

  organizerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  organizerInfo: {
    flex: 1,
  },

  organizerName: {
    ...typography.titleMedium,
    fontSize: 15,
    color: colors.textPrimary,
  },

  organizerLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  infoIconBox: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.emeraldSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  infoTextGroup: {
    flex: 1,
  },

  infoTitle: {
    ...typography.titleMedium,
    fontSize: 14.5,
    color: colors.textPrimary,
  },

  infoSub: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },

  infoDivider: {
    height: 1,
    backgroundColor: colors.borderSoft,
    marginVertical: spacing.md,
  },

  section: {
    marginBottom: spacing.lg,
  },

  sectionTitle: {
    ...typography.titleLarge,
    fontSize: 17,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  descriptionText: {
    ...typography.bodyLarge,
    fontSize: 14.5,
    lineHeight: 22,
    color: colors.textSecondary,
  },

  capacityCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },

  capacityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  capacityTitle: {
    ...typography.titleMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },

  capacityCount: {
    ...typography.label,
    fontSize: 11.5,
    color: colors.emerald,
  },

  progressTrack: {
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

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    paddingHorizontal: spacing.screen,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },

  bottomPriceGroup: {
    gap: 2,
  },

  bottomPriceLabel: {
    ...typography.bodySmall,
    fontSize: 11.5,
    color: colors.textSecondary,
  },

  bottomPriceValue: {
    ...typography.titleLarge,
    fontSize: 20,
    color: colors.primary,
    fontWeight: "700",
  },

  registerButton: {
    flex: 1,
  },

  sheetOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 100,
    justifyContent: "flex-end",
  },

  sheetBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  sheetContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.xl,
    alignItems: "center",
  },

  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },

  sheetTitle: {
    ...typography.headlineMedium,
    color: colors.textPrimary,
  },

  sheetSub: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xs,
    lineHeight: 20,
  },

  sheetSummaryCard: {
    width: "100%",
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    gap: 8,
  },

  sheetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  sheetRowLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  sheetRowVal: {
    ...typography.titleMedium,
    fontSize: 13.5,
    color: colors.primary,
  },

  sheetCancelBtn: {
    marginTop: spacing.sm,
    paddingVertical: 10,
  },

  sheetCancelText: {
    ...typography.titleMedium,
    fontSize: 14,
    color: colors.textSecondary,
  },
});
