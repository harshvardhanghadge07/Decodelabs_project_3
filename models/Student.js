const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // enforces distinctness, like a SQL UNIQUE constraint
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [16, "Age must be at least 16"], // acts like a SQL CHECK constraint
      max: [100, "Age must be realistic"],
    },
    enrollmentYear: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
