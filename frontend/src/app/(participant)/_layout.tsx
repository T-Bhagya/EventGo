import React from "react";
import { Stack } from "expo-router";

import { NavScrollProvider } from "../../context/NavScrollContext";
import { colors } from "../../theme/colors";

export default function ParticipantLayout() {
  return (
    <NavScrollProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="calendar" />
        <Stack.Screen name="search" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="event/[id]" />
        <Stack.Screen name="event/registration-success" />
        <Stack.Screen name="event/check-in" />
      </Stack>
    </NavScrollProvider>
  );
}
