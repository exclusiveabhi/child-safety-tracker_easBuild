const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
  studentId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  class: { type: String, required: true },
  route: { type: String, required: true },
  busNumber: { type: String, required: true }, // New field for bus number
  photo: { type: String, required: true } // Store photo as base64 string
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;