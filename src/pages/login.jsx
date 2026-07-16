import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        localStorage.setItem("isLoggedIn", "true");

        const redirect =
            localStorage.getItem("redirectAfterLogin") || "/dashboard";

        localStorage.removeItem("redirectAfterLogin");

        navigate(redirect);
    };
    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("redirectAfterLogin");
        navigate("/");
    };
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

            <div className="bg-slate-900 w-full max-w-md rounded-2xl p-8 border border-slate-800 shadow-xl">

                <h1 className="text-3xl font-bold text-white text-center mb-2">
                    SignAI Login
                </h1>

                <p className="text-gray-400 text-center mb-8">
                    Sign Language Recognition System
                </p>

                <form onSubmit={handleLogin} className="space-y-5">

                    <input
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full bg-slate-800 p-3 rounded-lg text-white border border-slate-700 focus:outline-none focus:border-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        required
                        className="w-full bg-slate-800 p-3 rounded-lg text-white border border-slate-700 focus:outline-none focus:border-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white font-semibold flex justify-center items-center gap-2"
                    >
                        <FaSignInAlt />
                        Login
                    </button>

                </form>

                <p className="text-gray-400 text-center mt-6">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-blue-500 hover:underline"
                    >
                        Register
                    </Link>
                </p>

            </div>

        </div>
    );
};

export default Login;