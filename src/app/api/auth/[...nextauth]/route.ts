import NextAuth, { AuthOptions, SessionStrategy } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import type { MongoClient } from "mongodb";
import clientPromise from "../../../../lib/mongodb-client";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise as Promise<MongoClient>),
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
