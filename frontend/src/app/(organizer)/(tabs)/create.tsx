import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AppButton from "../../../components/AppButton";
import AppTextInput from "../../../components/AppTextInput";
import CategoryChip from "../../../components/CategoryChip";
import SecondaryButton from "../../../components/SecondaryButton";
import { EventCategory, MOCK_CATEGORIES } from "../../../data/mockEvents";
import { colors } from "../../../theme/colors";
import { radius } from "../../../theme/radius";
import { spacing } from "../../../theme/spacing";
import { typography } from "../../../theme/typography";

export default function CreateEventWizardScreen() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<EventCategory>("Tech");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("Nov 15, 2026");
  const [time, setTime] = useState("10:00 AM - 04:00 PM");
  const [location, setLocation] = useState("Innovation Hall 101, Main Campus");
  const [isVirtual, setIsVirtual] = useState(false);
  const [price, setPrice] = useState("Free");
  const [capacity, setCapacity] = useState("250");
  const [pinCode, setPinCode] = useState("7721");
  const [published, setPublished] = useState(false);

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => (prev + 1) as any);
    } else if (step === 4) {
      setStep(5);
    }
  };

  const handlePublish = () => {
    setPublished(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create New Event</Text>
            <Text style={styles.headerSub}>Step {step} of 4 • {step === 1 ? "Basic Info" : step === 2 ? "Date & Time" : step === 3 ? "Location" : "Settings"}</Text>
          </View>

          {/* Progress Dots */}
          {!published ? (
            <View style={styles.stepProgressRow}>
              {[1, 2, 3, 4].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.stepBar,
                    i <= step && styles.stepBarActive,
                  ]}
                />
              ))}
            </View>
          ) : null}

          {published ? (
            /* Publish Success View */
            <View style={styles.successContainer}>
              <View style={styles.successCircle}>
                <Ionicons name="checkmark-sharp" size={48} color={colors.white} />
              </View>

              <Text style={styles.successTitle}>Event Published!</Text>
              <Text style={styles.successSub}>
                Your event <Text style={{ fontWeight: "700" }}>{title || "New Campus Event"}</Text> is now live for attendees to discover and register.
              </Text>

              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Category</Text>
                  <Text style={styles.summaryVal}>{category}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Date</Text>
                  <Text style={styles.summaryVal}>{date}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Check-In PIN</Text>
                  <Text style={styles.summaryVal}>{pinCode}</Text>
                </View>
              </View>

              <AppButton
                title="Go to Organizer Dashboard"
                onPress={() => router.replace("/(organizer)/(tabs)/dashboard" as any)}
                style={{ width: "100%", marginTop: spacing.lg }}
              />
            </View>
          ) : step === 1 ? (
            /* Step 1: Basic Info */
            <View style={styles.formSection}>
              <Text style={styles.sectionHeading}>Basic Information</Text>
              <AppTextInput
                label="Event Title"
                placeholder="e.g. Annual Campus Hackathon 2026"
                value={title}
                onChangeText={setTitle}
              />

              <View style={styles.categoryPicker}>
                <Text style={styles.fieldLabel}>Select Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {MOCK_CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <CategoryChip
                      key={cat}
                      label={cat}
                      selected={category === cat}
                      onPress={() => setCategory(cat)}
                    />
                  ))}
                </ScrollView>
              </View>

              <AppTextInput
                label="Event Description"
                placeholder="Briefly describe what attendees will experience..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                inputStyle={{ height: 90, textAlignVertical: "top", paddingTop: 10 }}
              />
            </View>
          ) : step === 2 ? (
            /* Step 2: Date & Time */
            <View style={styles.formSection}>
              <Text style={styles.sectionHeading}>Date & Time Schedule</Text>
              <AppTextInput
                label="Event Date"
                placeholder="Nov 15, 2026"
                value={date}
                onChangeText={setDate}
                leftIcon="calendar-outline"
              />

              <AppTextInput
                label="Time Range"
                placeholder="10:00 AM - 04:00 PM"
                value={time}
                onChangeText={setTime}
                leftIcon="time-outline"
              />
            </View>
          ) : step === 3 ? (
            /* Step 3: Location & Format */
            <View style={styles.formSection}>
              <Text style={styles.sectionHeading}>Venue Location & Format</Text>

              <View style={styles.formatToggleRow}>
                <Pressable
                  onPress={() => setIsVirtual(false)}
                  style={[styles.formatBtn, !isVirtual && styles.formatBtnActive]}
                >
                  <Ionicons name="location-outline" size={18} color={!isVirtual ? colors.primary : colors.textMuted} />
                  <Text style={[styles.formatText, !isVirtual && styles.formatTextActive]}>In-Person Venue</Text>
                </Pressable>

                <Pressable
                  onPress={() => setIsVirtual(true)}
                  style={[styles.formatBtn, isVirtual && styles.formatBtnActive]}
                >
                  <Ionicons name="videocam-outline" size={18} color={isVirtual ? colors.primary : colors.textMuted} />
                  <Text style={[styles.formatText, isVirtual && styles.formatTextActive]}>Virtual / Online</Text>
                </Pressable>
              </View>

              <AppTextInput
                label={isVirtual ? "Virtual Stream Link / Platform" : "Venue Address / Room Number"}
                placeholder={isVirtual ? "https://zoom.us/j/123456" : "Auditorium Hall B, Science Building"}
                value={location}
                onChangeText={setLocation}
                leftIcon={isVirtual ? "link-outline" : "navigate-outline"}
              />
            </View>
          ) : (
            /* Step 4: Registration Settings & Preview */
            <View style={styles.formSection}>
              <Text style={styles.sectionHeading}>Registration & Attendance PIN</Text>
              <AppTextInput
                label="Max Attendee Capacity"
                placeholder="250"
                value={capacity}
                onChangeText={setCapacity}
                keyboardType="numeric"
                leftIcon="people-outline"
              />

              <AppTextInput
                label="Ticket Price"
                placeholder="Free or $15"
                value={price}
                onChangeText={setPrice}
                leftIcon="pricetag-outline"
              />

              <AppTextInput
                label="Generated Check-In PIN"
                placeholder="7721"
                value={pinCode}
                onChangeText={setPinCode}
                leftIcon="key-outline"
              />

              {/* Preview Card Box */}
              <View style={styles.previewBox}>
                <Text style={styles.previewBoxTitle}>Event Preview Summary</Text>
                <Text style={styles.previewEventTitle}>{title || "Untitled Event"}</Text>
                <Text style={styles.previewEventSub}>{category} • {date} • {price}</Text>
              </View>
            </View>
          )}

          {/* Navigation Controls */}
          {!published ? (
            <View style={styles.controlRow}>
              {step > 1 ? (
                <SecondaryButton
                  title="Back"
                  onPress={() => setStep((prev) => (prev - 1) as any)}
                  style={{ flex: 1 }}
                />
              ) : null}

              <AppButton
                title={step === 4 ? "Publish Event" : "Next Step"}
                onPress={step === 4 ? handlePublish : handleNext}
                style={{ flex: 1 }}
              />
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xl,
  },

  header: {
    marginBottom: spacing.sm,
  },

  headerTitle: {
    ...typography.headlineLarge,
    color: colors.textPrimary,
  },

  headerSub: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: 2,
  },

  stepProgressRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: spacing.lg,
  },

  stepBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderSoft,
  },

  stepBarActive: {
    backgroundColor: colors.emerald,
  },

  formSection: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },

  sectionHeading: {
    ...typography.titleLarge,
    fontSize: 18,
    color: colors.textPrimary,
  },

  categoryPicker: {
    gap: 6,
  },

  fieldLabel: {
    ...typography.bodyMedium,
    fontSize: 13,
    fontWeight: "500",
    color: colors.textPrimary,
  },

  formatToggleRow: {
    flexDirection: "row",
    gap: spacing.md,
  },

  formatBtn: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  formatBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceSoft,
  },

  formatText: {
    ...typography.titleMedium,
    fontSize: 13.5,
    color: colors.textMuted,
  },

  formatTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },

  previewBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.sm,
  },

  previewBoxTitle: {
    ...typography.label,
    fontSize: 11,
    color: colors.emerald,
    letterSpacing: 1,
    marginBottom: 4,
  },

  previewEventTitle: {
    ...typography.titleLarge,
    fontSize: 16,
    color: colors.textPrimary,
  },

  previewEventSub: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },

  controlRow: {
    flexDirection: "row",
    gap: spacing.md,
  },

  successContainer: {
    alignItems: "center",
    paddingVertical: spacing.lg,
  },

  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.emerald,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },

  successTitle: {
    ...typography.headlineLarge,
    color: colors.textPrimary,
  },

  successSub: {
    ...typography.bodyLarge,
    fontSize: 14.5,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 20,
  },

  summaryCard: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.lg,
    gap: 8,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  summaryLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  summaryVal: {
    ...typography.titleMedium,
    fontSize: 13.5,
    color: colors.primary,
  },
});
