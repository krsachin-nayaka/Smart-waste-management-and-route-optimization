/**
 * Student Model
 * Project: Student Management REST API (USN: 1NH23CS106)
 * Stores student records, course enrollment, USN, demographic and contact information.
 */

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    usn: {
      type: String,
      required: [true, 'Student USN is required (e.g. 1NH23CS106)'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
      match: [
        /^[0-9][A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{3}$/i,
        'Please enter a valid USN format (e.g., 1NH23CS106)',
      ],
    },
    email: {
      type: String,
      required: [true, 'Student email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
      index: true,
    },
    age: {
      type: Number,
      required: [true, 'Student age is required'],
      min: [16, 'Age must be at least 16 years'],
      max: [70, 'Age cannot exceed 70 years'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: {
        values: ['Male', 'Female', 'Other'],
        message: '{VALUE} is not supported. Use Male, Female, or Other',
      },
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [
        /^[0-9+-\s()]{7,20}$/,
        'Please provide a valid contact phone number',
      ],
    },
    course: {
      type: String,
      required: [true, 'Enrolled course is required'],
      trim: true,
      index: true,
      enum: {
        values: [
          'Computer Science & Engineering',
          'Information Science & Engineering',
          'Artificial Intelligence & Machine Learning',
          'Electronics & Communication Engineering',
          'Mechanical Engineering',
          'Civil Engineering',
          'Master of Business Administration (MBA)',
          'Master of Computer Applications (MCA)',
        ],
        message: 'Course must be one of the accredited academic programs',
      },
    },
    address: {
      type: String,
      required: [true, 'Residential address is required'],
      trim: true,
      maxlength: [200, 'Address cannot exceed 200 characters'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for name and usn searches
studentSchema.index({ name: 'text', usn: 'text', course: 'text' });

module.exports = mongoose.model('Student', studentSchema);
