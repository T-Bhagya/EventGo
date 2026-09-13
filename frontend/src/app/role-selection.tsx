import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AppButton from "../components/AppButton";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

export type RoleType = "attendee" | "organizer";

type RoleCardProps = {
  role: RoleType;
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onSelect: (role: RoleType) => void;
};

function RoleCard({
  role,
  title,
  description,
  iconName,
  selected,
  onSelect,
}: RoleCardProps) {
  return (
    <Pressable
      onPress={() => onSelect(role)}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.iconContainer,
            selected && styles.iconContainerSelected,
          ]}
        >
          <Ionicons
            name={iconName}
            size={24}
            color={selected ? colors.emerald : colors.textPrimary}
          />
        </View>

        <View style={styles.cardHeaderRight}>
          <View
            style={[
              styles.radioIndicator,
              selected && styles.radioIndicatorSelected,
            ]}
          >
            {selected && (
              <Ionicons name="checkmark" size={14} color={colors.white} />
            )}
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={selected ? colors.emerald : colors.textMuted}
            style={styles.chevron}
          />
        </View>
      </View>

      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </Pressable>
  );
}

export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<RoleType | null>(null);
  const insets = useSafeAreaInsets();

  const handleContinue = () => {
    if (!selectedRole) return;
    router.push({
      pathname: "/(auth)/login",
      params: { role: selectedRole },
    } as any);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* Minimalist Header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandDot} />
            <Text style={styles.brandName}>EVENTGO</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Title Block */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>How will you use EventGo?</Text>
            <Text style={styles.subtitle}>
              Choose the experience that fits you best.
            </Text>
          </View>

          {/* Role Cards */}
          <View style={styles.cardsContainer}>
            <RoleCard
              role="attendee"
              title="Attend Events"
              description="Discover, save, register and attend university and public events."
              iconName="ticket-outline"
              selected={selectedRole === "attendee"}
              onSelect={setSelectedRole}
            />

            <RoleCard
              role="organizer"
              title="Organize Events"
              description="Create, publish and manage events, registrations and attendance."
              iconName="megaphone-outline"
              selected={selectedRole === "organizer"}
              onSelect={setSelectedRole}
            />
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <AppButton
            title="Continue"
            onPress={handleContinue}
            disabled={!selectedRole}
            style={styles.continueButton}
          />

          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>
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
    backgroundColor: colors.background,
    justifyContent: "space-between",
  },

  header: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    alignItems: "flex-start",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingVertical: 4,
  },

  brandDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.emerald,
  },

  brandName: {
    ...typography.label,
    fontSize: 12,
    letterSpacing: 1.8,
    color: colors.primary,
    fontWeight: "700",
  },

  scrollContent: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },

  titleSection: {
    marginBottom: spacing.xl,
  },

  title: {
    ...typography.headlineLarge,
    fontSize: 28,
    lineHeight: 35,
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },

  subtitle: {
    ...typography.bodyLarge,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },

  cardsContainer: {
    gap: spacing.md,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 22,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },

  cardSelected: {
    borderColor: colors.emerald,
    backgroundColor: colors.surface,
    shadowColor: colors.emerald,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.09,
    shadowRadius: 16,
    elevation: 4,
  },

  cardPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.96,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  iconContainerSelected: {
    backgroundColor: colors.emeraldSoft,
    borderColor: "rgba(15, 118, 110, 0.2)",
  },

  cardHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  radioIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },

  radioIndicatorSelected: {
    backgroundColor: colors.emerald,
    borderColor: colors.emerald,
  },

  chevron: {
    marginLeft: 2,
  },

  cardTitle: {
    ...typography.titleLarge,
    fontSize: 20,
    lineHeight: 26,
    color: colors.primary,
    marginTop: spacing.md,
  },

  cardDescription: {
    ...typography.bodyMedium,
    fontSize: 14.5,
    lineHeight: 21,
    color: colors.textSecondary,
    marginTop: 6,
  },

  bottomContainer: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },

  continueButton: {
    width: "100%",
  },

  backButton: {
    paddingVertical: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xs,
  },

  backButtonPressed: {
    opacity: 0.6,
  },

  backText: {
    ...typography.titleMedium,
    fontSize: 15,
    color: colors.textSecondary,
  },
});