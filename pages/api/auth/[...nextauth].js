import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

async function refreshAccessToken(token) {
  try {
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    console.log("REFRESH TOKEN IS : ", refreshedToken);
    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken, //token.refreshToken work as default if refreshedToken.refresh_token is null
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: "Refresh Access Token Error",
    };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    //add the AccessToken and RefreshToken and User to the json web token returned by spotify API
    async jwt({ token, account, user }) {
      //initial Sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.provider.providerAccountId,
          accessTokenExpires: account.expires_at * 1000, // account.expires_at=3600sec and *1000 is to get the expiry times in millisecondes
        };
      }

      //return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        console.log("ACCESS TOKEN IS VALID");
        return token;
      }

      //Access Token has expired ==> we need to get a new one
      console.log("ACCESS TOKEN HAS EXPIRED, REFRESHING...");
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;

      return session;
    },
  },
});
