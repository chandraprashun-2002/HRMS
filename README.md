# HRMS Lite

A lightweight Human Resource Management System for managing employees and tracking attendance.

## 📋 Project Overview

HRMS Lite is a full-stack web application designed for small to medium-sized organizations to:

- **Manage Employees** - Add, view, and delete employee records
- **Track Attendance** - Mark daily attendance and view attendance history
- **Filter Records** - Filter attendance by specific employees

### Features

| Module | Features |
|--------|----------|
| **Employees** | Add new employees, View employee list, Delete employees |
| **Attendance** | Mark daily attendance (Present/Absent), View attendance records, Filter by employee |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Python 3.x | Programming Language |
| Django 6.0 | Web Framework |
| Django REST Framework | REST API |
| MySQL | Database |
| django-cors-headers | CORS Support |

### Frontend
| Technology | Purpose |
|------------|---------|
| React.js 18 | UI Library |
| Vite | Build Tool |
| React Router DOM | Client-side Routing |
| Vanilla CSS | Styling |

---

## 🚀 Steps to Run the Project Locally

### Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL Server
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hrms-lite.git
cd hrms-lite
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE hrms_db;
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install django djangorestframework django-cors-headers mysqlclient

# Update database credentials in hrms_backend/settings.py if needed
# Default: USER='root', PASSWORD='prasun@123'

# Run migrations
python manage.py migrate

# Create admin user (optional)
python manage.py createsuperuser

# Start the backend server
python manage.py runserver
```

Backend will be running at: `http://localhost:8000`

### 4. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will be running at: `http://localhost:5173`

---

## 📁 Project Structure

```
hrms-lite/
├── backend/
│   ├── hrms_backend/      # Django project settings
│   ├── employees/         # Employee app (models, views, serializers)
│   ├── attendance/        # Attendance app (models, views, serializers)
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/    # Reusable components (Sidebar, Modal, Toast)
    │   ├── pages/         # Page components (Employees, Attendance)
    │   ├── services/      # API service layer
    │   ├── App.jsx
    │   └── index.css      # Styles
    ├── package.json
    └── vite.config.js
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees/` | List all employees |
| POST | `/api/employees/` | Create new employee |
| DELETE | `/api/employees/{id}/` | Delete employee |
| GET | `/api/attendance/` | List all attendance records |
| GET | `/api/attendance/?employee_id={id}` | Filter attendance by employee |
| POST | `/api/attendance/` | Mark attendance |
| PUT | `/api/attendance/{id}/` | Update attendance |

---
