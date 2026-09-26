import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

export type SearchBarProps = Omit<TextInputProps, "style"> & {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  onFilterPress?: () => void;
  hasActiveFilters?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

/**
 * SearchBar - EventGo minimalist search bar component.
 * Height: 60px, Radius: 30px, White surface, soft shadow, subtle border #ECEEF2.
 */
export function SearchBar({
  value,
  onChangeText,
  onClear,
  onFilterPress,
  hasActiveFilters = false,
  containerStyle,
  placeholder = "Search events, venues or organizers",
  ...restProps
}: SearchBarProps) {
  const handleClear = () => {
    onChangeText("");
    onClear?.();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputWrapper}>
        <Ionicons
          name="search-outline"
          size={21}
          color={colors.emerald}
          style={styles.searchIcon}
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          returnKeyType="search"
          {...restProps}
        />

        {value.length > 0 ? (
          <Pressable
            onPress={handleClear}
            style={styles.clearButton}
            accessibilityRole="button"
            accessibilityLabel="Clear search text"
          >
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </Pressable>
        ) : null}

        {onFilterPress ? (
          <Pressable
            onPress={onFilterPress}
            style={({ pressed }) => [
              styles.filterButton,
              hasActiveFilters && styles.filterButtonActive,
              pressed && styles.filterButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Open filters"
          >
            <Ionicons
              name="options-outline"
              size={18}
              color={hasActiveFilters ? colors.white : "#121316"}
            />
            {hasActiveFilters ? <View style={styles.filterBadgeDot} /> : null}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },

  inputWrapper: {
    flex: 1,
    height: 60, // 58-62px specification
    backgroundColor: "#FFFFFF",
    borderRadius: 30, // 28-31px specification
    borderWidth: 1,
    borderColor: "#ECEEF2",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,

    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },

  searchIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    height: "100%",
    ...typography.bodyMedium,
    fontSize: 14.5,
    color: "#121316",
    paddingVertical: 0,
  },

  clearButton: {
    padding: 4,
    marginRight: 4,
  },

  filterButton: {
    width: 38,
    height: 38,
    backgroundColor: "#F3F4F7",
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  filterButtonActive: {
    backgroundColor: "#121316",
  },

  filterButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.94 }],
  },

  filterBadgeDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.emeraldBright,
  },
});
