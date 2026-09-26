import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Share,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AppButton from "../../../components/AppButton";
import { MOCK_EVENTS } from "../../../data/mockEvents";
import { colors } from "../../../theme/colors";

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = MOCK_EVENTS.find((e) => e.id === id) || MOCK_EVENTS[0];

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(true);
  const [showConfirmSheet, setShowConfirmSheet] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const insets = useSafeAreaInsets();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${event.title} on EventGo!`,
      });
    } catch (e) {
      // ignore
    }
  };

  const handleRegisterConfirm = () => {
    setShowConfirmSheet(false);
    router.push({
      pathname: "/(participant)/event/registration-success",
      params: { id: event.id },
    } as any);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ═══════════════════════════════════════════════════════════════════
            § 1. HERO COVER IMAGE (Top ~40% Screen)
            ═══════════════════════════════════════════════════════════════════ */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: event.imageUrl }}
            style={styles.heroImage}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.heroOverlay} />

          {/* Floating Top Navigation Bar */}
          <SafeAreaView edges={["top"]} style={styles.topNavSafeArea}>
            <View style={styles.topNav}>
              {/* Back Button */}
              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => [styles.glassBtn, pressed && styles.pressed]}
                accessibilityLabel="Go back"
              >
                <Ionicons name="chevron-back" size={22} color="#FFF" />
              </Pressable>

              {/* Right Action Glass Buttons */}
              <View style={styles.topNavRight}>
                {/* Share button */}
                <Pressable
                  onPress={handleShare}
                  style={({ pressed }) => [styles.glassBtn, pressed && styles.pressed]}
                  accessibilityLabel="Share event"
                >
                  <Ionicons name="share-social-outline" size={20} color="#FFF" />
                </Pressable>

                {/* Favorite button */}
                <Pressable
                  onPress={() => setIsLiked((prev) => !prev)}
                  style={({ pressed }) => [styles.glassBtn, pressed && styles.pressed]}
                  accessibilityLabel="Favorite event"
                >
                  <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={20}
                    color={isLiked ? "#EF4444" : "#FFF"}
                  />
                </Pressable>
              </View>
            </View>
          </SafeAreaView>

          {/* Floating Status Pill (Bottom-left of hero cover) */}
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>SELLING FAST</Text>
          </View>
        </View>

        {/* ═══════════════════════════════════════════════════════════════════
            § 2. SLIDING BOTTOM SHEET CONTAINER
            ═══════════════════════════════════════════════════════════════════ */}
        <View style={styles.sheetContent}>
          {/* Top-Center Drag Handle */}
          <View style={styles.dragHandle} />

          {/* ── § 3. EVENT HEADER & METADATA ───────────────────────────── */}
          <View style={styles.titlePriceRow}>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {event.title}
            </Text>

            <View style={styles.pricePill}>
              <Text style={styles.pricePillText}>{event.price}</Text>
            </View>
          </View>

          <Text style={styles.subtitle}>
            {event.category} • {event.location.split("•")[0].trim()}
          </Text>

          {/* Vertical Metadata List */}
          <View style={styles.metadataList}>
            {/* Venue Row */}
            <View style={styles.metaItem}>
              <View style={styles.metaIconBox}>
                <Ionicons name="location" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.metaText} numberOfLines={2}>
                {event.location}
              </Text>
            </View>

            {/* Date & Time Row */}
            <View style={styles.metaItem}>
              <View style={styles.metaIconBox}>
                <Ionicons name="calendar" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.metaText}>
                {event.date} • {event.time}
              </Text>
            </View>
          </View>

          {/* ── § 4. SOCIAL PROOF / ATTENDEE CARD ───────────────────────── */}
          <View style={styles.attendeeCard}>
            <View style={styles.attendeeLeft}>
              {/* Overlapping Avatar Stack */}
              <View style={styles.avatarStack}>
                <View style={[styles.avatarCircle, { backgroundColor: "#E5E7EB", zIndex: 4 }]}>
                  <Text style={styles.avatarInitial}>TK</Text>
                </View>
                <View style={[styles.avatarCircle, { backgroundColor: "#CBD5E1", marginLeft: -10, zIndex: 3 }]}>
                  <Text style={styles.avatarInitial}>MR</Text>
                </View>
                <View style={[styles.avatarCircle, { backgroundColor: "#FEF08A", marginLeft: -10, zIndex: 2 }]}>
                  <Text style={styles.avatarInitial}>SZ</Text>
                </View>
                <View style={[styles.avatarCircle, { backgroundColor: "#F5B800", marginLeft: -10, zIndex: 1 }]}>
                  <Text style={styles.avatarBadgeText}>15k+</Text>
                </View>
              </View>

              {/* Members joined count text */}
              <View style={styles.attendeeInfo}>
                <Text style={styles.attendeeCount}>15.7k+</Text>
                <Text style={styles.attendeeLabel}>Members joined</Text>
              </View>
            </View>

            {/* Invite Action Link */}
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [styles.inviteBtn, pressed && styles.pressed]}
            >
              <Text style={styles.inviteText}>INVITE</Text>
              <Ionicons name="chevron-forward" size={14} color="#D97706" />
            </Pressable>
          </View>

          {/* ── § 5. ORGANIZER CARD ────────────────────────────────────── */}
          <View style={styles.organizerCard}>
            <View style={styles.organizerLeft}>
              <View style={styles.organizerAvatarWrap}>
                <Image
                  source={{
                    uri:
                      event.organizerAvatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
                  }}
                  style={styles.organizerAvatarImg}
                  contentFit="cover"
                />
                <View style={styles.onlineBadge} />
              </View>

              <View style={styles.organizerTextGroup}>
                <Text style={styles.organizerName}>{event.organizer}</Text>
                <Text style={styles.organizerRole}>Event Organiser & Promoter</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.organizerActions}>
              <Pressable style={({ pressed }) => [styles.orgActionCircle, pressed && styles.pressed]}>
                <Ionicons name="chatbubble-ellipses-outline" size={17} color="#FFFFFF" />
              </Pressable>

              <Pressable style={({ pressed }) => [styles.orgActionCircle, pressed && styles.pressed]}>
                <Ionicons name="call-outline" size={17} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          {/* ── § 6. DESCRIPTION SECTION ───────────────────────────────── */}
          <View style={styles.descSection}>
            <Text style={styles.descTitle}>Description</Text>
            <Text
              style={styles.descText}
              numberOfLines={isDescriptionExpanded ? undefined : 4}
            >
              {event.description}
            </Text>
            {!isDescriptionExpanded && (
              <Pressable onPress={() => setIsDescriptionExpanded(true)}>
                <Text style={styles.readMoreText}>... Read More</Text>
              </Pressable>
            )}
          </View>
        </View>
      </ScrollView>

      {/* ═══════════════════════════════════════════════════════════════════
          § 7. FIXED BOTTOM ACTION DOCK
          ═══════════════════════════════════════════════════════════════════ */}
      <View style={[styles.bottomDock, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        {/* Bookmark / Save Button */}
        <Pressable
          onPress={() => setIsBookmarked((prev) => !prev)}
          style={({ pressed }) => [
            styles.bookmarkSquareBtn,
            isBookmarked && styles.bookmarkSquareActive,
            pressed && styles.pressed,
          ]}
          accessibilityLabel="Save event"
        >
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={22}
            color={isBookmarked ? "#F5B800" : "#FFFFFF"}
          />
        </Pressable>

        {/* Primary CTA Button: BUY A TICKET */}
        <Pressable
          onPress={() => setShowConfirmSheet(true)}
          style={({ pressed }) => [styles.buyTicketBtn, pressed && styles.buyTicketPressed]}
          accessibilityRole="button"
          accessibilityLabel="Buy a ticket"
        >
          <Ionicons name="ticket-outline" size={20} color="#F5B800" />
          <Text style={styles.buyTicketText}>BUY A TICKET</Text>
        </Pressable>
      </View>

      {/* Confirmation Modal Sheet */}
      {showConfirmSheet && (
        <View style={styles.sheetOverlay}>
          <Pressable
            style={styles.sheetBackdrop}
            onPress={() => setShowConfirmSheet(false)}
          />
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Confirm Registration</Text>
            <Text style={styles.sheetSub}>
              You are about to register for{"\n"}
              <Text style={{ fontWeight: "700", color: "#111827" }}>
                {event.title}
              </Text>
            </Text>

            <View style={styles.sheetSummaryCard}>
              <View style={styles.sheetRow}>
                <Text style={styles.sheetRowLabel}>Date</Text>
                <Text style={styles.sheetRowVal}>{event.date}</Text>
              </View>
              <View style={styles.sheetRow}>
                <Text style={styles.sheetRowLabel}>Time</Text>
                <Text style={styles.sheetRowVal}>{event.time}</Text>
              </View>
              <View style={styles.sheetRow}>
                <Text style={styles.sheetRowLabel}>Fee</Text>
                <Text style={styles.sheetRowVal}>{event.price}</Text>
              </View>
            </View>

            <AppButton
              title="Confirm & Book"
              onPress={handleRegisterConfirm}
              style={{ width: "100%", marginTop: 16 }}
            />

            <Pressable
              onPress={() => setShowConfirmSheet(false)}
              style={styles.sheetCancelBtn}
            >
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scroll: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 110,
  },

  // ── § 1. Hero Cover Image ────────────────────────────────────────────────
  heroContainer: {
    height: 320,
    width: "100%",
    position: "relative",
    backgroundColor: "#0A0A0C",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  topNavSafeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  topNavRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  glassBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },

  statusPill: {
    position: "absolute",
    bottom: 48,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    borderColor: "#E5A910",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F5B800",
  },
  statusText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#F5B800",
    letterSpacing: 0.8,
  },

  // ── § 2. Sliding Bottom Sheet Container ─────────────────────────────────
  sheetContent: {
    marginTop: -32,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
  },
  dragHandle: {
    width: 44,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 9999,
    alignSelf: "center",
    marginBottom: 16,
  },

  // ── § 3. Event Header & Metadata ────────────────────────────────────────
  titlePriceRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  eventTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    lineHeight: 28,
  },
  pricePill: {
    backgroundColor: "#0A0A0C",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  pricePillText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    marginTop: 4,
    marginBottom: 16,
  },

  metadataList: {
    gap: 12,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#0A0A0C",
    alignItems: "center",
    justifyContent: "center",
  },
  metaText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  // ── § 4. Social Proof / Attendee Card ────────────────────────────────────
  attendeeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 16,
  },
  attendeeLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarStack: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatarInitial: {
    fontSize: 10,
    fontWeight: "800",
    color: "#374151",
  },
  avatarBadgeText: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#111827",
  },
  attendeeInfo: {
    gap: 1,
  },
  attendeeCount: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  attendeeLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  inviteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  inviteText: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#D97706",
    letterSpacing: 0.5,
  },

  // ── § 5. Organizer Card ─────────────────────────────────────────────────
  organizerCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 20,
  },
  organizerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  organizerAvatarWrap: {
    position: "relative",
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#F5B800",
    padding: 1,
  },
  organizerAvatarImg: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  onlineBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  organizerTextGroup: {
    flex: 1,
  },
  organizerName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  organizerRole: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginTop: 1,
  },
  organizerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  orgActionCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A0A0C",
  },

  // ── § 6. Description Section ─────────────────────────────────────────────
  descSection: {
    marginTop: 4,
    marginBottom: 16,
  },
  descTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  descText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4B5563",
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#D97706",
    marginTop: 4,
  },

  // ── § 7. Fixed Bottom Action Dock ────────────────────────────────────────
  bottomDock: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderColor: "#F3F4F6",
    paddingHorizontal: 20,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  bookmarkSquareBtn: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#0A0A0C",
    alignItems: "center",
    justifyContent: "center",
  },
  bookmarkSquareActive: {
    backgroundColor: "#0A0A0C",
    borderWidth: 1.5,
    borderColor: "#F5B800",
  },
  buyTicketBtn: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#0A0A0C",
    marginLeft: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  buyTicketPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  buyTicketText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  // ── Modal Confirmation Sheet ────────────────────────────────────────────
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    justifyContent: "flex-end",
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    alignItems: "center",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  sheetSub: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 20,
  },
  sheetSummaryCard: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  sheetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sheetRowLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  sheetRowVal: {
    fontSize: 13.5,
    fontWeight: "700",
    color: "#111827",
  },
  sheetCancelBtn: {
    marginTop: 12,
    paddingVertical: 10,
  },
  sheetCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
});

