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
            color={selected ? "#FFFFFF" : "#111827"}
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
              <Ionicons name="checkmark" size={14} color="#000000" />
            )}
          </View>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={selected ? "#0A0A0C" : "#9CA3AF"}
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
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F5B800",
  },

  brandName: {
    fontSize: 12,
    letterSpacing: 2,
    color: "#0A0A0C",
    fontWeight: "800",
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
    fontSize: 28,
    lineHeight: 35,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.4,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#6B7280",
    marginTop: spacing.sm,
  },

  cardsContainer: {
    gap: spacing.md,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    padding: 22,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },

  cardSelected: {
    borderColor: "#0A0A0C",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
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
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },

  iconContainerSelected: {
    backgroundColor: "#0A0A0C",
    borderColor: "#0A0A0C",
  },

  cardHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  radioIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },

  radioIndicatorSelected: {
    backgroundColor: "#F5B800",
    borderColor: "#F5B800",
  },

  chevron: {
    marginLeft: 2,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginTop: spacing.md,
  },

  cardDescription: {
    fontSize: 14.5,
    lineHeight: 21,
    color: "#6B7280",
    marginTop: 6,
  },

  bottomContainer: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
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
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
  },
});