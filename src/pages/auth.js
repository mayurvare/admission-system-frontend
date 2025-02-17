import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { loginUser, registerUser } from '../api/authApi';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate(); // React Router navigation

    // ✅ Check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            navigate('/home'); // Redirect to home if already logged in
        }
    }, [navigate]);

    // Handle Login
    const handleLogin = async () => {
        setLoading(true);
        if (!email || !password) {
            toast.error('Please enter email or password');
            setLoading(false);
            return;
        }

        try {
            await loginUser(email, password);
            navigate('/home');
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
        <div className='container'>
            <div className='form-container'>
                <div className='form-toggle'>
                    <button className={isLogin ? 'active' : ""} onClick={() => setIsLogin(true)}>Login</button>
                    <button className={!isLogin ? 'active' : ""} onClick={() => setIsLogin(false)}>Signup</button>
                </div>

                {isLogin ? (
                    <div className='form'>
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
                    <div className='form'>
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
