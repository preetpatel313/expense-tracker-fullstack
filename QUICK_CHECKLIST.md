# ✅ Login & Signup Troubleshooting Checklist

## Before Running:

### 1. PostgreSQL Running?
```powershell
# Check if PostgreSQL is running (Windows)
Get-Service postgres* | Select Name, Status

# If not running, start it
Start-Service postgresql-x64-15  # (version may differ)
```

### 2. Environment File Configured?
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

### 3. Database Exists?
```bash
psql -U postgres -l | grep expense_tracker
```
If not found, create it:
```bash
psql -U postgres -c "CREATE DATABASE expense_tracker;"
```

---

## Startup Steps:

### Step 1: Start Backend
```bash
cd backend
npm install          # (only first time)
npm start
```

Expected output:
```
✅ PostgreSQL Connected Successfully
✅ Database tables initialized
Server running on port 5000
```

### Step 2: Open Frontend
Open in browser:
```
file:///c:/Users/Preet%20Patel/Downloads/expense-tracker-fullstack-main/expense-tracker-fullstack-main/frontend/html/login.html
```

### Step 3: Test Signup
- Click "Create new account"
- Fill in: Name, Email, Password
- Click "Get Started"
- Should redirect to dashboard

### Step 4: Test Login
- Enter email and password
- Click "Login"
- Should redirect to dashboard

---

## Common Errors & Fixes:

| Error | Cause | Fix |
|-------|-------|-----|
| "Connection refused" | PostgreSQL not running | Start PostgreSQL service |
| "Database does not exist" | Database not created | `psql -U postgres -c "CREATE DATABASE expense_tracker;"` |
| "relation 'users' does not exist" | Tables not created | Restart backend, tables auto-create |
| "Email already exists" | Account already registered | Use different email |
| "Connection failed" | Backend not running | Run `npm start` in backend folder |
| "EADDRINUSE" | Port 5000 in use | Change port or kill process using it |
| Blank dashboard after login | Missing /api/auth/me | Check backend console for errors |

---

## Debug Commands:

```bash
# Test PostgreSQL connection
psql -U postgres -h localhost -c "SELECT 1"

# View database tables
psql -U postgres -d expense_tracker -c "\dt"

# Clear all data (reset)
psql -U postgres -d expense_tracker -c "DELETE FROM expenses; DELETE FROM users;"

# Test API endpoint
curl http://localhost:5000/api/auth/login

# Check if port 5000 is in use (Windows)
netstat -ano | findstr :5000
```

---

## Files to Check:

1. **Backend Configuration**
   - `backend/.env` - Must have correct DB credentials
   - `backend/config/db.js` - Auto-initializes tables

2. **Frontend Files**
   - `frontend/html/login.html` - Login page
   - `frontend/html/signup.html` - Signup page
   - `frontend/js/auth.js` - Auth functions
   - `frontend/html/dashboard.html` - Main app

3. **Backend Routes**
   - `backend/routes/authRoutes.js` - Auth endpoints
   - `backend/controllers/authController.js` - Signup/Login logic

---

## Quick Reset (If Completely Stuck):

```bash
# 1. Kill backend
# Press Ctrl+C in backend terminal

# 2. Delete and recreate database
psql -U postgres -c "DROP DATABASE expense_tracker;"
psql -U postgres -c "CREATE DATABASE expense_tracker;"

# 3. Restart backend
npm start

# Wait for "✅ Database tables initialized"

# 4. Try signup/login again
```

---

## Verify Working Setup:

✅ Backend outputs:
```
✅ PostgreSQL Connected Successfully
✅ Database tables initialized
Server running on port 5000
```

✅ Frontend can:
- Access login page
- Show/hide password
- Display error messages

✅ Signup works:
- Creates user in database
- Returns JWT token
- Redirects to dashboard

✅ Login works:
- Validates credentials
- Returns JWT token
- Redirects to dashboard

✅ Dashboard works:
- Loads user profile
- Shows transactions
- Can add/edit/delete

---

## If Still Not Working:

1. Check `backend/config/db.js` console output
2. Open browser F12 > Network tab > Check API responses
3. Check browser F12 > Console > JavaScript errors
4. Try manual database reset (see above)
5. Restart your computer

