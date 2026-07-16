import { useState } from "react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { FaUserCircle, FaCamera } from "react-icons/fa";

const Settings = () => {
  const [user, setUser] = useState({
    name: "Admin User",
    email: "admin@signai.com",
    phone: "+94 77 123 4567",
    university: "University Name",
    role: "Project Administrator",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    alert("Profile Updated Successfully!");
  };

  return (
    <DashboardLayout>
      <h1 className="text-4xl font-bold text-white mb-8">
        Profile Settings
      </h1>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">

        {/* Profile Image */}
        <div className="flex flex-col items-center">

          <div className="relative">
            <FaUserCircle className="text-8xl text-blue-500" />

            <button className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full hover:bg-blue-700">
              <FaCamera className="text-white" />
            </button>
          </div>

          <h2 className="text-2xl text-white font-semibold mt-4">
            {user.name}
          </h2>

          <p className="text-gray-400">
            {user.email}
          </p>

        </div>

        {/* Form */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <div>
            <label className="text-gray-300">Full Name</label>

            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
            />
          </div>

          <div>
            <label className="text-gray-300">Email</label>

            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
            />
          </div>

          <div>
            <label className="text-gray-300">Phone Number</label>

            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
            />
          </div>

          <div>
            <label className="text-gray-300">Age</label>

            <input
              type="number"
              name="age"
              value={user.age}
              onChange={handleChange}
              className="w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg p-3 text-white"
            />
          </div>

                  </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-white font-semibold transition"
          >
            Save Changes
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Settings;