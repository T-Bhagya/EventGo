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
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AppButton from "../../components/AppButton";
import AppTextInput from "../../components/AppTextInput";
import { colors } from "../../theme/colors";
import { radius } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

export default function RegisterScreen() {
  const params = useLocalSearchParams<{ role?: string }>();
  const role = params.role === "organizer" ? "Organizer" : "Attendee";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (params.role === "organizer") {
        router.replace("/(organizer)/dashboard" as any);
      } else {
        router.replace("/(participant)/(tabs)/home" as any);
      }
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

            <View style={styles.roleBadge}>
              <View style={styles.roleDot} />
              <Text style={styles.roleText}>{role} Account</Text>
            </View>
          </View>

          {/* Header Title Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>
              Sign up as an {role.toLowerCase()} to get started with EventGo.
            </Text>
          </View>

          {/* Form Section */}
          <View style={styles.form}>
            <AppTextInput
              label="Full Name"
              placeholder="Alex Morgan"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (error) setError("");
              }}
              leftIcon="person-outline"
            />

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

            <AppTextInput
              label="Password"
              placeholder="Create password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError("");
              }}
              leftIcon="lock-closed-outline"
              isPassword
            />

            <AppTextInput
              label="Confirm Password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (error) setError("");
              }}
              leftIcon="shield-checkmark-outline"
              isPassword
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Text style={styles.termsText}>
              By signing up, you agree to EventGo's{" "}
              <Text style={styles.termsHighlight}>Terms of Service</Text> and{" "}
              <Text style={styles.termsHighlight}>Privacy Policy</Text>.
            </Text>

            <AppButton
              title={loading ? "Creating Account..." : "Create Account"}
              onPress={handleRegister}
              disabled={loading}
              style={styles.submitButton}
            />
          </View>

          {/* Sign In Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <Pressable
              onPress={() =>
                router.replace({
                  pathname: "/(auth)/login",
                  params: { role: params.role },
                } as any)
              }
              style={({ pressed }) => [pressed && styles.pressed]}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </Pressable>
          </View>
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
    justifyContent: "space-between",
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

  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surfaceSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    gap: 6,
  },

  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.emerald,
  },

  roleText: {
    ...typography.label,
    fontSize: 12,
    color: colors.textPrimary,
  },

  headerSection: {
    marginBottom: spacing.lg,
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

  termsText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    lineHeight: 18,
    marginTop: spacing.xs,
  },

  termsHighlight: {
    color: colors.textSecondary,
    fontWeight: "500",
  },

  submitButton: {
    marginTop: spacing.xs,
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: spacing.xl,
  },

  footerText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },

  signInText: {
    ...typography.titleMedium,
    fontSize: 14.5,
    color: colors.primary,
    fontWeight: "600",
  },
});
