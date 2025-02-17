import './App.css';
import AuthForm from './pages/auth';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  return (
    <div>
      <ToastContainer />
      <AuthForm />
    </div>
  );
}

export default App;  