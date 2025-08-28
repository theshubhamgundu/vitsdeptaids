import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Briefcase,
  Phone,
  Mail,
  BookOpen,
  Award
} from "lucide-react";

const CreateFacultyProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [formErrors, setFormErrors] = useState({});

  const [facultyData, setFacultyData] = useState({
    personal: {
      firstName: "",
      lastName: "",
      employeeId: "",
      dateOfBirth: "",
      gender: "",
      bloodGroup: "",
      nationality: "Indian",
      profilePhoto: null
    },
    professional: {
      designation: "Assistant Professor",
      department: "AI & DS",
      joiningDate: "",
      experience: "",
      specializations: "",
      qualifications: "",
      previousExperience: "",
      currentSalary: "",
      employmentType: "Permanent"
    },
    contact: {
      personalEmail: "",
      collegeEmail: "",
      mobileNumber: "",
      officeMobile: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "India"
    },
    academic: {
      highestQualification: "",
      university: "",
      graduationYear: "",
      researchAreas: "",
      publications: "",
      conferences: "",
      certifications: ""
    }
  });

  const designations = ["Assistant Professor", "Associate Professor", "Professor", "HOD"];
  const departments = ["AI & DS", "CSE", "ECE", "EEE", "MECH", "CIVIL"];
  const genders = ["Male", "Female", "Other"];
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const employmentTypes = ["Permanent", "Contract", "Visiting"];

  const handleInputChange = (section: keyof typeof facultyData, field: string, value: any) => {
    setFacultyData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('personal', 'profilePhoto', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateEmployeeId = () => {
    const dept = facultyData.professional.department.replace(/[^A-Z]/g, '');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `VIT-${dept}-${random}`;
  };

  const generateCollegeEmail = () => {
    const firstName = facultyData.personal.firstName.toLowerCase();
    const lastName = facultyData.personal.lastName.toLowerCase();
    return `${firstName}.${lastName}@vignan.ac.in`;
  };

  const validateForm = () => {
    const errors = {};
    
    if (!facultyData.personal.firstName) errors.firstName = "First name is required";
    if (!facultyData.personal.lastName) errors.lastName = "Last name is required";
    if (!facultyData.contact.mobileNumber) errors.mobileNumber = "Mobile number is required";
    if (!facultyData.contact.personalEmail) errors.personalEmail = "Personal email is required";
    if (!facultyData.professional.joiningDate) errors.joiningDate = "Joining date is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      alert("Please fill all required fields");
      return;
    }

    // Generate employee ID if not provided
    if (!facultyData.personal.employeeId) {
      const employeeId = generateEmployeeId();
      setFacultyData(prev => ({
        ...prev,
        personal: { ...prev.personal, employeeId }
      }));
    }

    // Generate college email if not provided
    if (!facultyData.contact.collegeEmail) {
      const collegeEmail = generateCollegeEmail();
      setFacultyData(prev => ({
        ...prev,
        contact: { ...prev.contact, collegeEmail }
      }));
    }

    console.log("Faculty Profile Data:", facultyData);
    alert("Faculty profile created successfully!");
  };

  return (
    <DashboardLayout userType="admin" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Faculty Profile</h1>
            <p className="text-gray-600">Add a new faculty member to the system</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Create Profile
            </Button>
            <Button variant="outline">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>Basic personal details of the faculty</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center overflow-hidden">
                      {facultyData.personal.profilePhoto ? (
                        <img 
                          src={facultyData.personal.profilePhoto} 
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
                    <p className="text-gray-600 text-sm">Upload faculty's profile picture</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={facultyData.personal.firstName}
                      onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                      className={formErrors.firstName ? "border-red-500" : ""}
                    />
                    {formErrors.firstName && <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={facultyData.personal.lastName}
                      onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                      className={formErrors.lastName ? "border-red-500" : ""}
                    />
                    {formErrors.lastName && <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="employeeId">Employee ID (Auto-generated)</Label>
                    <Input
                      id="employeeId"
                      value={facultyData.personal.employeeId}
                      onChange={(e) => handleInputChange('personal', 'employeeId', e.target.value)}
                      placeholder="Will be auto-generated"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={facultyData.personal.dateOfBirth}
                      onChange={(e) => handleInputChange('personal', 'dateOfBirth', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={facultyData.personal.gender} onValueChange={(value) => handleInputChange('personal', 'gender', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genders.map(gender => (
                          <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select value={facultyData.personal.bloodGroup} onValueChange={(value) => handleInputChange('personal', 'bloodGroup', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodGroups.map(group => (
                          <SelectItem key={group} value={group}>{group}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Information */}
          <TabsContent value="professional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5" />
                  <span>Professional Information</span>
                </CardTitle>
                <CardDescription>Employment and professional details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Select value={facultyData.professional.designation} onValueChange={(value) => handleInputChange('professional', 'designation', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select designation" />
                      </SelectTrigger>
                      <SelectContent>
                        {designations.map(designation => (
                          <SelectItem key={designation} value={designation}>{designation}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select value={facultyData.professional.department} onValueChange={(value) => handleInputChange('professional', 'department', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="joiningDate">Joining Date *</Label>
                    <Input
                      id="joiningDate"
                      type="date"
                      value={facultyData.professional.joiningDate}
                      onChange={(e) => handleInputChange('professional', 'joiningDate', e.target.value)}
                      className={formErrors.joiningDate ? "border-red-500" : ""}
                    />
                    {formErrors.joiningDate && <p className="text-red-500 text-xs mt-1">{formErrors.joiningDate}</p>}
                  </div>

                  <div>
                    <Label htmlFor="experience">Total Experience</Label>
                    <Input
                      id="experience"
                      value={facultyData.professional.experience}
                      onChange={(e) => handleInputChange('professional', 'experience', e.target.value)}
                      placeholder="5 years"
                    />
                  </div>

                  <div>
                    <Label htmlFor="employmentType">Employment Type</Label>
                    <Select value={facultyData.professional.employmentType} onValueChange={(value) => handleInputChange('professional', 'employmentType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {employmentTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="currentSalary">Current Salary</Label>
                    <Input
                      id="currentSalary"
                      value={facultyData.professional.currentSalary}
                      onChange={(e) => handleInputChange('professional', 'currentSalary', e.target.value)}
                      placeholder="₹50,000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="specializations">Specializations</Label>
                    <Textarea
                      id="specializations"
                      value={facultyData.professional.specializations}
                      onChange={(e) => handleInputChange('professional', 'specializations', e.target.value)}
                      placeholder="Machine Learning, Data Science, AI"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="qualifications">Qualifications</Label>
                    <Textarea
                      id="qualifications"
                      value={facultyData.professional.qualifications}
                      onChange={(e) => handleInputChange('professional', 'qualifications', e.target.value)}
                      placeholder="Ph.D. in Computer Science, M.Tech, B.Tech"
                      rows={3}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="previousExperience">Previous Experience</Label>
                  <Textarea
                    id="previousExperience"
                    value={facultyData.professional.previousExperience}
                    onChange={(e) => handleInputChange('professional', 'previousExperience', e.target.value)}
                    placeholder="Details of previous work experience"
                    rows={3}
                  />
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
                <CardDescription>Contact details and address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="personalEmail">Personal Email *</Label>
                    <Input
                      id="personalEmail"
                      type="email"
                      value={facultyData.contact.personalEmail}
                      onChange={(e) => handleInputChange('contact', 'personalEmail', e.target.value)}
                      className={formErrors.personalEmail ? "border-red-500" : ""}
                      placeholder="faculty@gmail.com"
                    />
                    {formErrors.personalEmail && <p className="text-red-500 text-xs mt-1">{formErrors.personalEmail}</p>}
                  </div>

                  <div>
                    <Label htmlFor="collegeEmail">College Email (Auto-generated)</Label>
                    <Input
                      id="collegeEmail"
                      type="email"
                      value={facultyData.contact.collegeEmail}
                      onChange={(e) => handleInputChange('contact', 'collegeEmail', e.target.value)}
                      placeholder="Will be auto-generated"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mobileNumber">Mobile Number *</Label>
                    <Input
                      id="mobileNumber"
                      value={facultyData.contact.mobileNumber}
                      onChange={(e) => handleInputChange('contact', 'mobileNumber', e.target.value)}
                      className={formErrors.mobileNumber ? "border-red-500" : ""}
                      placeholder="+91 9876543210"
                    />
                    {formErrors.mobileNumber && <p className="text-red-500 text-xs mt-1">{formErrors.mobileNumber}</p>}
                  </div>

                  <div>
                    <Label htmlFor="officeMobile">Office Mobile</Label>
                    <Input
                      id="officeMobile"
                      value={facultyData.contact.officeMobile}
                      onChange={(e) => handleInputChange('contact', 'officeMobile', e.target.value)}
                      placeholder="+91 9876543211"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={facultyData.contact.address}
                    onChange={(e) => handleInputChange('contact', 'address', e.target.value)}
                    rows={3}
                    placeholder="Enter complete address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={facultyData.contact.city}
                      onChange={(e) => handleInputChange('contact', 'city', e.target.value)}
                      placeholder="Hyderabad"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={facultyData.contact.state}
                      onChange={(e) => handleInputChange('contact', 'state', e.target.value)}
                      placeholder="Telangana"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={facultyData.contact.pincode}
                      onChange={(e) => handleInputChange('contact', 'pincode', e.target.value)}
                      placeholder="500001"
                    />
                  </div>

                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={facultyData.contact.country}
                      onChange={(e) => handleInputChange('contact', 'country', e.target.value)}
                      placeholder="India"
                    />
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
                  <span>Academic & Research Information</span>
                </CardTitle>
                <CardDescription>Educational background and research details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="highestQualification">Highest Qualification</Label>
                    <Input
                      id="highestQualification"
                      value={facultyData.academic.highestQualification}
                      onChange={(e) => handleInputChange('academic', 'highestQualification', e.target.value)}
                      placeholder="Ph.D. in Computer Science"
                    />
                  </div>

                  <div>
                    <Label htmlFor="university">University</Label>
                    <Input
                      id="university"
                      value={facultyData.academic.university}
                      onChange={(e) => handleInputChange('academic', 'university', e.target.value)}
                      placeholder="IIT Hyderabad"
                    />
                  </div>

                  <div>
                    <Label htmlFor="graduationYear">Graduation Year</Label>
                    <Input
                      id="graduationYear"
                      type="number"
                      value={facultyData.academic.graduationYear}
                      onChange={(e) => handleInputChange('academic', 'graduationYear', e.target.value)}
                      placeholder="2015"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="researchAreas">Research Areas</Label>
                    <Textarea
                      id="researchAreas"
                      value={facultyData.academic.researchAreas}
                      onChange={(e) => handleInputChange('academic', 'researchAreas', e.target.value)}
                      placeholder="Machine Learning, Computer Vision, Natural Language Processing"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="publications">Publications</Label>
                    <Textarea
                      id="publications"
                      value={facultyData.academic.publications}
                      onChange={(e) => handleInputChange('academic', 'publications', e.target.value)}
                      placeholder="List of research publications"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="conferences">Conferences Attended</Label>
                    <Textarea
                      id="conferences"
                      value={facultyData.academic.conferences}
                      onChange={(e) => handleInputChange('academic', 'conferences', e.target.value)}
                      placeholder="International conferences and workshops attended"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="certifications">Certifications</Label>
                    <Textarea
                      id="certifications"
                      value={facultyData.academic.certifications}
                      onChange={(e) => handleInputChange('academic', 'certifications', e.target.value)}
                      placeholder="Professional certifications and courses"
                      rows={3}
                    />
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

export default CreateFacultyProfile;
