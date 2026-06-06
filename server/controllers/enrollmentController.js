import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';

// @desc    Get enrolled courses for logged-in user
// @route   GET /api/enrollments
// @access  Private
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user._id })
      .populate('courseId')
      .exec();

    // Map to format suitable for frontend
    const formatted = enrollments.map(enroll => {
      const course = enroll.courseId;
      if (!course) return null;
      return {
        _id: enroll._id,
        courseId: course._id,
        title: course.title,
        thumbnail: course.thumbnail,
        lessonsCount: course.lessonsCount,
        progress: enroll.progress,
        completedLessons: enroll.completedLessons,
        quizScore: enroll.quizScore,
        lessons: course.lessons,
        quiz: course.quiz
      };
    }).filter(Boolean);

    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll in a course
// @route   POST /api/enrollments/enroll/:courseId
// @access  Private
export const enrollInCourse = async (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.user._id;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = new Enrollment({
      userId,
      courseId,
      progress: 0,
      completedLessons: [],
      quizScore: null
    });

    await enrollment.save();

    // Update studentsEnrolled count on Course
    course.studentsEnrolled += 1;
    await course.save();

    // Update user enrolledCount
    const user = await User.findById(userId);
    user.enrolledCount += 1;
    await user.save();

    return res.status(201).json({
      message: 'Enrolled successfully',
      enrollment: {
        courseId: course._id,
        progress: 0,
        completedLessons: [],
        quizScore: null
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Complete or uncomplete a lesson
// @route   POST /api/enrollments/course/:courseId/lesson/:lessonId
// @access  Private
export const completeLesson = async (req, res) => {
  const { courseId, lessonId } = req.params;
  const userId = req.user._id;

  try {
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found for this course' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const lessonExists = course.lessons.some(l => l._id.toString() === lessonId);
    if (!lessonExists) {
      return res.status(404).json({ message: 'Lesson not found in this course' });
    }

    const completedIndex = enrollment.completedLessons.indexOf(lessonId);
    if (completedIndex !== -1) {
      // Toggle off: remove
      enrollment.completedLessons.splice(completedIndex, 1);
    } else {
      // Toggle on: add
      enrollment.completedLessons.push(lessonId);
    }

    // Calculate progress percentage
    const totalLessons = course.lessons.length || 1;
    enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);

    await enrollment.save();

    return res.json({
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Submit quiz score
// @route   POST /api/enrollments/course/:courseId/quiz
// @access  Private
export const submitQuizScore = async (req, res) => {
  const { courseId } = req.params;
  const { score } = req.body; // percentage score e.g. 100
  const userId = req.user._id;

  if (score === undefined || score === null || score < 0 || score > 100) {
    return res.status(400).json({ message: 'Valid quiz score percentage is required' });
  }

  try {
    const enrollment = await Enrollment.findOne({ userId, courseId });
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found for this course' });
    }

    enrollment.quizScore = score;
    await enrollment.save();

    return res.json({
      quizScore: enrollment.quizScore
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
