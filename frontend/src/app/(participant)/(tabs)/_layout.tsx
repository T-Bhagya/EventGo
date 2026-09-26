import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, Pressable, StyleSheet, View } from "react-native";

/**
 * Floating Center FAB — Oversized amber (+) button
 * Centered in the middle of the dock.
 */
function CenterFAB({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        fabStyles.container,
        pressed && fabStyles.fabPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Explore events"
    >
      <View style={fabStyles.fab}>
        <Ionicons name="add" size={28} color="#000000" />
      </View>
    </Pressable>
  );
}

const fabStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    top: -16,
    zIndex: 99,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F5B800",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(245, 184, 0, 0.45)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  fabPressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.9,
  },
});

/**
 * Floating Dock Bottom Navigation
 * ─────────────────────────────────
 * 5-tab balanced bar with elevated center FAB (+) button.
 * Layout: [Explore] [Events] — [FAB] — [Map] [Profile]
 */
export default function ParticipantTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.floatingDock,
        tabBarItemStyle: styles.tabItem,
        tabBarActiveTintColor: "#111827",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      {/* 1. Explore (Home) */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Explore",
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name={focused ? "compass" : "compass-outline"}
                size={22}
                color={focused ? "#111827" : color}
              />
            </View>
          ),
        }}
      />

      {/* 2. Events */}
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name={focused ? "ticket" : "ticket-outline"}
                size={21}
                color={focused ? "#111827" : color}
              />
            </View>
          ),
        }}
      />

      {/* 3. CENTER FAB — Center tab for floating explore button */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "",
          tabBarButton: (props) => <CenterFAB onPress={props.onPress} />,
        }}
      />

      {/* 4. Map */}
      <Tabs.Screen
        name="location"
        options={{
          title: "Map",
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name={focused ? "map" : "map-outline"}
                size={21}
                color={focused ? "#111827" : color}
              />
            </View>
          ),
        }}
      />

      {/* 5. Profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={21}
                color={focused ? "#111827" : color}
              />
            </View>
          ),
        }}
      />

      {/* Hidden tab routes */}
      <Tabs.Screen
        name="my-events"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingDock: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: Platform.OS === "ios" ? 84 : 66,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 4,
    paddingTop: 6,
    paddingBottom: Platform.OS === "ios" ? 22 : 6,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
    overflow: "visible",
  },

  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
  },

  tabLabel: {
    fontSize: 10.5,
    fontWeight: "600",
    letterSpacing: 0.1,
    marginTop: 2,
  },

  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 24,
  },
});