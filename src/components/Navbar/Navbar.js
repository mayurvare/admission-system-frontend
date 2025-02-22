import React from 'react';
import '../../../src/styles/Navbar.css';
import logo from '../../../src/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../src/AuthContext';


const Navbar = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to login page
    };


    return (
        <div className='navbar'>
            <img src={logo} alt="Logo" className='logo' />
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/admission">Admission</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                {isAuthenticated ? (<button onClick={handleLogout}>Sign out</button>) : (
                    <button onClick={() => navigate('/login')}>Sign in</button>
                )}

            </ul>
        </div>
    )
}

export default Navbar
