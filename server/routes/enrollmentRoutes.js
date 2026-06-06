import express from 'express';
import {
  getMyEnrollments,
  enrollInCourse,
  completeLesson,
  submitQuizScore
} from '../controllers/enrollmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All enrollment routes require user authentication
router.use(protect);

router.route('/')
  .get(getMyEnrollments);

router.route('/enroll/:courseId')
  .post(enrollInCourse);

router.route('/course/:courseId/lesson/:lessonId')
  .post(completeLesson);

router.route('/course/:courseId/quiz')
  .post(submitQuizScore);

export default router;
