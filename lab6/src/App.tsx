import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.tsx";
import HomePage from "./pages/HomePage";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<HomePage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
