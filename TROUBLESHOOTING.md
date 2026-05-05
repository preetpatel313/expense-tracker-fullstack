# FinDash Expense Tracker - Troubleshooting Guide

## Quick Checklist

### 1. Backend Server Status
```bash
# Check if backend is running
curl http://localhost:5000/api/expenses
```
**Expected**: Error 401 (No token provided) or Error 404
**Bad**: Connection refused = Backend not running

### 2. Database Connection
```bash
# Connect to database and check tables
psql -U postgres -d expense_tracker

# In postgres shell:
\dt
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM expenses;
```

### 3. Browser Console Debugging
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Add a test user (Signup page)
4. Look for these messages:
   - `✓ Present` = Token exists
   - `Transactions fetched successfully` = API working
   - `[Array]` with data = Transactions loaded

### 4. Common Issues & Fixes

#### Issue: "No transactions for this period"
**Solution**:
1. Open Browser Console (F12)
2. Check that transactions are being fetched
3. Add a new transaction through the UI
4. Verify date field is set correctly

#### Issue: "Backend not responding"
**Solution**:
```bash
# Terminal 1 - Start backend
cd backend
npm install
npm start

# Should show: "Server running on port 5000"
```

#### Issue: "Database error" in backend console
**Solution**:
```bash
# Run database setup
psql -U postgres -d expense_tracker -f backend/schema.sql

# OR manually create tables:
psql -U postgres -d expense_tracker
```

Then paste content from `backend/schema.sql`

#### Issue: Login not working after changes
**Solution**:
1. Clear localStorage: DevTools > Application > Clear All
2. Clear cookies
3. Refresh page
4. Try login again

#### Issue: Data disappears on refresh
**Likely Cause**: Transactions don't have `created_at` field in database

**Solution**:
```sql
-- Add created_at column if missing
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Update existing records
UPDATE expenses SET created_at = NOW() WHERE created_at IS NULL;
```

### 5. Manual Testing Steps

**Step 1: Test API Directly**
```javascript
// In browser console:
const token = localStorage.getItem('token');
console.log('Token:', token);

fetch('http://localhost:5000/api/expenses', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(d => console.log('Transactions:', d))
.catch(e => console.error('Error:', e));
```

**Step 2: Add Test Transaction**
```javascript
// In browser console:
addTransactionAPI('Test Income', 1000, 'income')
  .then(tx => console.log('Added:', tx))
  .catch(e => console.error('Error:', e));
```

**Step 3: Reload and Check**
```
Press F5 to reload page - transactions should appear
```

### 6. Environment Setup

Verify `.env` file in `backend/` folder:
```
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=expense_tracker
DB_PASSWORD=0313
DB_PORT=5432
JWT_SECRET=fab11d73a047fe3be505d53881759c7da090de72265f9215704f6ebd72b662bd
```

### 7. Full Database Reset

```bash
# WARNING: This deletes all data!

# Drop and recreate database
dropdb -U postgres expense_tracker
createdb -U postgres expense_tracker

# Set up schema
psql -U postgres -d expense_tracker -f backend/schema.sql

# Restart backend
cd backend
npm start
```

### 8. Logs to Check

**Backend logs** (in terminal where you ran `npm start`):
- Look for "PostgreSQL Connected"
- Look for "Server running on port 5000"
- Look for any errors when API is called

**Browser Console** (F12):
- Look for transaction fetch logs
- Look for API response status codes
- Look for any red errors

### 9. Still Not Working?

Collect this information:

1. **Backend terminal output** (copy last 20 lines)
2. **Browser console** (F12 > Console tab > copy all logs)
3. **Database check**:
   ```bash
   psql -U postgres -d expense_tracker -c "SELECT COUNT(*) FROM expenses;"
   ```
4. **Network tab** (F12 > Network > check /expenses request)
   - Status code?
   - Response body?
   - Request headers have token?

## Quick Fix Commands

```bash
# 1. Make sure backend is running
cd backend
npm start

# 2. In another terminal, check database
psql -U postgres -d expense_tracker -c "SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM expenses;"

# 3. In browser, check console
# DevTools > Console tab
# Add transaction through UI
# Refresh page
```

## Video Checklist

1. ✓ Backend running (`npm start`)
2. ✓ Database has tables (`\dt`)
3. ✓ Logged in (token in console)
4. ✓ Browser console shows transaction fetch logs
5. ✓ Transaction has `date` field
6. ✓ Month filter matches transaction dates
