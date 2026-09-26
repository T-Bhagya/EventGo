import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

import CategoryChip from "../../../components/CategoryChip";
import { useNavScroll } from "../../../context/NavScrollContext";
import {
  EventCategory,
  EventItem,
  MOCK_CATEGORIES,
  MOCK_EVENTS,
} from "../../../data/mockEvents";
import { colors } from "../../../theme/colors";
import { typography } from "../../../theme/typography";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const FEATURED_CARD_WIDTH = SCREEN_WIDTH * 0.72;
const FEATURED_CARD_HEIGHT = FEATURED_CARD_WIDTH * 1.25; // ~4:5 aspect

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// § AVATAR STACK — Overlapping participant avatars
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const AVATAR_URLS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=60&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80",
];

function AvatarStack({ count, initials }: { count: number; initials: string[] }) {
  return (
    <View style={avatarS.row}>
      {AVATAR_URLS.map((url, i) => (
        <View
          key={i}
          style={[avatarS.ring, { marginLeft: i === 0 ? 0 : -10, zIndex: 3 - i }]}
        >
          <Image source={{ uri: url }} style={avatarS.img} contentFit="cover" />
        </View>
      ))}
      <Text style={avatarS.count}>+{count} going</Text>
    </View>
  );
}
const avatarS = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
  ring: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.darkCard,
    overflow: "hidden",
  },
  img: { width: "100%", height: "100%" },
  count: {
    ...typography.label,
    fontSize: 11,
    color: colors.textOnDarkMuted,
    marginLeft: 8,
  },
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// § FEATURED SPOTLIGHT CARD — Large carousel hero cards
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function FeaturedCard({
  event,
  onPress,
}: {
  event: EventItem;
  onPress: (e: EventItem) => void;
}) {
  const dateMonth = event.date.split(" ")[0]?.toUpperCase() ?? "";
  const dateDay = event.date.split(" ")[1]?.replace(",", "") ?? "";
  const isFree = event.price === "Free" || event.price === "Free Entry";

  return (
    <Pressable
      onPress={() => onPress(event)}
      style={({ pressed }) => [featS.card, pressed && featS.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`View featured event ${event.title}`}
    >
      {/* Background Image */}
      <Image
        source={{ uri: event.imageUrl }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={400}
      />

      {/* Gradient overlay — top fade + bottom heavy */}
      <LinearGradient
        colors={[
          "rgba(10,10,12,0.3)",
          "rgba(10,10,12,0.05)",
          "rgba(10,10,12,0.6)",
          "rgba(10,10,12,0.92)",
        ]}
        locations={[0, 0.3, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* ── TOP ROW: Badges ─────────────────────────────────────────── */}
      <View style={featS.topRow}>
        {/* Left: FEATURED pill */}
        <View style={featS.featuredPill}>
          <Ionicons name="flash" size={10} color="#000" />
          <Text style={featS.featuredText}>FEATURED</Text>
        </View>

        {/* Right: Category pill & Bookmark */}
        <View style={featS.topRight}>
          <View style={featS.categoryPill}>
            <Text style={featS.categoryText}>{event.category}</Text>
          </View>

          <Pressable style={featS.bookmarkBtn} accessibilityLabel="Save event">
            <Ionicons name="bookmark-outline" size={16} color="#000000" />
          </Pressable>
        </View>
      </View>

      {/* ── BOTTOM CONTENT ──────────────────────────────────────────── */}
      <View style={featS.bottom}>
        <Text style={featS.dateTimeLabel}>
          {event.date.toUpperCase()} • {event.time.split("-")[0].trim()}
        </Text>

        <Text style={featS.title} numberOfLines={2}>
          {event.title}
        </Text>

        <View style={featS.locationRow}>
          <Ionicons name="location" size={13} color="rgba(255,255,255,0.8)" />
          <Text style={featS.locationText} numberOfLines={1}>
            {event.location.split("•")[0].trim()}
          </Text>
        </View>

        {/* Footer: avatars + price */}
        <View style={featS.footer}>
          <AvatarStack
            count={event.attendeesCount}
            initials={["JD", "AL", "RL"]}
          />
          <View
            style={[featS.pricePill, isFree && featS.pricePillFree]}
          >
            <Text
              style={[featS.priceText, isFree && featS.priceTextFree]}
            >
              {event.price}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const featS = StyleSheet.create({
  card: {
    width: FEATURED_CARD_WIDTH,
    height: FEATURED_CARD_HEIGHT,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: colors.darkCard,
    position: "relative",
  },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.96 },

  // Top row
  topRow: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    zIndex: 2,
  },
  dateBadge: {
    backgroundColor: "rgba(245,184,0,0.92)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: "center",
    minWidth: 42,
  },
  dateMonth: {
    ...typography.label,
    fontSize: 9,
    color: "#000",
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  dateDay: {
    ...typography.titleLarge,
    fontSize: 18,
    fontWeight: "800",
    color: "#000",
    lineHeight: 22,
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  featuredPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
  },
  featuredText: {
    ...typography.label,
    fontSize: 9,
    color: "#000000",
    fontWeight: "800",
    letterSpacing: 1,
  },
  categoryPill: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 50,
  },
  categoryText: {
    ...typography.label,
    fontSize: 11,
    color: "#000000",
    fontWeight: "700",
  },
  bookmarkBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  // Bottom
  bottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
    paddingTop: 24,
  },
  dateTimeLabel: {
    ...typography.label,
    fontSize: 10.5,
    color: colors.amber,
    fontWeight: "700",
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  title: {
    ...typography.titleLarge,
    fontSize: 18,
    lineHeight: 24,
    color: "#FFF",
    fontWeight: "700",
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 14,
  },
  locationText: {
    ...typography.bodySmall,
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pricePill: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 50,
  },
  pricePillFree: {
    backgroundColor: "#FFFFFF",
  },
  priceText: {
    ...typography.label,
    fontSize: 12,
    color: "#000000",
    fontWeight: "800",
  },
  priceTextFree: {
    color: "#000000",
  },
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// § SPECIAL OFFER BANNER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SpecialOfferBanner() {
  return (
    <View style={bannerS.container}>
      {/* Subtle gradient overlay */}
      <LinearGradient
        colors={["rgba(22,22,24,1)", "rgba(13,13,15,1)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={bannerS.inner}>
        <View style={bannerS.left}>
          {/* Tag */}
          <View style={bannerS.tag}>
            <Text style={bannerS.tagText}>SPECIAL OFFER</Text>
          </View>

          <Text style={bannerS.heading}>Invite your friends</Text>
          <Text style={bannerS.sub}>
            Get Rs.500 ride credit for every{"\n"}ticket booked.
          </Text>

          <Pressable
            style={({ pressed }) => [bannerS.cta, pressed && { opacity: 0.85 }]}
          >
            <Text style={bannerS.ctaText}>Invite Now</Text>
          </Pressable>
        </View>

        {/* Right graphic */}
        <View style={bannerS.giftBox}>
          <Text style={bannerS.giftEmoji}>🎁</Text>
          <Text style={bannerS.giftLabel}>Rs.500</Text>
          <Text style={bannerS.giftOff}>OFF</Text>
        </View>
      </View>
    </View>
  );
}

const bannerS = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 24,
    overflow: "hidden",
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 22,
  },
  left: { flex: 1, paddingRight: 14 },
  tag: {
    backgroundColor: "rgba(0,196,140,0.15)",
    borderWidth: 1,
    borderColor: "rgba(0,196,140,0.3)",
    alignSelf: "flex-start",
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 50,
    marginBottom: 10,
  },
  tagText: {
    ...typography.label,
    fontSize: 9,
    color: colors.mint,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  heading: {
    ...typography.titleLarge,
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 6,
  },
  sub: {
    ...typography.bodySmall,
    fontSize: 12.5,
    color: colors.textOnDarkMuted,
    lineHeight: 18,
    marginBottom: 18,
  },
  cta: {
    backgroundColor: colors.amber,
    alignSelf: "flex-start",
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 50,
    shadowColor: colors.amber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  ctaText: {
    ...typography.label,
    fontSize: 13,
    fontWeight: "800",
    color: "#000",
  },
  giftBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  giftEmoji: { fontSize: 24, marginBottom: 2 },
  giftLabel: {
    ...typography.label,
    fontSize: 12,
    color: colors.amber,
    fontWeight: "800",
    lineHeight: 15,
  },
  giftOff: {
    ...typography.label,
    fontSize: 9,
    color: colors.textOnDarkMuted,
    fontWeight: "700",
    letterSpacing: 1,
  },
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// § NEARBY EVENT ROW — Compact horizontal list card
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function NearbyCard({
  event,
  onPress,
  distance,
}: {
  event: EventItem;
  onPress: (e: EventItem) => void;
  distance: string;
}) {
  const dateParts = event.date.split(" ");
  const mon = (dateParts[0] ?? "").toUpperCase().slice(0, 3);
  const day = (dateParts[1] ?? "").replace(",", "");
  const isFree = event.price === "Free" || event.price === "Free Entry";

  return (
    <Pressable
      onPress={() => onPress(event)}
      style={({ pressed }) => [nearS.card, pressed && nearS.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`View nearby event ${event.title}`}
    >
      {/* Left: Image thumbnail with date overlay */}
      <View style={nearS.thumb}>
        <Image
          source={{ uri: event.imageUrl }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={300}
        />
        <View style={nearS.thumbOverlay} />
        <View style={nearS.datePill}>
          <Text style={nearS.datePillMon}>{mon}</Text>
          <Text style={nearS.datePillDay}>{day}</Text>
        </View>
      </View>

      {/* Right: Info */}
      <View style={nearS.info}>
        {/* Category + distance */}
        <View style={nearS.metaRow}>
          <Text style={nearS.categoryLabel}>
            {event.category.toUpperCase()}
          </Text>
          <Text style={nearS.distanceDot}> • </Text>
          <Text style={nearS.distanceLabel}>{distance}</Text>
        </View>

        <Text style={nearS.title} numberOfLines={1}>
          {event.title}
        </Text>
        <Text style={nearS.venue} numberOfLines={1}>
          {event.location.split("•")[0].trim()}
        </Text>

        {/* Rating + Price */}
        <View style={nearS.footerRow}>
          <View style={nearS.ratingRow}>
            <Ionicons name="star" size={12} color="#F5B800" />
            <Text style={nearS.ratingText}>
              {" "}{event.rating?.toFixed(1)}{" "}
            </Text>
            <Text style={nearS.ratingCount}>({event.reviewsCount})</Text>
          </View>
          <Text style={[nearS.priceText, isFree && nearS.priceTextFree]}>
            {event.price}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const nearS = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F1F4",
  },
  pressed: { transform: [{ scale: 0.99 }], opacity: 0.95 },

  // Thumbnail
  thumb: {
    width: 78,
    height: 100,
    backgroundColor: colors.heroBg,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(10,10,12,0.5)",
  },
  datePill: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(10, 10, 12, 0.78)",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
    zIndex: 2,
    minWidth: 46,
  },
  datePillMon: {
    ...typography.label,
    fontSize: 9.5,
    color: colors.amber,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  datePillDay: {
    ...typography.titleLarge,
    fontSize: 20,
    fontWeight: "800",
    color: "#FFF",
    lineHeight: 22,
  },

  // Info
  info: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  categoryLabel: {
    ...typography.label,
    fontSize: 9,
    color: colors.textMicro,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  distanceDot: {
    ...typography.label,
    fontSize: 9,
    color: colors.textMicro,
  },
  distanceLabel: {
    ...typography.label,
    fontSize: 9,
    color: colors.textMicro,
    fontWeight: "500",
  },
  title: {
    ...typography.titleMedium,
    fontSize: 14.5,
    fontWeight: "700",
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: 1,
  },
  venue: {
    ...typography.bodySmall,
    fontSize: 11.5,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    ...typography.label,
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: "700",
  },
  ratingCount: {
    ...typography.label,
    fontSize: 11,
    color: colors.textMicro,
    fontWeight: "500",
  },
  priceText: {
    ...typography.titleMedium,
    fontSize: 14,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  priceTextFree: {
    color: colors.mint,
    fontWeight: "800",
  },
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// § SECTION HEADER — Shared title + "See All" action
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SectionTitle({
  title,
  subtitle,
  onSeeAll,
}: {
  title: string;
  subtitle: string;
  onSeeAll?: () => void;
}) {
  return (
    <View style={secS.container}>
      <View style={secS.left}>
        <Text style={secS.title}>{title}</Text>
        <Text style={secS.subtitle}>{subtitle}</Text>
      </View>
      {onSeeAll ? (
        <Pressable onPress={onSeeAll} hitSlop={8}>
          <Text style={secS.seeAll}>See All ›</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
const secS = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  left: { flex: 1, paddingRight: 12 },
  title: {
    ...typography.titleLarge,
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.bodySmall,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  seeAll: {
    ...typography.label,
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// § MAIN SCREEN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function ParticipantHomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>("All");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { onScroll, onScrollEnd } = useNavScroll();

  const featuredEvents = MOCK_EVENTS.filter((e) => e.featured);
  const nearbyEvents = MOCK_EVENTS.filter((e) => !e.featured);

  const handleEventPress = (event: EventItem) => {
    router.push({
      pathname: "/(participant)/event/[id]",
      params: { id: event.id },
    } as any);
  };

  const handleOpenSearch = (initialCategory?: string) => {
    router.push({
      pathname: "/(participant)/search",
      params: initialCategory ? { category: initialCategory } : undefined,
    } as any);
  };

  return (
    <View style={s.root}>
      <StatusBar style="light" />

      {/* ═══════════════════════════════════════════════════════════════════
          § SCROLLABLE BODY (Hero + Content)
          ═══════════════════════════════════════════════════════════════════ */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        onScrollEndDrag={onScrollEnd}
        onMomentumScrollEnd={onScrollEnd}
        scrollEventThrottle={16}
      >
        {/* ── § 1. HERO HEADER — Deep black with convex bottom curve ── */}
        <View style={s.heroWrapper}>
          <SafeAreaView edges={["top"]} style={s.heroSafeArea}>
            <View style={s.heroContent}>
              {/* Top Bar: Menu | Location | Notifications */}
              <View style={s.topBar}>
                <Pressable
                  style={s.iconCircle}
                  onPress={() => setIsDrawerOpen(true)}
                  accessibilityLabel="Menu"
                >
                  <Ionicons name="menu" size={20} color="#FFF" />
                </Pressable>

                <Pressable style={s.locationSelector}>
                  <Text style={s.locationText}>Colombo, LK</Text>
                  <Ionicons
                    name="chevron-down"
                    size={14}
                    color="rgba(255,255,255,0.6)"
                  />
                </Pressable>

                <Pressable
                  style={s.iconCircle}
                  onPress={() =>
                    router.push("/(participant)/notifications" as any)
                  }
                  accessibilityLabel="Notifications"
                >
                  <Ionicons name="notifications-outline" size={20} color="#FFF" />
                  <View style={s.notifDot} />
                </Pressable>
              </View>

              {/* Title Row: "Discover Events" + Weather Pill */}
              <View style={s.titleRow}>
                <Text style={s.heroTitle}>Discover Events</Text>

                <View style={s.weatherPill}>
                  <Ionicons name="partly-sunny" size={20} color={colors.amber} />
                  <View>
                    <View style={s.weatherTempRow}>
                      <Text style={s.weatherTemp}>68°</Text>
                      <Text style={s.weatherDesc}> Mist</Text>
                    </View>
                    <Text style={s.weatherCaption}>Calm day</Text>
                  </View>
                </View>
              </View>

              {/* Search Bar */}
              <Pressable
                onPress={() => handleOpenSearch()}
                style={({ pressed }) => [s.searchBar, pressed && s.searchPressed]}
                accessibilityRole="button"
                accessibilityLabel="Search events"
              >
                <Ionicons
                  name="search-outline"
                  size={18}
                  color="rgba(255,255,255,0.5)"
                />
                <Text style={s.searchPlaceholder} numberOfLines={1}>
                  Search events, venues, organizers...
                </Text>
                <Pressable style={s.searchFilterBtn}>
                  <Ionicons name="options-outline" size={17} color="#000" />
                </Pressable>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
        {/* ── § 3. Category Chips (overlapping hero curve) ─────────────── */}
        <View style={s.chipSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.chipScroll}
          >
            {MOCK_CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat}
                label={cat}
                selected={selectedCategory === cat}
                onPress={() => {
                  setSelectedCategory(cat);
                  if (cat !== "All") handleOpenSearch(cat);
                }}
              />
            ))}
          </ScrollView>
        </View>

        {/* ── § 4. Featured Spotlight Carousel ─────────────────────────── */}
        <SectionTitle
          title="Featured Spotlight"
          subtitle="Handpicked premium events"
          onSeeAll={() => handleOpenSearch()}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.featuredScroll}
          decelerationRate="fast"
          snapToInterval={FEATURED_CARD_WIDTH + 14}
          snapToAlignment="start"
        >
          {featuredEvents.map((evt) => (
            <FeaturedCard key={evt.id} event={evt} onPress={handleEventPress} />
          ))}
        </ScrollView>

        {/* ── § 5. Special Offer Banner ────────────────────────────────── */}
        <SpecialOfferBanner />

        {/* ── § 6. Nearby You ──────────────────────────────────────────── */}
        <SectionTitle
          title="Nearby You"
          subtitle="Popular venues within 5 km"
          onSeeAll={() => handleOpenSearch()}
        />

        <View style={s.nearbyList}>
          {nearbyEvents.map((evt, idx) => (
            <NearbyCard
              key={evt.id}
              event={evt}
              onPress={handleEventPress}
              distance={
                idx === 0 ? "1.2 km away" : idx === 1 ? "2.5 km away" : "3.8 km away"
              }
            />
          ))}
        </View>
      </ScrollView>

      {/* ═══════════════════════════════════════════════════════════════════
          § LEFT SIDEBAR NAVIGATION DRAWER (Appears from left)
          ═══════════════════════════════════════════════════════════════════ */}
      <Modal
        visible={isDrawerOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setIsDrawerOpen(false)}
      >
        <View style={drawerS.modalRoot}>
          {/* Backdrop Overlay */}
          <Pressable
            style={drawerS.backdrop}
            onPress={() => setIsDrawerOpen(false)}
          />

          {/* Left Slide Panel */}
          <View style={drawerS.panel}>
            <SafeAreaView edges={["top", "bottom"]} style={drawerS.panelSafe}>
              {/* Profile Avatar & Name */}
              <View style={drawerS.userSection}>
                <Image
                  source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" }}
                  style={drawerS.avatar}
                  contentFit="cover"
                />
                <Text style={drawerS.userName}>Alex Morgan</Text>
              </View>

              {/* Drawer Menu List */}
              <ScrollView showsVerticalScrollIndicator={false} style={drawerS.menuScroll}>
                <Pressable
                  onPress={() => {
                    setIsDrawerOpen(false);
                    router.push("/(participant)/(tabs)/profile" as any);
                  }}
                  style={({ pressed }) => [drawerS.item, pressed && drawerS.pressed]}
                >
                  <Ionicons name="person-outline" size={22} color="#111827" />
                  <Text style={drawerS.itemText}>My Profile</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setIsDrawerOpen(false);
                    router.push("/(participant)/notifications" as any);
                  }}
                  style={({ pressed }) => [drawerS.item, pressed && drawerS.pressed]}
                >
                  <View style={drawerS.iconWrap}>
                    <Ionicons name="chatbubble-ellipses-outline" size={22} color="#111827" />
                    <View style={drawerS.badge}>
                      <Text style={drawerS.badgeText}>3</Text>
                    </View>
                  </View>
                  <Text style={drawerS.itemText}>Massage</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setIsDrawerOpen(false);
                    router.push("/(participant)/calendar" as any);
                  }}
                  style={({ pressed }) => [drawerS.item, pressed && drawerS.pressed]}
                >
                  <Ionicons name="calendar-outline" size={22} color="#111827" />
                  <Text style={drawerS.itemText}>Calender</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setIsDrawerOpen(false);
                    router.push("/(participant)/(tabs)/explore" as any);
                  }}
                  style={({ pressed }) => [drawerS.item, pressed && drawerS.pressed]}
                >
                  <Ionicons name="bookmark-outline" size={22} color="#111827" />
                  <Text style={drawerS.itemText}>Bookmark</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setIsDrawerOpen(false);
                    router.push("/(participant)/notifications" as any);
                  }}
                  style={({ pressed }) => [drawerS.item, pressed && drawerS.pressed]}
                >
                  <Ionicons name="mail-outline" size={22} color="#111827" />
                  <Text style={drawerS.itemText}>Contact Us</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setIsDrawerOpen(false);
                    router.push("/(participant)/(tabs)/profile" as any);
                  }}
                  style={({ pressed }) => [drawerS.item, pressed && drawerS.pressed]}
                >
                  <Ionicons name="settings-outline" size={22} color="#111827" />
                  <Text style={drawerS.itemText}>Settings</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setIsDrawerOpen(false);
                    router.push("/(participant)/(tabs)/profile" as any);
                  }}
                  style={({ pressed }) => [drawerS.item, pressed && drawerS.pressed]}
                >
                  <Ionicons name="help-circle-outline" size={22} color="#111827" />
                  <Text style={drawerS.itemText}>Helps & FAQs</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setIsDrawerOpen(false);
                    router.replace("/role-selection" as any);
                  }}
                  style={({ pressed }) => [drawerS.item, drawerS.itemSignOut, pressed && drawerS.pressed]}
                >
                  <Ionicons name="log-out-outline" size={22} color="#111827" />
                  <Text style={drawerS.itemText}>Sign Out</Text>
                </Pressable>
              </ScrollView>
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const drawerS = StyleSheet.create({
  modalRoot: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  panel: {
    width: "76%",
    height: "100%",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    overflow: "hidden",
  },
  panelSafe: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 24,
  },
  userSection: {
    marginBottom: 28,
    marginTop: 8,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#F3F4F6",
    marginBottom: 14,
  },
  userName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  menuScroll: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: 16,
  },
  itemSignOut: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 18,
  },
  itemText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  iconWrap: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: "#F5B800",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#000000",
  },
  pressed: {
    opacity: 0.7,
  },
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// § STYLES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ── Hero Header ────────────────────────────────────────────────────────
  heroWrapper: {
    backgroundColor: colors.heroBg,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 28,
    elevation: 4,
    zIndex: 1,
  },
  heroSafeArea: {
    backgroundColor: colors.heroBg,
  },
  heroContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 32,
  },

  // Top bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  iconCircle: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  locationSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  locationText: {
    ...typography.titleMedium,
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
  },
  notifDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.amber,
    borderWidth: 2,
    borderColor: colors.heroBg,
  },

  // Title row
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  heroTitle: {
    ...typography.headlineLarge,
    fontSize: 28,
    fontWeight: "800",
    color: "#FFF",
    flex: 1,
    paddingRight: 12,
  },
  weatherPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  weatherTempRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  weatherTemp: {
    ...typography.titleMedium,
    fontSize: 16,
    fontWeight: "800",
    color: "#FFF",
  },
  weatherDesc: {
    ...typography.label,
    fontSize: 11,
    color: colors.textOnDarkMuted,
    fontWeight: "500",
  },
  weatherCaption: {
    ...typography.label,
    fontSize: 10,
    color: colors.textOnDarkSub,
    fontWeight: "500",
    marginTop: 1,
  },

  // Search bar
  searchBar: {
    height: 52,
    borderRadius: 9999,
    backgroundColor: colors.darkInput,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 18,
    paddingRight: 6,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  searchPressed: {
    backgroundColor: "rgba(38,38,41,1)",
  },
  searchPlaceholder: {
    flex: 1,
    ...typography.bodyMedium,
    fontSize: 13.5,
    color: "rgba(255,255,255,0.45)",
  },
  searchFilterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.amber,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.amber,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },

  // ── Scroll Body ────────────────────────────────────────────────────────
  scroll: {
    flex: 1,
    zIndex: 20,
    elevation: 10,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // Chips — overlap the hero bottom curve by ~50%
  chipSection: {
    marginTop: -22,
    marginBottom: 0,
    zIndex: 30,
    elevation: 15,
  },
  chipScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },

  // Featured carousel
  featuredScroll: {
    paddingLeft: 20,
    paddingRight: 20,
    gap: 14,
    marginBottom: 16,
  },

  // Nearby list
  nearbyList: {
    paddingHorizontal: 20,
  },
});
