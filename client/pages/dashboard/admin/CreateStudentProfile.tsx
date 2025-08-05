import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  User,
  Save,
  X,
  Camera,
  GraduationCap,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Plus,
} from "lucide-react";

const CreateStudentProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [formErrors, setFormErrors] = useState({});

  const [studentData, setStudentData] = useState({
    personal: {
      firstName: "",
      lastName: "",
      hallTicket: "",
      dateOfBirth: "",
      gender: "",
      bloodGroup: "",
      nationality: "Indian",
      religion: "",
      caste: "",
      category: "General",
      profilePhoto: null,
    },
    academic: {
      admissionYear: "",
      admissionDate: "",
      branch: "AI & DS",
      year: "1",
      semester: "1",
      section: "A",
      admissionType: "Management",
      quota: "Management",
      previousEducation: {
        tenthBoard: "",
        tenthSchool: "",
        tenthMarks: "",
        tenthYear: "",
        twelfthBoard: "",
        twelfthCollege: "",
        twelfthMarks: "",
        twelfthYear: "",
        twelfthStream: "Science",
      },
      entrance: {
        examName: "",
        rank: "",
        score: "",
        category: "",
      },
    },
    contact: {
      personalEmail: "",
      collegeEmail: "",
      mobileNumber: "",
      whatsappNumber: "",
      alternateNumber: "",
      permanentAddress: "",
      temporaryAddress: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    family: {
      fatherName: "",
      fatherOccupation: "",
      fatherMobile: "",
      fatherEmail: "",
      motherName: "",
      motherOccupation: "",
      motherMobile: "",
      motherEmail: "",
      guardianName: "",
      guardianRelation: "",
      guardianMobile: "",
      guardianEmail: "",
      familyIncome: "",
      siblingDetails: "",
    },
    financial: {
      feeType: "Regular",
      scholarship: "No",
      scholarshipDetails: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      accountHolderName: "",
      hostelRequired: "No",
      transportRequired: "No",
    },
    documents: {
      aadharNumber: "",
      panNumber: "",
      passportNumber: "",
      tenthCertificate: null,
      twelfthCertificate: null,
      transferCertificate: null,
      birthCertificate: null,
      casteCertificate: null,
      incomeCertificate: null,
      photographs: null,
    },
  });

  const years = ["1", "2", "3", "4"];
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const sections = ["A", "B", "C", "D"];
  const branches = ["AI & DS", "CSE", "ECE", "EEE", "MECH", "CIVIL"];
  const genders = ["Male", "Female", "Other"];
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const categories = ["General", "OBC", "SC", "ST", "EWS"];
  const admissionTypes = ["Management", "EAMCET", "JEE", "Other"];

  const handleInputChange = (section, field, value) => {
    setStudentData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNestedInputChange = (section, subsection, field, value) => {
    setStudentData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value,
        },
      },
    }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange("personal", "profilePhoto", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (section, field, event) => {
    const file = event.target.files[0];
    if (file) {
      handleInputChange(section, field, file);
    }
  };

  const generateHallTicket = () => {
    const year = studentData.academic.admissionYear.slice(-2);
    const branch = studentData.academic.branch.replace(/[^A-Z]/g, "");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${year}${branch}${random}`;
  };

  const generateCollegeEmail = () => {
    const firstName = studentData.personal.firstName.toLowerCase();
    const lastName = studentData.personal.lastName.toLowerCase();
    const hallTicket = studentData.personal.hallTicket.toLowerCase();
    return `${firstName}.${lastName}@vignanits.ac.in`;
  };

  const validateForm = () => {
    const errors = {};

    // Validate required fields
    if (!studentData.personal.firstName)
      errors.firstName = "First name is required";
    if (!studentData.personal.lastName)
      errors.lastName = "Last name is required";
    if (!studentData.personal.dateOfBirth)
      errors.dateOfBirth = "Date of birth is required";
    if (!studentData.contact.mobileNumber)
      errors.mobileNumber = "Mobile number is required";
    if (!studentData.contact.personalEmail)
      errors.personalEmail = "Personal email is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      alert("Please fill all required fields");
      return;
    }

    // Generate hall ticket if not provided
    let updatedStudentData = { ...studentData };
    if (!updatedStudentData.personal.hallTicket) {
      const hallTicket = generateHallTicket();
      updatedStudentData.personal.hallTicket = hallTicket;
    }

    // Generate college email if not provided
    if (!updatedStudentData.contact.collegeEmail) {
      const collegeEmail = generateCollegeEmail();
      updatedStudentData.contact.collegeEmail = collegeEmail;
    }

    // Create student user object for authentication
    const studentUser = {
      id: updatedStudentData.personal.hallTicket,
      name: `${updatedStudentData.personal.firstName} ${updatedStudentData.personal.lastName}`,
      email: updatedStudentData.contact.personalEmail,
      role: "student",
      hallTicket: updatedStudentData.personal.hallTicket,
      year: `${updatedStudentData.academic.year}${getOrdinalSuffix(updatedStudentData.academic.year)} Year`,
      section: updatedStudentData.academic.section,
      branch: updatedStudentData.academic.branch,
    };

    // Store in localStorage for demo purposes (in real app, save to database)
    try {
      // Get existing students or create new array
      const existingStudents = JSON.parse(
        localStorage.getItem("students") || "[]",
      );
      existingStudents.push({
        ...updatedStudentData,
        id: updatedStudentData.personal.hallTicket,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("students", JSON.stringify(existingStudents));

      // Also store user for authentication
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      existingUsers.push(studentUser);
      localStorage.setItem("users", JSON.stringify(existingUsers));

      console.log("Student Profile Data:", updatedStudentData);
      alert(
        "Student profile created successfully! Student can now login with their hall ticket and email.",
      );

      // Reset form
      setStudentData({
        personal: {
          firstName: "",
          lastName: "",
          hallTicket: "",
          dateOfBirth: "",
          gender: "",
          bloodGroup: "",
          nationality: "Indian",
          religion: "",
          caste: "",
          category: "General",
          profilePhoto: null,
        },
        academic: {
          admissionYear: "",
          admissionDate: "",
          branch: "AI & DS",
          year: "1",
          semester: "1",
          section: "A",
          admissionType: "Management",
          quota: "Management",
          previousEducation: {
            tenthBoard: "",
            tenthSchool: "",
            tenthMarks: "",
            tenthYear: "",
            twelfthBoard: "",
            twelfthCollege: "",
            twelfthMarks: "",
            twelfthYear: "",
            twelfthStream: "Science",
          },
          entrance: {
            examName: "",
            rank: "",
            score: "",
            category: "",
          },
        },
        contact: {
          personalEmail: "",
          collegeEmail: "",
          mobileNumber: "",
          whatsappNumber: "",
          alternateNumber: "",
          permanentAddress: "",
          temporaryAddress: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
        },
        family: {
          fatherName: "",
          fatherOccupation: "",
          fatherMobile: "",
          fatherEmail: "",
          motherName: "",
          motherOccupation: "",
          motherMobile: "",
          motherEmail: "",
          guardianName: "",
          guardianRelation: "",
          guardianMobile: "",
          guardianEmail: "",
          familyIncome: "",
          siblingDetails: "",
        },
        financial: {
          feeType: "Regular",
          scholarship: "No",
          scholarshipDetails: "",
          bankName: "",
          accountNumber: "",
          ifscCode: "",
          accountHolderName: "",
          hostelRequired: "No",
          transportRequired: "No",
        },
        documents: {
          aadharNumber: "",
          panNumber: "",
          passportNumber: "",
          tenthCertificate: null,
          twelfthCertificate: null,
          transferCertificate: null,
          birthCertificate: null,
          casteCertificate: null,
          incomeCertificate: null,
          photographs: null,
        },
      });
    } catch (error) {
      console.error("Error saving student profile:", error);
      alert("Error creating student profile. Please try again.");
    }
  };

  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j == 1 && k != 11) {
      return "st";
    }
    if (j == 2 && k != 12) {
      return "nd";
    }
    if (j == 3 && k != 13) {
      return "rd";
    }
    return "th";
  };

  return (
    <DashboardLayout userType="admin" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create Student Profile
            </h1>
            <p className="text-gray-600">Add a new student to the system</p>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Create Profile
            </Button>
            <Button variant="outline">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="family">Family</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>
                  Basic personal details of the student
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center overflow-hidden">
                      {studentData.personal.profilePhoto ? (
                        <img
                          src={studentData.personal.profilePhoto}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-white" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 border cursor-pointer">
                      <Camera className="h-4 w-4 text-gray-600" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Profile Photo</h3>
                    <p className="text-gray-600 text-sm">
                      Upload student's profile picture
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={studentData.personal.firstName}
                      onChange={(e) =>
                        handleInputChange(
                          "personal",
                          "firstName",
                          e.target.value,
                        )
                      }
                      className={formErrors.firstName ? "border-red-500" : ""}
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={studentData.personal.lastName}
                      onChange={(e) =>
                        handleInputChange(
                          "personal",
                          "lastName",
                          e.target.value,
                        )
                      }
                      className={formErrors.lastName ? "border-red-500" : ""}
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.lastName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="hallTicket">
                      Hall Ticket (Auto-generated)
                    </Label>
                    <Input
                      id="hallTicket"
                      value={studentData.personal.hallTicket}
                      onChange={(e) =>
                        handleInputChange(
                          "personal",
                          "hallTicket",
                          e.target.value,
                        )
                      }
                      placeholder="Will be auto-generated"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={studentData.personal.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange(
                          "personal",
                          "dateOfBirth",
                          e.target.value,
                        )
                      }
                      className={formErrors.dateOfBirth ? "border-red-500" : ""}
                    />
                    {formErrors.dateOfBirth && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.dateOfBirth}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={studentData.personal.gender}
                      onValueChange={(value) =>
                        handleInputChange("personal", "gender", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genders.map((gender) => (
                          <SelectItem key={gender} value={gender}>
                            {gender}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select
                      value={studentData.personal.bloodGroup}
                      onValueChange={(value) =>
                        handleInputChange("personal", "bloodGroup", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodGroups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      value={studentData.personal.nationality}
                      onChange={(e) =>
                        handleInputChange(
                          "personal",
                          "nationality",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="religion">Religion</Label>
                    <Input
                      id="religion"
                      value={studentData.personal.religion}
                      onChange={(e) =>
                        handleInputChange(
                          "personal",
                          "religion",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={studentData.personal.category}
                      onValueChange={(value) =>
                        handleInputChange("personal", "category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Academic Information */}
          <TabsContent value="academic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5" />
                  <span>Academic Information</span>
                </CardTitle>
                <CardDescription>
                  Current academic details and admission information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="admissionYear">Admission Year</Label>
                    <Input
                      id="admissionYear"
                      type="number"
                      value={studentData.academic.admissionYear}
                      onChange={(e) =>
                        handleInputChange(
                          "academic",
                          "admissionYear",
                          e.target.value,
                        )
                      }
                      placeholder="2024"
                    />
                  </div>

                  <div>
                    <Label htmlFor="admissionDate">Admission Date</Label>
                    <Input
                      id="admissionDate"
                      type="date"
                      value={studentData.academic.admissionDate}
                      onChange={(e) =>
                        handleInputChange(
                          "academic",
                          "admissionDate",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="branch">Branch</Label>
                    <Select
                      value={studentData.academic.branch}
                      onValueChange={(value) =>
                        handleInputChange("academic", "branch", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch} value={branch}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="year">Current Year</Label>
                    <Select
                      value={studentData.academic.year}
                      onValueChange={(value) =>
                        handleInputChange("academic", "year", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="semester">Current Semester</Label>
                    <Select
                      value={studentData.academic.semester}
                      onValueChange={(value) =>
                        handleInputChange("academic", "semester", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((semester) => (
                          <SelectItem key={semester} value={semester}>
                            {semester}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="section">Section</Label>
                    <Select
                      value={studentData.academic.section}
                      onValueChange={(value) =>
                        handleInputChange("academic", "section", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        {sections.map((section) => (
                          <SelectItem key={section} value={section}>
                            {section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="admissionType">Admission Type</Label>
                    <Select
                      value={studentData.academic.admissionType}
                      onValueChange={(value) =>
                        handleInputChange("academic", "admissionType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select admission type" />
                      </SelectTrigger>
                      <SelectContent>
                        {admissionTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Previous Education */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Previous Education</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">10th Class Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tenthBoard">Board</Label>
                          <Input
                            id="tenthBoard"
                            value={
                              studentData.academic.previousEducation.tenthBoard
                            }
                            onChange={(e) =>
                              handleNestedInputChange(
                                "academic",
                                "previousEducation",
                                "tenthBoard",
                                e.target.value,
                              )
                            }
                            placeholder="CBSE/ICSE/State Board"
                          />
                        </div>
                        <div>
                          <Label htmlFor="tenthSchool">School Name</Label>
                          <Input
                            id="tenthSchool"
                            value={
                              studentData.academic.previousEducation.tenthSchool
                            }
                            onChange={(e) =>
                              handleNestedInputChange(
                                "academic",
                                "previousEducation",
                                "tenthSchool",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="tenthMarks">Marks/Percentage</Label>
                          <Input
                            id="tenthMarks"
                            value={
                              studentData.academic.previousEducation.tenthMarks
                            }
                            onChange={(e) =>
                              handleNestedInputChange(
                                "academic",
                                "previousEducation",
                                "tenthMarks",
                                e.target.value,
                              )
                            }
                            placeholder="95%"
                          />
                        </div>
                        <div>
                          <Label htmlFor="tenthYear">Year of Passing</Label>
                          <Input
                            id="tenthYear"
                            type="number"
                            value={
                              studentData.academic.previousEducation.tenthYear
                            }
                            onChange={(e) =>
                              handleNestedInputChange(
                                "academic",
                                "previousEducation",
                                "tenthYear",
                                e.target.value,
                              )
                            }
                            placeholder="2020"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">12th Class Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="twelfthBoard">Board</Label>
                          <Input
                            id="twelfthBoard"
                            value={
                              studentData.academic.previousEducation
                                .twelfthBoard
                            }
                            onChange={(e) =>
                              handleNestedInputChange(
                                "academic",
                                "previousEducation",
                                "twelfthBoard",
                                e.target.value,
                              )
                            }
                            placeholder="CBSE/ICSE/State Board"
                          />
                        </div>
                        <div>
                          <Label htmlFor="twelfthCollege">College Name</Label>
                          <Input
                            id="twelfthCollege"
                            value={
                              studentData.academic.previousEducation
                                .twelfthCollege
                            }
                            onChange={(e) =>
                              handleNestedInputChange(
                                "academic",
                                "previousEducation",
                                "twelfthCollege",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="twelfthMarks">Marks/Percentage</Label>
                          <Input
                            id="twelfthMarks"
                            value={
                              studentData.academic.previousEducation
                                .twelfthMarks
                            }
                            onChange={(e) =>
                              handleNestedInputChange(
                                "academic",
                                "previousEducation",
                                "twelfthMarks",
                                e.target.value,
                              )
                            }
                            placeholder="95%"
                          />
                        </div>
                        <div>
                          <Label htmlFor="twelfthYear">Year of Passing</Label>
                          <Input
                            id="twelfthYear"
                            type="number"
                            value={
                              studentData.academic.previousEducation.twelfthYear
                            }
                            onChange={(e) =>
                              handleNestedInputChange(
                                "academic",
                                "previousEducation",
                                "twelfthYear",
                                e.target.value,
                              )
                            }
                            placeholder="2022"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Entrance Exam Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Entrance Exam Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <Label htmlFor="examName">Exam Name</Label>
                      <Input
                        id="examName"
                        value={studentData.academic.entrance.examName}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "academic",
                            "entrance",
                            "examName",
                            e.target.value,
                          )
                        }
                        placeholder="EAMCET/JEE"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rank">Rank</Label>
                      <Input
                        id="rank"
                        type="number"
                        value={studentData.academic.entrance.rank}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "academic",
                            "entrance",
                            "rank",
                            e.target.value,
                          )
                        }
                        placeholder="1234"
                      />
                    </div>
                    <div>
                      <Label htmlFor="score">Score</Label>
                      <Input
                        id="score"
                        value={studentData.academic.entrance.score}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "academic",
                            "entrance",
                            "score",
                            e.target.value,
                          )
                        }
                        placeholder="150/200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="examCategory">Category</Label>
                      <Input
                        id="examCategory"
                        value={studentData.academic.entrance.category}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "academic",
                            "entrance",
                            "category",
                            e.target.value,
                          )
                        }
                        placeholder="General/OBC/SC/ST"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Information */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Contact Information</span>
                </CardTitle>
                <CardDescription>
                  Contact details and address information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="personalEmail">Personal Email *</Label>
                    <Input
                      id="personalEmail"
                      type="email"
                      value={studentData.contact.personalEmail}
                      onChange={(e) =>
                        handleInputChange(
                          "contact",
                          "personalEmail",
                          e.target.value,
                        )
                      }
                      className={
                        formErrors.personalEmail ? "border-red-500" : ""
                      }
                      placeholder="student@gmail.com"
                    />
                    {formErrors.personalEmail && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.personalEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="collegeEmail">
                      College Email (Auto-generated)
                    </Label>
                    <Input
                      id="collegeEmail"
                      type="email"
                      value={studentData.contact.collegeEmail}
                      onChange={(e) =>
                        handleInputChange(
                          "contact",
                          "collegeEmail",
                          e.target.value,
                        )
                      }
                      placeholder="Will be auto-generated"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mobileNumber">Mobile Number *</Label>
                    <Input
                      id="mobileNumber"
                      value={studentData.contact.mobileNumber}
                      onChange={(e) =>
                        handleInputChange(
                          "contact",
                          "mobileNumber",
                          e.target.value,
                        )
                      }
                      className={
                        formErrors.mobileNumber ? "border-red-500" : ""
                      }
                      placeholder="+91 9876543210"
                    />
                    {formErrors.mobileNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {formErrors.mobileNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                    <Input
                      id="whatsappNumber"
                      value={studentData.contact.whatsappNumber}
                      onChange={(e) =>
                        handleInputChange(
                          "contact",
                          "whatsappNumber",
                          e.target.value,
                        )
                      }
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div>
                    <Label htmlFor="alternateNumber">Alternate Number</Label>
                    <Input
                      id="alternateNumber"
                      value={studentData.contact.alternateNumber}
                      onChange={(e) =>
                        handleInputChange(
                          "contact",
                          "alternateNumber",
                          e.target.value,
                        )
                      }
                      placeholder="+91 9876543211"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="permanentAddress">
                        Permanent Address
                      </Label>
                      <Textarea
                        id="permanentAddress"
                        value={studentData.contact.permanentAddress}
                        onChange={(e) =>
                          handleInputChange(
                            "contact",
                            "permanentAddress",
                            e.target.value,
                          )
                        }
                        rows={3}
                        placeholder="Enter permanent address"
                      />
                    </div>

                    <div>
                      <Label htmlFor="temporaryAddress">
                        Temporary Address
                      </Label>
                      <Textarea
                        id="temporaryAddress"
                        value={studentData.contact.temporaryAddress}
                        onChange={(e) =>
                          handleInputChange(
                            "contact",
                            "temporaryAddress",
                            e.target.value,
                          )
                        }
                        rows={3}
                        placeholder="Enter temporary address (if different)"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={studentData.contact.city}
                        onChange={(e) =>
                          handleInputChange("contact", "city", e.target.value)
                        }
                        placeholder="Hyderabad"
                      />
                    </div>

                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={studentData.contact.state}
                        onChange={(e) =>
                          handleInputChange("contact", "state", e.target.value)
                        }
                        placeholder="Telangana"
                      />
                    </div>

                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        value={studentData.contact.pincode}
                        onChange={(e) =>
                          handleInputChange(
                            "contact",
                            "pincode",
                            e.target.value,
                          )
                        }
                        placeholder="500001"
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={studentData.contact.country}
                        onChange={(e) =>
                          handleInputChange(
                            "contact",
                            "country",
                            e.target.value,
                          )
                        }
                        placeholder="India"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Family Information */}
          <TabsContent value="family" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Family Information</span>
                </CardTitle>
                <CardDescription>Parents and guardian details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Father Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Father Details</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="fatherName">Father's Name</Label>
                        <Input
                          id="fatherName"
                          value={studentData.family.fatherName}
                          onChange={(e) =>
                            handleInputChange(
                              "family",
                              "fatherName",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="fatherOccupation">Occupation</Label>
                        <Input
                          id="fatherOccupation"
                          value={studentData.family.fatherOccupation}
                          onChange={(e) =>
                            handleInputChange(
                              "family",
                              "fatherOccupation",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="fatherMobile">Mobile Number</Label>
                        <Input
                          id="fatherMobile"
                          value={studentData.family.fatherMobile}
                          onChange={(e) =>
                            handleInputChange(
                              "family",
                              "fatherMobile",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="fatherEmail">Email Address</Label>
                        <Input
                          id="fatherEmail"
                          type="email"
                          value={studentData.family.fatherEmail}
                          onChange={(e) =>
                            handleInputChange(
                              "family",
                              "fatherEmail",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mother Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Mother Details</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="motherName">Mother's Name</Label>
                        <Input
                          id="motherName"
                          value={studentData.family.motherName}
                          onChange={(e) =>
                            handleInputChange(
                              "family",
                              "motherName",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="motherOccupation">Occupation</Label>
                        <Input
                          id="motherOccupation"
                          value={studentData.family.motherOccupation}
                          onChange={(e) =>
                            handleInputChange(
                              "family",
                              "motherOccupation",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="motherMobile">Mobile Number</Label>
                        <Input
                          id="motherMobile"
                          value={studentData.family.motherMobile}
                          onChange={(e) =>
                            handleInputChange(
                              "family",
                              "motherMobile",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="motherEmail">Email Address</Label>
                        <Input
                          id="motherEmail"
                          type="email"
                          value={studentData.family.motherEmail}
                          onChange={(e) =>
                            handleInputChange(
                              "family",
                              "motherEmail",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Guardian Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Guardian Details (if different from parents)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="guardianName">Guardian's Name</Label>
                      <Input
                        id="guardianName"
                        value={studentData.family.guardianName}
                        onChange={(e) =>
                          handleInputChange(
                            "family",
                            "guardianName",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="guardianRelation">Relation</Label>
                      <Input
                        id="guardianRelation"
                        value={studentData.family.guardianRelation}
                        onChange={(e) =>
                          handleInputChange(
                            "family",
                            "guardianRelation",
                            e.target.value,
                          )
                        }
                        placeholder="Uncle/Aunt/Grandparent"
                      />
                    </div>
                    <div>
                      <Label htmlFor="guardianMobile">Mobile Number</Label>
                      <Input
                        id="guardianMobile"
                        value={studentData.family.guardianMobile}
                        onChange={(e) =>
                          handleInputChange(
                            "family",
                            "guardianMobile",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="guardianEmail">Email Address</Label>
                      <Input
                        id="guardianEmail"
                        type="email"
                        value={studentData.family.guardianEmail}
                        onChange={(e) =>
                          handleInputChange(
                            "family",
                            "guardianEmail",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="familyIncome">Annual Family Income</Label>
                    <Input
                      id="familyIncome"
                      value={studentData.family.familyIncome}
                      onChange={(e) =>
                        handleInputChange(
                          "family",
                          "familyIncome",
                          e.target.value,
                        )
                      }
                      placeholder="₹5,00,000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="siblingDetails">Siblings Details</Label>
                    <Textarea
                      id="siblingDetails"
                      value={studentData.family.siblingDetails}
                      onChange={(e) =>
                        handleInputChange(
                          "family",
                          "siblingDetails",
                          e.target.value,
                        )
                      }
                      placeholder="Names, ages, and occupations of siblings"
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Information */}
          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Information</CardTitle>
                <CardDescription>
                  Fee structure and financial details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="feeType">Fee Type</Label>
                    <Select
                      value={studentData.financial.feeType}
                      onValueChange={(value) =>
                        handleInputChange("financial", "feeType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="Management">Management</SelectItem>
                        <SelectItem value="NRI">NRI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="scholarship">Scholarship</Label>
                    <Select
                      value={studentData.financial.scholarship}
                      onValueChange={(value) =>
                        handleInputChange("financial", "scholarship", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Scholarship status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="scholarshipDetails">
                      Scholarship Details
                    </Label>
                    <Input
                      id="scholarshipDetails"
                      value={studentData.financial.scholarshipDetails}
                      onChange={(e) =>
                        handleInputChange(
                          "financial",
                          "scholarshipDetails",
                          e.target.value,
                        )
                      }
                      placeholder="Scholarship name/percentage"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Bank Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={studentData.financial.bankName}
                        onChange={(e) =>
                          handleInputChange(
                            "financial",
                            "bankName",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={studentData.financial.accountNumber}
                        onChange={(e) =>
                          handleInputChange(
                            "financial",
                            "accountNumber",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="ifscCode">IFSC Code</Label>
                      <Input
                        id="ifscCode"
                        value={studentData.financial.ifscCode}
                        onChange={(e) =>
                          handleInputChange(
                            "financial",
                            "ifscCode",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountHolderName">
                        Account Holder Name
                      </Label>
                      <Input
                        id="accountHolderName"
                        value={studentData.financial.accountHolderName}
                        onChange={(e) =>
                          handleInputChange(
                            "financial",
                            "accountHolderName",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="hostelRequired">Hostel Required</Label>
                    <Select
                      value={studentData.financial.hostelRequired}
                      onValueChange={(value) =>
                        handleInputChange("financial", "hostelRequired", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Hostel requirement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="transportRequired">
                      Transport Required
                    </Label>
                    <Select
                      value={studentData.financial.transportRequired}
                      onValueChange={(value) =>
                        handleInputChange(
                          "financial",
                          "transportRequired",
                          value,
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Transport requirement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Document Upload</span>
                </CardTitle>
                <CardDescription>
                  Upload required documents and certificates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="aadharNumber">Aadhar Number</Label>
                    <Input
                      id="aadharNumber"
                      value={studentData.documents.aadharNumber}
                      onChange={(e) =>
                        handleInputChange(
                          "documents",
                          "aadharNumber",
                          e.target.value,
                        )
                      }
                      placeholder="1234 5678 9012"
                    />
                  </div>

                  <div>
                    <Label htmlFor="panNumber">PAN Number (if available)</Label>
                    <Input
                      id="panNumber"
                      value={studentData.documents.panNumber}
                      onChange={(e) =>
                        handleInputChange(
                          "documents",
                          "panNumber",
                          e.target.value,
                        )
                      }
                      placeholder="ABCDE1234F"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Document Uploads</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="tenthCertificate">10th Certificate</Label>
                      <Input
                        id="tenthCertificate"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          handleFileUpload("documents", "tenthCertificate", e)
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="twelfthCertificate">
                        12th Certificate
                      </Label>
                      <Input
                        id="twelfthCertificate"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          handleFileUpload("documents", "twelfthCertificate", e)
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="transferCertificate">
                        Transfer Certificate
                      </Label>
                      <Input
                        id="transferCertificate"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          handleFileUpload(
                            "documents",
                            "transferCertificate",
                            e,
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="birthCertificate">
                        Birth Certificate
                      </Label>
                      <Input
                        id="birthCertificate"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          handleFileUpload("documents", "birthCertificate", e)
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="casteCertificate">
                        Caste Certificate (if applicable)
                      </Label>
                      <Input
                        id="casteCertificate"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          handleFileUpload("documents", "casteCertificate", e)
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="incomeCertificate">
                        Income Certificate
                      </Label>
                      <Input
                        id="incomeCertificate"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          handleFileUpload("documents", "incomeCertificate", e)
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CreateStudentProfile;
