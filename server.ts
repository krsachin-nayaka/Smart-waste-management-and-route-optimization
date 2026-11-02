/**
 * Full-Stack Dev Server & Student Management REST API Engine
 * Author: Sachin (USN: 1NH23CS106)
 * Mounts live REST endpoints and serves the interactive frontend via Vite middlewares.
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'secret_student_api_1NH23CS106_super_key';
const PORT = parseInt(process.env.PORT || '3000', 10);

interface UserItem {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
  resetPasswordToken?: string | null;
  resetPasswordExpires?: number | null;
  createdAt: string;
  updatedAt: string;
}

interface StudentItem {
  _id: string;
  name: string;
  usn: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  course: string;
  address: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// In-Memory Database Store seeded with USN 1NH23CS106
const initialAdminHash = bcrypt.hashSync('Admin@1234', 10);
const initialUserHash = bcrypt.hashSync('User@1234', 10);

let users: UserItem[] = [
  {
    _id: '67c514782bb04c1f9e6d0101',
    name: 'Administrator (Academic Office)',
    email: 'admin@college.edu',
    passwordHash: initialAdminHash,
    role: 'admin',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '67c514782bb04c1f9e6d0102',
    name: 'Sachin (Student Developer)',
    email: 'sachin.1nh23cs106@college.edu',
    passwordHash: initialUserHash,
    role: 'user',
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let students: StudentItem[] = [
  {
    _id: '67c514782bb04c1f9e6d0106',
    name: 'Sachin Kumar',
    usn: '1NH23CS106',
    email: 'sachin.1nh23cs106@college.edu',
    age: 21,
    gender: 'Male',
    phone: '+91 98765 43210',
    course: 'Computer Science & Engineering',
    address: 'Outer Ring Road, Bengaluru, Karnataka 560103',
    createdBy: '67c514782bb04c1f9e6d0101',
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '67c514782bb04c1f9e6d0107',
    name: 'Ananya Sharma',
    usn: '1NH23CS012',
    email: 'ananya.sharma@college.edu',
    age: 20,
    gender: 'Female',
    phone: '+91 91234 56789',
    course: 'Computer Science & Engineering',
    address: 'Indiranagar 100ft Road, Bengaluru, Karnataka 560038',
    createdBy: '67c514782bb04c1f9e6d0101',
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '67c514782bb04c1f9e6d0108',
    name: 'Rohan Deshmukh',
    usn: '1NH23AI045',
    email: 'rohan.deshmukh@college.edu',
    age: 22,
    gender: 'Male',
    phone: '+91 98450 11223',
    course: 'Artificial Intelligence & Machine Learning',
    address: 'Whitefield Main Road, Bengaluru, Karnataka 560066',
    createdBy: '67c514782bb04c1f9e6d0101',
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '67c514782bb04c1f9e6d0109',
    name: 'Priyanka Reddy',
    usn: '1NH23IS088',
    email: 'priyanka.reddy@college.edu',
    age: 21,
    gender: 'Female',
    phone: '+91 97400 33445',
    course: 'Information Science & Engineering',
    address: 'Koramangala 4th Block, Bengaluru, Karnataka 560034',
    createdBy: '67c514782bb04c1f9e6d0101',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '67c514782bb04c1f9e6d0110',
    name: 'Aditya Varma',
    usn: '1NH23EC034',
    email: 'aditya.varma@college.edu',
    age: 21,
    gender: 'Male',
    phone: '+91 99001 55667',
    course: 'Electronics & Communication Engineering',
    address: 'HSR Layout Sector 2, Bengaluru, Karnataka 560102',
    createdBy: '67c514782bb04c1f9e6d0101',
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '67c514782bb04c1f9e6d0111',
    name: 'Meera Iyer',
    usn: '1NH23CS079',
    email: 'meera.iyer@college.edu',
    age: 20,
    gender: 'Female',
    phone: '+91 94480 77889',
    course: 'Computer Science & Engineering',
    address: 'Malleshwaram 8th Cross, Bengaluru, Karnataka 560003',
    createdBy: '67c514782bb04c1f9e6d0101',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const app = express();

// Security & Parsing
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper: Generate JWT
const signToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });
};

// Helper: Sanitize User
const sanitizeUser = (user: UserItem) => {
  const { passwordHash, resetPasswordToken, resetPasswordExpires, ...safeUser } = user;
  return safeUser;
};

// Middleware: Authenticate JWT
const authProtect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided in request header',
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    const user = users.find((u) => u._id === decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists',
      });
    }
    (req as any).user = user;
    next();
  } catch (err: any) {
    return res.status(401).json({
      success: false,
      message: err.name === 'TokenExpiredError' ? 'Session expired. Please log in again' : 'Not authorized. Invalid token',
    });
  }
};

// Middleware: RBAC Role Authorization
const roleAuthorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as UserItem;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${user.role}' is not authorized to access this resource. Required: [${allowedRoles.join(', ')}]`,
      });
    }
    next();
  };
};

/* ==========================================================================
   REST API: /api/auth
   ========================================================================== */

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: name, email, password',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long',
    });
  }

  const emailLower = email.toLowerCase().trim();
  if (users.some((u) => u.email === emailLower)) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email address already exists',
    });
  }

  const newUser: UserItem = {
    _id: '67c' + Math.random().toString(16).substring(2, 23).padEnd(21, '0'),
    name: name.trim(),
    email: emailLower,
    passwordHash: bcrypt.hashSync(password, 10),
    role: role === 'admin' ? 'admin' : 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);
  const token = signToken(newUser._id, newUser.role);

  return res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: sanitizeUser(newUser),
      token,
    },
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password',
    });
  }

  const user = users.find((u) => u.email === email.toLowerCase().trim());
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password credentials',
    });
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password credentials',
    });
  }

  const token = signToken(user._id, user.role);
  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: sanitizeUser(user),
      token,
    },
  });
});

