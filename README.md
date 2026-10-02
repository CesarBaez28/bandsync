# BandSync

BandSync is a web application for organizing a music band's activities. It lets users manage multiple bands, their members, repertoires, songs, setlists, and events through an authenticated interface with band-level permissions.

This repository contains the web application frontend. Authentication and business data are integrated with an external REST API; the API service and its data storage are not part of this project.

## Table of Contents

- [BandSync](#bandsync)
  - [Table of Contents](#table-of-contents)
  - [Key Features](#key-features)
  - [How It Works](#how-it-works)
  - [Technology Stack](#technology-stack)
  - [Requirements](#requirements)
  - [Local Setup](#local-setup)
  - [Build and Run in Production](#build-and-run-in-production)
  - [Project Structure](#project-structure)
  - [ESLint](#eslint)
  - [Security](#security)

## Key Features

- **Bands and members:** create and configure bands, send invitations, and manage members.
- **Authentication and accounts:** sign in, register, recover or change passwords, and use two-factor authentication (2FA).
- **Songs:** maintain a song catalog with artists, genres, keys, links, and sheet music.
- **Repertoires:** organize songs into repertoires.
- **Setlists:** create performance lists organized into ordered sets with notes; export them to PDF or Excel.
- **Calendar:** view and manage band events.
- **Roles and permissions:** assign musical roles and manage access roles and permissions.
- **Profile and policies:** manage the user account and access privacy and terms-of-service pages.

Available options may vary based on the user's permissions for each band.

## How It Works

1. Users authenticate through the application. NextAuth.js maintains the session using JWT and integrates with the API's authentication endpoints.
2. After signing in, users can access the bands associated with their account and open a band's workspace.
3. Pages and server actions retrieve or update data through the API modules in `src/app/lib/api`. Requests include the access token and, when applicable, a configurable header containing the band's identifier.
4. The REST API processes operations and persists data. BandSync consumes its responses and displays the results in the interface.

## Technology Stack

- **Next.js 16** with the App Router and **React 19**.
- **TypeScript 5** for static typing.
- **NextAuth.js 5** for authentication and sessions.
- **React Hook Form** and **Zod** for forms and validation.
- **Zustand** for shared state and **dnd-kit** for drag-and-drop interactions.
- **FullCalendar** for event scheduling.
- **React PDF** for generating PDF documents; Excel exports are requested from the API.
- **CSS Modules**, **Framer Motion**, and **SVGR** for styling, animations, and using SVG icons as components.

## Requirements

- Node.js 20.9 or later.
- npm (`package-lock.json` is included).
- Access to a compatible BandSync REST API instance.

## Local Setup

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Create a `.env.local` file in the project root:

   ```dotenv
   API=http://localhost:8080
   AUTH_SECRET=replace-with-a-long-random-secret
   MUSICAL_BAND_HEADER=X-Musical-Band-Id
   APP_NAME=BandSync
   ```

   Set `API` to your backend's base URL. The header name configured in `MUSICAL_BAND_HEADER` must match the one expected by that API. To generate a local secret, run `openssl rand -base64 32` and assign its output to `AUTH_SECRET`.

   All four variables are required. `API` configures the backend's base URL; `AUTH_SECRET` protects the authentication session; `MUSICAL_BAND_HEADER` defines the header used to send the band context; and `APP_NAME` sets the name displayed by the application. Do not publish secrets or commit them to version control.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

The API configured in `API` must be running and configured to accept requests from the application. This repository does not include a development backend or a local database.

## Build and Run in Production

Create an optimized production build:

```bash
npm run build
```

Set the same environment variables in your deployment environment, then start the production server:

```bash
npm run start
```

Deployment requires a Node.js runtime compatible with Next.js and network access from the application to the API. See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for other hosting options.

## Project Structure

```text
src/
	app/
		(main)/             Sign-in, registration, account, and legal pages
		api/                 Next.js API routes
		lib/
			actions/           Server Actions and form logic
			api/               Clients for backend REST endpoints
			schemas/           Validation schemas
		musicalbands/        Band workspace routes
		ui/                  Domain-organized interface components
	auth.config.ts         Authorization and route protection configuration
	auth.ts                NextAuth integration and credentials provider
public/                  Static assets, such as icons and images
```

## ESLint

To run ESLint directly:

```bash
npx eslint .
```

The `npm run lint` script is currently configured as `next lint`, a command that is not available in Next.js 16. Use the direct ESLint command above instead.

## Security

- Keep `AUTH_SECRET` private and use a distinct, strong value for each environment.
- Do not expose credentials or tokens in the browser, repository, or logs.
- Configure the API to validate authentication and permissions on the server; hiding an option in the interface is not a substitute for backend authorization.
