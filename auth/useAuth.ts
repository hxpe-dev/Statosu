import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

const TOKEN_KEY = 'osu_access_token';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false);

  useEffect(() => {
    SecureStore.getItemAsync(TOKEN_KEY).then(token => {
      setIsAuthenticated(!!token);
    });
  }, []);

  return { isAuthenticated };
}

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function logout() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
