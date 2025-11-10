# 🧩 Next-Gen CRM Frontend (React + Vite + Tailwind + Redux)

## 🚀 Overview
This is the **frontend** for the Next-Gen CRM System built for the Masters’ Union Assessment.
It integrates seamlessly with the backend (Node.js + Express + Prisma + Supabase PostgreSQL) and delivers a
production-grade UI for Admins, Managers, and Sales Executives.

---

## ⚙️ Tech Stack
- **React 18 + Vite**
- **TypeScript**
- **TailwindCSS 3**
- **Redux Toolkit**
- **React Router v6**
- **Socket.IO Client**
- **Recharts**
- **React Hot Toast**

---

## 📁 Folder Structure
```
src/
 ├── components/      # Reusable UI components (Navbar, Sidebar, ProtectedRoute)
 ├── pages/           # Dashboard, Leads, Users, Analytics, RegisterUser, Login
 ├── store/           # Redux slices (auth, leads, users, activities, analytics)
 ├── lib/             # Axios instance (api.ts)
 ├── hooks/           # Custom hooks (socket, theme)
 ├── assets/          # Logos, icons
 └── App.tsx          # Route configuration
```

---

## 🔐 Environment Setup
Create a `.env` file in the root:

```
VITE_API_BASE_URL="http://localhost:8080/api/v1"
VITE_SOCKET_URL="http://localhost:8080"
```

---

## 🧠 Features Implemented
### ✅ Authentication & Role Management
- JWT authentication integrated with backend
- Role-based routing for **Admin**, **Manager**, **Sales**
- Automatic redirect after login
- Conditional sidebar visibility

### ✅ Leads Management
- Create, search, and view leads
- Assign leads to sales users (Admin/Manager)
- Real-time updates via Socket.IO
- Status change with auto email + realtime update

### ✅ Activity Timeline
- Add notes, calls, meetings to a lead
- Updates both timeline and email in real-time

### ✅ Users Management
- Admin-only access to register Managers or Sales users
- All users visible to Admin and Manager
- “Add User” button navigates to `/users/new`

### ✅ Analytics Dashboard
- Visual performance charts using Recharts
- Aggregated data fetched from backend `/analytics/summary`
- Role-based access (Admin & Manager)

### ✅ Dark Mode
- Toggle switch with localStorage persistence
- Adaptive UI for all cards, charts, and typography

### ✅ Toast Notifications
- React Hot Toast for feedback on login, updates, access denied

### ✅ Real-time Notifications
- Integrated Socket.IO Client for lead & activity updates

| Role                | Email               | Password      | Access Permissions                                                                      |
| ------------------- | ------------------- | ------------- | --------------------------------------------------------------------------------------- |
| **Admin**           | `admin@crm.local`   | `Admin@123`   | Full access — can view analytics, manage users, assign leads, and see all leads.        |
| **Manager**         | `manager@crm.local` | `Manager@123` | Can view all leads, assign to sales, and see analytics — but cannot register new users. |
| **Sales Executive** | `sales@crm.local`   | `Sales@123`   | Can view and update only their assigned leads — no access to users or analytics.        |


---

## 🧭 Roles & Access Matrix

| Feature | Admin | Manager | Sales |
|----------|--------|----------|--------|
| Dashboard | ✅ | ✅ | ✅ |
| Leads | ✅ | ✅ | ✅ |
| Assign Lead | ✅ | ✅ | ❌ |
| Update Lead | ✅ | ✅ | ✅ |
| Add Activity | ✅ | ✅ | ✅ |
| View Users | ✅ | ✅ | ❌ |
| Register User | ✅ | ❌ | ❌ |
| View Analytics | ✅ | ✅ | ❌ |

---

## 🧪 Run Locally
```bash
npm install
npm run dev
```

Access the app at: [http://localhost:5173](http://localhost:5173)

---

## 🧩 Integration With Backend
Ensure your backend (Next-Gen CRM backend) is running at port `8080` and connected to Supabase PostgreSQL.

The frontend communicates with the backend using:
- REST APIs for CRUD
- Socket.IO for realtime
- JWT for authentication

---

## 📦 Build for Production
```bash
npm run build
npm run preview
```

---

## 🧾 Credits
Developed by **Shivam Shrivastava**  
Under the **Masters’ Union Next-Gen CRM Challenge (2025)**  
Powered by React, Tailwind, and Supabase
