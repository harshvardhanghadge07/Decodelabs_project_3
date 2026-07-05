const express = require("express");
const router = express.Router();
const {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
  getEnrollmentsByStudent,
} = require("../controllers/enrollmentController");

router.route("/").post(createEnrollment).get(getEnrollments);
router.get("/student/:studentId", getEnrollmentsByStudent);
router.route("/:id").get(getEnrollmentById).put(updateEnrollment).delete(deleteEnrollment);

module.exports = router;
