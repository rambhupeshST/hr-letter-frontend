import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/image.png"; // Adjust path if needed

export default function LoginPage() {
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [role, setRole] = useState("Employee");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (role === "Admin") {
      setIsLoading(false);
      navigate("/admin-dashboard");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/employees/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId,        // corrected key
          name: employeeName // key adjusted to 'name'
        }),
      });
      const data = await response.json();
      setIsLoading(false);

      if (data.success) {
        localStorage.setItem("employee", JSON.stringify(data.employee));
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setIsLoading(false);
      setError("Network error. Please try again.");
    }
  };


  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left Half */}
      <div
        className="hidden md:flex md:w-1/2 items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #171D34 0%, #9546F6 100%)",
        }}
      >
        <img
          src={logo}
          alt="Company Logo"
          className="max-w-[300px] w-9/12 rounded-3xl shadow-2xl object-cover"
        />
      </div>

      {/* Right Half - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center relative bg-white bg-opacity-5 backdrop-blur-2xl">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Login Form Content */}
        <div className="relative z-10 w-full max-w-md p-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[#171d34] mb-2">HR Letter Portal</h1>
            <p className="text-[#171d34] text-opacity-80">Welcome back! Please sign in to continue.</p>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white border-opacity-20">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Employee ID */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-[#9546F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Employee ID"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-[#171d34] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9546F6] focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  required
                />
              </div>

              {/* Employee Name */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-[#9546F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Employee Name"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-[#171d34] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9546F6] focus:border-transparent backdrop-blur-sm transition-all duration-300"
                  required
                />
              </div>

              {/* Role selection */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-[#9546F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-[#171d34] focus:outline-none focus:ring-2 focus:ring-[#9546F6] focus:border-transparent backdrop-blur-sm transition-all duration-300"
                >
                  <option value="Employee">Employee</option>
                  <option value="Admin">Admin</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-[#9546F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="px-4 py-2 mb-2 rounded bg-red-50 text-red-700 border border-red-200">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#9546F6] hover:bg-[#7b35c3] disabled:bg-opacity-30 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a href="#" className="text-[#9546F6] hover:text-[#7b35c3] text-sm transition-all duration-300">
                Forgot your password?
              </a>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-[#171d34] text-opacity-60 text-sm">
              Need help? Contact IT support at{" "}
              <a href="mailto:support@company.com" className="text-[#9546F6] hover:text-[#7b35c3] transition-all duration-300">
                support@company.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}