import { timeAgo } from "@/hooks/timeConverter";
import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";

interface ScoreCardProps {
  score: any;
  theme: any;
  style?: object;
}

const ScoreCard = ({ score, theme, style = {} }: ScoreCardProps) => {
  const styles = getStyles(theme);

  return (
    <View style={style}>
      <ImageBackground
        style={styles.beatmapImage}
        source={{ uri: score.beatmapset?.covers.cover }}
        imageStyle={{ borderRadius: 24 }}
      >
        <View style={styles.beatmapImageDarkener}>
          <View style={styles.beatmapDescriptionLine}>
            <Text style={styles.beatmapTitle} numberOfLines={1}>
              {score.beatmapset?.title}
            </Text>
            <Text style={styles.beatmapArtist} numberOfLines={1}>
              by {score.beatmapset?.artist}
            </Text>
          </View>
          <View style={styles.beatmapDescriptionLine}>
            <Text style={styles.beatmapDifficulty}>{score.beatmap?.version}</Text>
          </View>
          <View style={styles.beatmapDescriptionLine}>
            <View style={styles.leftStats}>
              <Text
                style={[
                  styles.rank,
                  {
                    color:
                      score.rank === "SS" ? "#FFD872" :
                      score.rank === "S"  ? "#02B5C3" :
                      score.rank === "A"  ? "#88DA20" : 
                      score.rank === "B"  ? "#EBBD48" :
                      score.rank === "C"  ? "#FF8E5D" :
                      score.rank === "D"  ? "#FF5A5A" :
                      score.rank === "F"  ? "#FF0000" :
                      theme.text,
                  },
                ]}
              >
                {score.rank}
              </Text>
              <Text style={styles.beatmapAccuracy}>
                {(score.accuracy * 100).toFixed(2)}%
              </Text>
              <Text style={styles.beatmapPP}>{Math.round(score.pp)}pp</Text>
            </View>
            <Text style={styles.timeAgo}>{timeAgo(score.created_at)}</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const getStyles = (theme: any) =>
  StyleSheet.create({
    beatmapImage: {
      width: "100%",
      height: 96,
    },
    beatmapImageDarkener: {
      flex: 1,
      borderRadius: 24,
      backgroundColor: "rgba(0,0,0, 0.67)",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center",
    },
    beatmapDescriptionLine: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginHorizontal: 16,
      alignSelf: "stretch",
    },
    leftStats: {
      flexDirection: "row",
      alignItems: "center",
      flexShrink: 1,
    },
    beatmapStatsLine: {
      flexDirection: 'row',
    },
    beatmapTitle: {
      color: theme.text,
      fontSize: 16,
      fontFamily: "Montserrat_500Medium",
      marginRight: 12,
      maxWidth: "80%",
    },
    beatmapArtist: {
      color: theme.secondaryText,
      fontSize: 12,
      fontFamily: "Montserrat_400Regular_Italic",
      flexShrink: 1,
    },
    beatmapDifficulty: {
      color: theme.thirdText,
      fontSize: 14,
      fontFamily: "Montserrat_400Regular_Italic",
    },
    rank: {
      fontSize: 16,
      fontFamily: "Montserrat_600SemiBold",
      marginRight: 16,
      marginTop: 4,
    },
    beatmapAccuracy: {
      color: theme.text,
      fontSize: 16,
      fontFamily: "Montserrat_400Regular",
      marginRight: 16,
      marginTop: 4,
    },
    beatmapPP: {
      color: theme.text,
      fontSize: 16,
      fontFamily: "Montserrat_400Regular",
      marginTop: 4,
    },
    timeAgo: {
      color: theme.secondaryText,
      fontSize: 12,
      fontFamily: "Montserrat_400Regular",
    },
  });

export default ScoreCard;
