import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ALL_AVAILABLE_INTERESTS = [
  "Tech",
  "Design",
  "Music",
  "Startups",
  "Gaming",
  "Sports",
  "AI & Robotics",
  "Business",
  "Arts & Culture",
  "Hackathons",
];

export default function ParticipantProfileScreen() {
  // User state
  const [user, setUser] = useState({
    name: "Alex Morgan",
    email: "alex.morgan@university.edu",
    department: "Computer Science & Design",
    studentId: "CS-2024-891",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    role: "Attendee",
    eventsAttended: 12,
    savedEvents: 5,
    reviewsGiven: 8,
    interests: ["Tech", "Design", "Music", "Startups"],
  });

  // Modal states
  const [activeModal, setActiveModal] = useState<
    "none" | "edit_info" | "interests" | "notifications" | "support" | "logout"
  >("none");

  // Edit info temporary state
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editDepartment, setEditDepartment] = useState(user.department);

  // Notification switches state
  const [notifPush, setNotifPush] = useState(true);
  const [notifReminders, setNotifReminders] = useState(true);
  const [notifInterests, setNotifInterests] = useState(true);
  const [notifAnnouncements, setNotifAnnouncements] = useState(false);

  // Handlers
  const handleSwitchToOrganizer = () => {
    router.replace("/(organizer)/dashboard" as any);
  };

  const handleSavePersonalInfo = () => {
    setUser((prev) => ({
      ...prev,
      name: editName.trim() || prev.name,
      email: editEmail.trim() || prev.email,
      department: editDepartment.trim() || prev.department,
    }));
    setActiveModal("none");
  };

  const handleToggleInterest = (interest: string) => {
    setUser((prev) => {
      const exists = prev.interests.includes(interest);
      const updated = exists
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: updated };
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Bar */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Pressable
            onPress={() => setActiveModal("edit_info")}
            style={({ pressed }) => [styles.settingsBtn, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Edit Profile"
          >
            <Ionicons name="create-outline" size={20} color="#111827" />
          </Pressable>
        </View>

        {/* ── 1. PROFILE CARD ────────────────────────────────────────────── */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user.role}</Text>
            </View>
          </View>

          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userDept}>{user.department}</Text>

          {/* Interests Pills */}
          <View style={styles.interestsRow}>
            {user.interests.map((interest) => (
              <View key={interest} style={styles.interestPill}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
            <Pressable
              onPress={() => setActiveModal("interests")}
              style={styles.addInterestPill}
            >
              <Ionicons name="add" size={14} color="#F5B800" />
            </Pressable>
          </View>
        </View>

        {/* ── 2. STATS ROW ───────────────────────────────────────────────── */}
        <View style={styles.statsContainer}>
          <Pressable
            onPress={() => router.push("/(participant)/(tabs)/events" as any)}
            style={styles.statBox}
          >
            <Text style={styles.statNumber}>{user.eventsAttended}</Text>
            <Text style={styles.statLabel}>Attended</Text>
          </Pressable>
          <View style={styles.statDivider} />
          <Pressable
            onPress={() => setActiveModal("interests")}
            style={styles.statBox}
          >
            <Text style={styles.statNumber}>{user.savedEvents}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </Pressable>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user.reviewsGiven}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* ── 3. ORGANIZER SWITCH BANNER (Black & Yellow Theme) ─────────── */}
        <View style={styles.switchBanner}>
          <View style={styles.switchBannerHeader}>
            <View style={styles.switchIconBadge}>
              <Ionicons name="briefcase" size={18} color="#F5B800" />
            </View>
            <View style={styles.switchTextGroup}>
              <Text style={styles.switchTitle}>Are you an Event Organizer?</Text>
              <Text style={styles.switchSub}>
                Switch to Organizer mode to create and publish campus events.
              </Text>
            </View>
          </View>

          <Pressable
            onPress={handleSwitchToOrganizer}
            style={({ pressed }) => [styles.switchBtn, pressed && styles.switchBtnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Switch to Organizer Mode"
          >
            <Text style={styles.switchBtnText}>Switch Mode</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* ── 4. FEATURE MENU LIST ───────────────────────────────────────── */}
        <View style={styles.menuContainer}>
          {/* Edit Personal Info */}
          <Pressable
            onPress={() => setActiveModal("edit_info")}
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
          >
            <View style={styles.menuIconBox}>
              <Ionicons name="person-outline" size={18} color="#111827" />
            </View>
            <View style={styles.menuTextGroup}>
              <Text style={styles.menuText}>Edit Personal Info</Text>
              <Text style={styles.menuSubText}>Name, email, campus department</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </Pressable>

          {/* Manage Event Interests */}
          <Pressable
            onPress={() => setActiveModal("interests")}
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
          >
            <View style={styles.menuIconBox}>
              <Ionicons name="heart-outline" size={18} color="#111827" />
            </View>
            <View style={styles.menuTextGroup}>
              <Text style={styles.menuText}>Manage Event Interests</Text>
              <Text style={styles.menuSubText}>{user.interests.length} categories selected</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </Pressable>

          {/* Notification Settings */}
          <Pressable
            onPress={() => setActiveModal("notifications")}
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
          >
            <View style={styles.menuIconBox}>
              <Ionicons name="notifications-outline" size={18} color="#111827" />
            </View>
            <View style={styles.menuTextGroup}>
              <Text style={styles.menuText}>Notification Settings</Text>
              <Text style={styles.menuSubText}>Push alerts & event reminders</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </Pressable>

          {/* Help & Support */}
          <Pressable
            onPress={() => setActiveModal("support")}
            style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
          >
            <View style={styles.menuIconBox}>
              <Ionicons name="help-circle-outline" size={18} color="#111827" />
            </View>
            <View style={styles.menuTextGroup}>
              <Text style={styles.menuText}>Help & Support</Text>
              <Text style={styles.menuSubText}>FAQs, support team & feedback</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </Pressable>

          {/* Log Out */}
          <Pressable
            onPress={() => setActiveModal("logout")}
            style={({ pressed }) => [styles.menuItem, styles.menuItemLast, pressed && styles.pressed]}
          >
            <View style={[styles.menuIconBox, { backgroundColor: "#FEE2E2" }]}>
              <Ionicons name="log-out-outline" size={18} color="#EF4444" />
            </View>

            <View style={styles.menuTextGroup}>
              <Text style={[styles.menuText, { color: "#EF4444" }]}>Log Out</Text>
              <Text style={styles.menuSubText}>Sign out of your account</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#FCA5A5" />
          </Pressable>
        </View>
      </ScrollView>

      {/* ═══════════════════════════════════════════════════════════════════
          § FEATURE MODALS (INLINE INTERACTIVE SHEETS)
          ═══════════════════════════════════════════════════════════════════ */}

      {/* 1. EDIT PERSONAL INFO MODAL */}
      <Modal
        visible={activeModal === "edit_info"}
        animationType="slide"
        transparent
        onRequestClose={() => setActiveModal("none")}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setActiveModal("none")} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Personal Info</Text>
              <Pressable onPress={() => setActiveModal("none")}>
                <Ionicons name="close-circle" size={24} color="#9CA3AF" />
              </Pressable>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter full name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>University Email</Text>
              <TextInput
                style={styles.textInput}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="Enter university email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Department / Major</Text>
              <TextInput
                style={styles.textInput}
                value={editDepartment}
                onChangeText={setEditDepartment}
                placeholder="Enter department"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <Pressable
              onPress={handleSavePersonalInfo}
              style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]}
            >
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 2. MANAGE EVENT INTERESTS MODAL */}
      <Modal
        visible={activeModal === "interests"}
        animationType="slide"
        transparent
        onRequestClose={() => setActiveModal("none")}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setActiveModal("none")} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Manage Event Interests</Text>
              <Pressable onPress={() => setActiveModal("none")}>
                <Ionicons name="close-circle" size={24} color="#9CA3AF" />
              </Pressable>
            </View>
            <Text style={styles.modalSub}>
              Select topics you love to get personalized event recommendations.
            </Text>

            <View style={styles.interestChipsWrap}>
              {ALL_AVAILABLE_INTERESTS.map((cat) => {
                const isSelected = user.interests.includes(cat);
                return (
                  <Pressable
                    key={cat}
                    onPress={() => handleToggleInterest(cat)}
                    style={[
                      styles.interestChipBtn,
                      isSelected && styles.interestChipBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.interestChipText,
                        isSelected && styles.interestChipTextActive,
                      ]}
                    >
                      {cat} {isSelected ? "✓" : "+"}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              onPress={() => setActiveModal("none")}
              style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]}
            >
              <Text style={styles.saveBtnText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 3. NOTIFICATION SETTINGS MODAL */}
      <Modal
        visible={activeModal === "notifications"}
        animationType="slide"
        transparent
        onRequestClose={() => setActiveModal("none")}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setActiveModal("none")} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notification Settings</Text>
              <Pressable onPress={() => setActiveModal("none")}>
                <Ionicons name="close-circle" size={24} color="#9CA3AF" />
              </Pressable>
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchTextGroup}>
                <Text style={styles.switchRowTitle}>Push Notifications</Text>
                <Text style={styles.switchRowSub}>Receive instant alerts on your device</Text>
              </View>
              <Switch
                value={notifPush}
                onValueChange={setNotifPush}
                trackColor={{ false: "#E5E7EB", true: "#F5B800" }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchTextGroup}>
                <Text style={styles.switchRowTitle}>Event Reminders</Text>
                <Text style={styles.switchRowSub}>Remind 1 hour before registered events</Text>
              </View>
              <Switch
                value={notifReminders}
                onValueChange={setNotifReminders}
                trackColor={{ false: "#E5E7EB", true: "#F5B800" }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchTextGroup}>
                <Text style={styles.switchRowTitle}>New Interest Alerts</Text>
                <Text style={styles.switchRowSub}>Alert when new events match your topics</Text>
              </View>
              <Switch
                value={notifInterests}
                onValueChange={setNotifInterests}
                trackColor={{ false: "#E5E7EB", true: "#F5B800" }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchTextGroup}>
                <Text style={styles.switchRowTitle}>Organizer Broadcasts</Text>
                <Text style={styles.switchRowSub}>Updates from event hosts</Text>
              </View>
              <Switch
                value={notifAnnouncements}
                onValueChange={setNotifAnnouncements}
                trackColor={{ false: "#E5E7EB", true: "#F5B800" }}
                thumbColor="#FFFFFF"
              />
            </View>

            <Pressable
              onPress={() => setActiveModal("none")}
              style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed, { marginTop: 12 }]}
            >
              <Text style={styles.saveBtnText}>Save Preferences</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 4. HELP & SUPPORT MODAL */}
      <Modal
        visible={activeModal === "support"}
        animationType="slide"
        transparent
        onRequestClose={() => setActiveModal("none")}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setActiveModal("none")} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Help & Support</Text>
              <Pressable onPress={() => setActiveModal("none")}>
                <Ionicons name="close-circle" size={24} color="#9CA3AF" />
              </Pressable>
            </View>

            <View style={styles.supportCard}>
              <Ionicons name="headset-outline" size={24} color="#F5B800" />
              <View style={{ flex: 1 }}>
                <Text style={styles.supportCardTitle}>Campus Support Desk</Text>
                <Text style={styles.supportCardSub}>support@eventgo-university.edu</Text>
              </View>
            </View>

            <View style={styles.faqList}>
              <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
              <Text style={styles.faqQ}>• How do I cancel an event registration?</Text>
              <Text style={styles.faqA}>Go to Events tab → Upcoming events → tap Cancel Registration.</Text>

              <Text style={styles.faqQ}>• How do I show my entry pass?</Text>
              <Text style={styles.faqA}>Tap on any registered event card to view your digital QR pass.</Text>
            </View>

            <Pressable
              onPress={() => setActiveModal("none")}
              style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]}
            >
              <Text style={styles.saveBtnText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* 5. LOG OUT CONFIRMATION MODAL */}
      <Modal
        visible={activeModal === "logout"}
        animationType="fade"
        transparent
        onRequestClose={() => setActiveModal("none")}
      >
        <View style={styles.modalOverlayCenter}>
          <Pressable style={styles.modalBackdrop} onPress={() => setActiveModal("none")} />
          <View style={styles.logoutCard}>
            <View style={styles.logoutIconCircle}>
              <Ionicons name="log-out" size={28} color="#EF4444" />
            </View>
            <Text style={styles.logoutTitle}>Log Out of EventGo?</Text>
            <Text style={styles.logoutSub}>
              Are you sure you want to log out? You will need to sign in again to access your passes.
            </Text>

            <View style={styles.logoutActions}>
              <Pressable
                onPress={() => setActiveModal("none")}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setActiveModal("none");
                  router.replace("/role-selection" as any);
                }}
                style={styles.confirmLogoutBtn}
              >
                <Text style={styles.confirmLogoutText}>Log Out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 110,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.7,
  },

  // ── Profile Card ──────────────────────────────────────────────────────────
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    padding: 20,
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#F3F4F6",
  },
  roleBadge: {
    position: "absolute",
    bottom: -6,
    alignSelf: "center",
    backgroundColor: "#0A0A0C",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  roleText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.4,
  },

  userName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  userEmail: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  userDept: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    marginTop: 1,
  },

  interestsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  interestPill: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
  },
  interestText: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#4B5563",
  },
  addInterestPill: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#0A0A0C",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Stats Container ───────────────────────────────────────────────────────
  statsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 14,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0A0A0C",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#E5E7EB",
  },

  // ── Organizer Switch Banner ────────────────────────────────────────────────
  switchBanner: {
    backgroundColor: "#FFFDF0",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(245, 184, 0, 0.35)",
    padding: 16,
    marginBottom: 14,
  },
  switchBannerHeader: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  switchIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#0A0A0C",
    alignItems: "center",
    justifyContent: "center",
  },
  switchTextGroup: {
    flex: 1,
    justifyContent: "center",
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  switchSub: {
    fontSize: 12.5,
    color: "#6B7280",
    lineHeight: 18,
    marginTop: 2,
  },

  switchBtn: {
    height: 46,
    borderRadius: 23,
    backgroundColor: "#0A0A0C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  switchBtnPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  switchBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  // ── Menu Container ────────────────────────────────────────────────────────
  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 12,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  menuTextGroup: {
    flex: 1,
  },
  menuText: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#111827",
  },
  menuSubText: {
    fontSize: 11.5,
    color: "#9CA3AF",
    marginTop: 1,
  },

  // ── Modals & Bottom Sheets ───────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalOverlayCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  modalSub: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 16,
  },

  formGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 6,
  },
  textInput: {
    height: 46,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#111827",
  },
  saveBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0A0A0C",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  // Interest Chips Grid
  interestChipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  interestChipBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  interestChipBtnActive: {
    backgroundColor: "#0A0A0C",
    borderColor: "#0A0A0C",
  },
  interestChipText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#4B5563",
  },
  interestChipTextActive: {
    color: "#F5B800",
  },

  // Switch Rows
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  switchRowTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  switchRowSub: {
    fontSize: 11.5,
    color: "#9CA3AF",
    marginTop: 1,
  },

  // Support Card
  supportCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFDF0",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(245, 184, 0, 0.35)",
    marginBottom: 16,
  },
  supportCardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },
  supportCardSub: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  faqList: {
    marginBottom: 16,
  },
  faqTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  faqQ: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginTop: 6,
  },
  faqA: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },

  // Logout Modal
  logoutCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  logoutIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoutTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },
  logoutSub: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  logoutActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4B5563",
  },
  confirmLogoutBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmLogoutText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
