import { authConfig } from "@/auth.config";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInWithApi } from "./app/lib/api/auth";
import { UserSesion } from "./app/lib/definitions";
import { UUID } from "crypto";
import { formLoginSchema } from "./app/lib/schemas/formLoginSchema";
import { handleAsync } from "./app/lib/utils";

export const { auth, signIn, signOut, unstable_update } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {

        const parsedCredentials = formLoginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          console.error('Invalid credentials forma', parsedCredentials.error);
          return null;
        }

        const [user, error] = await handleAsync<UserSesion>(signInWithApi(parsedCredentials.data));

        if (error) {
          console.log('Error traying to authenticate with API: ', error);
          throw new Error('Error traying to authenticate with API');
        }

        if (!user) {
          console.error('User not found or invalid credentials');
          return null;
        }

        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
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

      if (trigger === "update" && session?.user) {
        const updatedUser = session.user;

        token.id = updatedUser.id ?? token.id;
        token.username = updatedUser.username ?? token.username;
        token.firstName = updatedUser.firstName ?? token.firstName;
        token.lastName = updatedUser.lastName ?? token.lastName;
        token.email = updatedUser.email ?? token.email;
        token.phone = updatedUser.phone ?? token.phone;
        token.photo = updatedUser.photo ?? token.photo;
        token.status =
          typeof updatedUser.status === "boolean"
            ? updatedUser.status
            : token.status;
        token.accessToken = updatedUser.accessToken ?? token.accessToken;
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
      accessToken: string;
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