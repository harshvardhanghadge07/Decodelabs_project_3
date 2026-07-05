const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Course = require("../models/Course");

// CREATE - POST /api/enrollments
// Body: { student: "<studentId>", course: "<courseId>" }
exports.createEnrollment = async (req, res) => {
  try {
    const { student, course } = req.body;

    // Verify referenced documents actually exist (referential integrity)
    const studentExists = await Student.findById(student);
    if (!studentExists) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const courseExists = await Course.findById(course);
    if (!courseExists) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Enforce course capacity
    const activeCount = await Enrollment.countDocuments({ course, status: "active" });
    if (activeCount >= courseExists.capacity) {
      return res.status(400).json({ success: false, message: "Course is at full capacity" });
    }

    const enrollment = await Enrollment.create({ student, course });
    const populated = await enrollment.populate(["student", "course"]);

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    // Duplicate key error from the unique compound index (student + course)
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Student is already enrolled in this course" });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

// READ ALL - GET /api/enrollments
exports.getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student", "name email")
      .populate("course", "title code instructor")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ ONE - GET /api/enrollments/:id
exports.getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate("student", "name email")
      .populate("course", "title code instructor");

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }
    res.status(200).json({ success: true, data: enrollment });
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid enrollment ID" });
  }
};

// UPDATE - PUT /api/enrollments/:id
// Typically used to update status ("completed"/"dropped") or set a grade
exports.updateEnrollment = async (req, res) => {
  try {
    const { status, grade } = req.body;

    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { status, grade },
      { new: true, runValidators: true }
    )
      .populate("student", "name email")
      .populate("course", "title code instructor");

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }
    res.status(200).json({ success: true, data: enrollment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE - DELETE /api/enrollments/:id
exports.deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }
    res.status(200).json({ success: true, message: "Enrollment deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid enrollment ID" });
  }
};

// BONUS - GET /api/enrollments/student/:studentId
// All courses a specific student is enrolled in
exports.getEnrollmentsByStudent = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.params.studentId }).populate(
      "course",
      "title code instructor credits"
    );
    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid student ID" });
  }
};
