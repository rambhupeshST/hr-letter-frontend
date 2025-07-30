const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Employee login route
router.post('/login', async (req, res) => {
  const { Employee_id, password } = req.body;

  try {
    const employee = await Employee.findOne({ employeeId: Employee_id });

    if (!employee || employee.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      employee: {
        name: employee.name,
        employeeId: employee.employeeId,
        title: employee.title,
        startDate: employee.startDate,
        address: employee.address,
        role: 'Employee',
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;