import './App.css';
import AuthForm from './pages/auth';
import Home from './pages/home';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
    // <div>
    //   <ToastContainer />
    //   <AuthForm />
    // </div>
  );
}

// Higher Order Component to protect Home route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? <Home /> : <Navigate to="/" />;
};


export default App;  