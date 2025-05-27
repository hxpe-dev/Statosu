import { makeRedirectUri } from "expo-auth-session";

export const OSU_REDIRECT_URI = makeRedirectUri({
  scheme: "statosu",
  path: "login",
});
export const OSU_SCOPE = ["identify", "public", "chat.read", "chat.write", "chat.write_manage", "forum.write", "friends.read"];
export const OSU_AUTH_URL = `https://osu.ppy.sh/oauth/authorize`;
export const OSU_API_BASE_URL = "https://osu.ppy.sh/api/v2";