import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
  try {
    const { category, search, level, sort, minPrice, maxPrice, free } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (level && level !== 'All') {
      query.level = level;
    }

    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { title: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { shortDescription: { $regex: term, $options: 'i' } },
        { instructor: { $regex: term, $options: 'i' } },
      ];
    }

    if (free === 'true') {
      query.price = 0;
    } else {
      const priceFilter = {};
      if (minPrice !== undefined && minPrice !== '' && !Number.isNaN(Number(minPrice))) {
        priceFilter.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '' && !Number.isNaN(Number(maxPrice))) {
        priceFilter.$lte = Number(maxPrice);
      }
      if (Object.keys(priceFilter).length > 0) {
        query.price = priceFilter;
      }
    }

    const sortMap = {
      'newest': { createdAt: -1 },
      'oldest': { createdAt: 1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      'rating': { rating: -1 },
      'title': { title: 1 },
    };
    const sortOption = sortMap[sort] || { createdAt: -1 };

    const courses = await Course.find(query).sort(sortOption);
    return res.json(courses);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      return res.json(course);
    } else {
      return res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private (Admin/Instructor)
export const createCourse = async (req, res) => {
  try {
    const { title, description, shortDescription, category, instructor, instructorBio, price, originalPrice, duration, level, thumbnail } = req.body;

    const course = new Course({
      title,
      description,
      shortDescription,
      category,
      instructor,
      instructorBio,
      price,
      originalPrice,
      duration,
      level,
      thumbnail,
      lessons: [],
      quiz: []
    });

    const createdCourse = await course.save();
    return res.status(201).json(createdCourse);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Admin/Instructor)
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      course.title = req.body.title || course.title;
      course.description = req.body.description || course.description;
      course.shortDescription = req.body.shortDescription !== undefined ? req.body.shortDescription : course.shortDescription;
      course.category = req.body.category || course.category;
      course.instructor = req.body.instructor || course.instructor;
      course.instructorBio = req.body.instructorBio !== undefined ? req.body.instructorBio : course.instructorBio;
      course.price = req.body.price !== undefined ? req.body.price : course.price;
      course.originalPrice = req.body.originalPrice !== undefined ? req.body.originalPrice : course.originalPrice;
      course.duration = req.body.duration || course.duration;
      course.level = req.body.level || course.level;
      course.thumbnail = req.body.thumbnail !== undefined ? req.body.thumbnail : course.thumbnail;

      if (req.body.lessons) {
        course.lessons = req.body.lessons.map(l => ({
          _id: l._id || (typeof l.id === 'string' && l.id.length === 24 ? l.id : undefined),
          title: l.title,
          duration: l.duration,
          videoUrl: l.videoUrl
        }));
      }

      if (req.body.quiz) {
        course.quiz = req.body.quiz.map(q => ({
          _id: q._id || (typeof q.id === 'string' && q.id.length === 24 ? q.id : undefined),
          question: q.question,
          options: q.options,
          answer: q.answer
        }));
      }

      const updatedCourse = await course.save();
      return res.json(updatedCourse);
    } else {
      return res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin/Instructor)
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      // Delete enrollments for this course
      await Enrollment.deleteMany({ courseId: course._id });
      await course.deleteOne();
      return res.json({ message: 'Course removed successfully' });
    } else {
      return res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Add lesson to course
// @route   POST /api/courses/:id/lessons
// @access  Private (Admin/Instructor)
export const addLesson = async (req, res) => {
  try {
    const { title, duration, videoUrl } = req.body;
    const course = await Course.findById(req.params.id);

    if (course) {
      course.lessons.push({ title, duration, videoUrl });
      await course.save();
      return res.status(201).json(course);
    } else {
      return res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update lesson in course
// @route   PUT /api/courses/:id/lessons/:lessonId
// @access  Private (Admin/Instructor)
export const updateLesson = async (req, res) => {
  try {
    const { title, duration, videoUrl } = req.body;
    const course = await Course.findById(req.params.id);

    if (course) {
      const lesson = course.lessons.id(req.params.lessonId);
      if (lesson) {
        lesson.title = title || lesson.title;
        lesson.duration = duration || lesson.duration;
        lesson.videoUrl = videoUrl || lesson.videoUrl;
        await course.save();
        return res.json(course);
      } else {
        return res.status(404).json({ message: 'Lesson not found' });
      }
    } else {
      return res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete lesson from course
// @route   DELETE /api/courses/:id/lessons/:lessonId
// @access  Private (Admin/Instructor)
export const deleteLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      const lessonIndex = course.lessons.findIndex(l => l._id.toString() === req.params.lessonId);
      if (lessonIndex !== -1) {
        course.lessons.splice(lessonIndex, 1);
        await course.save();
        return res.json(course);
      } else {
        return res.status(404).json({ message: 'Lesson not found' });
      }
    } else {
      return res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update quiz in course
// @route   PUT /api/courses/:id/quiz
// @access  Private (Admin/Instructor)
export const updateQuiz = async (req, res) => {
  try {
    const { quiz } = req.body; // Array of quiz questions
    const course = await Course.findById(req.params.id);

    if (course) {
      course.quiz = quiz;
      await course.save();
      return res.json(course);
    } else {
      return res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
