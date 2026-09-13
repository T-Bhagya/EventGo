import React, { useState } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

export type AppTextInputProps = Omit<TextInputProps, "style"> & {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  isPassword?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

/**
 * AppTextInput - Minimalist, high-end form input component for EventGo.
 * Complies with 52px height, 12px corner radius, thin borders, and focus highlight.
 */
export function AppTextInput({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isPassword = false,
  containerStyle,
  inputStyle,
  secureTextEntry,
  onFocus,
  onBlur,
  ...restProps
}: AppTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isSecure = isPassword ? !showPassword : secureTextEntry;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          Boolean(error) && styles.inputWrapperError,
        ]}
      >
        {leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={20}
            color={
              error
                ? colors.error
                : isFocused
                ? colors.primary
                : colors.textMuted
            }
            style={styles.leftIcon}
          />
        ) : null}

        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[styles.input, leftIcon ? styles.inputWithLeft : null, inputStyle]}
          secureTextEntry={isSecure}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...restProps}
        />

        {isPassword ? (
          <Pressable
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.iconPressable}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? "Hide password" : "Show password"}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        ) : rightIcon ? (
          <Pressable
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={styles.iconPressable}
          >
            <Ionicons name={rightIcon} size={20} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export default AppTextInput;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  label: {
    ...typography.bodyMedium,
    fontSize: 13,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 6,
  },

  inputWrapper: {
    height: 52,
    backgroundColor: colors.surface,
    borderRadius: radius.md, // 12px
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },

  inputWrapperFocused: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },

  inputWrapperError: {
    borderColor: colors.error,
    backgroundColor: colors.surface,
  },

  leftIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: "100%",
    ...typography.bodyLarge,
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: 0,
  },

  inputWithLeft: {
    paddingLeft: 0,
  },

  iconPressable: {
    padding: 6,
    marginLeft: 4,
  },

  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    marginTop: 4,
    marginLeft: 2,
  },
});
