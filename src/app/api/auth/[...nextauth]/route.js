import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // If this is the initial sign-in, add the access token to the token object
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Include the access token in the session object
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin', // Optional: Define a custom sign-in page
    signOut: '/auth/signout',
    error: '/auth/error', // Optional: Error page
  },
  secret: process.env.NEXTAUTH_SECRET, // Add a secret key for NextAuth.js
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };