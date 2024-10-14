import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const auth = Cookies.get("auth");
        if (!auth) {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <div>
            <h1>Welcome to the Home Page</h1>
        </div>
    );
};

export default HomePage;
