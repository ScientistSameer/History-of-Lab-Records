# Project Structure Documentation

## 📂 Complete File Organization

```
lab-management-and-collaboration-system/
├── backend/                         # FastAPI server root
│   ├── app/                         # Main application logic
│   │   ├── routers/                 # API route handlers
│   │   │   ├── __init__.py          # Router package initialization
│   │   │   ├── collaboration_ai.py  # AI suggestion routes
│   │   │   ├── collaboration.py     # Lab networking routes
│   │   │   ├── doc_ingest.py        # Document processing routes
│   │   │   ├── ideal_lab.py         # Main lab management
│   │   │   ├── labs.py              # External lab directory
│   │   │   ├── researchers.py       # Staff management routes
│   │   │   └── users.py             # User profile routes
│   │   ├── services/                # Business logic layer
│   │   │   └── collaboration_ai.py  # AI processing logic
│   │   ├── __init__.py              # App package initialization
│   │   ├── auth.py                  # JWT authentication logic
│   │   ├── crud.py                  # Database create-read-update-delete
│   │   ├── database.py              # SQLAlchemy connection setup
│   │   ├── email.py                 # Mail service configuration
│   │   ├── models.py                # Database SQL tables
│   │   ├── schemas.py               # Pydantic data validation
│   │   └── main.py                  # Backend entry point
│   ├── __init__.py                  # Backend package initialization
│   ├── reset_db.py                  # Database clear script
│   ├── seed.py                      # Initial data population
│   └── requirements.txt             # Python backend dependencies
│
├── node_modules/                    # Installed frontend packages
├── other labs/                      # Raw document storage
│   ├── lab1.docx                    # Sample Word document
│   ├── lab1.pdf                     # Sample PDF document
│   ├── lab1.txt                     # Sample text file
│   ├── lab2.txt                     # Research data file
│   ├── lab3.txt                     # Lab profile data
│   ├── lab4.txt                     # Research interest data
│   └── lab5.txt                     # Collaboration history file
│
├── public/                          # Static public assets
│   ├── _redirects                   # Netlify routing rules
│
├── src/                             # React frontend source
│   ├── api/                         # Frontend API layer
│   │   ├── api/                     # Service-specific calls
│   │   │   ├── auth.js              # Login/Register API functions
│   │   │   ├── client.js            # Axios/Fetch base configuration
│   │   │   ├── collaboration_ai.js  # AI feature endpoints
│   │   │   ├── collaboration.js     # Messaging API functions
│   │   │   ├── emails.js            # Email service endpoints
│   │   │   ├── ideal_lab.js         # Core lab endpoints
│   │   │   ├── labs.js              # Directory API functions
│   │   │   ├── researchers.js       # Researcher data endpoints
│   │   │   └── users.js             # User data endpoints
│   ├── charts/                      # Chart.js components
│   ├── components/                  # Reusable UI components
│   ├── css/                         # Global Tailwind styles
│   ├── images/                      # Image asset storage
│   ├── pages/                       # Page view components
│   ├── partials/                    # Layout components
│   ├── utils/                       # Utility functions
│   ├── App.jsx                      # Main app component
│   ├── favicon.svg                  # Browser tab icon
│   └── main.jsx                     # React entry point
│
├── .env                             # Environment variables (root)
├── .env.example                     # Environment template file
├── .gitignore                       # Git excluded files
├── atlas.db                         # SQLite database file
├── index.html                       # HTML entry point
├── LICENSE                          # Project license file
├── package-lock.json                # NPM lock file
├── package.json                     # Frontend dependencies
├── pnpm-lock.yaml                   # PNPM lock file
├── postcss.config.cjs               # PostCSS configuration
├── PROJECT_STRUCTURE.md             # Detailed directory map
├── QUICK_START.md                   # Installation guide summary
├── README.md                        # General project documentation
└── vite.config.js                   # Vite configuration
```

## 🎯 Key Points

