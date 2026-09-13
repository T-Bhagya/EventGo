import React, { createContext, useContext, useRef } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import {
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

type NavScrollContextType = {
  navTranslateY: { value: number };
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onScrollEnd: () => void;
};

const NavScrollContext = createContext<NavScrollContextType | null>(null);

export function NavScrollProvider({ children }: { children: React.ReactNode }) {
  const navTranslateY = useSharedValue(0);
  const lastScrollY = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollY.current;

    // Only react after passing initial top inset
    if (currentY > 40) {
      if (diff > 8) {
        // Scrolling down -> hide nav bar smoothly
        navTranslateY.value = withTiming(100, {
          duration: 250,
          easing: Easing.out(Easing.quad),
        });
      } else if (diff < -8) {
        // Scrolling up -> show nav bar smoothly
        navTranslateY.value = withTiming(0, {
          duration: 200,
          easing: Easing.out(Easing.quad),
        });
      }
    } else {
      // Near top -> always show
      navTranslateY.value = withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.quad),
      });
    }

    lastScrollY.current = currentY;

    // Reset timer to show bar after scrolling stops completely
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      navTranslateY.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      });
    }, 1200);
  };

  const onScrollEnd = () => {
    navTranslateY.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.quad),
    });
  };

  return (
    <NavScrollContext.Provider value={{ navTranslateY, onScroll, onScrollEnd }}>
      {children}
    </NavScrollContext.Provider>
  );
}

export function useNavScroll() {
  const context = useContext(NavScrollContext);
  if (!context) {
    // Fallback if used outside provider
    const navTranslateY = useSharedValue(0);
    return {
      navTranslateY,
      onScroll: () => {},
      onScrollEnd: () => {},
    };
  }
  return context;
}
