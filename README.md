
# RealtyOS Foundation

RealtyOS is a comprehensive, cloud-based internal platform designed for real estate agencies to manage properties, tenants, payments, and automated operations.

## 🏗 System Architecture

The application follows a decoupled architecture:

*   **Frontend**: React (Vite) + TypeScript + Tailwind CSS.
*   **Backend**: Flask (Python) exposing a RESTful API.
*   **Database**: PostgreSQL (Production) / SQLite (Development).
*   **Background Tasks**: APScheduler for recurring billing and notifications.
*   **Storage**: Local file system (simulating S3 for this version).

## 🚀 Getting Started

### Prerequisites

*   Node.js v18+
*   Python 3.9+
*   Docker & Docker Compose (Optional, for containerized run)

### Local Development Setup

1.  **Backend Setup**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install -r requirements.txt
    
    # Configure Environment
    # Create a .env file based on the example in config.py
    
    # Run server
    python run.py
    ```
    The backend runs on `http://localhost:5000`.

2.  **Frontend Setup**
    ```bash
    # From root directory
    npm install
    npm run dev
    ```
    The frontend runs on `http://localhost:5173`.

### 🐳 Docker Deployment

The application is fully containerized. To run the full stack (Backend + Database):

```bash
docker-compose up --build -d
```

This starts:
*   **Web Container**: Flask API served via Gunicorn on port 5000.
*   **DB Container**: PostgreSQL database on port 5432.

> **Note**: For this version, the frontend is designed to be built and served by the Flask backend or hosted separately (e.g., Vercel/Netlify) pointing to the API.

## 🛠 Maintenance & Iteration

### 1. Database Management & Seeding
For testing or staging environments, you can seed the database with realistic mock data:
```bash
# Inside docker container or with venv active
python backend/seed_staging.py
```

### 2. Scheduled Tasks
The system runs background jobs for recurring billing and notifications. To manually trigger these (e.g., for testing billing logic):
```bash
python backend/trigger_jobs.py
```

### 3. Monitoring & Feedback
*   **Activity Feed**: Admins can monitor real-time user actions (logins, edits, payments) via the **Dashboard** or **Settings > Audit Trail**.
*   **System Status**: Go to **Settings > System Status** to view database connectivity and scheduler health.
*   **User Feedback**: Users can submit bugs/requests via the **Feedback** button in the header. Admins review these in **Settings > User Feedback**.

### 4. Dependency Security
Run the following to check for vulnerabilities in frontend dependencies and view a reminder for backend checks:
```bash
npm run audit:deps
```

## 📚 API Documentation

A complete reference of backend endpoints (Properties, Tenants, Financials, etc.) is available in:
[docs/API.md](docs/API.md)

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory for production:

| Variable | Description | Default |
|----------|-------------|---------|
| `FLASK_ENV` | Environment mode | `production` |
| `SECRET_KEY` | Cryptographic key | **ChangeMe** |
| `DATABASE_URL` | DB Connection String | `postgresql://user:pass@db:5432/db` |
| `LOG_TO_STDOUT` | Stream logs to console | `true` |

---
*Built for the RealtyOS Foundation Project.*