app.post('/api/auth/logout', authProtect, (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully. Token discarded on client.',
  });
});

app.get('/api/auth/me', authProtect, (req: Request, res: Response) => {
  const user = (req as any).user as UserItem;
  return res.status(200).json({
    success: true,
    message: 'User profile fetched successfully',
    data: sanitizeUser(user),
  });
});

app.put('/api/auth/update-profile', authProtect, (req: Request, res: Response) => {
  const user = (req as any).user as UserItem;

  // Security: Prevent role escalation
  if (req.body.role) {
    return res.status(403).json({
      success: false,
      message: 'Security Violation: Modifying user role via profile update is prohibited',
    });
  }

  if (req.body.email && req.body.email.toLowerCase().trim() !== user.email) {
    const emailExists = users.some(
      (u) => u._id !== user._id && u.email === req.body.email.toLowerCase().trim()
    );
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: 'The requested email address is already in use',
      });
    }
    user.email = req.body.email.toLowerCase().trim();
  }

  if (req.body.name) {
    user.name = req.body.name.trim();
  }
  user.updatedAt = new Date().toISOString();

  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: sanitizeUser(user),
  });
});

app.put('/api/auth/change-password', authProtect, (req: Request, res: Response) => {
  const user = (req as any).user as UserItem;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required',
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters long',
    });
  }

  const isMatch = bcrypt.compareSync(currentPassword, user.passwordHash);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Current password provided is incorrect',
    });
  }

  user.passwordHash = bcrypt.hashSync(newPassword, 10);
  user.updatedAt = new Date().toISOString();

  return res.status(200).json({
    success: true,
    message: 'Password changed successfully. Please log in with your new password.',
  });
});

app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide your account email' });
  }

  const user = users.find((u) => u.email === email.toLowerCase().trim());
  if (!user) {
    return res.status(200).json({
      success: true,
      message: 'If an account exists with that email, a password reset token has been dispatched',
    });
  }

  const token = 'rst_' + Math.random().toString(36).substring(2, 15);
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000;

  return res.status(200).json({
    success: true,
    message: 'Password reset token generated successfully',
    data: {
      resetToken: token,
      expiresIn: '1 hour',
      instructions: 'Send POST to /api/auth/reset-password with { token, newPassword }',
    },
  });
});

