# Expense Tracker - Setup Guide

## Database Setup

To properly set up the database with the required tables, follow these steps:

### 1. Create the Database
```bash
createdb expense_tracker
```

### 2. Run the Schema
```bash
psql -U postgres -d expense_tracker -f backend/schema.sql
```

Or connect to PostgreSQL and run the SQL commands manually:
```bash
psql -U postgres -d expense_tracker
```

Then paste the contents of `backend/schema.sql`

### 3. Environment Variables
Make sure your `.env` file in the `backend` folder has these variables set:
```
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=expense_tracker
DB_PASSWORD=0313
DB_PORT=5432
JWT_SECRET=fab11d73a047fe3be505d53881759c7da090de72265f9215704f6ebd72b662bd
```

## Running the Application

### Backend
```bash
cd backend
npm install
npm start
```

The backend will run on `http://localhost:5000`

### Frontend
Open `frontend/html/login.html` in your browser or serve it using a local server:
```bash
# Using Python
python -m http.server 8000

# Or using Node.js http-server
npx http-server
```

Then navigate to `http://localhost:8000/frontend/html/login.html`

## Troubleshooting

### Login/Signup Not Working
- Make sure the backend server is running on port 5000
- Check browser console for any error messages
- Verify database connection in backend logs

### Data Not Showing After Reload
- Ensure the database schema is properly set up (run schema.sql)
- Check that you're logged in and have a valid token
- Clear browser cache/localStorage and try again

### Database Connection Errors
- Verify PostgreSQL is running
- Check that the database credentials in .env match your PostgreSQL setup
- Make sure the database `expense_tracker` exists
