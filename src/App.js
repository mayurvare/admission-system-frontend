import './App.css';
import { AuthContext, AuthProvider } from './AuthContext';
import Navbar from './components/Navbar/Navbar';
import AboutUs from './pages/about';
import AuthForm from './pages/auth';
import Home from './pages/home';
import Admission from './pages/Admission';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useContext } from 'react';
function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />

      </Router>
    </AuthProvider>
  );
}
// Component to handle layout rendering
const MainLayout = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();
  const hideNavbar = location.pathname === "/login"; // Hide navbar on login page

  return (
    <>
      {!hideNavbar && <Navbar />}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <AuthForm />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/Admission" element={<Admission />} />

        {/* default redirect to home page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? <Navigate to="/" /> : children;
};

export default App;