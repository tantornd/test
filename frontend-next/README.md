# Inventory Management System - Next.js Frontend

This is the Next.js version of the Inventory Management System frontend, migrated from Vite + React.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Redux Toolkit** - State management
- **Redux Persist** - Persist Redux state
- **NextAuth** - Authentication
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library
- **Axios** - HTTP client
- **Sonner** - Toast notifications

## Features

- ✅ Redux + Redux Persist for state management
- ✅ NextAuth for authentication (credentials provider)
- ✅ Next.js App Router for file-based routing
- ✅ Fully typed with TypeScript
- ✅ Modern UI with shadcn/ui components
- ✅ Responsive design with Tailwind CSS
- ✅ Product management (CRUD operations)
- ✅ Stock request management
- ✅ Role-based access control (Admin, Staff, Guest)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend server running on `http://localhost:8080`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
# Copy and update .env.local
cp .env.local .env.local
```

Update the values in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend-next/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   │   └── auth/            # NextAuth configuration
│   │   ├── login/               # Login page
│   │   ├── register/            # Register page
│   │   ├── products/            # Products page
│   │   ├── my-requests/         # My requests page
│   │   ├── all-requests/        # All requests page (admin)
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page (redirects to /products)
│   │   ├── providers.tsx        # Redux + NextAuth providers
│   │   └── globals.css          # Global styles
│   ├── components/              # React components
│   │   ├── auth/                # Authentication components
│   │   ├── products/            # Product components
│   │   ├── requests/            # Request components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── figma/               # Figma components
│   │   ├── Navigation.tsx       # Navigation component
│   │   └── Loading.tsx          # Loading component
│   ├── lib/                     # Utility libraries
│   │   ├── api.ts              # Axios instance with interceptors
│   │   ├── auth.ts             # NextAuth configuration
│   │   └── utils.ts            # Utility functions
│   ├── services/                # API services
│   │   ├── productService.ts   # Product API calls
│   │   └── requestService.ts   # Request API calls
│   ├── store/                   # Redux store
│   │   ├── index.ts            # Store configuration
│   │   ├── authSlice.ts        # Auth slice
│   │   └── hooks.ts            # Typed Redux hooks
│   └── types/                   # TypeScript types
│       └── index.ts            # Shared types
├── public/                      # Static files
├── .env.local                   # Environment variables
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies

```

## Key Differences from Vite Version

### State Management
- **Before**: React Context API (`AuthContext`)
- **After**: Redux Toolkit + Redux Persist

### Routing
- **Before**: React Router DOM with `<Route>` components
- **After**: Next.js App Router with file-based routing

### Authentication
- **Before**: Custom auth with Context API
- **After**: Redux + NextAuth (with credentials provider)

### Data Fetching
- Both versions use Axios with similar service patterns
- Redux Thunks for async actions in Next.js version

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8080/api/v1` |
| `NEXTAUTH_URL` | Frontend URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret for NextAuth | (generate with `openssl rand -base64 32`) |

## API Integration

The app communicates with an Express backend. API calls are made through service files:

- `productService.ts` - Product CRUD operations
- `requestService.ts` - Stock request operations

Axios interceptors automatically:
- Add JWT tokens to requests (from Redux store)
- Redirect to login on 401 errors
- Handle error responses

## User Roles

### Guest
- View products (read-only)
- Access to login/register

### Staff
- View all products
- Create stock requests (Stock In/Out)
- View and manage own requests
- Cannot access admin features

### Admin
- Full product management (CRUD)
- Toggle product visibility
- View all stock requests from all users
- Manage any stock request

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Notes

- Redux Persist stores auth state in localStorage
- NextAuth session is JWT-based (no database session)
- The backend must support CORS for the frontend origin
- All client components are marked with `'use client'` directive

