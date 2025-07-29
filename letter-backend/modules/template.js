// models/Template.js
const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  name: String,
  type: String,
  lastUpdated: { type: Date, default: Date.now },
  googleDocUrl: String,
});

module.exports = mongoose.model("Template", templateSchema);
