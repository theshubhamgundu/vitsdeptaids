import { RequestHandler } from "express";

// Mock student data
const mockStudents = [
  {
    id: "1",
    hallTicket: "20AI001",
    fullName: "Rahul Sharma",
    email: "rahul.sharma@vignanits.ac.in",
    phone: "+91 9876543210",
    year: 3,
    branch: "AI & DS",
    semester: 6,
    cgpa: 8.45,
    attendance: 88,
    address: "123 Tech Street, Hyderabad, Telangana 500001",
    emergencyContact: "+91 9876543211",
    status: "Active",
    admissionDate: "2021-08-01"
  },
  {
    id: "2", 
    hallTicket: "20AI002",
    fullName: "Priya Reddy",
    email: "priya.reddy@vignanits.ac.in",
    phone: "+91 9876543212",
    year: 3,
    branch: "AI & DS", 
    semester: 6,
    cgpa: 8.75,
    attendance: 92,
    address: "456 Data Lane, Hyderabad, Telangana 500002",
    emergencyContact: "+91 9876543213",
    status: "Active",
    admissionDate: "2021-08-01"
  },
  {
    id: "3",
    hallTicket: "20AI003", 
    fullName: "Arjun Kumar",
    email: "arjun.kumar@vignanits.ac.in",
    phone: "+91 9876543214",
    year: 2,
    branch: "AI & DS",
    semester: 4,
    cgpa: 7.85,
    attendance: 78,
    address: "789 ML Boulevard, Hyderabad, Telangana 500003", 
    emergencyContact: "+91 9876543215",
    status: "Active",
    admissionDate: "2022-08-01"
  }
];

interface StudentFilters {
  year?: string;
  branch?: string;
  status?: string;
  search?: string;
}

export const handleGetStudents: RequestHandler = (req, res) => {
  try {
    const { year, branch, status, search } = req.query as StudentFilters;
    
    let filteredStudents = [...mockStudents];

    // Apply filters
    if (year) {
      filteredStudents = filteredStudents.filter(s => s.year.toString() === year);
    }
    
    if (branch) {
      filteredStudents = filteredStudents.filter(s => s.branch === branch);
    }
    
    if (status) {
      filteredStudents = filteredStudents.filter(s => s.status.toLowerCase() === status.toLowerCase());
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredStudents = filteredStudents.filter(s => 
        s.fullName.toLowerCase().includes(searchLower) ||
        s.hallTicket.toLowerCase().includes(searchLower) ||
        s.email.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      data: filteredStudents,
      total: filteredStudents.length
    });
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const handleGetStudent: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const student = mockStudents.find(s => s.id === id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error("Get student error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const handleGetStudentAnalysis: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const student = mockStudents.find(s => s.id === id);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Mock analysis data
    const analysisData = {
      studentId: id,
      academicPerformance: {
        cgpa: student.cgpa,
        semesterWise: [
          { semester: 1, cgpa: 8.2 },
          { semester: 2, cgpa: 8.1 },
          { semester: 3, cgpa: 8.3 },
          { semester: 4, cgpa: 8.5 },
          { semester: 5, cgpa: 8.6 },
          { semester: 6, cgpa: 8.45 }
        ],
        subjectWise: [
          { subject: "Machine Learning", marks: 85, grade: "A" },
          { subject: "Data Structures", marks: 88, grade: "A" },
          { subject: "Database Systems", marks: 82, grade: "A" },
          { subject: "Computer Networks", marks: 78, grade: "B+" }
        ]
      },
      attendance: {
        overall: student.attendance,
        subjectWise: [
          { subject: "Machine Learning", percentage: 90 },
          { subject: "Data Structures", percentage: 85 },
          { subject: "Database Systems", percentage: 88 },
          { subject: "Computer Networks", percentage: 82 }
        ],
        monthlyTrend: [85, 87, 88, 90, 88, 87]
      },
      certificates: {
        approved: 3,
        pending: 1,
        rejected: 0,
        list: [
          { title: "AWS Cloud Practitioner", status: "approved" },
          { title: "Google Data Analytics", status: "approved" },
          { title: "Machine Learning Certification", status: "pending" }
        ]
      },
      achievements: [
        { title: "Best Project Award", year: "2024" },
        { title: "Hackathon Winner", year: "2023" }
      ],
      leaveHistory: [
        { type: "Medical", days: 2, status: "approved", date: "2024-01-15" },
        { type: "Personal", days: 1, status: "approved", date: "2024-02-20" }
      ],
      riskFactors: [
        ...(student.attendance < 75 ? [{ type: "attendance", severity: "high", message: "Low attendance" }] : []),
        ...(student.cgpa < 6.0 ? [{ type: "academic", severity: "high", message: "Low CGPA" }] : [])
      ],
      recommendations: [
        "Maintain excellent academic performance",
        "Consider participating in more technical competitions"
      ]
    };

    res.json({
      success: true,
      data: analysisData
    });
  } catch (error) {
    console.error("Get student analysis error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const handleGetStudentStats: RequestHandler = (req, res) => {
  try {
    const stats = {
      total: mockStudents.length,
      byYear: {
        1: mockStudents.filter(s => s.year === 1).length,
        2: mockStudents.filter(s => s.year === 2).length,
        3: mockStudents.filter(s => s.year === 3).length,
        4: mockStudents.filter(s => s.year === 4).length
      },
      byStatus: {
        active: mockStudents.filter(s => s.status === "Active").length,
        inactive: mockStudents.filter(s => s.status === "Inactive").length
      },
      averageCgpa: mockStudents.reduce((sum, s) => sum + s.cgpa, 0) / mockStudents.length,
      averageAttendance: mockStudents.reduce((sum, s) => sum + s.attendance, 0) / mockStudents.length
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Get student stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
