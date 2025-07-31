import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [templateMenuOpen, setTemplateMenuOpen] = useState(false);
  const templateMenuRef = useRef();
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState([]);
  const [apiError, setApiError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [letterRequests, setLetterRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [notification, setNotification] = useState(null);

  const filteredEmployees = employeeData.filter(
    (row) =>
      (row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.employeeId && row.employeeId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Dropdown template options with URLs
  const templateOptions = [
    {
      label: "Certification Reimbursement",
      value: "certification",
      url: "https://docs.google.com/document/d/193TkX-J6HHpoWx8Ahdhof3EukhGkk6VV/edit",
    },
    {
      label: "HR Letter",
      value: "hr_letter",
      url: "https://docs.google.com/document/d/1SgBMZYqTtQlbvUbk38S3YXk-b0xokwl4/edit",
    },
    {
      label: "Internship Letter Completion",
      value: "internship_completion",
      url: "https://docs.google.com/document/d/1YuRniRa8TlCRB9-x0oWFPMMkxmUCJfOR/edit",
    },
    {
      label: "Travel NOC Letter",
      value: "travel_noc",
      url: "https://docs.google.com/document/d/1wc6birpYSbuxyQhDgHLD-2yaapLJEawl/edit",
    },
    {
      label: "Visa Letter",
      value: "visa",
      url: "https://docs.google.com/document/d/1KGIPp31eyIGixIfBqk3O20nrHY47oq_N/edit",
    },
  ];

  // For tracking previous pending request count to detect new requests
  const prevPendingCountRef = useRef(0);

  // Close dropdown menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (templateMenuRef.current && !templateMenuRef.current.contains(event.target)) {
        setTemplateMenuOpen(false);
      }
    };
    if (templateMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [templateMenuOpen]);

  useEffect(() => {
    fetchEmployees();
    fetchLetterRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEmployees = () => {
    fetch("http://localhost:4000/api/employees")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load employee data");
        return response.json();
      })
      .then((data) => {
        setEmployeeData(data);
      })
      .catch((err) => setApiError(err.message));
  };

  const fetchLetterRequests = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/letter-requests");
      if (response.ok) {
        const data = await response.json();
        setLetterRequests(data);

        const pendingCount = data.filter((req) => req.status === "pending").length;

        if (pendingCount > prevPendingCountRef.current) {
          showNotification("New letter request received.", "info");
        }

        prevPendingCountRef.current = pendingCount;
        setPendingRequests(pendingCount);
      } else {
        console.error("Failed to fetch letter requests");
      }
    } catch (error) {
      console.error("Error fetching letter requests:", error);
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleNewTemplateSelect = (option) => {
    setTemplateMenuOpen(false);
    if (option.url) {
      window.open(option.url, "_blank", "noopener");
    } else {
      alert(`Selected: ${option.label}`);
    }
  };

  const handleRequestAction = async (requestId, action, notes = "") => {
    try {
      const response = await fetch(`http://localhost:4000/api/letter-requests/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: action,
          adminNotes: notes,
        }),
      });

      if (response.ok) {
        alert(`Request ${action} successfully!`);
        fetchLetterRequests();
      } else {
        alert("Failed to update request. Please try again.");
      }
    } catch (error) {
      console.error("Error updating request:", error);
      alert("Error updating request. Please try again.");
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "templates", label: "Manage Templates", icon: "📝" },
    { id: "requests", label: "Letter Requests", icon: "📨" },
    { id: "users", label: "User Management", icon: "👥" },
    { id: "employeeData", label: "Employee Data", icon: "🗂️" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const stats = [
    {
      title: "Total Users",
      value: employeeData.length.toString(),
      color: "bg-gradient-to-r from-blue-600 to-blue-400",
      iconBg: "bg-blue-100 text-blue-600",
      icon: "👥",
    },
    {
      title: "Pending Requests",
      value: pendingRequests.toString(),
      color: "bg-gradient-to-r from-amber-500 to-amber-400",
      iconBg: "bg-amber-100 text-amber-600",
      icon: "⏳",
    },
    {
      title: "Active Templates",
      value: "8",
      color: "bg-gradient-to-r from-emerald-500 to-emerald-400",
      iconBg: "bg-emerald-100 text-emerald-600",
      icon: "📄",
    },
  ];

  // Make sure this is declared - used for status color badges
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-amber-600 bg-amber-100";
    }
  };

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

        <div className="mt-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 text-gray-600 rounded-xl flex items-center justify-center font-bold">
              A
            </div>
            <div>
              <div className="font-semibold">Admin</div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
          </div>
          <button
            className="mt-6 w-full bg-red-50 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-100 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-auto">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center flex-col sm:flex-row">
            <h1 className="text-2xl font-bold text-gray-800 capitalize">
              {{
                dashboard: "Admin Dashboard",
                templates: "Manage Templates",
                requests: "Letter Requests",
                users: "User Management",
                employeeData: "Employee Data",
                settings: "Settings",
              }[activeTab]}
            </h1>
            <span className="text-gray-600 mt-2 sm:mt-0">Welcome, Admin 👋</span>
          </div>

          {/* Notification Bar */}
          {notification && (
            <div
              className={`p-3 rounded text-white font-medium mb-4 ${
                notification.type === "success"
                  ? "bg-green-600"
                  : notification.type === "error"
                  ? "bg-red-600"
                  : "bg-blue-600"
              }`}
            >
              {notification.message}
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
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
          )}

          {/* Letter Requests Tab */}
          {activeTab === "requests" && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">Letter Requests</h2>
              {letterRequests.length === 0 ? (
                <div className="text-gray-600">No letter requests found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Employee</th>
                        <th className="px-4 py-2 text-left">Letter Type</th>
                        <th className="px-4 py-2 text-left">Request Date</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {letterRequests.map((request) => (
                        <tr key={request._id}>
                          <td className="px-4 py-2">
                            <div>
                              <div className="font-medium">{request.employeeName}</div>
                              <div className="text-sm text-gray-500">
                                ID: {request.employeeId}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2">{request.letterType}</td>
                          <td className="px-4 py-2">
                            {new Date(request.requestDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                request.status
                              )}`}
                            >
                              {request.status}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            {request.status === "pending" ? (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    handleRequestAction(request._id, "approved")
                                  }
                                  className="text-green-600 hover:text-green-900 text-sm font-medium"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    handleRequestAction(request._id, "rejected")
                                  }
                                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500">
                                {request.adminNotes || "No notes"}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === "users" && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">User Management</h2>
              <input
                type="text"
                placeholder="Search by name or employee ID..."
                className="mb-4 px-4 py-2 border rounded w-full max-w-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {apiError ? (
                <div className="text-red-600">Error loading employees: {apiError}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2">Employee ID</th>
                        <th className="px-4 py-2">Employee</th>
                        <th className="px-4 py-2">Start date</th>
                        <th className="px-4 py-2">Title</th>
                        <th className="px-4 py-2">Home address - Full address</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEmployees.map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2">{row.employeeId}</td>
                          <td className="px-4 py-2">{row.name}</td>
                          <td className="px-4 py-2">{row.startDate}</td>
                          <td className="px-4 py-2">{row.title}</td>
                          <td className="px-4 py-2">{row.address}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Employee Data Tab */}
          {activeTab === "employeeData" && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">Employee Data</h2>
              <input
                type="text"
                placeholder="Search by name or employee ID..."
                className="mb-4 px-4 py-2 border rounded w-full max-w-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {apiError ? (
                <div className="text-red-600">Error loading employees: {apiError}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2">Employee ID</th>
                        <th className="px-4 py-2">Employee</th>
                        <th className="px-4 py-2">Start date</th>
                        <th className="px-4 py-2">Title</th>
                        <th className="px-4 py-2">Home address - Full address</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEmployees.map((row, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-2">{row.employeeId}</td>
                          <td className="px-4 py-2">{row.name}</td>
                          <td className="px-4 py-2">{row.startDate}</td>
                          <td className="px-4 py-2">{row.title}</td>
                          <td className="px-4 py-2">{row.address}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Optional: Add other tabs here */}
        </div>
      </main>
    </div>
  );
}
