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
import { spacing } from "../../theme/spacing";

export default function LoginScreen() {
  const params = useLocalSearchParams<{ role?: string }>();
  const role = params.role === "organizer" ? "Organizer" : "Attendee";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in both email and password.");
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
              <Ionicons name="arrow-back" size={20} color="#111827" />
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
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },

  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 6,
  },
  roleDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#F5B800",
  },
  roleText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },

  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14.5,
    color: "#6B7280",
    marginTop: 6,
  },

  form: {
    gap: 16,
  },
  errorText: {
    fontSize: 12.5,
    color: "#EF4444",
    marginTop: -4,
  },

  forgotRow: {
    alignItems: "flex-end",
    marginTop: -4,
  },
  forgotText: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#0A0A0C",
  },

  submitButton: {
    marginTop: 8,
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    gap: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    fontSize: 12.5,
    color: "#9CA3AF",
  },

  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
  },
  signUpText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0A0A0C",
  },
});
