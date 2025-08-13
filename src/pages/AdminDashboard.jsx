import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.get("http://localhost:4000/api/employees")
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });

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
  const [previewRequest, setPreviewRequest] = useState(null);

  const filteredEmployees = employeeData.filter(
    (row) =>
      (row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.employeeId && row.employeeId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Dropdown template options
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

  // For tracking previous pending request count for notifications
  const prevPendingCountRef = useRef(0);

  // Close template dropdown when clicking outside
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

  // Fetch employees and letter requests on mount
  useEffect(() => {
    fetchEmployees();
    fetchLetterRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch employee data with detailed error logging
  const fetchEmployees = () => {
    fetch("http://localhost:4000/api/employees")
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load employee data, status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setEmployeeData(data);
        setApiError("");
      })
      .catch((err) => {
        console.error("Fetch employee error:", err);
        setApiError(err.message);
      });
  };

  // Fetch letter requests and notify if new pending requests arrive
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
        console.error("Failed to fetch letter requests, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching letter requests:", error);
    }
  };

  // Show notification message
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Logout handler
  const handleLogout = () => {
    navigate("/");
  };

  // Open selected template URL in new tab
  const handleNewTemplateSelect = (option) => {
    setTemplateMenuOpen(false);
    if (option.url) {
      window.open(option.url, "_blank", "noopener");
    } else {
      alert(`Selected: ${option.label}`);
    }
  };

  // Handle approve/reject actions for letter requests
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
        showNotification(`Request ${action} successfully!`, "success");
        fetchLetterRequests();
      } else {
        showNotification("Failed to update request. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error updating request:", error);
      showNotification("Error updating request. Please try again.", "error");
    }
  };

  // Preview Modal Component
  const PreviewModal = ({ request, onClose, onApprove, onReject }) => {
    if (!request) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Request Preview</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">Employee Information</h4>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p>{request.employeeName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employee ID</p>
                  <p>{request.employeeId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{request.employeeEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p>{request.employeeDepartment}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{request.employeeAddress || "Not provided"}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700">Letter Details</h4>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm text-gray-500">Letter Type</p>
                  <p>{request.letterType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Request Date</p>
                  <p>{new Date(request.requestDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </p>
                </div>
                {request.adminNotes && (
                  <div>
                    <p className="text-sm text-gray-500">Admin Notes</p>
                    <p>{request.adminNotes}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700">Additional Details</h4>
              <div className="mt-2 bg-gray-50 p-4 rounded">
                {request.comments && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Employee Comments</p>
                    <p className="whitespace-pre-wrap">{request.comments}</p>
                  </div>
                )}
                {Object.entries(request.formData || {}).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <p className="whitespace-pre-wrap">{value || 'Not provided'}</p>
                  </div>
                ))}
              </div>
            </div>

            {request.status === "pending" && (
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    const notes = prompt("Please enter rejection notes:");
                    if (notes !== null) {
                      onReject(notes);
                    }
                  }}
                  className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => {
                    const notes = prompt("Please enter approval notes (optional):");
                    onApprove(notes || "");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Navigation items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "templates", label: "Manage Templates", icon: "📝" },
    { id: "requests", label: "Letter Requests", icon: "📨" },
    { id: "employeeData", label: "Employee Data", icon: "🗂️" },
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

  // Status badge color helper
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
                employeeData: "Employee Data",
            
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

          {/* Manage Templates Tab */}
          {activeTab === "templates" && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">Manage Templates</h2>
              <div ref={templateMenuRef} className="relative inline-block text-left">
                <button
                  onClick={() => setTemplateMenuOpen((open) => !open)}
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  aria-haspopup="true"
                  aria-expanded={templateMenuOpen}
                >
                  Select Template
                  <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {templateMenuOpen && (
                  <div className="origin-top-right absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {templateOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleNewTemplateSelect(option)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
                              <div className="text-sm text-gray-500">ID: {request.employeeId}</div>
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
                                  onClick={() => setPreviewRequest(request)}
                                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                                >
                                  Preview
                                </button>
                                <button
                                  onClick={() => {
                                    const notes = prompt("Please enter approval notes (optional):");
                                    if (notes !== null) {
                                      handleRequestAction(request._id, "approved", notes || "");
                                    }
                                  }}
                                  className="text-green-600 hover:text-green-900 text-sm font-medium"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    const notes = prompt("Please enter rejection notes:");
                                    if (notes !== null) {
                                      handleRequestAction(request._id, "rejected", notes);
                                    }
                                  }}
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
                        <th className="px-4 py-2">Home address</th>
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
        </div>
      </main>

      {/* Preview Modal */}
      <PreviewModal
        request={previewRequest}
        onClose={() => setPreviewRequest(null)}
        onApprove={(notes) => handleRequestAction(previewRequest?._id, "approved", notes)}
        onReject={(notes) => handleRequestAction(previewRequest?._id, "rejected", notes)}
      />
    </div>
  );
}
