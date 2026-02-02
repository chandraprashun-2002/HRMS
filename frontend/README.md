# HRMS Lite - Frontend

React.js frontend for the HRMS Lite application.

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React.js 18 | UI Library |
| Vite | Build Tool & Dev Server |
| React Router DOM | Client-side Routing |
| Vanilla CSS | Styling (Responsive Design) |

## 📁 Project Structure

```
src/
├── components/
│   ├── Modal.jsx       # Reusable modal component
│   ├── Sidebar.jsx     # Navigation sidebar
│   └── Toast.jsx       # Toast notification system
├── pages/
│   ├── Employees.jsx   # Employee management page
│   └── Attendance.jsx  # Attendance tracking page
├── services/
│   └── api.js          # API service layer (fetch)
├── App.jsx             # Main app with routing
├── main.jsx            # Entry point
└── index.css           # All styles (responsive)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Backend server running at `http://localhost:8000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🎨 Features

- **Employee Management** - Add, view, delete employees
- **Attendance Tracking** - Mark and view attendance records
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Toast Notifications** - Success/error feedback
- **Loading States** - Spinners and empty state handling

## 🔗 API Integration

The frontend connects to the Django backend at `http://localhost:8000/api/`

| Endpoint | Description |
|----------|-------------|
| `/api/employees/` | Employee CRUD operations |
| `/api/attendance/` | Attendance CRUD operations |
