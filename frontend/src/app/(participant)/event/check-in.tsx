import React, { useState } from "react";
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

export default function AttendanceCheckInScreen() {
  const { id, pinCode: defaultPin } = useLocalSearchParams<{
    id?: string;
    pinCode?: string;
  }>();

  const event = MOCK_EVENTS.find((e) => e.id === id) || MOCK_EVENTS[0];
  const targetPin = defaultPin || event.pinCode || "8492";

  const [mode, setMode] = useState<"qr" | "pin">("pin");
  const [enteredPin, setEnteredPin] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleKeyPress = (digit: string) => {
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);

      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
    if (status !== "idle") setStatus("idle");
  };

  const verifyPin = (pin: string) => {
    if (pin === targetPin || pin === "1234" || pin === "8492") {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          >
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Event Check-In</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Mode Selector */}
        <View style={styles.modeContainer}>
          <Pressable
            onPress={() => {
              setMode("pin");
              setStatus("idle");
            }}
            style={[
              styles.modeTab,
              mode === "pin" && styles.modeTabActive,
            ]}
          >
            <Ionicons
              name="keypad-outline"
              size={18}
              color={mode === "pin" ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.modeText,
                mode === "pin" && styles.modeTextActive,
              ]}
            >
              PIN Attendance
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setMode("qr");
              setStatus("idle");
            }}
            style={[
              styles.modeTab,
              mode === "qr" && styles.modeTabActive,
            ]}
          >
            <Ionicons
              name="qr-code-outline"
              size={18}
              color={mode === "qr" ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.modeText,
                mode === "qr" && styles.modeTextActive,
              ]}
            >
              QR Pass Scanner
            </Text>
          </Pressable>
        </View>

        {status === "success" ? (
          /* Check-In Success State */
          <View style={styles.successBox}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-sharp" size={48} color={colors.white} />
            </View>

            <Text style={styles.successTitle}>Attendance Marked!</Text>
            <Text style={styles.successSub}>
              You have successfully checked into{"\n"}
              <Text style={styles.eventTitleHighlight}>{event.title}</Text>
            </Text>

            <View style={styles.stampCard}>
              <Text style={styles.stampLabel}>VERIFIED ATTENDEE</Text>
              <Text style={styles.stampTime}>Time: 09:42 AM • Room A1</Text>
            </View>

            <AppButton
              title="Return to My Events"
              onPress={() => router.replace("/(participant)/(tabs)/my-events" as any)}
              style={styles.doneBtn}
            />
          </View>
        ) : mode === "pin" ? (
          /* PIN Keypad Mode */
          <ScrollView
            contentContainerStyle={styles.pinContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.pinInstruction}>
              Enter the 4-digit PIN provided by the event organizer
            </Text>

            {/* PIN Code Box Indicators */}
            <View style={styles.pinBoxesRow}>
              {[0, 1, 2, 3].map((index) => {
                const char = enteredPin[index] || "";
                return (
                  <View
                    key={index}
                    style={[
                      styles.pinDotBox,
                      char !== "" && styles.pinDotBoxFilled,
                      status === "error" && styles.pinDotBoxError,
                    ]}
                  >
                    <Text style={styles.pinDotText}>{char ? "•" : ""}</Text>
                  </View>
                );
              })}
            </View>

            {status === "error" ? (
              <Text style={styles.errorLabel}>
                Incorrect PIN code. Try PIN: {targetPin}
              </Text>
            ) : null}

            {/* Keypad */}
            <View style={styles.keypadGrid}>
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map(
                (item, idx) => {
                  if (item === "") return <View key={idx} style={styles.keyItem} />;
                  if (item === "del") {
                    return (
                      <Pressable
                        key={idx}
                        onPress={handleDelete}
                        style={({ pressed }) => [
                          styles.keyItem,
                          pressed && styles.keyPressed,
                        ]}
                      >
                        <Ionicons
                          name="backspace-outline"
                          size={22}
                          color={colors.textPrimary}
                        />
                      </Pressable>
                    );
                  }
                  return (
                    <Pressable
                      key={idx}
                      onPress={() => handleKeyPress(item)}
                      style={({ pressed }) => [
                        styles.keyItem,
                        pressed && styles.keyPressed,
                      ]}
                    >
                      <Text style={styles.keyText}>{item}</Text>
                    </Pressable>
                  );
                }
              )}
            </View>

            {/* Demo Helper Button */}
            <Pressable
              onPress={() => verifyPin(targetPin)}
              style={styles.autoFillBtn}
            >
              <Text style={styles.autoFillText}>Demo: Auto-enter PIN ({targetPin})</Text>
            </Pressable>
          </ScrollView>
        ) : (
          /* QR Code Scanner Mode */
          <View style={styles.qrContainer}>
            <View style={styles.scannerFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />

              <Ionicons name="qr-code" size={120} color="rgba(15, 118, 110, 0.4)" />
              <Text style={styles.scannerText}>Scanning event pass QR...</Text>
            </View>

            <AppButton
              title="Simulate Instant QR Scan"
              onPress={() => setStatus("success")}
              style={{ width: "100%", marginTop: spacing.xl }}
            />
          </View>
        )}
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xs,
    marginBottom: spacing.md,
  },

  backBtn: {
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

  headerTitle: {
    ...typography.titleLarge,
    fontSize: 18,
    color: colors.textPrimary,
  },

  modeContainer: {
    flexDirection: "row",
    marginHorizontal: spacing.screen,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.md,
    padding: 4,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },

  modeTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: radius.sm,
  },

  modeTabActive: {
    backgroundColor: colors.surface,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  modeText: {
    ...typography.label,
    fontSize: 12.5,
    color: colors.textMuted,
  },

  modeTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },

  pinContent: {
    paddingHorizontal: spacing.screen,
    alignItems: "center",
    paddingBottom: spacing.xl,
  },

  pinInstruction: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },

  pinBoxesRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: spacing.md,
  },

  pinDotBox: {
    width: 56,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  pinDotBoxFilled: {
    borderColor: colors.emerald,
    backgroundColor: colors.emeraldSoft,
  },

  pinDotBoxError: {
    borderColor: colors.error,
    backgroundColor: colors.errorSoft,
  },

  pinDotText: {
    ...typography.display,
    fontSize: 32,
    color: colors.primary,
  },

  errorLabel: {
    ...typography.bodySmall,
    color: colors.error,
    marginBottom: spacing.md,
  },

  keypadGrid: {
    width: "100%",
    maxWidth: 320,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    justifyContent: "center",
    marginTop: spacing.md,
  },

  keyItem: {
    width: 80,
    height: 60,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  keyPressed: {
    backgroundColor: colors.surfaceSoft,
    borderColor: colors.primary,
  },

  keyText: {
    ...typography.titleLarge,
    fontSize: 22,
    color: colors.primary,
  },

  autoFillBtn: {
    marginTop: spacing.xl,
    paddingVertical: 8,
  },

  autoFillText: {
    ...typography.bodySmall,
    color: colors.emerald,
    fontWeight: "600",
  },

  qrContainer: {
    flex: 1,
    paddingHorizontal: spacing.screen,
    alignItems: "center",
    justifyContent: "center",
  },

  scannerFrame: {
    width: 240,
    height: 240,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    gap: spacing.sm,
  },

  scannerText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: colors.emerald,
  },

  topLeft: {
    top: 10,
    left: 10,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },

  topRight: {
    top: 10,
    right: 10,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },

  bottomLeft: {
    bottom: 10,
    left: 10,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },

  bottomRight: {
    bottom: 10,
    right: 10,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },

  successBox: {
    flex: 1,
    paddingHorizontal: spacing.screen,
    alignItems: "center",
    justifyContent: "center",
  },

  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.emerald,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    shadowColor: colors.emerald,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 4,
  },

  successTitle: {
    ...typography.headlineLarge,
    color: colors.textPrimary,
  },

  successSub: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 20,
  },

  eventTitleHighlight: {
    color: colors.primary,
    fontWeight: "700",
  },

  stampCard: {
    backgroundColor: colors.emeraldSoft,
    borderWidth: 1,
    borderColor: "rgba(15, 118, 110, 0.3)",
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginVertical: spacing.xl,
    gap: 4,
  },

  stampLabel: {
    ...typography.label,
    fontSize: 12,
    letterSpacing: 1.5,
    color: colors.emerald,
    fontWeight: "700",
  },

  stampTime: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },

  doneBtn: {
    width: "100%",
  },
});
