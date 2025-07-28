import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginpage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<EmployeeDashboard />} />
      </Routes>
    </>
  );
};

export default App;
