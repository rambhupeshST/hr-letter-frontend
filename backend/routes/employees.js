const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee'); // Adjust path if needed

// Create a new employee
router.post('/', async (req, res) => {
  try {
    console.log("👉 Incoming POST body:", req.body);

    const { employeeId, name, startDate, title, address } = req.body;

    // Validate required fields
    if (!employeeId || !name) {
      return res.status(400).json({ error: "Missing required fields: employeeId and name are required." });
    }

    // Check if employee with the same employeeId already exists
    const existingEmployee = await Employee.findOne({ employeeId });
    if (existingEmployee) {
      return res.status(409).json({ error: "Employee with this employeeId already exists." });
    }

    // Create new employee document
    const newEmployee = new Employee({
      employeeId,
      name,
      startDate,
      title,
      address,
    });

    await newEmployee.save();

    console.log("✅ New employee saved:", newEmployee);
    res.status(201).json(newEmployee);
  } catch (err) {
    console.error("❌ Backend error (POST /):", err);
    res.status(500).json({ error: "Internal Server Error: " + err.message });
  }
});

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ name: 1 }); // Sort ascending by name
    res.json(employees);
  } catch (err) {
    console.error("❌ Backend error (GET /):", err);
    res.status(500).json({ error: "Internal Server Error: " + err.message });
  }
});

// Get a single employee by employeeId
router.get('/:employeeId', async (req, res) => {
  try {
    const employee = await Employee.findOne({ employeeId: req.params.employeeId });
    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json(employee);
  } catch (err) {
    console.error(`❌ Backend error (GET /${req.params.employeeId}):`, err);
    res.status(500).json({ error: "Internal Server Error: " + err.message });
  }
});

// Update an employee by employeeId
router.patch('/:employeeId', async (req, res) => {
  try {
    const updateData = req.body;

    const updatedEmployee = await Employee.findOneAndUpdate(
      { employeeId: req.params.employeeId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    console.log(`✅ Employee updated (employeeId: ${req.params.employeeId}):`, updatedEmployee);
    res.json(updatedEmployee);
  } catch (err) {
    console.error(`❌ Backend error (PATCH /${req.params.employeeId}):`, err);
    res.status(500).json({ error: "Internal Server Error: " + err.message });
  }
});

// Delete an employee by employeeId
router.delete('/:employeeId', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findOneAndDelete({ employeeId: req.params.employeeId });

    if (!deletedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    console.log(`✅ Employee deleted (employeeId: ${req.params.employeeId})`);
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error(`❌ Backend error (DELETE /${req.params.employeeId}):`, err);
    res.status(500).json({ error: "Internal Server Error: " + err.message });
  }
});

// Login route - POST /api/employees/login
router.post('/login', async (req, res) => {
  try {
    const { employeeId, name } = req.body;

    if (!employeeId || !name) {
      return res.status(400).json({ success: false, message: "Employee ID and name are required." });
    }

    const employee = await Employee.findOne({ employeeId, name });

    if (!employee) {
      return res.status(401).json({ success: false, message: "Invalid employee ID or name." });
    }

    // Login successful
    res.json({ success: true, employee });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
