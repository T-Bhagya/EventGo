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

import AppButton from "../../components/AppButton";
import AppTextInput from "../../components/AppTextInput";
import { colors } from "../../theme/colors";
import { radius } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
            </Pressable>
          </View>

          {/* Key Visual Icon */}
          <View style={styles.iconBadge}>
            <Ionicons name="key-outline" size={28} color={colors.emerald} />
          </View>

          {!sent ? (
            <>
              {/* Header Title Section */}
              <View style={styles.headerSection}>
                <Text style={styles.title}>Forgot password?</Text>
                <Text style={styles.subtitle}>
                  No worries! Enter your email address below and we'll send you
                  reset instructions.
                </Text>
              </View>

              {/* Form Section */}
              <View style={styles.form}>
                <AppTextInput
                  label="Email Address"
                  placeholder="name@example.com"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (error) setError("");
                  }}
                  leftIcon="mail-outline"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <AppButton
                  title={loading ? "Sending..." : "Send Reset Link"}
                  onPress={handleReset}
                  disabled={loading}
                  style={styles.submitButton}
                />
              </View>
            </>
          ) : (
            /* Sent Confirmation View */
            <View style={styles.successCard}>
              <View style={styles.successIconWrapper}>
                <Ionicons name="checkmark-circle" size={48} color={colors.emerald} />
              </View>
              <Text style={styles.successTitle}>Check your inbox</Text>
              <Text style={styles.successSubtitle}>
                We sent a password reset link to{"\n"}
                <Text style={styles.emailHighlight}>{email}</Text>
              </Text>

              <AppButton
                title="Back to Sign In"
                onPress={() => router.replace("/(auth)/login" as any)}
                style={styles.backToLoginButton}
              />
            </View>
          )}

          {/* Back to login row */}
          {!sent ? (
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                styles.backToLoginRow,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="arrow-back" size={16} color={colors.textSecondary} />
              <Text style={styles.backToLoginText}>Back to Sign In</Text>
            </Pressable>
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  backButton: {
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
    opacity: 0.7,
  },

  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.emeraldSoft,
    borderWidth: 1,
    borderColor: "rgba(15, 118, 110, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },

  headerSection: {
    marginBottom: spacing.xl,
  },

  title: {
    ...typography.headlineLarge,
    color: colors.textPrimary,
  },

  subtitle: {
    ...typography.bodyLarge,
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  form: {
    gap: spacing.md,
  },

  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    marginTop: -4,
  },

  submitButton: {
    marginTop: spacing.sm,
  },

  backToLoginRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: spacing.xxl,
  },

  backToLoginText: {
    ...typography.titleMedium,
    fontSize: 14.5,
    color: colors.textSecondary,
  },

  successCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    marginTop: spacing.md,
  },

  successIconWrapper: {
    marginBottom: spacing.md,
  },

  successTitle: {
    ...typography.headlineMedium,
    color: colors.textPrimary,
    textAlign: "center",
  },

  successSubtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.xs,
    lineHeight: 22,
  },

  emailHighlight: {
    color: colors.primary,
    fontWeight: "600",
  },

  backToLoginButton: {
    width: "100%",
    marginTop: spacing.xl,
  },
});
