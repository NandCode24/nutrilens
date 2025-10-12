# 🥦 NutriLens – Your Personal AI Health & Nutrition Assistant

> **Team ID:** TM180  
> **Team Name:** BitByBit  

NutriLens is an AI-powered web application designed to help users make informed food and medicine choices through image-based and text-based analysis.  
With the power of **Google Gemini AI**, **Next.js**, and **Neon Database**, NutriLens scans ingredients or medicine labels, provides nutritional insights, health ratings, and personalized recommendations — all in a simple, user-friendly dashboard.

---

## 🚀 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Frontend** | Next.js 15 (App Router, React 19) |
| **Backend** | Next.js API Routes (Node.js Runtime) |
| **Database** | NeonDB (PostgreSQL + Prisma ORM) |
| **Auth** | Firebase Authentication (Google Sign-In + Email) |
| **AI Model** | Google Gemini API (Generative AI) |
| **Styling** | Tailwind CSS + Shadcn UI |
| **Deployment** | Vercel |
| **Language** | TypeScript |

---

## ⚙️ Features Overview

### 👤 User Management
- Secure Firebase Authentication (Google Sign-In, Email Sign-Up)
- Profile setup with personal details, health goals, and preferences
- Persistent onboarding flow with dynamic redirection

### 🧠 AI-Powered Food Label Analysis
- Upload an image of any **food or ingredient label**
- Gemini AI extracts and analyzes the text (OCR built-in)
- Detects:
  - Ingredients  
  - Allergens  
  - Additives & preservatives (with side effects)  
  - Nutritional summary  
  - Health rating (0–10)  
  - Personalized recommendation (based on user profile)

### 💊 Medicine Analysis
- Upload an image or type medicine name
- AI identifies active ingredients, uses, side effects, and precautions
- Personalized compatibility score based on user health profile

### 🩺 Symptom Checker
- Input health symptoms
- AI analyzes and provides probable conditions with advice & warning signs

### 📜 Health Tips
- Personalized wellness and nutrition tips fetched via AI

### 📚 History Dashboard
- Tracks all AI scans — Food & Medicine — tied to each user
- Allows deleting records dynamically
- Data synced with NeonDB via Prisma ORM

### 🌓 Theme Support
- Global dark/light mode toggle with persistent user preference

### 🌍 Scalable Architecture
- Next.js App Router structure  
- Prisma for data layer abstraction  
- Ready for multilingual support (future-ready for Hindi, Gujarati, etc.)

---

## 🧩 Folder Structure

nutrilens/
├── prisma/
│   ├── schema.prisma        # Database schema definition
├── src/
│   ├── app/
│   │   ├── api/             # API routes (server-side)
│   │   │   ├── ingredient/route.ts
│   │   │   ├── medicine/route.ts
│   │   │   ├── symptom-check/route.ts
│   │   │   ├── history/route.ts
│   │   │   ├── profile/route.ts
│   │   └── (frontend pages)
│   ├── lib/
│   │   ├── prisma.ts        # Prisma client instance
│   │   ├── firebase.ts      # Firebase config
│   ├── components/          # UI components
│   ├── context/             # Global context providers
│   └── styles/              # Tailwind styles
├── .env                     # Environment variables
├── package.json
└── README.md

---

## ⚙️ Installation Guide

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/NandCode24/nutrilens.git
cd nutrilens

2️⃣ Install Dependencies

npm install

3️⃣ Setup Environment Variables

Create a .env file in the root directory and configure it as follows:

# Prisma / Neon DB
DATABASE_URL="postgresql://<username>:<password>@<neon-host>/<db>?sslmode=require"

# Google Gemini AI Key
GEMINI_API_KEY=your_gemini_api_key

# Firebase Auth
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Next Auth URL
NEXTAUTH_URL=http://localhost:3000

# Optional: Production URL (for Vercel)
NEXT_PUBLIC_APP_URL=https://nutrilens-yourproject.vercel.app

4️⃣ Generate Prisma Client

npx prisma generate

5️⃣ Push Database Schema

npx prisma db push

6️⃣ Run Development Server

npm run dev

App runs locally at:
👉 http://localhost:3000

⸻

🚀 Deployment Guide (Vercel)
	1.	Push your repo to GitHub.
	2.	Visit Vercel Dashboard.
	3.	Import your project from GitHub.
	4.	Add the same .env variables in Vercel → Project Settings → Environment Variables.
	5.	Hit Deploy.
	6.	Once deployed, update:

NEXTAUTH_URL=https://your-vercel-app-url.vercel.app


	7.	Redeploy to apply final settings.

⸻

💾 Database Schema (Prisma)

User

Field	Type	Description
id	UUID	Primary Key
name	String	User’s name
email	String	Unique email
age	Int	Age
gender	String	Gender
heightCm	Float	Height (cm)
weightKg	Float	Weight (kg)
allergies	String[]	Known allergies
healthGoals	String	User’s goal
dietType	String	Diet preference
bmr	Float	Calculated Basal Metabolic Rate
createdAt	DateTime	Record timestamp

