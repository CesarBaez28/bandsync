import { jwtDecode, JwtPayload } from 'jwt-decode';
import type { NextAuthConfig } from 'next-auth';
import { config } from './app/lib/config';
import { getToken } from 'next-auth/jwt';

const checkAccessToken = (token: string | undefined): boolean => {
  if (!token) return false;
  try {
    const decoded: JwtPayload = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return typeof decoded.exp !== "undefined" && decoded.exp > currentTime;
  } catch (e) {
    console.error("Error decoding token", e);
    return false;
  }
};

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async authorized({ request }) {

      const allowPublicAccess = new Set([
        '/login',
        '/register',
        '/invitation',
        '/forgot-password',
        '/reset-password',
        '/two-factor/verify'
      ]);

      if (allowPublicAccess.has(request.nextUrl.pathname)) {
        return true;
      }

      const raw = await getToken({ req: request, secret: config.authSecret });

      const apiJwtString = raw?.accessToken as string | undefined;

      const isAccessTokenValid = checkAccessToken(apiJwtString);

      if (!isAccessTokenValid) return false;

      if (request.nextUrl.pathname === '/login') {
        return Response.redirect(new URL('/', request.nextUrl));
      }

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;