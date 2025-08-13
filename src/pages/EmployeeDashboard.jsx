import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const letterTemplates = {
  visa_letter: "https://docs.google.com/document/d/1KGIPp31eyIGixIfBqk3O20nrHY47oq_N/edit",
  certification_reimbursement: "https://docs.google.com/document/d/1KIKkCJ6KglJvabsModKEVkVqhKl_njP_/edit",
  internship_completion: "https://docs.google.com/document/d/1YuRniRa8TlCRB9-x0oWFPMMkxmUCJfOR/edit",
  hr_letter: "https://docs.google.com/document/d/1SgBMZYqTtQlbvUbk38S3YXk-b0xokwl4/edit",
  travel_noc: "https://docs.google.com/document/d/1wc6birpYSbuxyQhDgHLD-2yaapLJEawl/edit",
};

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [requestHistory, setRequestHistory] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    address: "",
    comments: "",
    letterType: ""
  });

  const [stats, setStats] = useState([
    {
      title: "Letters Requested",
      value: "0",
      color: "bg-gradient-to-r from-blue-600 to-blue-400",
      iconBg: "bg-blue-100 text-blue-600",
      icon: "📨",
    },
    {
      title: "Approved Letters",
      value: "0",
      color: "bg-gradient-to-r from-green-500 to-green-400",
      iconBg: "bg-green-100 text-green-600",
      icon: "✅",
    },
    {
      title: "Pending Approvals",
      value: "0",
      color: "bg-gradient-to-r from-amber-500 to-amber-400",
      iconBg: "bg-amber-100 text-amber-600",
      icon: "⏳",
    },
  ]);

  const navigate = useNavigate();
  const prevRequestHistoryRef = useRef([]);

  useEffect(() => {
    const storedValue = localStorage.getItem("employee");
    if (!storedValue) {
      navigate("/");
      return;
    }
    try {
      const employee = JSON.parse(storedValue);
      setCurrentEmployee(employee);
      setFormData(prev => ({
        ...prev,
        address: employee.address || ""
      }));
    } catch (err) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (currentEmployee) fetchRequestHistory();
  }, [currentEmployee]);

  const fetchRequestHistory = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/letter-requests/employee/${currentEmployee.employeeId}`
      );
      if (response.ok) {
        const data = await response.json();

        const prev = prevRequestHistoryRef.current;
        data.forEach((req) => {
          const prevReq = prev.find((r) => r._id === req._id);
          if (prevReq && prevReq.status !== req.status) {
            if (req.status === "approved") showNotification("Your letter request has been approved.", "success");
            else if (req.status === "rejected") showNotification("Your letter request has been rejected.", "error");
          }
        });
        prevRequestHistoryRef.current = data;

        setRequestHistory(data);
        setStats([
          { ...stats[0], value: data.length + "" },
          { ...stats[1], value: data.filter((req) => req.status === "approved").length + "" },
          { ...stats[2], value: data.filter((req) => req.status === "pending").length + "" }
        ]);
      }
    } catch (error) {
      console.error("Error fetching request history:", error);
    }
  };

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogout = () => {
    localStorage.removeItem("employee");
    navigate("/");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitLetterRequest = async () => {
    if (!formData.letterType) {
      showNotification("Please select a letter type", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/letter-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: currentEmployee.employeeId,
          employeeName: currentEmployee.name,
          letterType: formData.letterType,
          address: formData.address,
          employeeComments: formData.comments,
          status: "pending"
        }),
      });

      if (response.ok) {
        showNotification("Your letter request has been sent.", "success");
        setFormData({
          address: currentEmployee.address || "",
          comments: "",
          letterType: ""
        });
        await fetchRequestHistory();
      } else {
        showNotification("Failed to submit request.", "error");
      }
    } catch (err) {
      showNotification("Submit error.", "error");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "text-green-600 bg-green-100";
      case "rejected": return "text-red-600 bg-red-100";
      default: return "text-amber-600 bg-amber-100";
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "request", label: "Request Letter", icon: "📝" },
    { id: "history", label: "Letter History", icon: "📜" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  const letterOptions = [
    { label: "Certification Reimbursement", value: "certification_reimbursement" },
    { label: "HR Letter", value: "hr_letter" },
    { label: "Internship Letter Completion", value: "internship_completion" },
    { label: "Travel NOC Letter", value: "travel_noc" },
    { label: "Visa Letter", value: "visa_letter" },
  ];

  if (!currentEmployee) return <div className="p-10 text-lg">Loading...</div>;

  return (
    <div className="flex h-screen w-screen overflow-hidden text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-6 shadow-sm">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold">HR</div>
          <h2 className="text-xl font-bold text-gray-800">Employee Portal</h2>
        </div>
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-4 space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              {currentEmployee.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{currentEmployee.name}</p>
              <p className="text-xs text-gray-500">Employee</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 text-red-600 hover:bg-red-100 py-2 px-4 rounded-xl border border-red-100 font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8 space-y-6 bg-gray-50">
        <div className="flex justify-between items-center flex-col sm:flex-row">
          <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
          <span className="text-gray-500 mt-2 sm:mt-0">Welcome, {currentEmployee.name}</span>
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
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
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
              <h2 className="text-xl font-semibold mb-2 text-gray-800">Employee Overview</h2>
              <p className="text-gray-600">
                Request letters, check history, and manage your settings from here.
              </p>
            </div>
          </>
        )}

        {/* Request Tab - Now shows form directly */}
        {activeTab === "request" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Letter Request Form</h2>
            
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    value={currentEmployee.name}
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    value={currentEmployee.employeeId}
                    readOnly
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Letter Type *</label>
                <select
                  name="letterType"
                  value={formData.letterType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Letter Type</option>
                  {letterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your current address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Comments</label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="4"
                  placeholder="Please provide any additional information that might help process your request..."
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-6">
              <button
                onClick={() => {
                  setFormData({
                    address: currentEmployee.address || "",
                    comments: "",
                    letterType: ""
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Clear Form
              </button>
              <button
                onClick={submitLetterRequest}
                disabled={!formData.letterType}
                className={`px-6 py-2 rounded-md ${
                  formData.letterType
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Submit Request
              </button>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Letter History</h2>
            {requestHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No letter requests found.</p>
                <button 
                  onClick={() => setActiveTab("request")}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Request a Letter
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Letter Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Notes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requestHistory.map((request) => (
                      <tr key={request._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                          {request.letterType.replace(/_/g, ' ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.requestDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              request.status
                            )}`}
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {request.adminNotes || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.status === "approved" && letterTemplates[request.letterType] && (
                            <a
                              href={letterTemplates[request.letterType]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Download
                            </a>
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

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-lg">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">My Profile</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-sm font-medium text-gray-500">Personal Information</h3>
                <div className="mt-2 grid grid-cols-1 gap-y-4 gap-x-8 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">{currentEmployee.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Employee ID</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">{currentEmployee.employeeId}</p>
                  </div>
                  {currentEmployee.email && (
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">{currentEmployee.email}</p>
                    </div>
                  )}
                  {currentEmployee.department && (
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">{currentEmployee.department}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                <div className="mt-2 grid grid-cols-1 gap-y-4 gap-x-8 sm:grid-cols-2">
                  {currentEmployee.address && (
                    <div className="sm:col-span-2">
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">{currentEmployee.address}</p>
                    </div>
                  )}
                  {currentEmployee.phone && (
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">{currentEmployee.phone}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}