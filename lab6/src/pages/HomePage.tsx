import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import WeatherComponent from "./WeatherComponent.tsx";

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const auth = Cookies.get("auth");
        if (!auth) {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <WeatherComponent/>
    );
};

export default HomePage;
