import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  videoUrl: { type: String, required: true }
});

const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: Number, required: true } // Index of the correct option
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  instructorBio: {
    type: String,
  },
  rating: {
    type: Number,
    default: 5.0,
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
  },
  duration: {
    type: String,
  },
  lessonsCount: {
    type: Number,
    default: 0,
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  studentsEnrolled: {
    type: Number,
    default: 0,
  },
  thumbnail: {
    type: String,
    default: '',
  },
  lessons: [lessonSchema],
  quiz: [quizQuestionSchema]
}, {
  timestamps: true
});

// Pre-save hook to calculate lesson count dynamically
courseSchema.pre('save', function (next) {
  if (this.lessons) {
    this.lessonsCount = this.lessons.length;
  }
  next();
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
