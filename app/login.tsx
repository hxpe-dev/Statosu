import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import * as AuthSession from "expo-auth-session";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { setAccessToken } from "../api/osu";
import { OSU_AUTH_URL, OSU_REDIRECT_URI, OSU_SCOPE } from "../constants/Osu";


const discovery = {
  authorizationEndpoint: OSU_AUTH_URL,
  tokenEndpoint: "https://osu.ppy.sh/oauth/token",
};

export default function Login() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const styles = getStyles(theme);

  const [clientId, onChangeClientId] = React.useState('');
  const [clientSecret, onChangeClientSecret] = React.useState('');

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      redirectUri: OSU_REDIRECT_URI,
      responseType: AuthSession.ResponseType.Code,
      scopes: OSU_SCOPE,
      usePKCE: false,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;

      fetch("https://osu.ppy.sh/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: OSU_REDIRECT_URI,
        }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (data.access_token) {
            await setAccessToken(data.access_token);
            router.replace("/(tabs)");
          } else {
            console.error("Token exchange failed:", data);
          }
        })
        .catch(console.error);
    }
  }, [clientId, clientSecret, response]);

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <Text style={styles.title}>Welcome to Statosu</Text>
        <Text style={styles.subTitle}>Use our OAuth (not working atm)</Text>
        <Pressable
          style={styles.loginButton}
          disabled={!request}
          onPress={() => promptAsync()}
        >
          <Text style={styles.loginText}>LOGIN WITH OSU!</Text>
        </Pressable>
        <Text style={styles.textSeparator}>------- OR -------</Text>
        <Text style={styles.subTitle}>Use your own OAuth (recommended atm)</Text>
        <Pressable style={styles.instructionsButton} onPress={() => Linking.openURL('https://github.com/hxpe-dev/Statosu/blob/main/custom_oauth_instructions.md')}>
          <Text style={styles.instructionsText}>Click to see instructions</Text>
        </Pressable>
        <TextInput
          style={styles.clientIdInput}
          onChangeText={onChangeClientId}
          value={clientId}
          placeholder="Client ID"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.clientSecretInput}
          onChangeText={onChangeClientSecret}
          value={clientSecret}
          placeholder="Client Secret"
        />
        <Pressable
          style={styles.loginButton}
          disabled={!request}
          onPress={() => promptAsync()}
        >
          <Text style={styles.loginText}>LOGIN</Text>
        </Pressable>
      </View>
    </View>
  );
}

const getStyles = (theme: typeof Colors.light) =>
  StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: theme.background,
      justifyContent: "center", 
      alignItems: "center",
    },
    modal: {
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: theme.surface,
      width: 300,
      borderRadius: 24,
      padding: 16,
    },
    title: {
      color: theme.text,
      fontSize: 24, 
      marginBottom: 20,
      fontFamily: "Montserrat_700Bold",
      textAlign: 'center',
    },
    subTitle: {
      color: theme.text,
      fontSize: 20,
      fontFamily: "Montserrat_600SemiBold",
      textAlign: 'center',
      marginBottom: 8
    },
    textSeparator: {
      color: theme.secondaryText,
      fontSize: 16,
      marginVertical: 32,
      fontFamily: "Montserrat_500Medium",
      textAlign: 'center',
    },
    instructionsButton: {
      backgroundColor: theme.background,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginBottom: 12,
    },
    instructionsText: {
      color: theme.text,
      fontSize: 14,
      fontFamily: "Montserrat_400Regular",
    },
    clientIdInput: {
      alignSelf: 'stretch',
      textAlign: 'center',
      borderWidth: 1,
      borderRadius: 12,
      borderColor: theme.secondaryText,
      marginBottom: 12,
    },
    clientSecretInput: {
      alignSelf: 'stretch',
      textAlign: 'center',
      borderWidth: 1,
      marginBottom: 12,
      borderRadius: 12,
      borderColor: theme.secondaryText,
    },
    loginButton: {
      backgroundColor: theme.background,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 12,
    },
    loginText: {
      color: theme.text,
      fontSize: 16,
      fontFamily: "Montserrat_600SemiBold",
    },
  });