app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ success: false, message: 'Token and newPassword are required' });
  }

  const user = users.find(
    (u) =>
      u.resetPasswordToken === token &&
      u.resetPasswordExpires &&
      u.resetPasswordExpires > Date.now()
  );

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired password reset token',
    });
  }

  user.passwordHash = bcrypt.hashSync(newPassword, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  user.updatedAt = new Date().toISOString();

  return res.status(200).json({
    success: true,
    message: 'Password has been successfully reset. You may now log in.',
  });
});

/* ==========================================================================
   REST API: /api/students
   ========================================================================== */

app.get('/api/students', authProtect, (req: Request, res: Response) => {
  const { search, course, gender, sortBy = 'createdAt', order = 'desc', page = '1', limit = '10' } = req.query as any;

  let results = [...students];

  // Search by name or USN
  if (search) {
    const q = (search as string).toLowerCase().trim();
    results = results.filter(
      (s) => s.name.toLowerCase().includes(q) || s.usn.toLowerCase().includes(q)
    );
  }

  // Filter by course
  if (course) {
    results = results.filter((s) => s.course.toLowerCase() === (course as string).toLowerCase());
  }

  // Filter by gender
  if (gender) {
    results = results.filter((s) => s.gender.toLowerCase() === (gender as string).toLowerCase());
  }

  // Sorting
  const sortDirection = order === 'asc' ? 1 : -1;
  results.sort((a: any, b: any) => {
    if (a[sortBy] < b[sortBy]) return -1 * sortDirection;
    if (a[sortBy] > b[sortBy]) return 1 * sortDirection;
    return 0;
  });

  // Pagination
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const total = results.length;
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedStudents = results.slice(startIndex, startIndex + limitNum);

  return res.status(200).json({
    success: true,
    message: 'Students fetched successfully',
    data: {
      students: paginatedStudents,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
        hasPrev: pageNum > 1,
        hasNext: pageNum < Math.ceil(total / limitNum),
      },
    },
  });
});

