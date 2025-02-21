import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { loginUser, registerUser } from '../api/authApi';
import '../../src/styles/auth.css'
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // React Router navigation
    const { login } = useContext(AuthContext);
    // ✅ Check if user is already logged in
    // useEffect(() => {
    //     const token = localStorage.getItem('accessToken');
    //     if (token) {
    //         navigate('/'); // Redirect to home if already logged in
    //     }
    // }, [navigate]);

    // Handle Login
    const handleLogin = async () => {

        setLoading(true);
        if (!email || !password) {
            toast.error('Please enter email or password');
            setLoading(false);
            return;
        }

        try {
            const response = await loginUser(email, password);
            login(response.accessToken);
            navigate('/');
            setEmail('');
            setPassword('');
        } catch (err) {
            toast.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle Signup
    const handleSignup = async () => {
        if (password !== confirmPassword) {
            toast.error('Password do not match');
            return;
        }
        if (!email) {
            toast.error('Please Enter Email');
            return;
        }
        if (!password) {
            toast.error('Please Enter Password');
        }


        setLoading(true);

        try {
            await registerUser(email, password);
            toast.success('Signup Successful! Please log in.');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setIsLogin(true);
        } catch (err) {
            toast.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='auth-container'>
            <div className='auth-form-container'>
                <div className='auth-form-toggle'>
                    <button className={isLogin ? 'active' : ""} onClick={() => setIsLogin(true)}>Login</button>
                    <button className={!isLogin ? 'active' : ""} onClick={() => setIsLogin(false)}>Signup</button>
                </div>

                {isLogin ? (
                    <div className='auth-form'>
                        <h2>Login Form</h2>
                        <input
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <a href='#'>Forgot Password?</a>
                        <button onClick={handleLogin} disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                        <p>Not a Member?<a href='#' onClick={() => setIsLogin(false)}> Signup now</a></p>
                    </div>
                ) : (
                    <div className='auth-form'>
                        <h2>Signup Form</h2>
                        <input
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type='password'
                            placeholder='Confirm Password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button onClick={handleSignup} disabled={loading}>
                            {loading ? 'Signing up...' : 'Signup'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthForm;
