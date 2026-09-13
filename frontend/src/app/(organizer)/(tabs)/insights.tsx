import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import SectionHeader from "../../../components/SectionHeader";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { typography } from "../../../theme/typography";

export default function OrganizerAnalyticsScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Registration Analytics</Text>
          <Text style={styles.subtitle}>
            Performance metrics, attendance rates & registration velocity
          </Text>
        </View>

        {/* Overview Stat Cards */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Total Attendance Performance</Text>
          <Text style={styles.overviewNumber}>1,205</Text>
          <Text style={styles.overviewSub}>+18.4% growth compared to last month</Text>

          <View style={styles.barChartContainer}>
            <View style={styles.chartBarCol}>
              <View style={[styles.bar, { height: 60 }]} />
              <Text style={styles.barLabel}>Mon</Text>
            </View>
            <View style={styles.chartBarCol}>
              <View style={[styles.bar, { height: 95 }]} />
              <Text style={styles.barLabel}>Tue</Text>
            </View>
            <View style={styles.chartBarCol}>
              <View style={[styles.bar, { height: 130, backgroundColor: colors.emerald }]} />
              <Text style={styles.barLabel}>Wed</Text>
            </View>
            <View style={styles.chartBarCol}>
              <View style={[styles.bar, { height: 80 }]} />
              <Text style={styles.barLabel}>Thu</Text>
            </View>
            <View style={styles.chartBarCol}>
              <View style={[styles.bar, { height: 110 }]} />
              <Text style={styles.barLabel}>Fri</Text>
            </View>
            <View style={styles.chartBarCol}>
              <View style={[styles.bar, { height: 40 }]} />
              <Text style={styles.barLabel}>Sat</Text>
            </View>
          </View>
        </View>

        {/* Channel Breakdowns */}
        <View style={styles.section}>
          <SectionHeader title="Registration Sources" />

          <View style={styles.channelCard}>
            <View style={styles.channelRow}>
              <Ionicons name="link-outline" size={18} color={colors.emerald} />
              <Text style={styles.channelName}>Campus Direct Link</Text>
              <Text style={styles.channelVal}>64%</Text>
            </View>
            <View style={styles.channelRow}>
              <Ionicons name="compass-outline" size={18} color={colors.gold} />
              <Text style={styles.channelName}>EventGo Discovery Feed</Text>
              <Text style={styles.channelVal}>26%</Text>
            </View>
            <View style={styles.channelRow}>
              <Ionicons name="share-social-outline" size={18} color={colors.primary} />
              <Text style={styles.channelName}>Social & Referral Invites</Text>
              <Text style={styles.channelVal}>10%</Text>
            </View>
          </View>
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

  subtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: 2,
  },

  overviewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },

  overviewTitle: {
    ...typography.label,
    fontSize: 11,
    color: colors.emerald,
    letterSpacing: 1,
  },

  overviewNumber: {
    ...typography.display,
    fontSize: 34,
    color: colors.primary,
    marginTop: 2,
  },

  overviewSub: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  barChartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 140,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },

  chartBarCol: {
    alignItems: "center",
    gap: 6,
  },

  bar: {
    width: 28,
    borderRadius: radius.xs,
    backgroundColor: colors.surfaceSoft,
  },

  barLabel: {
    ...typography.label,
    fontSize: 11,
    color: colors.textMuted,
  },

  section: {
    marginBottom: spacing.lg,
  },

  channelCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 12,
  },

  channelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  channelName: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    flex: 1,
  },

  channelVal: {
    ...typography.titleMedium,
    fontSize: 14,
    color: colors.primary,
    fontWeight: "700",
  },
});
