const mongoose = require("mongoose");

// This is the "junction table" equivalent from the relational world:
// Students <-> Enrollments <-> Courses (many-to-many)
const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // foreign key -> Student._id
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // foreign key -> Course._id
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "dropped"],
      default: "active",
    },
    grade: {
      type: String,
      enum: ["A", "B", "C", "D", "F", null],
      default: null,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent the same student from enrolling in the same course twice
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
