# 💌 Digital Candy Grams App

A Next.js application designed for university Resident Assistants (RAs) or student organizations to host digital Valentine's Day events. Students can draw custom messages on a digital "Candy Gram," select a destination dorm building, and submit them. This was created specifically for Bradley University's Residential Living department by the "Enthusiasm" initiative.

Admins can access a dashboard to view all submissions, filter by building, and **export them as print-ready PDFs** (formatted 6-per-page) to attach to candy and deliver. The dashboard is hosted on `/admin` and is secured with a password.

![App Screenshot](public/template.png)

## ✨ Features

- **Digital Drawing Canvas**: 
  - Color palette with eraser support.
  - Users draw directly over a customizable background template.
  - Prevents blank submissions.
- **Routing System**: Students select a destination building (e.g., Williams, Harper, Geisert) for easier sorting.
- **Admin Dashboard** (Password Protected):
  - View all submissions with visual thumbnails.
  - Filter submissions by building.
  - Delete inappropriate or test entries.
- **PDF Generation**:
  - Automatically formats cards into a printable US Letter PDF.
  - Fits 6 cards per page (2 columns x 3 rows). Handles optimization for different card amounts as well (IE 7 cards print across 2 pages to optimize layout).
  - Perfect for printing, cutting, and distributing.

## 🛠 Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Database**: PostgreSQL (via Supabase or Vercel Postgres)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: Tailwind CSS
- **PDF Generation**: `@react-pdf/renderer`
- **Canvas**: `react-sketch-canvas`

## 🚀 Installation & Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- A PostgreSQL database URL (can be local or hosted on Vercel/Supabase).

### 2. Clone the Repository
```bash
git clone [https://github.com/Conmmander/CandyGramApp.git](https://github.com/Conmmander/CandyGramApp.git)
cd CandyGramApp
npm install

```
### 3. Environment Variables

Create a `.env` file in the root directory. You need a Postgres connection string and an admin password.

```bash
# Connection to your Postgres database
POSTGRES_PRISMA_URL="postgres://user:password@host:5432/dbname?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgres://user:password@host:5432/dbname"

# Admin Dashboard Password (Default: admin123)
ADMIN_PASSWORD="your_secret_password"

```

### 4. Database Setup

Sync your database schema with Prisma:

```bash
npx prisma db push
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) to see the drawing page.
Open [http://localhost:3000/admin](https://www.google.com/search?q=http://localhost:3000/admin) to see the dashboard.

## 📦 Deployment (Vercel)

This project is optimized for Vercel and Vercel Postgres.

1. **Push to GitHub**: Ensure your latest code is pushed to your repository.
2. **Create Project on Vercel**:
* Go to the Vercel Dashboard and click "Add New... > Project".
* Import your `CandyGramApp` repository.

3. **Add Database (Vercel Postgres)**:
* Before clicking "Deploy", go to the "Storage" tab in the Vercel project configuration menu (or create the store separately and link it).
* Click "Create" on Vercel Postgres.
* Once created, Vercel will automatically populate the `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` environment variables for you.

4. **Configure Environment Variables**:
* In the "Environment Variables" section of the deployment screen, add your admin password:
* Key: `ADMIN_PASSWORD`
* Value: `your_secure_password`




5. **Deploy**:
* Click "Deploy".
* Vercel will install dependencies and run the `postinstall` script (`prisma generate`) automatically.
* Once deployed, the app will be live!

**Note:** If you see database errors on the first run, you may need to run the schema push command from your local machine pointing to the Vercel database, or add `npx prisma db push` to your build command (though `prisma generate` is usually sufficient if the database is already synced).

## Creation

This app was made using Google Gemini Pro, a large language model. While it is a trivial web application, it was also the first project that the creator "Vibe Coded", and was meant to see if such methods could actually generate usable code.
