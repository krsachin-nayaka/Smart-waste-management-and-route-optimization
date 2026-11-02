/**
 * Student Controller
 * Project: Student Management REST API (USN: 1NH23CS106)
 * Handles Student CRUD, pagination, filtering by course, regex searching, and sorting.
 */

const Student = require('../models/Student');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create a new student record
// @route   POST /api/students
// @access  Private / Admin
const createStudent = asyncHandler(async (req, res) => {
  const { name, usn, email, age, gender, phone, course, address } = req.body;

  // Check for duplicate USN
  const existingUSN = await Student.findOne({ usn: usn.toUpperCase() });
  if (existingUSN) {
    return res.status(409).json({
      success: false,
      message: `A student with USN '${usn.toUpperCase()}' already exists in the system`,
    });
  }

  // Check for duplicate Email
  const existingEmail = await Student.findOne({ email });
  if (existingEmail) {
    return res.status(409).json({
      success: false,
      message: `A student with email '${email}' already exists in the system`,
    });
  }

  const student = await Student.create({
    name,
    usn: usn.toUpperCase(),
    email,
    age,
    gender,
    phone,
    course,
    address,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Student record created successfully',
    data: student,
  });
});

// @desc    Get all students with Search, Filter, Sort & Pagination
// @route   GET /api/students
// @access  Private (Admin & User)
const getAllStudents = asyncHandler(async (req, res) => {
  const { search, course, gender, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;

  // 1. Build Query Filter
  const query = {};

  // Case-insensitive search on Name or USN
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { usn: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by exact course
  if (course) {
    query.course = course;
  }

  // Filter by gender
  if (gender) {
    query.gender = gender;
  }

  // 2. Sorting options
  const sortDirection = order === 'asc' ? 1 : -1;
  const sortOptions = {};
  const allowedSortFields = ['name', 'usn', 'age', 'createdAt', 'updatedAt', 'course'];
  if (allowedSortFields.includes(sortBy)) {
    sortOptions[sortBy] = sortDirection;
  } else {
    sortOptions.createdAt = -1;
  }

  // 3. Pagination calculation
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (parsedPage - 1) * parsedLimit;

  // 4. Execute queries
  const totalStudents = await Student.countDocuments(query);
  const students = await Student.find(query)
    .populate('createdBy', 'name email role')
    .sort(sortOptions)
    .skip(skip)
    .limit(parsedLimit);

  res.status(200).json({
    success: true,
    message: 'Students fetched successfully',
    data: {
      students,
      pagination: {
        total: totalStudents,
        page: parsedPage,
        pages: Math.ceil(totalStudents / parsedLimit) || 1,
        limit: parsedLimit,
        hasPrev: parsedPage > 1,
        hasNext: parsedPage < Math.ceil(totalStudents / parsedLimit),
      },
    },
  });
});

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private (Admin & User)
const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id).populate('createdBy', 'name email');

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with ID '${req.params.id}' was not found`,
    });
  }

  res.status(200).json({
    success: true,
    message: 'Student retrieved successfully',
    data: student,
  });
});

// @desc    Update student completely (PUT)
// @route   PUT /api/students/:id
// @access  Private / Admin
const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with ID '${req.params.id}' was not found`,
    });
  }

  // Check email uniqueness if email updated
  if (req.body.email && req.body.email !== student.email) {
    const emailExists = await Student.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: `Student with email '${req.body.email}' already exists`,
      });
    }
  }

  // Check USN uniqueness if USN updated
  if (req.body.usn && req.body.usn.toUpperCase() !== student.usn) {
    const usnExists = await Student.findOne({ usn: req.body.usn.toUpperCase() });
    if (usnExists) {
      return res.status(409).json({
        success: false,
        message: `Student with USN '${req.body.usn.toUpperCase()}' already exists`,
      });
    }
  }

  const updatedStudent = await Student.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      ...(req.body.usn && { usn: req.body.usn.toUpperCase() }),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: 'Student updated successfully',
    data: updatedStudent,
  });
});

// @desc    Partial update student (PATCH)
// @route   PATCH /api/students/:id
// @access  Private / Admin
const patchStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with ID '${req.params.id}' was not found`,
    });
  }

  // Check unique constraints if fields modified
  if (req.body.email && req.body.email !== student.email) {
    const emailExists = await Student.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: `Student with email '${req.body.email}' already exists`,
      });
    }
  }

  if (req.body.usn && req.body.usn.toUpperCase() !== student.usn) {
    const usnExists = await Student.findOne({ usn: req.body.usn.toUpperCase() });
    if (usnExists) {
      return res.status(409).json({
        success: false,
        message: `Student with USN '${req.body.usn.toUpperCase()}' already exists`,
      });
    }
  }

  Object.assign(student, req.body);
  if (req.body.usn) {
    student.usn = req.body.usn.toUpperCase();
  }

  const patchedStudent = await student.save();

  res.status(200).json({
    success: true,
    message: 'Student patched successfully',
    data: patchedStudent,
  });
});

// @desc    Delete student record
// @route   DELETE /api/students/:id
// @access  Private / Admin
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with ID '${req.params.id}' was not found`,
    });
  }

  await Student.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: `Student '${student.name}' (USN: ${student.usn}) deleted successfully`,
    data: { id: req.params.id },
  });
});

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  patchStudent,
  deleteStudent,
};
