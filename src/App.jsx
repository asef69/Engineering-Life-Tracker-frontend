import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './router/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Todos from './pages/Todos';
import Routines from './pages/Routines';
import Expenses from './pages/Expenses';
import CGPA from './pages/CGPA';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/todos"
            element={
              <PrivateRoute>
                <Layout>
                  <Todos />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/routines"
            element={
              <PrivateRoute>
                <Layout>
                  <Routines />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <PrivateRoute>
                <Layout>
                  <Expenses />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/cgpa"
            element={
              <PrivateRoute>
                <Layout>
                  <CGPA />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Layout>
                  <Profile />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

