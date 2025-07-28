import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "request", label: "Request Letter", icon: "📝" },
    { id: "history", label: "Letter History", icon: "📜" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const stats = [
    {
      title: "Letters Requested",
      value: "12",
      color: "bg-gradient-to-r from-blue-600 to-blue-400",
      iconBg: "bg-blue-100 text-blue-600",
      icon: "📨"
    },
    {
      title: "Approved Letters",
      value: "9",
      color: "bg-gradient-to-r from-green-500 to-green-400",
      iconBg: "bg-green-100 text-green-600",
      icon: "✅"
    },
    {
      title: "Pending Approvals",
      value: "3",
      color: "bg-gradient-to-r from-amber-500 to-amber-400",
      iconBg: "bg-amber-100 text-amber-600",
      icon: "⏳"
    },
  ];

  return (
    <div className="flex h-screen w-screen bg-gray-50 text-gray-800 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-6 shadow-sm">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold">
              HR
            </div>
            <h2 className="text-xl font-bold text-gray-800">Employee Portal</h2>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-xl flex items-center space-x-3 border border-gray-200">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              E
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Employee</p>
              <p className="text-xs text-gray-500">Staff Member</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 text-red-600 hover:bg-red-100 font-medium py-2 px-4 rounded-xl transition-all duration-300 border border-red-100"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-auto">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 capitalize">
              {{
                dashboard: "Dashboard",
                request: "Request Letter",
                history: "Letter History",
                settings: "Settings"
              }[activeTab]}
            </h1>
            <span className="text-gray-600">Welcome, Employee 👋</span>
          </div>

          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-600 font-medium">{stat.title}</h3>
                      <div className={`w-10 h-10 ${stat.iconBg} rounded-lg flex items-center justify-center text-lg`}>
                        {stat.icon}
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    <div className="w-full mt-3 h-2 bg-gray-100 rounded-full">
                      <div
                        className={`${stat.color} h-2 rounded-full`}
                        style={{ width: `${(parseInt(stat.value) / 50) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Employee Overview</h2>
                <p className="text-gray-600">
                  This is your dashboard to request letters, check history, and update your settings.
                </p>
              </div>
            </>
          )}

          {/* Other tabs can be added here */}
        </div>
      </main>
    </div>
  );
}
