# SKay Auto Group

Luxury & Exotic Car Dealership website built with Express.js + React SPA (Vite).

## Stack

- **Frontend**: React 18, React Router, Vite, Tailwind CSS, Framer Motion
- **Backend**: Express.js, JWT auth, Prisma ORM
- **Database**: MySQL
- **Image Hosting**: Cloudinary

## Scripts

```bash
npm run dev          # Start dev server (Express + Vite)
npm run build        # Build frontend for production
npm start            # Start production server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
```

## Environment Variables

```env
DATABASE_URL=mysql://user:pass@host:3306/db
NEXTAUTH_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SETUP_SECRET=your-setup-secret
```

## Deployment

Auto-deploys from GitHub to Hostinger. Build command: `npm run build`. Start command: `npm start`.
