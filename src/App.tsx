/**
 * Student Management REST API - Interactive Developer Studio & Learning Portal
 * Author USN: 1NH23CS106
 */

import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Send,
  Code2,
  BookOpen,
  FileText,
  Copy,
  Check,
  Download,
  Shield,
  Layers,
  ArrowRight,
  Database,
  Key,
  FolderTree,
  AlertCircle,
  HelpCircle,
  Sun,
  Moon,
  ExternalLink,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { PROJECT_FILES, STAGES, USN_CODE, ProjectFile } from './data/projectData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'stage1' | 'api' | 'code' | 'swagger' | 'interview'>('stage1');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(PROJECT_FILES[0]);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  // Live API Tester State
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>('GET');
  const [apiEndpoint, setApiEndpoint] = useState<string>('/api/students?search=1NH23CS106');
  const [apiToken, setApiToken] = useState<string>('');
  const [apiBody, setApiBody] = useState<string>('{\n  "search": "1NH23CS106"\n}');
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiStatus, setApiStatus] = useState<number | null>(null);
  const [apiLatency, setApiLatency] = useState<number | null>(null);

  // Terminal Simulator State
  const [simStep, setSimStep] = useState<number>(1);
  const [terminalCopied, setTerminalCopied] = useState<boolean>(false);

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Available standard test endpoints
  const ENDPOINT_PRESETS = [
    {
      group: 'Students (CRUD & Query)',
      endpoints: [
        {
          label: 'GET /api/students?search=1NH23CS106 (Search Sachin)',
          method: 'GET' as const,
          endpoint: `/api/students?search=${USN_CODE}`,
          body: '',
          desc: 'Search students by USN or name (case-insensitive regex)',
        },
        {
          label: 'POST /api/students (Create New Student)',
          method: 'POST' as const,
          endpoint: '/api/students',
          body: JSON.stringify(
            {
              name: 'Vikramaditya Rao',
              usn: '1NH23CS' + Math.floor(120 + Math.random() * 800),
              email: `vikram.${Math.floor(Math.random() * 10000)}@college.edu`,
              age: 21,
              gender: 'Male',
              phone: '+91 98111 22334',
              course: 'Computer Science & Engineering',
              address: 'Koramangala 5th Block, Bengaluru',
            },
            null,
            2
          ),
          desc: 'Creates a new student record (Requires Admin role)',
        },
        {
          label: 'PUT /api/students/:id (Full Update Sachin 1NH23CS106)',
          method: 'PUT' as const,
          endpoint: '/api/students/67c514782bb04c1f9e6d0106',
          body: JSON.stringify(
            {
              name: 'Sachin Kumar',
              usn: USN_CODE,
              email: 'sachin.1nh23cs106@college.edu',
              age: 22,
              gender: 'Male',
              phone: '+91 98765 43210',
              course: 'Computer Science & Engineering',
              address: 'Indiranagar 100ft Road, Bengaluru, Karnataka',
            },
            null,
            2
          ),
          desc: 'Replaces all attributes for student with ID 67c514782bb04c1f9e6d0106',
        },
        {
          label: 'PATCH /api/students/:id (Partial Update Phone)',
          method: 'PATCH' as const,
          endpoint: '/api/students/67c514782bb04c1f9e6d0106',
          body: JSON.stringify(
            {
              phone: '+91 99000 88776',
            },
            null,
            2
          ),
          desc: 'Updates only the phone number for student with ID 67c514782bb04c1f9e6d0106',
        },
        {
          label: 'GET /api/students/:id (Get Single Student)',
          method: 'GET' as const,
          endpoint: '/api/students/67c514782bb04c1f9e6d0106',
          body: '',
          desc: 'Retrieves student record by MongoDB ObjectId',
        },
        {
          label: 'DELETE /api/students/:id (Delete Student)',
          method: 'DELETE' as const,
          endpoint: '/api/students/67c514782bb04c1f9e6d0111',
          body: '',
          desc: 'Removes student record (Requires Admin role)',
        },
      ],
    },
    {
      group: 'Authentication & Profile',
      endpoints: [
        {
          label: 'POST /api/auth/login (Admin Login)',
          method: 'POST' as const,
          endpoint: '/api/auth/login',
          body: JSON.stringify(
            {
              email: 'admin@college.edu',
              password: 'Admin@1234',
            },
            null,
            2
          ),
          desc: 'Authenticates Administrator and returns JWT Bearer token',
        },
        {
          label: 'POST /api/auth/login (Student Login - Sachin)',
          method: 'POST' as const,
          endpoint: '/api/auth/login',
          body: JSON.stringify(
            {
              email: 'sachin.1nh23cs106@college.edu',
              password: 'User@1234',
            },
            null,
            2
          ),
          desc: 'Authenticates Student User and returns JWT Bearer token',
        },
        {
          label: 'POST /api/auth/register (Register New User)',
          method: 'POST' as const,
          endpoint: '/api/auth/register',
          body: JSON.stringify(
            {
              name: 'New Student User',
              email: `student.${Math.floor(Math.random() * 10000)}@college.edu`,
              password: 'Student@1234',
              role: 'user',
            },
            null,
            2
          ),
          desc: 'Registers a new user account with hashed password',
        },
        {
          label: 'GET /api/auth/me (Get Current Profile)',
          method: 'GET' as const,
          endpoint: '/api/auth/me',
          body: '',
          desc: 'Fetches profile of the authenticated bearer token',
        },
        {
          label: 'PUT /api/auth/update-profile (Update Name & Email)',
          method: 'PUT' as const,
          endpoint: '/api/auth/update-profile',
          body: JSON.stringify(
            {
              name: 'Sachin Kumar (Developer 1NH23CS106)',
            },
            null,
            2
          ),
          desc: 'Updates user profile. Disallows role escalation.',
        },
        {
          label: 'PUT /api/auth/change-password (Change Password)',
          method: 'PUT' as const,
          endpoint: '/api/auth/change-password',
          body: JSON.stringify(
            {
              currentPassword: 'Admin@1234',
              newPassword: 'Admin@1234',
            },
            null,
            2
          ),
          desc: 'Verifies current password and sets new hashed password',
        },
      ],
    },
    {
      group: 'User Management (Admin Only)',
      endpoints: [
        {
          label: 'GET /api/users (List All System Users)',
          method: 'GET' as const,
          endpoint: '/api/users',
          body: '',
          desc: 'Lists all system accounts (Admin role required)',
        },
        {
          label: 'PUT /api/users/:id (Promote / Change Role)',
          method: 'PUT' as const,
          endpoint: '/api/users/67c514782bb04c1f9e6d0102',
          body: JSON.stringify({ role: 'admin' }, null, 2),
          desc: 'Updates role for user account (Admin role required)',
        },
      ],
    },
  ];

  const [selectedEndpointKey, setSelectedEndpointKey] = useState<string>(ENDPOINT_PRESETS[0].endpoints[0].label);

  const fetchTokenFor = async (role: 'admin' | 'user') => {
    const creds =
      role === 'admin'
        ? { email: 'admin@college.edu', password: 'Admin@1234' }
        : { email: 'sachin.1nh23cs106@college.edu', password: 'User@1234' };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds),
      });
      const data = await res.json();
      if (data?.data?.token) {
        setApiToken(data.data.token);
        return data.data.token;
      }
    } catch {}
    return null;
  };

  // Initial Auto-Login as Admin to seed token
  useEffect(() => {
    fetchTokenFor('admin');
  }, []);

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(id);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  // Auto update body template when method changes
  const handleMethodChange = (newMethod: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE') => {
    setApiMethod(newMethod);
    if (newMethod === 'POST') {
      if (!apiEndpoint.includes('/api/students') && !apiEndpoint.includes('/api/auth')) {
        setApiEndpoint('/api/students');
      }
      setApiBody(
        JSON.stringify(
          {
            name: 'New Student',
            usn: '1NH23CS' + Math.floor(200 + Math.random() * 700),
            email: `student.${Math.floor(Math.random() * 10000)}@college.edu`,
            age: 21,
            gender: 'Male',
            phone: '+91 98765 00000',
            course: 'Computer Science & Engineering',
            address: 'Bengaluru, Karnataka',
          },
          null,
          2
        )
      );
    } else if (newMethod === 'PUT') {
      if (apiEndpoint === '/api/students' || apiEndpoint.includes('?')) {
        setApiEndpoint('/api/students/67c514782bb04c1f9e6d0106');
      }
      setApiBody(
        JSON.stringify(
          {
            name: 'Sachin Kumar',
            usn: USN_CODE,
            email: 'sachin.1nh23cs106@college.edu',
            age: 22,
            gender: 'Male',
            phone: '+91 98765 43210',
            course: 'Computer Science & Engineering',
            address: 'Outer Ring Road, Bengaluru',
          },
          null,
          2
        )
      );
    } else if (newMethod === 'PATCH') {
      if (apiEndpoint === '/api/students' || apiEndpoint.includes('?')) {
        setApiEndpoint('/api/students/67c514782bb04c1f9e6d0106');
      }
      setApiBody(JSON.stringify({ phone: '+91 99999 88888' }, null, 2));
    }
  };

  const handleSelectPresetEndpoint = (label: string) => {
    setSelectedEndpointKey(label);
    for (const group of ENDPOINT_PRESETS) {
      const found = group.endpoints.find((e) => e.label === label);
      if (found) {
        setApiMethod(found.method);
        setApiEndpoint(found.endpoint);
        setApiBody(found.body);
        break;
      }
    }
  };

  const selectPreset = (
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    body: string = ''
  ) => {
    setApiMethod(method);
    setApiEndpoint(endpoint);
    setApiBody(body);
  };

  const handleSendApiRequest = async () => {
    setApiLoading(true);
    setApiResponse(null);
    setApiStatus(null);
    const startTime = performance.now();

    try {
      // 1. Ensure token exists for protected routes
      let activeToken = apiToken.trim();
      const isPublicRoute =
        apiEndpoint.includes('/api/auth/login') ||
        apiEndpoint.includes('/api/auth/register') ||
        apiEndpoint.includes('/api/auth/forgot-password') ||
        apiEndpoint.includes('/api/auth/reset-password') ||
        apiEndpoint === '/' ||
        apiEndpoint === '/api/health';

      if (!activeToken && !isPublicRoute) {
        // Auto-fetch admin token seamlessly so the request doesn't fail with 401
        activeToken = (await fetchTokenFor('admin')) || '';
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (activeToken) {
        headers['Authorization'] = `Bearer ${activeToken}`;
      }

      const options: RequestInit = {
        method: apiMethod,
        headers,
      };

      if (['POST', 'PUT', 'PATCH'].includes(apiMethod)) {
        if (apiBody && apiBody.trim()) {
          try {
            JSON.parse(apiBody);
            options.body = apiBody;
          } catch (e: any) {
            setApiLoading(false);
            setApiStatus(400);
            setApiResponse({
              success: false,
              errorType: 'Client-Side JSON Syntax Error',
              message: `Your Request Body contains invalid JSON syntax: ${e.message}`,
              tip: 'Click "Auto-Fix / Reset Body" or select a preset from the dropdown.',
            });
            return;
          }
        } else {
          options.body = '{}';
        }
      }

      const res = await fetch(apiEndpoint, options);
      const text = await res.text();
      let data: any;

      try {
        data = JSON.parse(text);
      } catch {
        data = {
          success: false,
          status: res.status,
          message: text.substring(0, 300) || 'Non-JSON response received from server',
        };
      }

      const elapsed = Math.round(performance.now() - startTime);

      setApiStatus(res.status);
      setApiLatency(elapsed);
      setApiResponse(data);

      // Auto update token if logging in or registering
      if (data?.data?.token) {
        setApiToken(data.data.token);
      }
    } catch (err: any) {
      setApiStatus(500);
      setApiResponse({
        success: false,
        errorType: 'Client-Side Network Failure',
        message: err.message || 'Could not communicate with the local server',
        tip: 'Check that server.ts is running and the URL starts with /api/...',
      });
    } finally {
      setApiLoading(false);
    }
  };

  const downloadPostman = () => {
    fetch('/backend/postman_collection.json')
      .then((res) => res.text())
      .then((text) => {
        const blob = new Blob([text], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Student_Management_API_${USN_CODE}.postman_collection.json`;
        a.click();
      })
      .catch(() => alert('Could not download postman collection'));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. TOP BAR CONTRACT */}
      <header className="h-16 border-b border-slate-800 bg-slate-950 px-6 flex items-center justify-between gap-8 shrink-0 sticky top-0 z-40">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm">
            SM
          </div>
          <span className="font-semibold text-base tracking-tight text-white whitespace-nowrap">
            Student Management REST API
          </span>
          <span className="text-xs font-mono text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded bg-indigo-500/10">
            USN: {USN_CODE}
          </span>
        </div>

        {/* Zone 2: 4-5 concise single-line nav tabs */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('stage1')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'stage1'
                ? 'bg-slate-800 text-white font-semibold'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            Stage 1 Guide
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'api'
                ? 'bg-slate-800 text-white font-semibold'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-indigo-400" />
            Live API Studio
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-slate-800 text-white font-semibold'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            MVC Code Explorer
          </button>
          <button
            onClick={() => setActiveTab('swagger')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'swagger'
                ? 'bg-slate-800 text-white font-semibold'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            Swagger Spec
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'interview'
                ? 'bg-slate-800 text-white font-semibold'
                : 'hover:text-white hover:bg-slate-900'
            }`}
          >
            Interview Q&A
          </button>
        </nav>

        {/* Zone 3: 1 primary action & utilities */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={downloadPostman}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors whitespace-nowrap shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export Postman
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            title="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* SUB-HEADER / METADATA STRIP */}
      <div className="border-b border-slate-800 bg-slate-950/60 px-6 py-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-slate-200 font-medium">Node.js + Express + MongoDB + Mongoose</span>
          <span aria-hidden="true">·</span>
          <span>MVC Architecture</span>
          <span aria-hidden="true">·</span>
          <span>JWT + bcryptjs Auth</span>
          <span aria-hidden="true">·</span>
          <span>Role-Based Access Control (Admin / User)</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-slate-400">
          <span>Student USN: <strong className="text-indigo-400">{USN_CODE}</strong></span>
          <span aria-hidden="true">·</span>
          <span>API Status: <strong className="text-emerald-400">Online</strong></span>
        </div>
      </div>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 overflow-y-auto">
        {/* =========================================================
            TAB 1: STAGE 1 GUIDE & ROADMAP
            ========================================================= */}
        {activeTab === 'stage1' && (
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-xl p-8 relative overflow-hidden">
              <div className="relative z-10 space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase tracking-wider">
                  <Terminal className="w-3.5 h-3.5" />
                  Stage 1 of 7 · Foundation & Architecture
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Student Management REST API Architecture
                </h1>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Welcome to the industry-grade backend project masterclass for USN <span className="font-mono text-indigo-300 font-semibold">{USN_CODE}</span>.
                  In this stage, we establish the clean Model-View-Controller (MVC) directory tree, configure production dependencies, enforce secure environment variable handling, and establish our Node.js runtime foundation.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('api')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-2"
                  >
                    Test Live REST Endpoints
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-md transition-colors flex items-center gap-2"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    Inspect All Files
                  </button>
                </div>
              </div>
            </div>

            {/* 7-Stage Curriculum Strip */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-400">
                  Project Development Stages
                </h2>
                <span className="text-xs text-indigo-400 font-medium">Stage 1 Active · Ready for Confirmation</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {STAGES.slice(0, 4).map((st) => (
                  <div
                    key={st.id}
                    className={`p-4 rounded-lg border transition-all ${
                      st.id === 1
                        ? 'border-indigo-500 bg-slate-900/90 shadow-sm'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-2">
                      <span className={st.id === 1 ? 'text-indigo-400 font-bold' : 'text-slate-500'}>
                        Stage 0{st.id}
                      </span>
                      {st.id === 1 ? (
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">
                          CURRENT
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">UPCOMING</span>
                      )}
                    </div>
                    <h3 className={`text-sm font-semibold mb-1 ${st.id === 1 ? 'text-white' : 'text-slate-300'}`}>
                      {st.title.split(': ')[1]}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {st.summary}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage 1 Detailed Step-by-Step Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Terminal & Setup Instructions (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="border border-slate-800 rounded-xl bg-slate-950 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                      <Terminal className="w-4 h-4 text-indigo-400" />
                      Stage 1 Terminal Commands
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSimStep(1)}
                        className={`px-2.5 py-1 text-xs rounded ${simStep === 1 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                      >
                        Step 1: Init
                      </button>
                      <button
                        onClick={() => setSimStep(2)}
                        className={`px-2.5 py-1 text-xs rounded ${simStep === 2 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                      >
                        Step 2: Dependencies
                      </button>
                      <button
                        onClick={() => setSimStep(3)}
                        className={`px-2.5 py-1 text-xs rounded ${simStep === 3 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                      >
                        Step 3: Folders
                      </button>
                    </div>
                  </div>

                  <div className="p-5 font-mono text-xs space-y-4">
                    {simStep === 1 && (
                      <div className="space-y-3">
                        <div className="text-slate-400"># 1. Initialize project directory and create package.json</div>
                        <div className="bg-slate-900 p-3 rounded border border-slate-800 text-emerald-400 flex items-center justify-between">
                          <code>mkdir student-management-api &amp;&amp; cd student-management-api &amp;&amp; npm init -y</code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText('mkdir student-management-api && cd student-management-api && npm init -y');
                              setTerminalCopied(true);
                              setTimeout(() => setTerminalCopied(false), 2000);
                            }}
                            className="text-slate-400 hover:text-white ml-2"
                          >
                            {terminalCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <div className="text-slate-400 text-[11px] leading-relaxed">
                          <strong>Why we need it:</strong> Initializes the Node.js project environment, generating a fresh <code className="text-indigo-300">package.json</code> file that will track project dependencies, metadata, and execution scripts.
                        </div>
                      </div>
                    )}

                    {simStep === 2 && (
                      <div className="space-y-3">
                        <div className="text-slate-400"># 2. Install production dependencies and dev tooling</div>
                        <div className="bg-slate-900 p-3 rounded border border-slate-800 text-emerald-400 flex items-center justify-between">
                          <code className="break-all">npm install express mongoose dotenv jsonwebtoken bcryptjs cors helmet morgan express-validator express-rate-limit swagger-ui-express</code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText('npm install express mongoose dotenv jsonwebtoken bcryptjs cors helmet morgan express-validator express-rate-limit swagger-ui-express && npm install -D nodemon');
                              setTerminalCopied(true);
                              setTimeout(() => setTerminalCopied(false), 2000);
                            }}
                            className="text-slate-400 hover:text-white ml-2 shrink-0"
                          >
                            {terminalCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <div className="text-slate-400"># Install nodemon as a development dependency</div>
                        <div className="bg-slate-900 p-3 rounded border border-slate-800 text-emerald-400">
                          <code>npm install -D nodemon</code>
                        </div>
                        <div className="text-slate-400 text-[11px] leading-relaxed">
                          <strong>Why we need each:</strong>
                          <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-300">
                            <li><strong className="text-indigo-300">express:</strong> Fast, unopinionated web framework for Node.js.</li>
                            <li><strong className="text-indigo-300">mongoose:</strong> Elegant MongoDB object modeling (ODM).</li>
                            <li><strong className="text-indigo-300">jsonwebtoken:</strong> Encodes and cryptographically signs authentication tokens.</li>
                            <li><strong className="text-indigo-300">bcryptjs:</strong> One-way salted hashing of user passwords.</li>
                            <li><strong className="text-indigo-300">helmet &amp; cors:</strong> HTTP header security and Cross-Origin Resource Sharing.</li>
                            <li><strong className="text-indigo-300">express-validator:</strong> Schema sanitization &amp; validation rules.</li>
                            <li><strong className="text-indigo-300">morgan:</strong> Automatic HTTP request logger in the terminal.</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {simStep === 3 && (
                      <div className="space-y-3">
                        <div className="text-slate-400"># 3. Create MVC architecture folders and root files</div>
                        <div className="bg-slate-900 p-3 rounded border border-slate-800 text-emerald-400 flex items-center justify-between">
                          <code>mkdir config controllers middleware models routes validators utils docs</code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText('mkdir config controllers middleware models routes validators utils docs && touch server.js .env .env.example .gitignore');
                              setTerminalCopied(true);
                              setTimeout(() => setTerminalCopied(false), 2000);
                            }}
                            className="text-slate-400 hover:text-white ml-2"
                          >
                            {terminalCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <div className="text-slate-400"># Create root files</div>
                        <div className="bg-slate-900 p-3 rounded border border-slate-800 text-emerald-400">
                          <code>touch server.js .env .env.example .gitignore</code>
                        </div>
                        <div className="text-slate-400 text-[11px] leading-relaxed">
                          <strong>Why MVC:</strong> Decouples data representations (<code className="text-indigo-300">models/</code>) from business logic (<code className="text-indigo-300">controllers/</code>) and URL routers (<code className="text-indigo-300">routes/</code>), ensuring scalable, maintainable, and easily unit-testable code.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Common Errors & Beginner Pitfalls */}
                <div className="border border-slate-800 rounded-xl bg-slate-950 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
                    <AlertCircle className="w-4 h-4" />
                    Common Beginner Errors in Stage 1 &amp; How to Fix Them
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="border border-slate-800/80 rounded-lg p-3 bg-slate-900/30">
                      <div className="font-semibold text-slate-200 mb-1">
                        1. <code className="text-rose-400">Cannot find module 'express'</code>
                      </div>
                      <p className="text-slate-400">
                        <strong>Cause:</strong> You ran <code className="text-slate-300">node server.js</code> without running <code className="text-slate-300">npm install</code> first, or in the wrong directory.
                      </p>
                      <p className="text-emerald-400 mt-1">
                        <strong>Fix:</strong> Confirm you are in the project folder with <code className="text-slate-300">pwd</code>, then run <code className="text-slate-300">npm install</code>.
                      </p>
                    </div>

                    <div className="border border-slate-800/80 rounded-lg p-3 bg-slate-900/30">
                      <div className="font-semibold text-slate-200 mb-1">
                        2. <code className="text-rose-400">Port 5000 already in use (EADDRINUSE)</code>
                      </div>
                      <p className="text-slate-400">
                        <strong>Cause:</strong> Another process (or previous instance of nodemon) is already bound to port 5000.
                      </p>
                      <p className="text-emerald-400 mt-1">
                        <strong>Fix:</strong> Run <code className="text-slate-300">npx kill-port 5000</code>, or change <code className="text-slate-300">PORT=5001</code> in your <code className="text-slate-300">.env</code> file.
                      </p>
                    </div>

                    <div className="border border-slate-800/80 rounded-lg p-3 bg-slate-900/30">
                      <div className="font-semibold text-slate-200 mb-1">
                        3. <code className="text-rose-400">process.env variables undefined</code>
                      </div>
                      <p className="text-slate-400">
                        <strong>Cause:</strong> Forgot to call <code className="text-slate-300">require('dotenv').config()</code> at the very top of <code className="text-slate-300">server.js</code> before referencing env vars.
                      </p>
                      <p className="text-emerald-400 mt-1">
                        <strong>Fix:</strong> Put <code className="text-slate-300">require('dotenv').config();</code> as Line 1 of <code className="text-slate-300">server.js</code>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: MVC Structure & Communication Flow (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* MVC Folder Structure View */}
                <div className="border border-slate-800 rounded-xl bg-slate-950 p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-200 border-b border-slate-800 pb-3">
                    <span className="flex items-center gap-2">
                      <FolderTree className="w-4 h-4 text-indigo-400" />
                      Clean MVC Folder Structure
                    </span>
                    <span className="text-slate-500 font-mono">USN: {USN_CODE}</span>
                  </div>

                  <div className="font-mono text-xs space-y-1.5 text-slate-300">
                    <div className="text-indigo-400 font-bold">student-management-api/</div>
                    <div className="pl-4">├── <span className="text-amber-400">config/</span> <span className="text-slate-500">→ db.js (MongoDB Mongoose connection)</span></div>
                    <div className="pl-4">├── <span className="text-emerald-400">controllers/</span> <span className="text-slate-500">→ auth, student, user logic</span></div>
                    <div className="pl-4">├── <span className="text-cyan-400">middleware/</span> <span className="text-slate-500">→ auth, role RBAC, 404 &amp; error</span></div>
                    <div className="pl-4">├── <span className="text-purple-400">models/</span> <span className="text-slate-500">→ User.js, Student.js (USN: {USN_CODE})</span></div>
                    <div className="pl-4">├── <span className="text-blue-400">routes/</span> <span className="text-slate-500">→ authRoutes, studentRoutes, userRoutes</span></div>
                    <div className="pl-4">├── <span className="text-pink-400">validators/</span> <span className="text-slate-500">→ express-validator schemas</span></div>
                    <div className="pl-4">├── <span className="text-teal-400">utils/</span> <span className="text-slate-500">→ generateToken, asyncHandler</span></div>
                    <div className="pl-4">├── <span className="text-yellow-400">docs/</span> <span className="text-slate-500">→ swagger.js (OpenAPI 3.0)</span></div>
                    <div className="pl-4">├── <span className="text-slate-200">.env</span> &amp; <span className="text-slate-200">.env.example</span></div>
                    <div className="pl-4">├── <span className="text-slate-200">package.json</span></div>
                    <div className="pl-4">├── <span className="text-slate-200">postman_collection.json</span></div>
                    <div className="pl-4">└── <span className="text-indigo-300 font-semibold">server.js</span> <span className="text-slate-500">→ Root server orchestrator</span></div>
                  </div>
                </div>

                {/* File Communication Cycle Card */}
                <div className="border border-slate-800 rounded-xl bg-slate-950 p-5 space-y-4">
                  <div className="text-xs font-semibold text-slate-200 border-b border-slate-800 pb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    How Files Communicate in This Architecture
                  </div>

                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded bg-indigo-900/60 text-indigo-300 flex items-center justify-center font-bold shrink-0 text-xs">
                        1
                      </div>
                      <div>
                        <strong className="text-white">Client Request arrives at server.js:</strong>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Helmet &amp; CORS inspect headers. Request passes to the route handler matching <code className="text-indigo-300">/api/students</code>.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded bg-indigo-900/60 text-indigo-300 flex items-center justify-center font-bold shrink-0 text-xs">
                        2
                      </div>
                      <div>
                        <strong className="text-white">routes/studentRoutes.js applies Middleware:</strong>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Runs <code className="text-indigo-300">protect</code> (verifies JWT), runs <code className="text-indigo-300">authorize('admin')</code>, runs <code className="text-indigo-300">createStudentValidation</code>.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded bg-indigo-900/60 text-indigo-300 flex items-center justify-center font-bold shrink-0 text-xs">
                        3
                      </div>
                      <div>
                        <strong className="text-white">controllers/studentController.js queries Model:</strong>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Executes Mongoose operations on <code className="text-indigo-300">models/Student.js</code>. Any rejected promises trigger <code className="text-indigo-300">asyncHandler</code> to forward to errorMiddleware.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded bg-indigo-900/60 text-indigo-300 flex items-center justify-center font-bold shrink-0 text-xs">
                        4
                      </div>
                      <div>
                        <strong className="text-white">Clean JSON Response:</strong>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Sends standard <code className="text-emerald-400">{`{ success: true, message: "...", data: { ... } }`}</code> with appropriate HTTP status code (200, 201).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stage 1 Confirmation Box */}
                <div className="border border-indigo-500/40 rounded-xl bg-indigo-950/20 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-300 font-semibold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    Stage 1 Milestone Achieved
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    All Stage 1 prerequisites (Node.js setup, package.json, dependencies, .env.example, and folder architecture) have been configured. You can test the live endpoints in the <strong>Live API Studio</strong> or inspect any file in the <strong>MVC Code Explorer</strong>.
                  </p>
                  <div className="pt-1 text-[11px] text-slate-400 font-mono">
                    Next step upon user confirmation: <strong>Stage 2 (Mongoose Database &amp; Schemas)</strong>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: LIVE API STUDIO (POSTMAN IN BROWSER)
            ========================================================= */}
        {activeTab === 'api' && (
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Send className="w-5 h-5 text-indigo-400" />
                  Live API Studio &amp; Postman Tester
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Interact directly with the live running Express REST API. Test JWT bearer authentication, role authorization, student CRUD, search, filter, and pagination.
                </p>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-slate-400 mr-1">Presets:</span>
                <button
                  onClick={() => selectPreset('GET', `/api/students?search=${USN_CODE}`)}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded border border-indigo-500/30"
                >
                  Search USN {USN_CODE}
                </button>
                <button
                  onClick={() =>
                    selectPreset(
                      'POST',
                      '/api/auth/login',
                      '{\n  "email": "admin@college.edu",\n  "password": "Admin@1234"\n}'
                    )
                  }
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
                >
                  Login Admin
                </button>
                <button
                  onClick={() =>
                    selectPreset(
                      'POST',
                      '/api/auth/login',
                      `{\n  "email": "sachin.1nh23cs106@college.edu",\n  "password": "User@1234"\n}`
                    )
                  }
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
                >
                  Login Student
                </button>
                <button
                  onClick={() => selectPreset('GET', '/api/auth/me')}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
                >
                  Get /me
                </button>
                <button
                  onClick={() =>
                    selectPreset(
                      'POST',
                      '/api/students',
                      JSON.stringify(
                        {
                          name: 'Kavya Ramesh',
                          usn: '1NH23CS150',
                          email: 'kavya.ramesh@college.edu',
                          age: 20,
                          gender: 'Female',
                          phone: '+91 98888 77777',
                          course: 'Computer Science & Engineering',
                          address: 'Indiranagar, Bengaluru',
                        },
                        null,
                        2
                      )
                    )
                  }
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded border border-emerald-500/30"
                >
                  + Create Student
                </button>
                <button
                  onClick={() => selectPreset('GET', '/api/users')}
                  className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-purple-300 rounded border border-purple-500/30"
                >
                  List Users (Admin)
                </button>
              </div>
            </div>

            {/* Request Builder Bar */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
              {/* Endpoint Preset Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Select API Endpoint</span>
                  <span className="text-[11px] text-indigo-400 font-normal">
                    Pre-configures Method, URL, and valid JSON Body
                  </span>
                </label>
                <select
                  value={selectedEndpointKey}
                  onChange={(e) => handleSelectPresetEndpoint(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {ENDPOINT_PRESETS.map((grp) => (
                    <optgroup key={grp.group} label={grp.group}>
                      {grp.endpoints.map((ep) => (
                        <option key={ep.label} value={ep.label}>
                          {ep.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* URL & Method Bar */}
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                {/* Method Dropdown */}
                <select
                  value={apiMethod}
                  onChange={(e) => handleMethodChange(e.target.value as any)}
                  className={`px-3 py-2 rounded-md font-mono text-xs font-bold border border-slate-700 focus:outline-none ${
                    apiMethod === 'GET'
                      ? 'bg-blue-950/80 text-blue-400'
                      : apiMethod === 'POST'
                      ? 'bg-emerald-950/80 text-emerald-400'
                      : apiMethod === 'PUT'
                      ? 'bg-amber-950/80 text-amber-400'
                      : apiMethod === 'PATCH'
                      ? 'bg-purple-950/80 text-purple-400'
                      : 'bg-rose-950/80 text-rose-400'
                  }`}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </select>

                {/* URL Input */}
                <input
                  type="text"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  placeholder="/api/students"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-md px-3.5 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-indigo-500"
                />

                {/* Send Button */}
                <button
                  onClick={handleSendApiRequest}
                  disabled={apiLoading}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-md transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm"
                >
                  {apiLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  Send Request
                </button>
              </div>

              {/* JWT Bearer Token Management Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Key className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-slate-400 shrink-0 font-mono text-[11px]">Bearer Token:</span>
                  <input
                    type="text"
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    placeholder="Authorization token auto-populates upon login"
                    className="flex-1 bg-transparent text-slate-200 text-xs font-mono focus:outline-none placeholder:text-slate-600 truncate"
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => fetchTokenFor('admin')}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-[11px] font-mono border border-emerald-500/30"
                    title="Generate Admin Token"
                  >
                    Admin Token
                  </button>
                  <button
                    onClick={() => fetchTokenFor('user')}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded text-[11px] font-mono border border-indigo-500/30"
                    title="Generate Student Token"
                  >
                    User Token
                  </button>
                  {apiToken && (
                    <button
                      onClick={() => setApiToken('')}
                      className="px-2 py-1 text-rose-400 hover:text-rose-300 text-[11px] font-mono"
                      title="Clear Token to test 401"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Request Body Editor (for POST/PUT/PATCH) */}
              {['POST', 'PUT', 'PATCH'].includes(apiMethod) && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span>Request Body (JSON)</span>
                      <span className="text-[11px] text-slate-500">
                        {apiMethod === 'POST' ? '· Must contain required fields' : '· Can contain full or partial updates'}
                      </span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          try {
                            setApiBody(JSON.stringify(JSON.parse(apiBody), null, 2));
                          } catch (err: any) {
                            alert('Cannot format invalid JSON: ' + err.message);
                          }
                        }}
                        className="text-indigo-400 hover:text-indigo-300 text-[11px]"
                      >
                        Format JSON
                      </button>
                      <button
                        onClick={() => handleMethodChange(apiMethod)}
                        className="text-slate-400 hover:text-slate-300 text-[11px]"
                      >
                        Reset Template
                      </button>
                    </div>
                  </div>
                  <textarea
                    rows={7}
                    value={apiBody}
                    onChange={(e) => setApiBody(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-md p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                  />
                </div>
              )}
            </div>

            {/* Response Viewer */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-200">Response</span>
                  {apiStatus !== null && (
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        apiStatus >= 200 && apiStatus < 300
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : apiStatus >= 400 && apiStatus < 500
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      HTTP {apiStatus}
                    </span>
                  )}
                  {apiLatency !== null && (
                    <span className="text-xs font-mono text-slate-400">
                      Latency: <strong className="text-slate-200 tabular-nums">{apiLatency} ms</strong>
                    </span>
                  )}
                </div>

                {apiResponse && (
                  <button
                    onClick={() => handleCopyCode(JSON.stringify(apiResponse, null, 2), 'response')}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
                  >
                    {copiedFile === 'response' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy JSON
                  </button>
                )}
              </div>

              <div className="p-5">
                {apiLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-3">
                    <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
                    <span className="text-xs font-mono">Executing HTTP request against localhost...</span>
                  </div>
                ) : apiResponse ? (
                  <pre className="font-mono text-xs text-slate-200 overflow-x-auto p-4 bg-slate-900 rounded-lg border border-slate-800 leading-relaxed max-h-[500px]">
                    {JSON.stringify(apiResponse, null, 2)}
                  </pre>
                ) : (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    No request sent yet. Click &quot;Send Request&quot; or choose a preset above to test the live API.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 3: MVC CODE EXPLORER
            ========================================================= */}
        {activeTab === 'code' && (
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-indigo-400" />
                  MVC Architecture Codebase Inspector
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Inspect the complete, production-grade source code for every file with line-by-line breakdown and USN {USN_CODE} integrations.
                </p>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {PROJECT_FILES.length} Files Configured
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* File List Navigation (4 cols) */}
              <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1">
                <div className="px-3 py-2 text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  Source Files
                </div>
                <div className="space-y-0.5">
                  {PROJECT_FILES.map((file) => (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between transition-colors ${
                        selectedFile.path === file.path
                          ? 'bg-indigo-600 text-white font-semibold'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{file.path}</span>
                      <span className="text-[10px] opacity-60 uppercase">{file.language}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Viewer & Explanations (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                  {/* File Header */}
                  <div className="px-5 py-3 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono font-bold text-indigo-300">
                        {selectedFile.path}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {selectedFile.description}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyCode(selectedFile.code, selectedFile.path)}
                      className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1.5 transition-colors"
                    >
                      {copiedFile === selectedFile.path ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy File
                        </>
                      )}
                    </button>
                  </div>

                  {/* Why We Need It Banner */}
                  <div className="px-5 py-2.5 bg-indigo-950/20 border-b border-slate-800/80 text-xs text-indigo-300 flex items-start gap-2">
                    <BookOpen className="w-4 h-4 shrink-0 mt-0.5 text-indigo-400" />
                    <div>
                      <strong>Why we need this file:</strong> {selectedFile.whyNeeded}
                    </div>
                  </div>

                  {/* Code Block */}
                  <pre className="p-5 font-mono text-xs text-slate-200 overflow-x-auto bg-slate-950 leading-relaxed max-h-[500px]">
                    {selectedFile.code}
                  </pre>
                </div>

                {/* Line by line explanation */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Important Code Breakdown
                  </div>
                  <div className="space-y-2">
                    {selectedFile.lineExplanations.map((exp, idx) => (
                      <div
                        key={idx}
                        className="text-xs bg-slate-900/60 border border-slate-800/80 rounded p-2.5 flex items-start gap-3"
                      >
                        <span className="font-mono text-indigo-400 font-semibold shrink-0 text-[11px]">
                          {exp.lines}:
                        </span>
                        <span className="text-slate-300 text-[11px] leading-relaxed">
                          {exp.explanation}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: SWAGGER SPEC
            ========================================================= */}
        {activeTab === 'swagger' && (
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  Swagger &amp; OpenAPI 3.0 Documentation
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Complete interactive specification for all REST API endpoints. Author USN: {USN_CODE}.
                </p>
              </div>
              <a
                href="/backend/docs/swagger.js"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open swagger.js
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Endpoint Summary Card */}
              <div className="border border-slate-800 rounded-xl bg-slate-950 p-5 space-y-3">
                <div className="text-xs font-mono text-indigo-400 font-semibold uppercase">1. Auth Endpoints</div>
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900">
                    <span className="text-emerald-400 font-bold">POST</span>
                    <span className="text-slate-300">/api/auth/register</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900">
                    <span className="text-emerald-400 font-bold">POST</span>
                    <span className="text-slate-300">/api/auth/login</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900">
                    <span className="text-blue-400 font-bold">GET</span>
                    <span className="text-slate-300">/api/auth/me</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900">
                    <span className="text-amber-400 font-bold">PUT</span>
                    <span className="text-slate-300">/api/auth/update-profile</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900">
                    <span className="text-amber-400 font-bold">PUT</span>
                    <span className="text-slate-300">/api/auth/change-password</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900">
                    <span className="text-emerald-400 font-bold">POST</span>
                    <span className="text-slate-300">/api/auth/forgot-password</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900">
                    <span className="text-emerald-400 font-bold">POST</span>
                    <span className="text-slate-300">/api/auth/reset-password</span>
                  </div>
                </div>
              </div>

              {/* Students Endpoints */}
              <div className="border border-slate-800 rounded-xl bg-slate-950 p-5 space-y-3">
                <div className="text-xs font-mono text-indigo-400 font-semibold uppercase">2. Student Endpoints</div>
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900">
                    <span className="text-blue-400 font-bold">GET</span>
                    <span className="text-slate-300">/api/students</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900">
                    <span className="text-emerald-400 font-bold">POST</span>
                    <span className="text-slate-300">/api/students (Admin)</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900">
                    <span className="text-blue-400 font-bold">GET</span>
                    <span className="text-slate-300">/api/students/:id</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900">
                    <span className="text-amber-400 font-bold">PUT</span>
                    <span className="text-slate-300">/api/students/:id (Admin)</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900">
                    <span className="text-purple-400 font-bold">PATCH</span>
                    <span className="text-slate-300">/api/students/:id (Admin)</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900">
                    <span className="text-rose-400 font-bold">DELETE</span>
                    <span className="text-slate-300">/api/students/:id (Admin)</span>
                  </div>
                </div>
              </div>

              {/* Users Endpoints */}
              <div className="border border-slate-800 rounded-xl bg-slate-950 p-5 space-y-3">
                <div className="text-xs font-mono text-indigo-400 font-semibold uppercase">3. User Endpoints (Admin)</div>
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900">
                    <span className="text-blue-400 font-bold">GET</span>
                    <span className="text-slate-300">/api/users</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900">
                    <span className="text-blue-400 font-bold">GET</span>
                    <span className="text-slate-300">/api/users/:id</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900">
                    <span className="text-amber-400 font-bold">PUT</span>
                    <span className="text-slate-300">/api/users/:id</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-slate-900">
                    <span className="text-rose-400 font-bold">DELETE</span>
                    <span className="text-slate-300">/api/users/:id</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Schema Models View */}
            <div className="border border-slate-800 rounded-xl bg-slate-950 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-white">Database Schema Models</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-xs space-y-2">
                  <div className="text-indigo-400 font-bold">Student Schema</div>
                  <pre className="text-slate-300 leading-relaxed overflow-x-auto">
{`{
  name: String (required, 2-80 chars),
  usn: String (unique, e.g. "1NH23CS106"),
  email: String (unique, valid email),
  age: Number (16-70),
  gender: Enum ("Male", "Female", "Other"),
  phone: String (valid format),
  course: Enum (Accredited degree list),
  address: String (max 200 chars),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}`}
                  </pre>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-xs space-y-2">
                  <div className="text-indigo-400 font-bold">User Schema</div>
                  <pre className="text-slate-300 leading-relaxed overflow-x-auto">
{`{
  name: String (required),
  email: String (unique, indexed),
  password: String (hashed via bcrypt, select: false),
  role: Enum ("admin", "user", default: "user"),
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: Date,
  updatedAt: Date
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 5: INTERVIEW Q&A
            ========================================================= */}
        {activeTab === 'interview' && (
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                Backend Developer Technical Interview Questions &amp; Answers
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Common questions asked in Node.js, Express, and MongoDB backend engineering interviews based on this project.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-2">
                <h3 className="text-sm font-semibold text-indigo-300">
                  Q1: Why do we use bcrypt with salting instead of simple SHA256 or MD5 for passwords?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> MD5 and SHA256 are fast general-purpose cryptographic hashing functions designed for message verification, making them extremely susceptible to brute-force and pre-computed rainbow table attacks. <code className="text-indigo-300">bcrypt</code> uses an adaptive work factor (salt rounds), where each round doubles computational cost. The random salt ensures identical passwords result in completely different hashes, mitigating rainbow table attacks entirely.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-2">
                <h3 className="text-sm font-semibold text-indigo-300">
                  Q2: What is the purpose of asyncHandler in Express controllers?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> By default in Express 4, unhandled promise rejections inside asynchronous routes do not automatically get passed to the error-handling middleware, potentially hanging the request or terminating the process. <code className="text-indigo-300">asyncHandler</code> is a higher-order function that wraps async controllers and automatically forwards rejected promises to <code className="text-indigo-300">next(error)</code>, eliminating repetitive try-catch blocks across every controller.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-2">
                <h3 className="text-sm font-semibold text-indigo-300">
                  Q3: How does JWT authentication work, and why is it stateless?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> A JSON Web Token consists of three parts: Header, Payload, and Signature. Upon login, the server signs the payload using a secret key (<code className="text-indigo-300">JWT_SECRET</code>). The client stores this token and passes it in the <code className="text-indigo-300">Authorization: Bearer &lt;token&gt;</code> header on subsequent requests. Because the server verifies token authenticity cryptographically rather than querying a session database on every request, it is completely stateless and horizontally scalable across multiple server instances.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-2">
                <h3 className="text-sm font-semibold text-indigo-300">
                  Q4: How do you prevent users from escalating their privileges to &quot;admin&quot; through the profile update endpoint?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> In <code className="text-indigo-300">updateProfile</code>, we strictly whitelist permissible fields (e.g., <code className="text-indigo-300">name</code> and <code className="text-indigo-300">email</code>) and reject or discard any incoming <code className="text-indigo-300">role</code> field with a 403 Forbidden response. Role changes must only be permitted via dedicated administrative routes protected by <code className="text-indigo-300">authorize('admin')</code>.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-2">
                <h3 className="text-sm font-semibold text-indigo-300">
                  Q5: How does skip-and-limit pagination work in MongoDB, and what are its performance considerations?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> Skip is calculated as <code className="text-indigo-300">(page - 1) * limit</code>. Mongoose executes <code className="text-indigo-300">Student.find().skip(skip).limit(limit)</code>. For small to medium collections, this is intuitive and supports jumping to arbitrary page numbers. For massive datasets (millions of records), cursor-based pagination (using <code className="text-indigo-300">_id &gt; lastSeenId</code> with an indexed field) is preferred to avoid scanning through all preceding documents.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-3 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
        <div>
          Student Management System REST API · Academic Project · Author USN: <span className="font-mono text-indigo-400 font-semibold">{USN_CODE}</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Node.js / Express</span>
          <span aria-hidden="true">·</span>
          <span>MongoDB / Mongoose</span>
          <span aria-hidden="true">·</span>
          <span>JWT RBAC</span>
        </div>
      </footer>
    </div>
  );
}
