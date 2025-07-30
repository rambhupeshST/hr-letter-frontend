import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedLetterType, setSelectedLetterType] = useState("");
  const [requestHistory, setRequestHistory] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(null);

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

  useEffect(() => {
    const storedValue = localStorage.getItem("employee");
    if (!storedValue) {
      navigate("/");
      return;
    }

    try {
      const parsed = JSON.parse(storedValue);
      setCurrentEmployee(parsed);
    } catch (err) {
      console.error("Error parsing employee object:", err);
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (currentEmployee) fetchRequestHistory();
  }, [currentEmployee]);

  const fetchRequestHistory = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/letter-requests/employee/${currentEmployee.employeeId}`);
      if (response.ok) {
        const data = await response.json();
        setRequestHistory(data);

        const total = data.length;
        const approved = data.filter(req => req.status === "approved").length;
        const pending = data.filter(req => req.status === "pending").length;

        setStats([
          { ...stats[0], value: total.toString() },
          { ...stats[1], value: approved.toString() },
          { ...stats[2], value: pending.toString() },
        ]);
      }
    } catch (error) {
      console.error("Error fetching request history:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("employee");
    navigate("/");
  };

  const handleRequestLetter = (option) => {
    setSelectedLetterType(option);
    setShowRequestModal(true);
  };

  const submitLetterRequest = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/letter-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: currentEmployee.Employee_id,
          employeeName: currentEmployee.name,
          letterType: selectedLetterType.value,
        }),
      });

      if (response.ok) {
        alert("Letter request submitted successfully!");
        setShowRequestModal(false);
        fetchRequestHistory();
      } else {
        alert("Failed to submit request.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Submit error.");
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
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const letterOptions = [
    { label: "Certification Reimbursement", icon: "🎓", value: "certification_reimbursement" },
    { label: "HR Letter", icon: "👤", value: "hr_letter" },
    { label: "Internship Letter Completion", icon: "🎯", value: "internship_completion" },
    { label: "Travel NOC Letter", icon: "✈️", value: "travel_noc" },
    { label: "Visa Letter", icon: "🛂", value: "visa_letter" },
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
                activeTab === item.id ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" : "hover:bg-gray-100"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-4 space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">E</div>
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
          <span className="text-gray-500">Welcome, {currentEmployee.name}</span>
        </div>

        {/* Dashboard */}
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
                    <div className={`w-10 h-10 ${stat.iconBg} rounded-lg flex items-center justify-center text-lg`}>{stat.icon}</div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  <div className="w-full mt-3 h-2 bg-gray-100 rounded-full">
                    <div className={`${stat.color} h-2 rounded-full`} style={{ width: `${(parseInt(stat.value) / 50) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">Employee Overview</h2>
              <p className="text-gray-600">Request letters, check history, and manage your settings from here.</p>
            </div>
          </>
        )}

        {/* Request */}
        {activeTab === "request" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Request a Letter</h2>
            <div className="grid grid-cols-1 gap-4">
              {letterOptions.map(option => (
                <button
                  key={option.label}
                  className="flex items-center space-x-3 px-5 py-4 bg-blue-50 hover:bg-blue-100 rounded-lg shadow-sm border border-blue-100 text-left transition text-blue-800"
                  onClick={() => handleRequestLetter(option)}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* History */}
        {activeTab === "history" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Letter History</h2>
            {requestHistory.length === 0 ? (
              <p className="text-gray-600">No letter requests found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Letter Type</th>
                      <th className="px-4 py-2 text-left">Request Date</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {requestHistory.map((request) => (
                      <tr key={request._id}>
                        <td className="px-4 py-2">{request.letterType}</td>
                        <td className="px-4 py-2">
                          {new Date(request.requestDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">{request.adminNotes || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-sm w-full space-y-4">
            <h3 className="text-lg font-semibold">Confirm Letter Request</h3>
            <p>
              Are you sure you want to request a <strong>{selectedLetterType.label}</strong>?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={submitLetterRequest}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Submit
              </button>
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
