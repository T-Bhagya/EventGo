import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import AppButton from "../components/AppButton";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>EventGo</Text>

      <Text style={styles.subtitle}>
        Discover. Connect. Experience.
      </Text>

      <AppButton
        title="Get Started"
        onPress={() => {
          router.push("/role-selection");
        }}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    paddingHorizontal: spacing.screen,
  },

  logo: {
    ...typography.display,
    color: colors.textPrimary,
    textAlign: "center",
  },

  subtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.sm,
  },

  button: {
    marginTop: spacing.xl,
  },
});