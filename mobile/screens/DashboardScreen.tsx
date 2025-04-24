import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../lib/stores/userStore";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function DashboardScreen({ navigation }) {
  const {
    username,
    level,
    xp,
    coins,
    gems,
    streak,
    selectedAvatar,
    selectedTitle,
    loadUser,
  } = useUserStore();

  const [refreshing, setRefreshing] = useState(false);
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: "Mathematics",
      icon: "calculator-outline",
      color: "#FF5733",
      level: 3,
      xp: 250,
      totalStudyTime: 420,
    },
    {
      id: 2,
      name: "Physics",
      icon: "flask-outline",
      color: "#33A8FF",
      level: 2,
      xp: 180,
      totalStudyTime: 300,
    },
    {
      id: 3,
      name: "Computer Science",
      icon: "desktop-outline",
      color: "#33FF57",
      level: 4,
      xp: 380,
      totalStudyTime: 560,
    },
    {
      id: 4,
      name: "English",
      icon: "book-outline",
      color: "#B833FF",
      level: 2,
      xp: 190,
      totalStudyTime: 240,
    },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUser();
    // Here you would also refresh subjects and quests
    setRefreshing(false);
  };

  // Format study time from minutes to hours and minutes
  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const calculateXpProgress = (currentXp: number) => {
    const baseXp = 100;
    const nextLevelXp = Math.floor(baseXp * Math.pow(1.5, level));
    const prevLevelXp = Math.floor(baseXp * Math.pow(1.5, level - 1));
    const xpNeeded = nextLevelXp - prevLevelXp;
    const xpProgress = ((currentXp - prevLevelXp) / xpNeeded) * 100;
    return Math.min(Math.max(xpProgress, 0), 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with user info */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: `https://api.dicebear.com/7.x/pixel-art/png?seed=${selectedAvatar}`,
                }}
                style={styles.avatar}
              />
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>{level}</Text>
              </View>
            </View>

            <View style={styles.userDetails}>
              <Text style={styles.username}>{username || "User"}</Text>
              <Text style={styles.title}>{selectedTitle}</Text>
              <View style={styles.streakContainer}>
                <Ionicons name="flame" size={16} color="#FFC107" />
                <Text style={styles.streakText}>{streak} day streak</Text>
              </View>
            </View>
          </View>

          <View style={styles.currencyContainer}>
            <View style={styles.currency}>
              <Ionicons name="ellipse" size={16} color="#FFD700" />
              <Text style={styles.currencyText}>{coins}</Text>
            </View>
            <View style={styles.currency}>
              <Ionicons name="diamond" size={16} color="#14F195" />
              <Text style={styles.currencyText}>{gems}</Text>
            </View>
          </View>
        </View>

        {/* XP Progress */}
        <View style={styles.xpContainer}>
          <View style={styles.xpLabelContainer}>
            <Text style={styles.xpLabel}>XP Progress</Text>
            <Text style={styles.xpAmount}>{xp} XP</Text>
          </View>
          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                { width: `${calculateXpProgress(xp)}%` },
              ]}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#9945FF" }]}
            onPress={() => navigation.navigate("Study")}
          >
            <Ionicons name="timer-outline" size={24} color="#fff" />
            <Text style={styles.actionText}>Study Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#14F195" }]}
            onPress={() => navigation.navigate("Quests")}
          >
            <Ionicons name="list-outline" size={24} color="#fff" />
            <Text style={styles.actionText}>Quests</Text>
          </TouchableOpacity>
        </View>

        {/* Subjects */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Subjects</Text>
          <TouchableOpacity>
            <Ionicons name="add-circle-outline" size={24} color="#9945FF" />
          </TouchableOpacity>
        </View>

        <View style={styles.subjectsContainer}>
          {subjects.map((subject) => (
            <TouchableOpacity
              key={subject.id}
              style={styles.subjectCard}
              onPress={() => console.log(`Navigate to subject ${subject.id}`)}
            >
              <View
                style={[
                  styles.subjectIconContainer,
                  { backgroundColor: subject.color },
                ]}
              >
                <Ionicons name={subject.icon} size={24} color="#fff" />
              </View>
              <View style={styles.subjectInfo}>
                <Text style={styles.subjectName}>{subject.name}</Text>
                <View style={styles.subjectStatsRow}>
                  <Text style={styles.subjectStat}>Lvl {subject.level}</Text>
                  <Text style={styles.subjectStat}>•</Text>
                  <Text style={styles.subjectStat}>{subject.xp} XP</Text>
                </View>
                <View style={styles.subjectProgress}>
                  <View
                    style={[
                      styles.subjectProgressFill,
                      { width: "60%", backgroundColor: subject.color },
                    ]}
                  />
                </View>
                <Text style={styles.studyTime}>
                  <Ionicons name="time-outline" size={14} color="#B8B8B8" />{" "}
                  Total: {formatStudyTime(subject.totalStudyTime)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a0b2e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2A1B3D",
  },
  levelBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: "#9945FF",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  levelText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  userDetails: {
    marginLeft: 12,
  },
  username: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    color: "#B8B8B8",
    fontSize: 14,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  streakText: {
    color: "#FFC107",
    fontSize: 12,
    marginLeft: 4,
  },
  currencyContainer: {
    flexDirection: "row",
  },
  currency: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A1B3D",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginLeft: 8,
  },
  currencyText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  xpContainer: {
    margin: 16,
    backgroundColor: "#2A1B3D",
    padding: 12,
    borderRadius: 8,
  },
  xpLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  xpLabel: {
    color: "#fff",
    fontSize: 14,
  },
  xpAmount: {
    color: "#14F195",
    fontSize: 14,
    fontWeight: "bold",
  },
  progressBackground: {
    height: 8,
    backgroundColor: "#3A2B4D",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#14F195",
    borderRadius: 4,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  subjectsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  subjectCard: {
    flexDirection: "row",
    backgroundColor: "#2A1B3D",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  subjectIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  subjectInfo: {
    marginLeft: 12,
    flex: 1,
  },
  subjectName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  subjectStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  subjectStat: {
    color: "#B8B8B8",
    fontSize: 12,
    marginRight: 5,
  },
  subjectProgress: {
    height: 4,
    backgroundColor: "#3A2B4D",
    borderRadius: 2,
    marginTop: 6,
    marginBottom: 6,
    overflow: "hidden",
  },
  subjectProgressFill: {
    height: "100%",
    borderRadius: 2,
  },
  studyTime: {
    color: "#B8B8B8",
    fontSize: 12,
  },
});
