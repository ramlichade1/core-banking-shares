import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Header from "./components/header";
import Home from "./pages/home";
import LoginPage from "./pages/login";
import SignupPage from "./pages/SignUp";
import Profile from "./pages/profile";
import AdminPannel from "./pages/AdminPannel";
import BankEmployeeProfile from "./pages/BankEmpProfile";
import YourCustomersPage from "./pages/YourCustomers";

// Wrapper component to handle conditional header
const Layout = ({ children }) => {
  const location = useLocation();
  const hideHeaderPaths = ["/login", "/sign-up"]; // hide header on these pages

  return (
    <>
      {!hideHeaderPaths.includes(location.pathname) && <Header />}
      {children}
    </>
  );
};

// ✅ ProtectedRoute: checks token in localStorage
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// ✅ ProtectedAdminRoute: checks bankEmployee in localStorage
const ProtectedAdminRoute = ({ children }) => {
  const bankEmployee = localStorage.getItem("employeeId");
  return bankEmployee ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin-pannel"
            element={
              <ProtectedAdminRoute>
                <AdminPannel />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/bankEmp-profile"
            element={
              <ProtectedAdminRoute>
                <BankEmployeeProfile />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/your-customers"
            element={
              <ProtectedAdminRoute>
                <YourCustomersPage />
              </ProtectedAdminRoute>
            }
          />

          {/* Redirect all unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
