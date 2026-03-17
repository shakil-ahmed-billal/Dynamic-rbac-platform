# Dynamic RBAC Platform 🚀

[![MIT License](https://img.shields.io/badge/License-MIT-orange.svg)](https://opensource.org/licenses/MIT)
[![Frontend](https://img.shields.io/badge/Frontend-rbac--platform.vercel.app-blue)](https://rbac-platform.vercel.app)
[![Contributor](https://img.shields.io/badge/Contributor-shakil--ahmed--billal-green)](https://github.com/shakil-ahmed-billal)

A multi-role, full-stack web application where access to every feature, page, and action is governed by a **Dynamic Permission System**. Configure user access at runtime through a visual permission editor — no developer changes required.

---

## 🌐 Live Demo
Visit the platform: **[rbac-platform.vercel.app](https://rbac-platform.vercel.app)**

---

## 🔑 Demo Credentials
> [!IMPORTANT]
> Seeding complete! All modules are ready.

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `superadmin@rbac.com` | `Admin@123` |
| **Admin** | `admin@rbac.com` | `Admin@123` |
| **Manager** | `manager@rbac.com` | `Manager@123` |
| **Agent** | `agent@rbac.com` | `Agent@123` |
| **User** | `user@rbac.com` | `User@123` |

---

## ✨ Core Features
- **Dynamic Permission System**: Group-based and individual permission overrides.
- **Visual Permission Editor**: Grouped by module with real-time toggle updates.
- **Grant Ceiling Enforcement**: You cannot grant permissions you do not hold yourself.
- **Audit Trails**: Append-only log of every administrative action.
- **Multi-Role Support**: Super Admin, Admin, Manager, Agent, and User.
- **Premium UI**: Modern "Obliq" design system using the **Onest** and **Inter** fonts.

---

## 🛠️ Technical Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Premium "Obliq" Design)
- **State Management**: Zustand (Auth), TanStack Query (Server State)
- **Form Handling**: React Hook Form + Zod

### Backend
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JWT with Access Token (memory) and Refresh Token (httpOnly cookie)

---

## 📂 Project Structure
```text
├── frontend/             # Next.js Application
│   ├── src/app/          # App Router (Auth & Dashboard)
│   ├── src/components/   # Premium UI & Permission Gates
│   └── src/providers/    # Auth & Query Providers
├── backend/              # Express API
│   ├── src/modules/      # RBAC, Users, Audit Logs modules
│   ├── prisma/           # Schema & Seeding scripts
│   └── src/server.ts     # Entry point
└── RBAC_System_Documentation.txt # Detailed technical spec
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- pnpm / npm / yarn
- PostgreSQL instance

### Backend Setup
1. `cd backend`
2. `pnpm install`
3. Configure `.env` with your `DATABASE_URL`
4. `pnpm run init` (Migrates and generates Prisma client)
5. `pnpm run seed` (Populates roles, permissions, and demo users)
6. `pnpm run dev`

### Frontend Setup
1. `cd frontend`
2. `pnpm install`
3. Configure `.env.local` with `NEXT_PUBLIC_API_URL`
4. `pnpm run dev`

---

## 🤝 Contributing
Contributions are welcome! Please read the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details on our code of conduct.

### Contributor
**Shakil Ahmed Billal**
- GitHub: [@shakil-ahmed-billal](https://github.com/shakil-ahmed-billal)

---

## 📄 License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.