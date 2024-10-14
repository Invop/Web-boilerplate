import React, { useState, ChangeEvent, FormEvent } from "react";
import Cookies from "js-cookie";
import "./Login.css";
import Input from "../components/login/input/input.tsx";
import Button from "../components/login/button/button.tsx";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleRememberMeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setRememberMe(event.target.checked);
    };

    const handleSave = (event: FormEvent) => {
        event.preventDefault();
        if (email === "" || password === "") {
            setError("Email and Password cannot be empty.");
        } else if (email !== "Andrii3@gmail.com" || password !== "Andrii3") {
            setError("Invalid email or password.");
        } else {
            Cookies.set("auth", "true", { expires: rememberMe ? 7 : undefined });  // <--- додано
            setError("");
            navigate("/");  // <--- додано
        }
    };

    return (
        <section className="container">
            <div className="login-box">
                <form onSubmit={handleSave}>
                    <h2>Log to Web App</h2>
                    {error && <p className="error">{error}</p>}
                    <Input
                        type="email"
                        text={email}
                        placeholder="Enter your email address"
                        handleChangeText={handleChangeEmail}
                        label="Email"
                    />
                    <Input
                        type="password"
                        text={password}
                        placeholder="Password"
                        handleChangeText={handleChangePassword}
                        label="Password"
                    />
                    <div className="remember-me">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={handleRememberMeChange}
                        />
                        <label>Remember Me</label>
                    </div>
                    <Button className="btn" type="submit" text="Login" />
                </form>
            </div>
        </section>
    );
};

export default Login;
