import * as SecureStore from "expo-secure-store";
import { OSU_API_BASE_URL } from "../constants/Osu";

export async function getAccessToken() {
  return await SecureStore.getItemAsync("osu_access_token");
}

export async function setAccessToken(token: string) {
  await SecureStore.setItemAsync("osu_access_token", token);
}

export async function getClientID() {
  return await SecureStore.getItemAsync("client_id");
}

export async function setClientID(clientId: string) {
  return await SecureStore.setItemAsync("client_id", clientId);
}

export async function getClientSecret() {
  return await SecureStore.getItemAsync("client_secret");
}

export async function setClientSecret(clientSecret: string) {
  return await SecureStore.setItemAsync("client_secret", clientSecret);
}

export async function apiFetch(path: string, options = {}) {
  const token = await getAccessToken();
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${OSU_API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options as any).headers,
    },
  });

  if (!res.ok) {
    console.warn("osu API error", res.status);
    throw new Error("API ERROR");
  }

  return res.json();
}

export async function getCurrentUser() {
  return apiFetch("/me");
}

export async function getUserData(userId: number) {
  return apiFetch(`/users/${userId}?key=id&mode=osu`);
}

export async function getUserBestScores(userId: number, limit = 10, legacy = 1) {
  return apiFetch(`/users/${userId}/scores/best?limit=${limit}&mode=osu&legacy_only=${legacy}`);
}

export async function getUserRecentScores(userId: number, limit = 10, legacy = 1) {
  return apiFetch(`/users/${userId}/scores/recent?limit=${limit}&mode=osu&legacy_only=${legacy}`);
}

export async function getUserPinnedScores(userId: number, limit = 10, legacy = 1) {
  return apiFetch(`/users/${userId}/scores/pinned?limit=${limit}&mode=osu&legacy_only=${legacy}`);
}