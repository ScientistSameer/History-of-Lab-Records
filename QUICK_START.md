# Quick Start Guide

## 🚀 Get Running in 5 Minutes


#### Step 1: Install Backend Dependencies

```bash
# From project root
pip install -r backend/requirements.txt
```

#### Step 2: Install Frontend Dependencies

```bash
# From project root
npm install
```

#### Step 3: Configure Environment
Create a .env file in the project root:
```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/lab_management

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI/API Keys (optional)
OPENAI_API_KEY=your-openai-key

# Email Configuration (optional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Step 4: Start the Application

**Terminal 1 (Backend):**
```bash
# From project root
python -m uvicorn backend.app.main:app --reload --port 8001
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

### 🎉 Access the Application

- **Frontend UI**: http://localhost:5173
- **Backend API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs

## 📝 Default Credentials

After first run, you can create an account through the registration page. and can access this webapp

## ⚙️ Common Issues

### Database Connection Error

Make sure PostgreSQL is running:
```bash
# Check status
sudo service postgresql status

# Start if not running
sudo service postgresql start
```

### Port Already in Use

Change the port in the command:
```bash
# Backend on different port
python -m uvicorn backend.app.main:app --reload --port 8002
```

### Module Not Found (Frontend)

Clear and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```


## 📚 Next Steps

1. ✅ Create your user account
2. ✅ Add your first lab
3. ✅ Explore the dashboard and analytics
4. ✅ Try document upload feature
5. ✅ Customize your profile

## 🆘 Need Help?

- Check the [README.md](README.md) for detailed documentation
- Visit the API docs at http://localhost:8001/docs
- Create an issue on GitHub