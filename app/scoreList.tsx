import { getUserBestScores } from "@/api/osu";
import ScoreCard from "@/components/ScoreCard";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ScoreList() {
  const { title, userId } = useLocalSearchParams();

  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const styles = getStyles(theme);

  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUserData() {
      try {
        const sc = await getUserBestScores(parseInt(userId as string), 100);
        setScores(sc);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [userId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.thirdText} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.count}>{scores.length}</Text>
      </View>
      {scores.map((score: any, i: number) => (
        <ScoreCard
          key={i}
          score={score}
          theme={theme}
          style={i !== scores.length - 1 ? { marginBottom: 12 } : {}}
        />
      ))}
    </ScrollView>
  );
}

const getStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      flex: 1,
    },
    contentContainer: {
      padding: 16,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: 16,
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 20,
      color: theme.text,
      fontFamily: "Montserrat_700Bold",
    },
    count: {
      fontSize: 16,
      color: theme.secondaryText,
      fontFamily: "Montserrat_500Medium"
    },
  });
