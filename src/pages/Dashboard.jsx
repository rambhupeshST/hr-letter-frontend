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
        {/* Logo + Navigation */}
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

        {/* User Info + Logout */}
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
          {/* Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800 capitalize">
              {activeTab === "dashboard" ? "Admin Dashboard" : 
               activeTab === "templates" ? "Manage Templates" :
               activeTab === "requests" ? "Letter Requests" :
               activeTab === "users" ? "User Management" : "Settings"}
            </h1>
            <span className="text-gray-600">Welcome, Admin 👋</span>
          </div>

          {/* Dashboard Overview */}
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
                      <div
                        className={`w-10 h-10 ${stat.iconBg} rounded-lg flex items-center justify-center text-lg`}
                      >
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
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Admin Overview</h2>
                <p className="text-gray-600">
                  Welcome to the Admin Dashboard. Here you can manage letter templates, review requests, and administer user accounts.
                </p>
              </div>
            </>
          )}

          {/* Manage Templates */}
          {activeTab === "templates" && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Letter Templates</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <input 
                    type="text" 
                    placeholder="Search templates..." 
                    className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    + New Template
                  </button>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Employment Verification</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Verification</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-05-15</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Salary Certificate</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Certificate</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-04-28</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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

          {/* Letter Requests */}
          {activeTab === "requests" && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Pending Requests</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">All</button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Pending</button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Approved</button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Rejected</button>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search requests..." 
                    className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg hover:shadow-md transition">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Employment Verification</h3>
                        <p className="text-sm text-gray-500">Requested by: Ram (ID: 1234)</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">Approve</button>
                        <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm">Reject</button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg hover:shadow-md transition">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Salary Certificate</h3>
                        <p className="text-sm text-gray-500">Requested by: John (ID: 1235)</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">Approve</button>
                        <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm">Reject</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Management */}
          {activeTab === "users" && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">User Management</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    + Add User
                  </button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              R
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">Ram</div>
                              <div className="text-sm text-gray-500">ID: 1234</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ram@example.com</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Employee</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Deactivate</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                              J
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">John</div>
                              <div className="text-sm text-gray-500">ID: 1235</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">john@example.com</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Manager</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Deactivate</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">System Settings</h2>
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-medium mb-3">General Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-gray-700">System Name</label>
                      <input 
                        type="text" 
                        defaultValue="HR Letter Portal" 
                        className="px-3 py-2 border rounded-lg w-64"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-gray-700">Default Timezone</label>
                      <select className="px-3 py-2 border rounded-lg w-64">
                        <option>UTC +05:30 (India)</option>
                        <option>UTC +00:00 (GMT)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">Email Notifications</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="notify-requests" className="mr-2" defaultChecked />
                      <label htmlFor="notify-requests">Notify admins on new requests</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="notify-users" className="mr-2" defaultChecked />
                      <label htmlFor="notify-users">Notify users when requests are processed</label>
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}