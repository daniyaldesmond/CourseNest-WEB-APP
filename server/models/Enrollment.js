import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  completedLessons: [{
    type: mongoose.Schema.Types.ObjectId // Reference to lesson ID inside Course
  }],
  quizScore: {
    type: Number,
    default: null
  }
}, {
  timestamps: true
});

// Ensure a user cannot enroll in the same course twice
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