app.post('/api/students', authProtect, roleAuthorize('admin'), (req: Request, res: Response) => {
  const { name, usn, email, age, gender, phone, course, address } = req.body;

  if (!name || !usn || !email || !age || !gender || !phone || !course || !address) {
    return res.status(400).json({
      success: false,
      message: 'All student fields are required (name, usn, email, age, gender, phone, course, address)',
    });
  }

  const cleanUSN = usn.toUpperCase().trim();
  if (students.some((s) => s.usn === cleanUSN)) {
    return res.status(409).json({
      success: false,
      message: `A student with USN '${cleanUSN}' already exists in the system`,
    });
  }

  const cleanEmail = email.toLowerCase().trim();
  if (students.some((s) => s.email === cleanEmail)) {
    return res.status(409).json({
      success: false,
      message: `A student with email '${cleanEmail}' already exists in the system`,
    });
  }

  const newStudent: StudentItem = {
    _id: '67c' + Math.random().toString(16).substring(2, 23).padEnd(21, '0'),
    name: name.trim(),
    usn: cleanUSN,
    email: cleanEmail,
    age: parseInt(age, 10),
    gender,
    phone: phone.trim(),
    course: course.trim(),
    address: address.trim(),
    createdBy: ((req as any).user as UserItem)._id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  students.unshift(newStudent);

  return res.status(201).json({
    success: true,
    message: 'Student record created successfully',
    data: newStudent,
  });
});

// Friendly handlers for when client calls PUT/PATCH/DELETE on /api/students without an ID
app.put('/api/students', (_req: Request, res: Response) => {
  return res.status(400).json({
    success: false,
    message: 'Missing student ID in URL path. To update a student, use PUT /api/students/:id (e.g. /api/students/67c514782bb04c1f9e6d0106)',
    example: '/api/students/67c514782bb04c1f9e6d0106',
  });
});

app.patch('/api/students', (_req: Request, res: Response) => {
  return res.status(400).json({
    success: false,
    message: 'Missing student ID in URL path. To partially update a student, use PATCH /api/students/:id (e.g. /api/students/67c514782bb04c1f9e6d0106)',
    example: '/api/students/67c514782bb04c1f9e6d0106',
  });
});

app.delete('/api/students', (_req: Request, res: Response) => {
  return res.status(400).json({
    success: false,
    message: 'Missing student ID in URL path. To delete a student, use DELETE /api/students/:id (e.g. /api/students/67c514782bb04c1f9e6d0106)',
    example: '/api/students/67c514782bb04c1f9e6d0106',
  });
});

app.get('/api/students/:id', authProtect, (req: Request, res: Response) => {
  const student = students.find((s) => s._id === req.params.id);
  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with ID '${req.params.id}' was not found`,
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Student retrieved successfully',
    data: student,
  });
});

app.put('/api/students/:id', authProtect, roleAuthorize('admin'), (req: Request, res: Response) => {
  const studentIndex = students.findIndex((s) => s._id === req.params.id);
  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Student with ID '${req.params.id}' was not found`,
    });
  }

  const student = students[studentIndex];
  const { name, usn, email, age, gender, phone, course, address } = req.body;

  if (email && email.toLowerCase().trim() !== student.email) {
    if (students.some((s) => s._id !== student._id && s.email === email.toLowerCase().trim())) {
      return res.status(409).json({ success: false, message: `Email '${email}' is already taken` });
    }
  }

  if (usn && usn.toUpperCase().trim() !== student.usn) {
    if (students.some((s) => s._id !== student._id && s.usn === usn.toUpperCase().trim())) {
      return res.status(409).json({ success: false, message: `USN '${usn}' is already taken` });
    }
  }

  const updated: StudentItem = {
    ...student,
    name: name !== undefined ? name.trim() : student.name,
    usn: usn !== undefined ? usn.toUpperCase().trim() : student.usn,
    email: email !== undefined ? email.toLowerCase().trim() : student.email,
    age: age !== undefined ? parseInt(age, 10) : student.age,
    gender: gender !== undefined ? gender : student.gender,
    phone: phone !== undefined ? phone.trim() : student.phone,
    course: course !== undefined ? course.trim() : student.course,
    address: address !== undefined ? address.trim() : student.address,
    updatedAt: new Date().toISOString(),
  };

  students[studentIndex] = updated;

  return res.status(200).json({
    success: true,
    message: 'Student updated successfully',
    data: updated,
  });
});

app.patch('/api/students/:id', authProtect, roleAuthorize('admin'), (req: Request, res: Response) => {
  const studentIndex = students.findIndex((s) => s._id === req.params.id);
  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Student with ID '${req.params.id}' was not found`,
    });
  }

  const student = students[studentIndex];
  const allowedKeys = ['name', 'usn', 'email', 'age', 'gender', 'phone', 'course', 'address'];
  const updateData: any = {};

  for (const key of allowedKeys) {
    if (req.body[key] !== undefined) {
      if (key === 'usn') updateData[key] = req.body[key].toUpperCase().trim();
      else if (key === 'email') updateData[key] = req.body[key].toLowerCase().trim();
      else if (key === 'age') updateData[key] = parseInt(req.body[key], 10);
      else updateData[key] = req.body[key];
    }
  }

  const patched = { ...student, ...updateData, updatedAt: new Date().toISOString() };
  students[studentIndex] = patched;

  return res.status(200).json({
    success: true,
    message: 'Student patched successfully',
    data: patched,
  });
});

app.delete('/api/students/:id', authProtect, roleAuthorize('admin'), (req: Request, res: Response) => {
  const studentIndex = students.findIndex((s) => s._id === req.params.id);
  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Student with ID '${req.params.id}' was not found`,
    });
  }

  const deleted = students.splice(studentIndex, 1)[0];

  return res.status(200).json({
    success: true,
    message: `Student '${deleted.name}' (USN: ${deleted.usn}) deleted successfully`,
    data: { id: req.params.id },
  });
});

