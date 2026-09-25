# 💻 Next.js Auth & Dashboard Client

A modern, responsive, and secure frontend client built with **Next.js 15 (App Router)**, **TypeScript**, and **Tailwind CSS**. Designed as the user interface for the Authentication Starter Kit, featuring dynamic UI components, multi-step auth flows, and Google OAuth integration.

---

## ✨ Key Features

- **Authentication & Onboarding**
  - Single-page Auth interface supporting **Login**, **Register**, **Email OTP Verification**, and **Multi-step Password Recovery**.
  - Integrated **Google Sign-In** with `@react-oauth/google`.
  - Custom password visibility toggle (Eye Show/Hide) with cross-browser CSS normalization.

- **Smart User Dashboard**
  - Dynamic user profile management with conditional rendering.
  - **OAuth Protection**: Automatically locks email fields and hides password change settings for Google Sign-In users.
  - **Secure Email Update**: Modal prompt for OTP verification when changing profile email address.
  - **Custom Tailwind Confirmation Modal**: Interactive modal for account deletion without browser native `confirm()` popups.

- **UX & Feedback**
  - Inline loading indicators and button spinners during API requests.
  - Clean error and success alert callouts.

---

## 🛠️ Tech Stack

| Category       | Technology                     |
|-----------------|----------------------------------|
| Framework       | Next.js 15 (App Router)         |
| Language        | TypeScript                       |
| Styling         | Tailwind CSS                     |
| HTTP Client     | Axios                             |
| OAuth Library   | `@react-oauth/google`            |
| Deployment      | Vercel                            |

---

## 📁 Folder Structure

```
learn-ex-frontend/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Protected Dashboard page & Profile settings
│   │   ├── globals.css         # Global styles & password reveal CSS reset
│   │   ├── layout.tsx          # Root layout with Google OAuth Provider
│   │   └── page.tsx            # Multi-view Auth Page (Login, Register, Reset, OTP)
│   └── lib/
│       └── api.ts              # Axios configuration with JWT interceptor
├── .env.local                  # Local environment variables
├── next.config.ts              # Next.js configuration
├── package.json                # Client dependencies & scripts
└── tailwind.config.ts          # Tailwind CSS configuration
```

---

## 🔑 Environment Variables (`.env.local`)

Create a `.env.local` file in the root directory of the frontend project:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
```

For production deployment on Vercel: ensure `NEXT_PUBLIC_API_URL` points to your deployed Express backend URL (e.g. `https://your-backend.vercel.app/api`).

---

## 🚦 Local Getting Started

**1. Clone Repository & Install Dependencies**

```bash
git clone <repository-frontend-url>
cd learn-ex-frontend
npm install
```

**2. Run Development Server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**3. Build for Production**

```bash
npm run build
npm start
```