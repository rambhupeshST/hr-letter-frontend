import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "templates", label: "Manage Templates", icon: "📝" },
    { id: "requests", label: "Letter Requests", icon: "📨" },
    { id: "users", label: "User Management", icon: "👥" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const stats = [
    {
      title: "Total Users",
      value: "42",
      color: "bg-gradient-to-r from-blue-600 to-blue-400",
      iconBg: "bg-blue-100 text-blue-600",
      icon: "👥"
    },
    {
      title: "Pending Requests",
      value: "15",
      color: "bg-gradient-to-r from-amber-500 to-amber-400",
      iconBg: "bg-amber-100 text-amber-600",
      icon: "⏳"
    },
    {
      title: "Active Templates",
      value: "8",
      color: "bg-gradient-to-r from-emerald-500 to-emerald-400",
      iconBg: "bg-emerald-100 text-emerald-600",
      icon: "📄"
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
            <h2 className="text-xl font-bold text-gray-800">Admin Portal</h2>
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
              A
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Admin</p>
              <p className="text-xs text-gray-500">Administrator</p>
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
                dashboard: "Admin Dashboard",
                templates: "Manage Templates",
                requests: "Letter Requests",
                users: "User Management",
                settings: "Settings"
              }[activeTab]}
            </h1>
            <span className="text-gray-600">Welcome, Admin 👋</span>
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
                      <div className={`${stat.color} h-2 rounded-full`} style={{ width: `${(parseInt(stat.value) / 50) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Admin Overview</h2>
                <p className="text-gray-600">Welcome to the admin Dashboard. Here you can manage letter templates, review requests, and administer user accounts.</p>
              </div>
            </>
          )}

          {activeTab === "templates" && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Letter Templates</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <input type="text" placeholder="Search templates..." className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">+ New Template</button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Employment Verification</td>
                        <td className="px-6 py-4 text-sm text-gray-500">Verification</td>
                        <td className="px-6 py-4 text-sm text-gray-500">2023-05-15</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">Salary Certificate</td>
                        <td className="px-6 py-4 text-sm text-gray-500">Certificate</td>
                        <td className="px-6 py-4 text-sm text-gray-500">2023-04-28</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs like requests, users, and settings continue here… */}
        </div>
      </main>
    </div>
  );
}