FoodScan

Field	Type	Description
id	UUID	Primary Key
userId	UUID	Linked to User
ingredients	String[]	Parsed ingredients
allergens	String[]	Allergens detected
nutritionSummary	String	Short nutrition description
rating	Int	0–10 health score
recommendation	String	AI advice
nutritionData	JSON	Full Gemini output

Medicine

Field	Type	Description
id	UUID	Primary Key
userId	UUID	Linked to User
name	String	Medicine name
brand	String	Brand name
dosage	String	Active ingredients
uses	String	Use case
precautions	String	Precautions list


⸻

📦 Available Scripts

Command	Description
npm run dev	Start dev server
npm run build	Build Next.js for production
npm start	Start production server
npx prisma studio	Open database viewer
npx prisma db push	Sync schema to Neon DB


⸻

✨ Future Enhancements
	•	🌍 Multi-language support (Hindi, Gujarati)
	•	📈 Nutrition tracking over time
	•	🧬 AI-generated meal planning
	•	💬 In-app chatbot for health queries
	•	📲 Mobile app version (React Native)

⸻

👨‍💻 Contributors

BitByBit Team	Design, Architecture, Coding & Testing


⸻

🛡️ License

This project is licensed under the MIT License.

⸻

💚 Acknowledgements
	•	Google Gemini API
	•	Next.js
	•	NeonDB
	•	Firebase Authentication
	•	Vercel
	•	Prisma ORM

⸻

## 🎨✨ Application Showcase

Experience NutriLens in action — from intelligent onboarding to AI-powered nutrition analysis, all wrapped in a beautiful UI 🌿  

---

### 🏠 Home Interface
> The welcoming dashboard introducing NutriLens — your AI-powered health companion.
![Home](https://raw.githubusercontent.com/NandCode24/nutrilens/main/assets/homescreen.png)

---

### 🧾 User Authentication

| Signup | Signin |
|--------|---------|
| ![Signup](https://raw.githubusercontent.com/NandCode24/nutrilens/main/assets/signup.png) | ![Signin](https://raw.githubusercontent.com/NandCode24/nutrilens/main/assets/signin.png) |

> Seamless user authentication flow — powered by Firebase Auth.

---

### 👤 Personalized Onboarding
> Collects user health goals, allergies, and fitness objectives to personalize AI responses.
![Onboarding](https://raw.githubusercontent.com/NandCode24/nutrilens/main/assets/onboarding.png)

---

### 🥗 Ingredient Scanner

| Upload Ingredient Label | AI-Generated Analysis |
|--------------------------|-----------------------|
| ![Scan Ingredient Label](https://raw.githubusercontent.com/NandCode24/nutrilens/main/assets/scaningredient.png) | ![Ingredient Output](https://raw.githubusercontent.com/NandCode24/nutrilens/main/assets/ingredientoutput.png) |

> NutriLens analyzes ingredient labels using **Google Gemini AI** to detect additives, allergens, and nutritional scores.

---

### 💊 Medicine Analyzer

| Upload Medicine Label | AI-Powered Medicine Report |
|------------------------|-----------------------------|
| ![Scan Medicine](https://raw.githubusercontent.com/NandCode24/nutrilens/main/assets/scanmedicine.png) | ![Medicine Output](https://raw.githubusercontent.com/NandCode24/nutrilens/main/assets/medicineoutput.png) |

> Get detailed medical insights, active ingredients, side effects, and safety checks based on your profile.

---

### 🧠 Smart Symptom Checker

| Symptom Input | AI Diagnosis Output |
|----------------|----------------------|
| ![Symptom Checker](https://raw.githubusercontent.com/NandCode24/nutrilens/main/assets/symptomchecker.png) | ![Symptom Checker Output](https://raw.githubusercontent.com/NandCode24/nutrilens/main/assets/scoutput.png) |

> Describe your symptoms — and NutriLens provides possible conditions, severity levels, and advice 💡

---

### 🌿 Daily Wellness Tips
> Discover healthy habits, nutrition insights, and lifestyle recommendations generated dynamically.
![Health Tips](https://raw.githubusercontent.com/NandCode24/nutrilens/main/assets/healthtips.png)

---

### 👤 Profile Management
> Users can view or update their profile, preferences, and health data at any time.
![Profile](https://raw.githubusercontent.com/NandCode24/nutrilens/main/assets/profile.png)

---

### 🕒 History Dashboard
> A centralized place where users can revisit all scans and health analyses.
![History](https://raw.githubusercontent.com/NandCode24/nutrilens/main/assets/history.png)

---

> 🧩 **NutriLens** combines AI + HealthTech to deliver an all-in-one wellness assistant experience, built with  
> 🖥️ Next.js • 🧠 Google Gemini API • 🗄️ NeonDB • 🔐 Firebase Auth • 🎨 Tailwind CSS  

---

Made with 💚 by Team BitByBit (TM180) — Empowering Smarter, Healthier Living.

---


