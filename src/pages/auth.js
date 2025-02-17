import React, { useState } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // API base URL
    const BASE_URL = 'http://localhost:3000/auth/api';

    // Handle Login
    const handleLogin = async () => {
        setLoading(true);
        if (!email || !password) {
            toast.error('Please enter email or password');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/login`, { username: email, password });
            const { accessToken, refreshToken } = response.data;
            if (response.status === 200) {
                // Store tokens in localStorage
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                toast.success('Login Successful!');
                setLoading(false);
            }


        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
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
            const response = await axios.post(`${BASE_URL}/register`, { username: email, password });
            // ✅ Check if the response status is 200
            if (response.status === 201) {
                console.log('login Success');
                toast.success('Signup Successful! Please log in.');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setIsLogin(true);
            } else {
                console.log('Something Went Wrong');
                toast.error(response.data.message);
            }

            setIsLogin(true);
            setLoading(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
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
