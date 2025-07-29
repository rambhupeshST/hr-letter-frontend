// routes/templateRoutes.js
const express = require("express");
const router = express.Router();
const Template = require("../models/Template");

// POST /api/templates - add new letter template
router.post("/", async (req, res) => {
  try {
    const newTemplate = new Template(req.body);
    const savedTemplate = await newTemplate.save();
    res.status(201).json(savedTemplate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
