import { RequestHandler } from "express";

// Mock user data - in real app this would be from database
const mockUsers = [
  {
    id: "1",
    identifier: "20AI001",
    email: "rahul.sharma@vignanits.ac.in",
    name: "Rahul Sharma",
    role: "student",
    password: "student123" // In real app, this would be hashed
  },
  {
    id: "2", 
    identifier: "FAC001",
    email: "anita.verma@vignanits.ac.in",
    name: "Dr. Anita Verma",
    role: "faculty",
    password: "faculty123"
  },
  {
    id: "3",
    identifier: "ADMIN001", 
    email: "admin@vignanits.ac.in",
    name: "Admin User",
    role: "admin",
    password: "admin123"
  },
  {
    id: "4",
    identifier: "HOD001",
    email: "priya.sharma@vignanits.ac.in", 
    name: "Dr. Priya Sharma",
    role: "hod",
    password: "hod123"
  }
];

interface LoginRequest {
  identifier: string;
  password: string;
  role: string;
}

interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    identifier: string;
  };
  token?: string;
  message?: string;
}

export const handleLogin: RequestHandler = (req, res) => {
  try {
    const { identifier, password, role } = req.body as LoginRequest;

    if (!identifier || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      } as AuthResponse);
    }

    // Find user by identifier and role
    const user = mockUsers.find(u => 
      u.identifier === identifier && 
      u.role === role && 
      u.password === password
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      } as AuthResponse);
    }

    // In real app, generate JWT token
    const token = `mock-jwt-token-${user.id}`;

    const response: AuthResponse = {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        identifier: user.identifier
      },
      token,
      message: "Login successful"
    };

    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    } as AuthResponse);
  }
};

export const handleLogout: RequestHandler = (req, res) => {
  // In real app, invalidate token
  res.json({
    success: true,
    message: "Logout successful"
  });
};

export const handleVerifyToken: RequestHandler = (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided"
    });
  }

  // In real app, verify JWT token
  if (token.startsWith('mock-jwt-token-')) {
    const userId = token.replace('mock-jwt-token-', '');
    const user = mockUsers.find(u => u.id === userId);
    
    if (user) {
      return res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email, 
          role: user.role,
          identifier: user.identifier
        }
      });
    }
  }

  res.status(401).json({
    success: false,
    message: "Invalid token"
  });
};
