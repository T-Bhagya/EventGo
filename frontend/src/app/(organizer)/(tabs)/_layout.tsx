import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, Pressable, StyleSheet, View } from "react-native";

/**
 * Floating Center FAB — Oversized amber (+) Create Event button
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
      accessibilityLabel="Create event"
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

export default function OrganizerTabsLayout() {
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
      {/* 1. Dashboard */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name={focused ? "grid" : "grid-outline"}
                size={21}
                color={focused ? "#111827" : color}
              />
            </View>
          ),
        }}
      />

      {/* 2. My Events */}
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name={focused ? "calendar" : "calendar-outline"}
                size={21}
                color={focused ? "#111827" : color}
              />
            </View>
          ),
        }}
      />

      {/* 3. CENTER FAB — Create Event */}
      <Tabs.Screen
        name="create"
        options={{
          title: "",
          tabBarButton: (props) => <CenterFAB onPress={props.onPress} />,
        }}
      />

      {/* 4. Analytics */}
      <Tabs.Screen
        name="insights"
        options={{
          title: "Analytics",
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name={focused ? "stats-chart" : "stats-chart-outline"}
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
          title: "Organizer",
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
