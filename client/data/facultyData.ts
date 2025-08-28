// Faculty data with predefined credentials and details
export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  facultyId: string;
  role: "HOD" | "Faculty" | "Admin";
  defaultPassword: string;
  email: string;
  phone: string;
  department: string;
  specialization: string;
  experience: number;
  qualification: string;
  canChangePassword: boolean;
}

export const facultyDatabase: FacultyMember[] = [
  {
    id: "1",
    name: "Dr. V. Srinivas",
    designation: "HOD",
    facultyId: "AIDS-HVS1",
    role: "HOD",
    defaultPassword: "@VSrinivas231",
    email: "vsrinivas@vignan.ac.in",
    phone: "+91 9876543201",
    department: "AI & Data Science",
    specialization: "Machine Learning, Deep Learning",
    experience: 15,
    qualification: "Ph.D in Computer Science",
    canChangePassword: true
  },
  {
    id: "2",
    name: "Dr. N. Murali Krishna",
    designation: "Associate Prof.",
    facultyId: "AIDS-ANK1",
    role: "Faculty",
    defaultPassword: "@NMKrishna342",
    email: "nmkrishna@vignan.ac.in",
    phone: "+91 9876543202",
    department: "AI & Data Science",
    specialization: "Data Mining, Big Data Analytics",
    experience: 12,
    qualification: "Ph.D in Computer Science",
    canChangePassword: true
  },
  {
    id: "3",
    name: "Dr. B. Ramakrishna",
    designation: "Associate Prof.",
    facultyId: "AIDS-ABR1",
    role: "Faculty",
    defaultPassword: "@BRamakrishna189",
    email: "bramakrishna@vignan.ac.in",
    phone: "+91 9876543203",
    department: "AI & Data Science",
    specialization: "Computer Vision, Image Processing",
    experience: 10,
    qualification: "Ph.D in Electronics",
    canChangePassword: true
  },
  {
    id: "4",
    name: "Mr. S. Ramana Reddy",
    designation: "Asst. Prof.",
    facultyId: "AIDS-PSRR1",
    role: "Faculty",
    defaultPassword: "@SRReddy583",
    email: "sramana@vignan.ac.in",
    phone: "+91 9876543204",
    department: "AI & Data Science",
    specialization: "Natural Language Processing, Python Programming",
    experience: 8,
    qualification: "M.Tech in CSE",
    canChangePassword: true
  },
  {
    id: "5",
    name: "Mrs. G. Lavanya",
    designation: "Asst. Prof.",
    facultyId: "AIDS-PGL1",
    role: "Faculty",
    defaultPassword: "@GLavanya478",
    email: "glavanya@vignan.ac.in",
    phone: "+91 9876543205",
    department: "AI & Data Science",
    specialization: "Data Structures, Algorithms",
    experience: 6,
    qualification: "M.Tech in CSE",
    canChangePassword: true
  },
  {
    id: "6",
    name: "Mr. T. Sai Lalith Prasad",
    designation: "Asst. Prof.",
    facultyId: "AIDS-PTSP1",
    role: "Faculty",
    defaultPassword: "@TSPrasad764",
    email: "tsailalith@vignan.ac.in",
    phone: "+91 9876543206",
    department: "AI & Data Science",
    specialization: "Database Systems, Web Technologies",
    experience: 5,
    qualification: "M.Tech in CSE",
    canChangePassword: true
  },
  {
    id: "7",
    name: "Mrs. R. Yamini",
    designation: "Asst. Prof.",
    facultyId: "AIDS-PRY1",
    role: "Faculty",
    defaultPassword: "@RYamini225",
    email: "ryamini@vignan.ac.in",
    phone: "+91 9876543207",
    department: "AI & Data Science",
    specialization: "Statistics, Mathematics for AI",
    experience: 4,
    qualification: "M.Sc in Statistics",
    canChangePassword: true
  },
  {
    id: "8",
    name: "Mr. CH. Naresh",
    designation: "Asst. Prof.",
    facultyId: "AIDS-PCN1",
    role: "Faculty",
    defaultPassword: "@CHNaresh611",
    email: "chnaresh@vignan.ac.in",
    phone: "+91 9876543208",
    department: "AI & Data Science",
    specialization: "Software Engineering, Project Management",
    experience: 7,
    qualification: "M.Tech in CSE",
    canChangePassword: true
  },
  {
    id: "9",
    name: "Mrs. K. Sindhuja",
    designation: "Asst. Prof.",
    facultyId: "AIDS-PKS1",
    role: "Faculty",
    defaultPassword: "@KSindhuja839",
    email: "ksindhuja@vignan.ac.in",
    phone: "+91 9876543209",
    department: "AI & Data Science",
    specialization: "Cloud Computing, IoT",
    experience: 3,
    qualification: "M.Tech in CSE",
    canChangePassword: true
  },
  {
    id: "10",
    name: "Mr. Admin User",
    designation: "System Administrator",
    facultyId: "AIDS-ADM1",
    role: "Admin",
    defaultPassword: "@Admin123",
    email: "admin@vignan.ac.in",
    phone: "+91 9876543210",
    department: "AI & Data Science",
    specialization: "System Administration, User Management",
    experience: 8,
    qualification: "M.Tech in Computer Science",
    canChangePassword: true
  }
];

// Function to authenticate faculty
export const authenticateFaculty = (facultyId: string, password: string): FacultyMember | null => {
  const faculty = facultyDatabase.find(f => f.facultyId === facultyId);
  if (faculty && faculty.defaultPassword === password) {
    return faculty;
  }
  return null;
};

// Function to update password
export const updateFacultyPassword = (facultyId: string, newPassword: string): boolean => {
  const facultyIndex = facultyDatabase.findIndex(f => f.facultyId === facultyId);
  if (facultyIndex !== -1 && facultyDatabase[facultyIndex].canChangePassword) {
    facultyDatabase[facultyIndex].defaultPassword = newPassword;
    return true;
  }
  return false;
};

// Function to get faculty by ID
export const getFacultyById = (facultyId: string): FacultyMember | null => {
  return facultyDatabase.find(f => f.facultyId === facultyId) || null;
};

// Function to get all faculty
export const getAllFaculty = (): FacultyMember[] => {
  return facultyDatabase;
};

// Function to get faculty by role
export const getFacultyByRole = (role: "HOD" | "Faculty" | "Admin"): FacultyMember[] => {
  return facultyDatabase.filter(f => f.role === role);
};

export default facultyDatabase;
