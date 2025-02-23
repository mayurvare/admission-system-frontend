import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../src/AuthContext';
import logo from '../../../src/logo.svg';
import '../../../src/styles/Navbar.css';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to login page
    };

    return (
        <>
            <div className="navbar">
                <img src={logo} alt="Logo" className="logo" />
                
                {/* Desktop Menu */}
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/admission">Admission</Link></li>
                    <li><Link to="/contact">Contact Us</Link></li>
                    {isAuthenticated ? (
                        <button onClick={handleLogout}>Sign out</button>
                    ) : (
                        <button onClick={() => navigate('/login')}>Sign in</button>
                    )}
                </ul>

                {/* Hamburger Menu (Small Screens) */}
                <button className="menu-icon" onClick={() => setDrawerOpen(true)}>
                    <FaBars />
                </button>
            </div>

            {/* Drawer Menu */}
            <div className={`drawer ${isDrawerOpen ? 'open' : ''}`}>
                <button className="close-btn" onClick={() => setDrawerOpen(false)}>
                    <FaTimes />
                </button>
                <ul>
                    <li><Link to="/" onClick={() => setDrawerOpen(false)}>Home</Link></li>
                    <li><Link to="/about" onClick={() => setDrawerOpen(false)}>About</Link></li>
                    <li><Link to="/admission" onClick={() => setDrawerOpen(false)}>Admission</Link></li>
                    <li><Link to="/contact" onClick={() => setDrawerOpen(false)}>Contact Us</Link></li>
                    {isAuthenticated ? (
                        <button onClick={() => { handleLogout(); setDrawerOpen(false); }}>Sign out</button>
                    ) : (
                        <button onClick={() => { navigate('/login'); setDrawerOpen(false); }}>Sign in</button>
                    )}
                </ul>
            </div>

            {/* Overlay when drawer is open */}
            {isDrawerOpen && <div className="overlay" onClick={() => setDrawerOpen(false)}></div>}
        </>
    );
}

export default Navbar;
