import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Temporary registration
    alert("Registration Successful!");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">

        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Create Account
        </h1>

        <p className="text-gray-400 text-center mb-8">
          SignAI Recognition System
        </p>

        <form onSubmit={handleRegister} className="space-y-5">

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex justify-center items-center gap-2"
          >
            <FaUserPlus />
            Register
          </button>

        </form>

        <p className="text-gray-400 text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Register;