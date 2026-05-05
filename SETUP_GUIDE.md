# FinDash - Complete Setup Guide

## 🚀 Quick Start

### 1. **Database Setup**

#### Prerequisites
- PostgreSQL installed and running
- Default: `localhost:5432`

#### Option A: Auto-Initialize (Recommended)
The backend will automatically create tables on first run.

#### Option B: Manual Setup
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE expense_tracker;

# Connect to the database
\c expense_tracker

# Create tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    category VARCHAR(100),
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_type ON expenses(type);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
```

---

### 2. **Backend Setup**

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
File: `backend/.env`
```
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=expense_tracker
DB_PASSWORD=0313
DB_PORT=5432
JWT_SECRET=fab11d73a047fe3be505d53881759c7da090de72265f9215704f6ebd72b662bd
```

#### Start Backend Server
```bash
npm start
```

**Expected Output:**
```
✅ PostgreSQL Connected Successfully
✅ Database tables initialized
Server running on port 5000
```

---

### 3. **Frontend Setup**

#### Open Login Page
```
file:///c:/Users/Preet%20Patel/Downloads/expense-tracker-fullstack-main/expense-tracker-fullstack-main/frontend/html/login.html
```

Or navigate directly in browser:
```
c:/Users/Preet Patel/Downloads/expense-tracker-fullstack-main/expense-tracker-fullstack-main/frontend/html/login.html
```

---

## 🔐 Login & Signup Flow

### Signup
1. Click **"Create new account"** on login page
2. Enter:
   - Full Name: Any name
   - Email: Valid email (must be unique)
   - Password: At least 6 characters
3. Click **"Get Started"**
4. Token saved automatically
5. Redirects to dashboard

### Login
1. Enter email and password
2. Click **"Login"**
3. If successful → Dashboard loads
4. If failed → Error message shown

---

## ❌ Troubleshooting

### **Error: "Connection refused" or "ECONNREFUSED"**
**Solution:**
```bash
# 1. Check if PostgreSQL is running
# Windows: Services > PostgreSQL

# 2. Test connection
psql -U postgres -h localhost

# 3. If not running, start PostgreSQL service
# Services.msc > PostgreSQL > Start
```

### **Error: "Database does not exist"**
**Solution:**
```bash
psql -U postgres
CREATE DATABASE expense_tracker;
```

### **Error: "relation 'users' does not exist"**
**Solution:**
The backend will auto-create tables. Ensure:
- PostgreSQL is connected
- Database `expense_tracker` exists
- Run backend with: `npm start`

### **Error: "Signup email already exists"**
**Solution:**
Use a different email address or clear the users table:
```bash
psql -U postgres -d expense_tracker
DELETE FROM expenses;
DELETE FROM users;
```

### **Login page shows "Connection failed"**
**Solution:**
1. Ensure backend is running: `npm start` in backend folder
2. Check backend port: Should be `5000`
3. Verify no firewall blocking `localhost:5000`
4. Check browser console (F12) for detailed errors

### **Login redirects back to login page**
**Solution:**
- Check browser console (F12)
- Verify token is saved: `localStorage.getItem('token')`
- Ensure `/api/auth/me` endpoint works (test in Postman)

---

## 📝 API Endpoints

### Auth Endpoints
```
POST   /api/auth/signup      - Create new account
POST   /api/auth/login       - Login with email/password
GET    /api/auth/me          - Get current user (requires token)
```

### Expense Endpoints (All require token)
```
GET    /api/expenses         - Get all expenses
POST   /api/expenses         - Add new expense
PUT    /api/expenses/:id     - Update expense
DELETE /api/expenses/:id     - Delete expense
GET    /api/expenses/total   - Get total expenses
GET    /api/expenses/balance - Get income/expense balance
```

---

## 🔧 Testing with Postman

### 1. **Signup**
```
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. **Login**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response includes token** - Copy it

### 3. **Get Current User**
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer [token_from_login]
```

---

## 📂 File Structure

```
expense-tracker-fullstack-main/
├── backend/
│   ├── config/
│   │   └── db.js              ← Database connection (AUTO-INITIALIZES)
│   ├── controllers/
│   │   ├── authController.js  ← Signup/Login/GetUser
│   │   └── expenseController.js
│   ├── middleware/
│   │   └── authMiddleware.js  ← JWT verification
│   ├── models/
│   │   ├── userModel.js
│   │   └── expenseModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── expenseRoutes.js
│   ├── app.js
│   ├── server.js
│   ├── .env                   ← CONFIGURATION
│   └── package.json
│
├── frontend/
│   ├── html/
│   │   ├── login.html         ← LOGIN PAGE
│   │   ├── signup.html        ← SIGNUP PAGE
│   │   └── dashboard.html     ← MAIN APP
│   ├── js/
│   │   ├── auth.js            ← Auth functions
│   │   └── api.js             ← API calls
│   └── css/
│       └── style.css
│
└── SETUP_GUIDE.md
```

---

## ✅ Verification Checklist

- [ ] PostgreSQL is installed and running
- [ ] `expense_tracker` database exists
- [ ] `backend/.env` file is configured
- [ ] `npm install` completed in backend folder
- [ ] Backend started with `npm start`
- [ ] No errors in backend console
- [ ] Tables auto-initialized (check console logs)
- [ ] Can access login page in browser
- [ ] Can create new account
- [ ] Can login with credentials
- [ ] Dashboard loads after login

---

## 🆘 Still Having Issues?

1. **Check Backend Logs**
   - Backend console shows all errors
   - Look for "DB Connection Error" messages

2. **Browser Console (F12)**
   - Check Network tab for failed requests
   - Check Console for JavaScript errors

3. **Verify API Connection**
   - Open terminal and run:
   ```bash
   curl http://localhost:5000/api/auth/login
   ```
   - Should show "Cannot POST" message (not connection error)

4. **Reset Everything**
   ```bash
   # Stop backend (Ctrl+C)
   # Delete database
   psql -U postgres -c "DROP DATABASE expense_tracker;"
   # Restart backend - it will auto-create
   npm start
   ```

---

## 📞 Support

For issues, check:
1. Backend console output
2. Browser console (F12)
3. Database connection string in `.env`
4. Port 5000 availability
5. PostgreSQL service status

