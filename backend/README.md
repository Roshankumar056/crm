
# 🚀 Next-Gen CRM Backend (Final Version)
**Stack:** Node.js · Express · Prisma ORM · PostgreSQL (Supabase) · Socket.IO · Nodemailer (Gmail App Password) · TypeScript

---

## 📘 Overview
This backend is built for the *Masters’ Union - Next-Gen CRM System Challenge*.  
It provides complete CRM functionality including:
- Authentication & Role Management (Admin, Manager, Sales)
- Lead Management with tracking, ownership, and history
- Activity Timeline for notes, calls, and meetings
- Real-time Socket.IO notifications
- Automated Email Notifications via Gmail SMTP (App Password)
- Analytics Dashboard Endpoints
- Webhooks for integration
- PostgreSQL database via Prisma ORM (Supabase-hosted)

---

## ⚙️ Setup Instructions

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Create `.env` file
```env
DATABASE_URL="postgresql://postgres:crm%40shivam123@db.hqbgwczxmnzhfmmiujci.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1&schema=public"

JWT_ACCESS_SECRET="supersecret_access"
JWT_REFRESH_SECRET="supersecret_refresh"
JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

BCRYPT_SALT_ROUNDS="10"
PORT="8080"
NODE_ENV="development"
LOG_LEVEL="dev"

SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_SECURE="true"
SMTP_USER="shivamshrivaastava@gmail.com"
SMTP_PASS="ihvz ffeo uted tywp"  # Gmail App Password
EMAIL_FROM="CRM <shivamshrivaastava@gmail.com>"
```

> ⚠️ Use Gmail **App Password**, not your normal Gmail password.

---

## 🧩 Database Setup

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```
✅ Creates default  user:  
| Role                | Email               | Password      | Access Permissions                                                                      |
| ------------------- | ------------------- | ------------- | --------------------------------------------------------------------------------------- |
| **Admin**           | `admin@crm.local`   | `Admin@123`   | Full access — can view analytics, manage users, assign leads, and see all leads.        |
| **Manager**         | `manager@crm.local` | `Manager@123` | Can view all leads, assign to sales, and see analytics — but cannot register new users. |
| **Sales Executive** | `sales@crm.local`   | `Sales@123`   | Can view and update only their assigned leads — no access to users or analytics.        |


---

## ▶️ Run Server
```bash
npm run dev
```
App runs on: `http://localhost:8080`

Check:
```
GET /health → { "ok": true }
```

---

## 🔗 API Endpoints (Base: `/api/v1`)

| Module | Route | Description |
|--------|--------|-------------|
| **Auth** | `/auth` | JWT login/register/refresh/me |
| **Users** | `/users` | List & update users (Admin/Manager) |
| **Leads** | `/leads` | CRUD, assign, update |
| **Activities** | `/activities` | Add/view timeline |
| **Analytics** | `/analytics` | Summary APIs |
| **Webhooks** | `/webhooks` | Integration endpoints |

---

## ⚡ Realtime + Email

### Socket.IO Events
| Event | Description |
|--------|-------------|
| `lead:new` | Broadcast when new lead created |
| `lead:assigned` | Sent to assigned Sales user |
| `lead:updated` | Sent when lead status changes |
| `activity:new` | Sent when activity added |

### Email Triggers
| Event | Email Sent |
|--------|-------------|
| New Lead | "🆕 New Lead Created" |
| Lead Assigned | "📋 Lead Assigned" |
| Lead Updated | "🔄 Lead Updated" |
| New Activity | "📝 New Lead Activity" |

---

## 🧠 Role Permissions

| Feature | Admin | Manager | Sales |
|----------|--------|----------|--------|
| Register user | ✅ | ❌ | ❌ |
| View users | ✅ | ✅ | ❌ |
| Create leads | ✅ | ✅ | ✅ |
| Assign leads | ✅ | ✅ | ❌ |
| Update leads | ✅ | ✅ | ✅ |
| Delete leads | ✅ | ✅ | ❌ |
| Add activity | ✅ | ✅ | ✅ |
| View analytics | ✅ | ✅ | ❌ |

---

## 🧾 Default Credentials
| Role | Email | Password |
|------|--------|-----------|
| Admin | admin@crm.local | Admin@123 |

---

## 🚀 Deployment on Sevella

### Steps
1️⃣ Push project to GitHub  
2️⃣ Create a Sevella Node.js app  
3️⃣ Add all `.env` variables in dashboard  
4️⃣ Set:  
   - **Build Command:** `npm install && npm run build`  
   - **Start Command:** `npm run start`  
5️⃣ Run after deploy:  
```bash
npx prisma migrate deploy
npm run seed
```
6️⃣ Test → `https://yourapp.sevella.app/health` → `{ "ok": true }`

✅ Socket.IO & Gmail App Password emails work automatically on Sevella.

---


---

## 🧾 License
MIT © 2025 Roshan Kumar