/* ==========================================================================
   REST API: /api/users (Admin Only)
   ========================================================================== */

app.get('/api/users', authProtect, roleAuthorize('admin'), (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: 'Users fetched successfully',
    count: users.length,
    data: users.map(sanitizeUser),
  });
});

app.put('/api/users', (_req: Request, res: Response) => {
  return res.status(400).json({
    success: false,
    message: 'Missing user ID in URL path. To update a user, use PUT /api/users/:id',
  });
});

app.delete('/api/users', (_req: Request, res: Response) => {
  return res.status(400).json({
    success: false,
    message: 'Missing user ID in URL path. To delete a user, use DELETE /api/users/:id',
  });
});

app.get('/api/users/:id', authProtect, roleAuthorize('admin'), (req: Request, res: Response) => {
  const user = users.find((u) => u._id === req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User with ID '${req.params.id}' not found`,
    });
  }

  return res.status(200).json({
    success: true,
    message: 'User retrieved successfully',
    data: sanitizeUser(user),
  });
});

app.put('/api/users/:id', authProtect, roleAuthorize('admin'), (req: Request, res: Response) => {
  const user = users.find((u) => u._id === req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User with ID '${req.params.id}' not found`,
    });
  }

  if (req.body.role && !['admin', 'user'].includes(req.body.role)) {
    return res.status(400).json({ success: false, message: 'Role must be admin or user' });
  }

  if (req.body.name) user.name = req.body.name.trim();
  if (req.body.role) user.role = req.body.role;
  user.updatedAt = new Date().toISOString();

  return res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: sanitizeUser(user),
  });
});

app.delete('/api/users/:id', authProtect, roleAuthorize('admin'), (req: Request, res: Response) => {
  const currentUser = (req as any).user as UserItem;
  if (currentUser._id === req.params.id) {
    return res.status(400).json({
      success: false,
      message: 'Self-deletion prohibited: You cannot delete your own active administrator account',
    });
  }

  const idx = users.findIndex((u) => u._id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const deleted = users.splice(idx, 1)[0];
  return res.status(200).json({
    success: true,
    message: `User account '${deleted.name}' deleted successfully`,
    data: { id: req.params.id },
  });
});

// Seed Reset Route (Useful for testing)
app.post('/api/reset-data', authProtect, roleAuthorize('admin'), (_req: Request, res: Response) => {
  students = [
    {
      _id: '67c514782bb04c1f9e6d0106',
      name: 'Sachin Kumar',
      usn: '1NH23CS106',
      email: 'sachin.1nh23cs106@college.edu',
      age: 21,
      gender: 'Male',
      phone: '+91 98765 43210',
      course: 'Computer Science & Engineering',
      address: 'Outer Ring Road, Bengaluru, Karnataka 560103',
      createdBy: '67c514782bb04c1f9e6d0101',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  return res.status(200).json({ success: true, message: 'Data reset to initial state with USN 1NH23CS106' });
});

// Health & System Info
app.get('/api/health', (_req: Request, res: Response) => {
  return res.status(200).json({
    status: 'healthy',
    project: 'Student Management REST API',
    authorUSN: '1NH23CS106',
    uptime: process.uptime(),
    activeStudents: students.length,
    activeUsers: users.length,
    timestamp: new Date().toISOString(),
  });
});

/* ==========================================================================
   Vite Frontend Integration
   ========================================================================== */

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(` 🎓 Student Management API & Studio Online`);
    console.log(` 🚀 Listening at: http://0.0.0.0:${PORT}`);
    console.log(` 👤 Project Author USN: 1NH23CS106`);
    console.log(` 📚 Live REST Endpoints: /api/auth, /api/students, /api/users`);
    console.log(`====================================================`);
  });
}

startServer();
