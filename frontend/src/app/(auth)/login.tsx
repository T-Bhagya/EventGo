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
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AppButton from "../../components/AppButton";
import AppTextInput from "../../components/AppTextInput";
import { colors } from "../../theme/colors";
import { radius } from "../../theme/radius";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

export default function LoginScreen() {
  const params = useLocalSearchParams<{ role?: string }>();
  const role = params.role === "organizer" ? "Organizer" : "Attendee";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const insets = useSafeAreaInsets();

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in both email and password.");
      return;
    }

    setError("");
    setLoading(true);

    // Mock authentication delay & navigation
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
              <Text style={styles.roleText}>{role} Mode</Text>
            </View>
          </View>

          {/* Header Title Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to access your {role.toLowerCase()} account.
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
              autoCorrect={false}
            />

            <AppTextInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (error) setError("");
              }}
              leftIcon="lock-closed-outline"
              isPassword
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.forgotRow}>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/(auth)/forgot-password",
                    params: { role: params.role },
                  } as any)
                }
                style={({ pressed }) => [pressed && styles.pressed]}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </Pressable>
            </View>

            <AppButton
              title={loading ? "Signing in..." : "Sign In"}
              onPress={handleLogin}
              disabled={loading}
              style={styles.submitButton}
            />
          </View>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Register Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/(auth)/register",
                  params: { role: params.role },
                } as any)
              }
              style={({ pressed }) => [pressed && styles.pressed]}
            >
              <Text style={styles.signUpText}>Sign Up</Text>
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

  forgotRow: {
    alignItems: "flex-end",
    marginTop: -4,
  },

  forgotText: {
    ...typography.bodyMedium,
    fontSize: 13.5,
    fontWeight: "500",
    color: colors.emerald,
  },

  submitButton: {
    marginTop: spacing.sm,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.xl,
    gap: spacing.md,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  dividerText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },

  footerText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },

  signUpText: {
    ...typography.titleMedium,
    fontSize: 14.5,
    color: colors.primary,
    fontWeight: "600",
  },
});