### 1. No "frontend" Folder
- Frontend source code is in `src/` directly
- Run `npm run dev` from PROJECT ROOT
- No need to `cd frontend`

### 2. Environment Variables Location
- `.env` is in **PROJECT ROOT** (not in backend/)
- Contains database credentials and API keys
- Never commit `.env` to Git

### 3. Running Commands

All commands run from **PROJECT ROOT**:

```bash
# Backend
python -m uvicorn backend.app.main:app --reload --port 8001

# Frontend
npm run dev

# Both (using script)
./start.sh
```

### 4. No Virtual Environment
- Not using `venv` folder
- Dependencies installed globally with pip
- If you want to use venv, create it manually

## 📦 Dependencies Location

### Backend Dependencies
- File: `backend/requirements.txt`
- Install: `cd backend && pip install -r requirements.txt && cd ..`

### Frontend Dependencies
- File: `package.json` (in root)
- Install: `npm install` (from root)

## 🔧 Configuration Files (Root Level)

| File | Purpose |
|------|---------|
| `.env` | Environment variables |
| `package.json` | Frontend dependencies & scripts |
| `vite.config.js` | Vite bundler configuration |
| `postcss.config.cjs` | PostCSS and Tailwind setup |
| `tailwind.config.js` | Tailwind CSS customization |

## 🚀 Development Workflow

### 1. Start Development

```bash
# Terminal 1 - Backend
python -m uvicorn backend.app.main:app --reload --port 8001

# Terminal 2 - Frontend
npm run dev
```

### 2. Access Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8001
- API Docs: http://localhost:8001/docs

### 3. Make Changes

**Backend changes:**
- Edit files in `backend/app/`
- Backend auto-reloads (--reload flag)

**Frontend changes:**
- Edit files in `src/`
- Vite hot-reloads automatically

## 📝 Important Conventions

### Import Paths

**Backend:**
```python
from app.core.database import get_db
from app.models.user import User
from app.schemas.lab import LabCreate
```

**Frontend:**
```javascript
import Header from '../partials/Header'
import { getLabs } from '../api/labs'
import DoughnutChart from '../charts/DoughnutChart'
```

### API Calls

Frontend makes calls to backend:
```javascript
// Configured in vite.config.js proxy
axios.get('http://localhost:8001/labs/')
```

### Environment Variables

**Backend (Python):**
```python
from app.core.config import settings
database_url = settings.DATABASE_URL
```

**Frontend (if needed):**
```javascript
// Create .env.local for frontend-specific vars
const apiUrl = import.meta.env.VITE_API_URL
```

## 🔐 Security Notes

### Never Commit

- `.env` file
- `node_modules/`
- `__pycache__/`
- `*.pyc` files
- `dist/` folder
- Database files

### Always Keep Private

- Database credentials
- API keys (Google, OpenAI)
- SECRET_KEY
- Email passwords

## 📊 File Relationships

```
.env (root)
  ↓
backend/app/core/config.py
  ↓
backend/app/main.py
  ↓
backend/app/api/*.py

package.json (root)
  ↓
vite.config.js
  ↓
src/main.jsx
  ↓
src/App.jsx
  ↓
src/pages/*.jsx
```

## 🎨 Styling Architecture

```
src/index.css              # Global Tailwind imports
  ↓
Tailwind CSS 4.0          # Utility classes
  ↓
Components                 # Styled with Tailwind
  ↓
Dark mode support         # Via ThemeContext
```

## 🧪 Testing Structure (When Implemented)

```
backend/
  └── tests/
      ├── test_api/
      ├── test_models/
      └── test_services/

src/
  └── __tests__/
      ├── components/
      └── pages/
```

## 📖 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main project documentation |
| `QUICK_START.md` | 5-minute setup guide |
| `PROJECT_STRUCTURE.md` | This file - structure reference |
| `.env.example` | Environment variables template |

---

**Remember:** Everything runs from PROJECT ROOT! 🎯