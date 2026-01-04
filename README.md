# Lab Management and Collaboration System

A comprehensive full-stack application for managing research laboratories, researchers, and collaborations with advanced analytics and AI-powered features.

## 🚀 Features

### Backend
- **FastAPI-based REST API** with automatic OpenAPI documentation
- **PostgreSQL database** with SQLAlchemy ORM
- **JWT authentication** for secure user management
- **Document processing** (PDF, DOCX, TXT) with AI extraction
- **Email integration** for lab communications
- **CORS support** for frontend integration

### Frontend
- **React 19** with modern hooks and functional components
- **Chart.js** for interactive data visualizations
- **Tailwind CSS 4.0** for responsive, modern UI
- **React Router** for seamless navigation
- **Dark mode support** with theme persistence
- **Real-time charts** for analytics dashboard

### Key Modules
- 📊 **Dashboard**: Overview of labs, researchers, and projects
- 📈 **Analytics**: Advanced insights with interactive charts
- 🔬 **Labs Management**: CRUD operations with document upload
- 📧 **Email System**: Communication management
- 👤 **User Profile**: Personalized settings and preferences

## 📋 Prerequisites

- **Python 3.8+**
- **Node.js 16+** and npm
- **PostgreSQL 12+**
- **Git**

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd lab-management-system
```

### 2. Install Backend Dependencies

```bash
# From project root
pip install -r backend/requirements.txt
```

### 3. Install Frontend Dependencies

```bash
# From project root
npm install
```

### 4. Environment Configuration

Create a `.env` file in the **project root**:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/lab_management

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI/API Keys (optional)
GOOGLE_API_KEY=your-google-api-key
OPENAI_API_KEY=your-openai-key

# Email Configuration (optional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 🚀 Running the Application

### Quick Start (Recommended)

From the **project root directory**:

```bash
# Terminal 1: Start Backend from root
python -m uvicorn backend.app.main:app --reload --port 8001

# Terminal 2: Start Frontend (in a new terminal) from root
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8001
- **API Documentation**: http://localhost:8001/docs

### Alternative Commands

**Backend:**
```bash
# From project root
python -m uvicorn backend.app.main:app --reload --port 8001

# With hot reload
python -m uvicorn backend.app.main:app --reload --port 8001 --log-level debug
```

**Frontend:**
```bash
# From project root
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

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

## 🔧 Configuration Files

### Root Level Configuration

**package.json**: Frontend dependencies and scripts
**vite.config.js**: Vite bundler configuration
**postcss.config.cjs**: PostCSS and Tailwind setup
**tailwind.config.js**: Tailwind CSS customization
**.env**: Environment variables (PROJECT ROOT)

### Backend Configuration

**backend/requirements.txt**: Python dependencies

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8001/docs
- **ReDoc**: http://localhost:8001/redoc

### Main Endpoints

**Authentication:**
- `POST /users/register` - Register new user
- `POST /users/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

**Labs:**
- `GET /labs/` - List all labs
- `POST /labs/` - Create new lab
- `PUT /labs/{lab_id}` - Update lab details
- `DELETE /labs/{lab_id}` - Delete lab

**IDEAL Lab (Management):**
- `GET /ideal-lab/` - Get details of the IDEAL Lab
- `PUT /ideal-lab/` - Update IDEAL lab details

**Researchers:**
- `GET /researchers/` - List all researchers
- `POST /researchers/` - Add a new researcher
- `GET /researchers/by-lab/{lab_id}` - Get researchers assigned to a specific lab
- `GET /researchers/summary` - Get statistical summary of researchers

**Collaboration & AI:**
- `GET /collaboration/suggestions` - Get AI-driven collaboration suggestions
- `POST /collaboration/send-email` - Send collaboration email to another lab

**Document Processing:**
- `POST /ingest/document` - Extract lab info from document

**General:**
- `GET /` - API health check / Root

## 🎨 UI Features

### Dashboard
- Real-time metrics cards
- Interactive charts (doughnut, line, bar)
- Lab distribution by domain
- Researcher growth trends
- AI-powered insights

### Analytics
- Advanced data visualizations
- Workload distribution
- Equipment level analysis
- Resource utilization insights
- Top performing labs

### Labs Management
- Grid and table view modes
- Advanced search and filtering
- Document upload for auto-extraction
- Full lab profile management
- Collaboration tracking

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration for frontend
- SQL injection prevention via ORM
- Environment-based secrets management


## 📦 Dependencies

### Backend
- **FastAPI**: Web framework
- **SQLAlchemy**: ORM
- **Pydantic**: Data validation
- **python-jose**: JWT handling
- **passlib**: Password hashing
- **python-multipart**: File uploads
- **python-docx**: DOCX processing
- **PyPDF2**: PDF processing

### Frontend
- **React 19**: UI library
- **Chart.js**: Data visualization
- **React Router**: Navigation
- **Axios**: HTTP client
- **Tailwind CSS**: Styling
- **Vite**: Build tool

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Error:**
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Verify credentials in .env (root directory)
# Ensure database exists
```

**Port Already in Use:**
```bash
# Use different port
python -m uvicorn backend.app.main:app --reload --port 8002
```

**Module Import Errors:**
```bash
# Ensure you're running from project root
# Reinstall dependencies
pip install -r backend/requirements.txt
```

### Frontend Issues

**Module Not Found:**
```bash
# From project root
rm -rf node_modules package-lock.json
npm install
```

**CORS Errors:**
- Ensure backend CORS is configured for `http://localhost:5173`
- Check `backend/app/main.py` CORS settings
- Verify `.env` has correct ALLOWED_ORIGINS

## 📝 Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Backend: Update models, add endpoints in `backend/app/`
   - Frontend: Create components, update pages in `src/`

3. **Test Locally**
   - Run backend: `python -m uvicorn backend.app.main:app --reload --port 8001`
   - Run frontend: `npm run dev`
   - Test all affected features

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: description of changes"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 🚀 Deployment

### Backend (Railway/Heroku/DigitalOcean)

```bash
# Set environment variables from .env
# Configure database URL
# Deploy using platform CLI or Git integration
```

### Frontend (Vercel/Netlify)

```bash
# Build production bundle
npm run build

# Deploy dist folder
# Configure build command: npm run build
# Configure output directory: dist
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Sameer Babar** - Initial work

## 🙏 Acknowledgments

- Tailwind CSS for the design system
- Chart.js for visualization components
- FastAPI team for excellent documentation
- React community for best practices

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: smeer.py@gmail.com

---

**Made with ❤️ by Sameer Babar**