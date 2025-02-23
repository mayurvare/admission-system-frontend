import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
const Home = () => {

    const navigate = useNavigate();
    return (
        <div style={{
            textAlign: "center",
            marginTop: "50px",
            fontFamily: "Arial, sans-serif"
        }}>
            <header style={{

                color: "#fff",
                padding: "15px 0",
                fontSize: "24px",
                fontWeight: "bold"
            }}>
                Shri P.L.Shroff College Admission System
            </header>

            <div style={{ padding: "30px" }}>
                <h1>Welcome to Shri P.L.Shroff College 🎓</h1>
                <p>Your journey to excellence starts here. Apply now for the upcoming academic year.</p>

                <button onClick={(e) => navigate('/Admission')}
                    style={{
                        padding: "10px 20px",
                        fontSize: "18px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "5px",
                        marginTop: "15px"
                    }}
                >
                    Apply Now
                </button>
            </div>

            <footer style={{
                marginTop: "50px",
                background: "#004080",
                color: "#fff",
                padding: "10px",
                fontSize: "14px"
            }}>
                © 2025 Shri P.L.Shroff College | All Rights Reserved
            </footer>
        </div>
    );
};

export default Home;
