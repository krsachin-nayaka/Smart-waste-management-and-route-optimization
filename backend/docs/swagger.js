/**
 * Swagger Documentation Configuration
 * Project: Student Management REST API (USN: 1NH23CS106)
 * Defines OpenAPI 3.0 specification for authentication, students, and user endpoints.
 */

const swaggerUi = require('swagger-ui-express');

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Student Management REST API',
    version: '1.0.0',
    description: 'Enterprise REST API specification for Student Records, User Management, and JWT RBAC.\n\nAuthor: Student Developer (USN: 1NH23CS106)\nInstitution: Academic Final Project',
    contact: {
      name: 'Sachin (USN: 1NH23CS106)',
      email: 'sachinuiux106@gmail.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token obtained from /api/auth/login or /api/auth/register',
      },
    },
    schemas: {
      Student: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '67c514782bb04c1f9e6d0106' },
          name: { type: 'string', example: 'Sachin Kumar' },
          usn: { type: 'string', example: '1NH23CS106' },
          email: { type: 'string', example: 'sachin.1nh23cs106@college.edu' },
          age: { type: 'integer', example: 21 },
          gender: { type: 'string', enum: ['Male', 'Female', 'Other'], example: 'Male' },
          phone: { type: 'string', example: '+91 98765 43210' },
          course: { type: 'string', example: 'Computer Science & Engineering' },
          address: { type: 'string', example: 'Bengaluru, Karnataka, India' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '67c514782bb04c1f9e6d0101' },
          name: { type: 'string', example: 'Administrator' },
          email: { type: 'string', example: 'admin@college.edu' },
          role: { type: 'string', enum: ['admin', 'user'], example: 'admin' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation completed successfully' },
          data: { type: 'object' },
        },
      },
    },
  },
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'John Doe' },
                  email: { type: 'string', example: 'johndoe@example.com' },
                  password: { type: 'string', example: 'secret123' },
                  role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User registered successfully' },
          400: { description: 'Validation failed' },
          409: { description: 'Email already exists' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Authenticate user & retrieve JWT Bearer token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@college.edu' },
                  password: { type: 'string', example: 'Admin@1234' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful with JWT token' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get currently logged-in user profile',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'User profile fetched' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/students': {
      get: {
        tags: ['Students'],
        summary: 'Get list of students with pagination, search, filter, and sort',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search by student name or USN (e.g. 1NH23CS106)' },
          { name: 'course', in: 'query', schema: { type: 'string' }, description: 'Filter by academic course' },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'sortBy', in: 'query', schema: { type: 'string', default: 'createdAt' } },
          { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' } },
        ],
        responses: {
          200: { description: 'Paginated list of students' },
          401: { description: 'Unauthorized' },
        },
      },
      post: {
        tags: ['Students'],
        summary: 'Create a student record (Admin Only)',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'usn', 'email', 'age', 'gender', 'phone', 'course', 'address'],
                properties: {
                  name: { type: 'string', example: 'Sachin Kumar' },
                  usn: { type: 'string', example: '1NH23CS106' },
                  email: { type: 'string', example: 'sachin.1nh23cs106@college.edu' },
                  age: { type: 'integer', example: 21 },
                  gender: { type: 'string', example: 'Male' },
                  phone: { type: 'string', example: '+91 98765 43210' },
                  course: { type: 'string', example: 'Computer Science & Engineering' },
                  address: { type: 'string', example: 'Outer Ring Road, Bengaluru' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Student created successfully' },
          403: { description: 'Forbidden - Admin role required' },
        },
      },
    },
    '/api/students/{id}': {
      get: {
        tags: ['Students'],
        summary: 'Get student by ID',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Student retrieved successfully' },
          404: { description: 'Student not found' },
        },
      },
      put: {
        tags: ['Students'],
        summary: 'Complete update of student record (Admin Only)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Student updated successfully' },
          403: { description: 'Forbidden' },
        },
      },
      delete: {
        tags: ['Students'],
        summary: 'Delete student record (Admin Only)',
        security: [{ BearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Student deleted successfully' },
          403: { description: 'Forbidden' },
        },
      },
    },
    '/api/users': {
      get: {
        tags: ['Users'],
        summary: 'List all users (Admin Only)',
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'Users listed' },
          403: { description: 'Forbidden' },
        },
      },
    },
  },
};

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });
};

module.exports = { setupSwagger, swaggerDocument };
