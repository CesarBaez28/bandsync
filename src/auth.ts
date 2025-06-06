import { authConfig } from "@/auth.config";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { signInWithApi } from "./app/lib/api/auth";
import { User } from "./app/lib/definitions";
import { UUID } from "crypto";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            username: z.string().min(6),
            password: z.string().min(8)
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.error("Invalid credentials format", parsedCredentials.error);
          return null;
        }

        const user: User = await signInWithApi(parsedCredentials.data);

        if (!user) {
          console.error("User not found or invalid credentials");
          return null;
        }

        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
        token.phone = user.phone;
        token.photo = user.photo;
        token.status = user.status;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as UUID,
        email: token.email as string,
        username: token.username as string,
        firstName: token.firstName as string,
        lastName: token.lastName as string,
        phone: token.phone as string,
        photo: token.photo as string,
        status: token.status as boolean,
        emailVerified: null,
        accessToken: token.accessToken as string,
      };
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  session: { strategy: 'jwt' },
});

declare module 'next-auth' {
  interface Session {
    user: {
      id: UUID;
      username: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      photo: string;
      status: boolean;
    };
    accessToken: string;
  }

  interface User {
    id: UUID;
    username: string;
    accessToken: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    photo: string;
    status: boolean;
  }

  interface JWT {
    accessToken: string;
  }
}