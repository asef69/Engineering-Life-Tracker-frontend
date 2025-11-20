# Engineering Life Tracker - Frontend

A comprehensive React frontend application for tracking engineering student life, including todos, class routines, expenses, and CGPA management. This application provides a modern, user-friendly interface for students to manage their academic and personal life efficiently.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.2-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.6-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🔐 Authentication & Security
- **User Registration & Login**: Secure authentication with JWT tokens
- **Automatic Token Refresh**: Seamless token management with automatic refresh
- **Protected Routes**: Secure access to authenticated pages
- **Profile Management**: Update profile information and change password

### 📊 Dashboard
- **Overview Cards**: Quick view of pending todos, total courses, monthly balance, and CGPA
- **Monthly Expense Summary**: Visual breakdown of earnings, spending, and balance
- **Welcome Section**: Personalized greeting with university and academic level information

### ✅ Todo Management
- Create, edit, and delete todos
- Mark todos as complete/incomplete
- Filter and organize tasks efficiently

### 📚 Class Routines
- **File Upload**: Upload PDF or image files for class routines
- **Cloudinary Integration**: Seamless file storage and retrieval
- **Image Previews**: Thumbnail previews for uploaded images
- **Filter by Level & Term**: Organize routines by academic period
- **View & Delete**: Easy access to routine files

### 💰 Expense Tracker
- **Track Earnings & Spending**: Record income and expenses
- **Monthly Summaries**: Automatic calculation of monthly balance
- **Transaction History**: View all financial transactions
- **Balance Tracking**: Real-time balance updates

### 🎓 CGPA Management
- **Weighted CGPA Calculation**: Accurate CGPA using the formula: Σ(course grade point × credit hour) / Σ(credit hour)
- **Course Management**: Add courses with details (name, code, CT marks, CGPA, credit hours)
- **Edit Functionality**: Update course credit hours and grade points
- **Filter by Level & Term**: View CGPA for specific academic periods
- **Overall & Filtered CGPA**: Calculate CGPA for all courses or filtered subsets

### 👤 Profile Management
- **Update Profile**: Modify name, university, department, level, and term
- **Change Password**: Secure password change with validation
- **Error Handling**: Comprehensive error messages and validation

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.2.0
- **Routing**: React Router v6.20.0
- **HTTP Client**: Axios 1.6.2
- **State Management**: React Context API
- **Styling**: Tailwind CSS 3.3.6
- **Build Tool**: Vite 7.2.2
- **File Storage**: Cloudinary (via backend)

## 📋 Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager
- Backend API server running (Django backend)

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "life tracker frontend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Configuration

1. **Update API Base URL**
   
   Edit `src/api/client.js` and update the `API_BASE_URL` if your backend runs on a different port or domain:
   ```javascript
   const API_BASE_URL = 'http://localhost:8000'; // Change this to your backend URL
   ```

### Running the Application

1. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173` (or the port shown in terminal)

2. **Build for Production**
   ```bash
   npm run build
   ```
   
   The production build will be in the `dist` directory.

3. **Preview Production Build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── api/              # API client and endpoint functions
│   ├── auth.js       # Authentication endpoints
│   ├── client.js     # Axios client with interceptors
│   ├── courses.js    # Course/CGPA endpoints
│   ├── expenses.js   # Expense endpoints
│   ├── routines.js   # Routine file endpoints
│   └── todos.js      # Todo endpoints
├── components/        # Reusable components
│   ├── Icons.jsx     # SVG icon components
│   └── Layout.jsx    # Main layout with navbar and sidebar
├── context/          # React Context providers
│   └── AuthContext.jsx # Authentication context
├── pages/            # Page components
│   ├── CGPA.jsx      # CGPA management page
│   ├── Dashboard.jsx # Dashboard overview
│   ├── Expenses.jsx  # Expense tracking
│   ├── Login.jsx     # Login page
│   ├── Profile.jsx   # Profile management
│   ├── Register.jsx  # Registration page
│   ├── Routines.jsx  # Class routines
│   └── Todos.jsx     # Todo management
├── router/           # Route components
│   └── PrivateRoute.jsx # Protected route wrapper
├── utils/            # Utility functions
│   └── cgpaCalculator.js # CGPA calculation logic
├── App.jsx           # Main app component with routing
└── main.jsx         # Application entry point
```

## 🔑 Key Features Explained

### CGPA Calculation

The application uses a weighted CGPA calculation formula:
```
CGPA = Σ(course grade point × credit hour) / Σ(credit hour)
```

This ensures that courses with more credit hours have appropriate weight in the final CGPA calculation.

### Authentication Flow

1. User logs in with email and password
2. Backend returns access and refresh tokens
3. Tokens are stored in localStorage
4. Access token is automatically attached to all API requests
5. On 401 errors, the app automatically refreshes the token
6. If refresh fails, user is redirected to login

### File Upload (Routines)

- Files are uploaded using FormData
- Backend handles Cloudinary integration
- Frontend displays Cloudinary URLs with image previews
- Supports PDF and image formats (PNG, JPG, JPEG, WebP)

## 🔒 Security Features

- JWT token-based authentication
- Automatic token refresh
- Secure password change with validation
- Protected routes for authenticated pages
- XSS protection through React's built-in escaping

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with gradient accents
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Loading States**: Visual feedback during API calls
- **Error Handling**: User-friendly error messages
- **Success Notifications**: Confirmation messages for successful operations
- **Image Previews**: Thumbnail previews for uploaded images

## 📝 API Endpoints

The frontend communicates with the following backend endpoints:

- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login
- `GET /api/users/me/` - Get user profile
- `PUT /api/users/me/` - Update profile
- `POST /api/users/change-password/` - Change password
- `GET /api/todos/` - Get todos
- `POST /api/todos/` - Create todo
- `PUT /api/todos/:id/` - Update todo
- `DELETE /api/todos/:id/` - Delete todo
- `GET /api/courses/` - Get courses
- `POST /api/courses/` - Create course
- `PUT /api/courses/:id/` - Update course
- `PATCH /api/courses/:id/` - Partial update course
- `GET /api/expenses/` - Get expenses
- `POST /api/expenses/` - Create expense
- `GET /api/routines/` - Get routines
- `POST /api/routines/` - Upload routine file
- `DELETE /api/routines/:id/` - Delete routine

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Ensure backend server is running
   - Check API_BASE_URL in `src/api/client.js`
   - Verify CORS settings on backend

2. **Authentication Issues**
   - Clear localStorage and try logging in again
   - Check token expiration settings
   - Verify backend authentication endpoints

3. **File Upload Failures**
   - Check file size limits
   - Verify Cloudinary configuration on backend
   - Ensure file format is supported

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

Engineering Life Tracker - Frontend

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Vite for the fast build tool
- All contributors and users of this project

---

**Note**: This is the frontend application. Make sure you have the corresponding backend server running for full functionality.
