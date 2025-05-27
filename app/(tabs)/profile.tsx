import ScoreCard from "@/components/ScoreCard";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { getCurrentUser, getUserBestScores, getUserPinnedScores } from "../../api/osu";


export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const styles = getStyles(theme);

  const [user, setUser] = useState<any>(null);
  const [bestScores, setBestScores] = useState<any[]>([]);
  const [pinnedScores, setPinnedScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      try {
        const user = await getCurrentUser();
        setUser(user);

        // const userFull = await getUserData(user.id);

        const pinned = await getUserPinnedScores(user.id);
        setPinnedScores(pinned);

        const topScores = await getUserBestScores(user.id, 1);
        setBestScores(topScores);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.thirdText} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topProfile}>
        <Image
          source={{ uri: user.avatar_url }}
          style={styles.userCover}
        />
        <View style={styles.userInfoTopContainer}>
          <Text style={styles.countryText}>{user.country.name}</Text>
          <Text style={styles.usernameText}>{user.username}</Text>
          <Text style={styles.levelText}>Level {user.statistics.level.current}</Text>
        </View>
      </View>

      <View style={styles.rankingsContainer}>
        <View style={styles.rankContainerLeft}>
          <Text style={styles.rankName}>Global</Text>
          <Text style={styles.rankValue}>#{user.statistics.global_rank.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
        </View>
        <View style={styles.rankContainerCenter}>
          <Text style={styles.rankName}>Country</Text>
          <Text style={styles.rankValue}>#{user.statistics.country_rank.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
        </View>
        <View style={styles.rankContainerRight}>
          <Text style={styles.rankName}>Total pp</Text>
          <Text style={styles.rankValue}>{Math.round(user.statistics.pp).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <View style={styles.topSectionContainer}>
          <Text style={styles.sectionTitle}>Pinned Scores</Text>
        </View>
        {pinnedScores.map((score, i) => (
          <ScoreCard
            key={i}
            score={score}
            theme={theme}
            style={i !== pinnedScores.length - 1 ? { marginBottom: 12 } : {}}
          />
        ))}
      </View>

      <View style={styles.sectionContainer}>
        <Pressable
          style={styles.topSectionContainer}
          onPress={() => {
            router.push({
              pathname: "/scoreList",
              params: {
                title: "Best Performance",
                userId: user.id,
              },
            });
          }}
        >
          <Text style={styles.sectionTitle}>Best Performance</Text>
          <Ionicons
            name={"arrow-forward-outline"}
            size={20}
            color={theme.secondaryText}
          />
        </Pressable>
        {bestScores.slice(0, 1).map((score, i) => (
          <ScoreCard
            key={i}
            score={score}
            theme={theme}
            style={i !== bestScores.length - 1 ? { marginBottom: 12 } : {}}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const getStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      flex: 1, 
      padding: 16,
    },
    topProfile: {
      flexDirection: 'row',
      alignItems: "center",
      marginBottom: 24,
    },
    userCover: {
      width: 74,
      height: 74,
      borderRadius: 24,
    },
    userInfoTopContainer: {
      flex: 1,
      flexDirection: 'column',
      alignItems: "flex-start",
      marginLeft: 16,
      justifyContent: 'center',
    },
    countryText: {
      color: theme.secondaryText,
      fontSize: 14,
      fontFamily: "Montserrat_400Regular",
      marginVertical: -3,
    },
    usernameText: {
      color: theme.text,
      fontSize: 24,
      fontFamily: "Montserrat_600SemiBold",
    },
    levelText: {
      color: theme.thirdText,
      fontSize: 14,
      fontFamily: "Montserrat_400Regular_Italic",
      marginVertical: -3,
    },
    rankingsContainer: {
      backgroundColor: theme.surface,
      flexDirection: "row",
      justifyContent: "space-between",
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 24,
    },
    rankContainerLeft: {
      flexDirection: "column",
      alignItems: 'flex-start',
      width: "33%",
    },
    rankContainerCenter: {
      flexDirection: "column",
      alignItems: 'center',
      width: "33%",
    },
    rankContainerRight: {
      flexDirection: "column",
      alignItems: 'flex-end',
      width: "33%",
    },
    rankName: {
      color: theme.text,
      fontSize: 14,
      fontFamily: "Montserrat_500Medium",
    },
    rankValue: {
      color: theme.text,
      fontSize: 16,
      fontFamily: "Montserrat_600SemiBold",
    },
    sectionContainer: {
      flexDirection: 'column',
      marginBottom: 24,
    },
    topSectionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    sectionTitle: {
      color: theme.text,
      fontSize: 16,
      fontFamily: "Montserrat_700Bold",
    },
  });
