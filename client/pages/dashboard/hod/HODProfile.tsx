import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  User,
  Edit,
  Save,
  X,
  Camera,
  Award,
  BookOpen,
  Users,
  Calendar,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Building,
  Crown,
  FileText,
  Trophy,
  Target
} from "lucide-react";

const HODProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const [profileData, setProfileData] = useState({
    personal: {
      name: "Dr. Priya Sharma",
      email: "priya.sharma@vignan.ac.in",
      phone: "+91 9876543210",
      employeeId: "VIT-AIML-001",
      dateOfBirth: "1980-05-15",
      address: "123, Faculty Colony, Hyderabad, Telangana - 500032",
      emergencyContact: "+91 9876543211",
      bloodGroup: "A+",
      profilePhoto: null
    },
    professional: {
      designation: "Professor & Head of Department",
      department: "Artificial Intelligence & Data Science",
      institute: "Vignan Institute of Technology & Science",
      joiningDate: "2015-08-01",
      experience: "15+ years",
      specializations: ["Machine Learning", "Deep Learning", "Data Science", "AI Ethics"],
      currentSalary: "₹85,000",
      employmentType: "Permanent",
      officeLocation: "AI & DS Department, Room 301",
      workingHours: "9:00 AM - 5:00 PM"
    },
    academic: {
      highestQualification: "Ph.D. in Computer Science",
      university: "Indian Institute of Technology, Hyderabad",
      graduationYear: "2010",
      thesis: "Advanced Machine Learning Algorithms for Predictive Analytics",
      otherQualifications: [
        { degree: "M.Tech Computer Science", university: "JNTU Hyderabad", year: "2005" },
        { degree: "B.Tech Computer Science", university: "JNTU Hyderabad", year: "2003" }
      ],
      certifications: [
        "Google Cloud Professional ML Engineer",
        "AWS Certified Solutions Architect",
        "Microsoft Azure AI Engineer"
      ]
    },
    research: {
      publications: 45,
      hIndex: 18,
      citationCount: 1250,
      researchAreas: ["Machine Learning", "Deep Learning", "Computer Vision", "Natural Language Processing"],
      currentProjects: [
        {
          title: "AI-Driven Healthcare Analytics",
          fundingAgency: "DST, Govt. of India",
          amount: "₹25,00,000",
          duration: "2023-2026"
        },
        {
          title: "Smart City Traffic Management using ML",
          fundingAgency: "SERB",
          amount: "₹15,00,000", 
          duration: "2022-2025"
        }
      ],
      patents: [
        {
          title: "Intelligent Traffic Signal Control System",
          patentNumber: "IN 202341068",
          year: "2023"
        }
      ],
      awards: [
        {
          title: "Best Faculty Award",
          organization: "Vignan Institute",
          year: "2023"
        },
        {
          title: "Excellence in Research Award",
          organization: "AICTE",
          year: "2022"
        }
      ]
    },
    administrative: {
      currentRole: "Head of Department",
      previousRoles: [
        { role: "Professor", department: "AI & DS", duration: "2020-2024" },
        { role: "Associate Professor", department: "CSE", duration: "2017-2020" },
        { role: "Assistant Professor", department: "CSE", duration: "2015-2017" }
      ],
      committeeMemberships: [
        "Academic Council Member",
        "Board of Studies - AI & ML",
        "Research Committee Chair",
        "Industry Interface Committee"
      ],
      responsibilitiesAsHOD: [
        "Department strategic planning and execution",
        "Faculty recruitment and development",
        "Student academic progress monitoring",
        "Industry partnership and collaboration",
        "Research project coordination",
        "Budget planning and resource allocation"
      ],
      keyAchievements: [
        "Increased department placement rate to 95%",
        "Established 15+ industry partnerships",
        "Led curriculum modernization initiative",
        "Grew research funding by 200%"
      ]
    }
  });

  const [editedData, setEditedData] = useState(profileData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(profileData);
  };

  const handleSave = () => {
    setProfileData(editedData);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (section, field, value) => {
    setEditedData(prev => ({
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

  const currentData = isEditing ? editedData : profileData;

  return (
    <DashboardLayout userType="hod" userName="Dr. Priya Sharma">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">HOD Profile</h1>
            <p className="text-gray-600">Manage your professional and academic profile</p>
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <Button onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
            <TabsTrigger value="administrative">Administrative</TabsTrigger>
          </TabsList>

          {/* Personal Information */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>Basic personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo Section */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center overflow-hidden">
                      {currentData.personal.profilePhoto ? (
                        <img 
                          src={currentData.personal.profilePhoto} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Crown className="h-12 w-12 text-white" />
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 border cursor-pointer">
                        <Camera className="h-4 w-4 text-gray-600" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{currentData.personal.name}</h3>
                    <p className="text-gray-600">{currentData.professional.designation}</p>
                    <Badge className="mt-1">{currentData.professional.department}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={currentData.personal.name}
                        onChange={(e) => handleInputChange('personal', 'name', e.target.value)}
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{currentData.personal.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Employee ID</Label>
                    <p className="mt-1 text-gray-900 font-mono">{currentData.personal.employeeId}</p>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={currentData.personal.email}
                        onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                      />
                    ) : (
                      <div className="flex items-center mt-1">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{currentData.personal.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={currentData.personal.phone}
                        onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                      />
                    ) : (
                      <div className="flex items-center mt-1">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{currentData.personal.phone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    {isEditing ? (
                      <Input
                        id="dob"
                        type="date"
                        value={currentData.personal.dateOfBirth}
                        onChange={(e) => handleInputChange('personal', 'dateOfBirth', e.target.value)}
                      />
                    ) : (
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{new Date(currentData.personal.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    {isEditing ? (
                      <Input
                        id="bloodGroup"
                        value={currentData.personal.bloodGroup}
                        onChange={(e) => handleInputChange('personal', 'bloodGroup', e.target.value)}
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{currentData.personal.bloodGroup}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Textarea
                      id="address"
                      value={currentData.personal.address}
                      onChange={(e) => handleInputChange('personal', 'address', e.target.value)}
                      rows={3}
                    />
                  ) : (
                    <div className="flex items-start mt-1">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                      <span>{currentData.personal.address}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  {isEditing ? (
                    <Input
                      id="emergencyContact"
                      value={currentData.personal.emergencyContact}
                      onChange={(e) => handleInputChange('personal', 'emergencyContact', e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center mt-1">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{currentData.personal.emergencyContact}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Information */}
          <TabsContent value="professional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="h-5 w-5" />
                  <span>Professional Information</span>
                </CardTitle>
                <CardDescription>Current position and professional details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Designation</Label>
                    <p className="mt-1 text-gray-900 font-semibold">{currentData.professional.designation}</p>
                  </div>
                  
                  <div>
                    <Label>Department</Label>
                    <p className="mt-1 text-gray-900">{currentData.professional.department}</p>
                  </div>

                  <div>
                    <Label>Institute</Label>
                    <div className="flex items-center mt-1">
                      <Building className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{currentData.professional.institute}</span>
                    </div>
                  </div>

                  <div>
                    <Label>Joining Date</Label>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{new Date(currentData.professional.joiningDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div>
                    <Label>Experience</Label>
                    <p className="mt-1 text-gray-900">{currentData.professional.experience}</p>
                  </div>

                  <div>
                    <Label>Employment Type</Label>
                    <Badge className="mt-1">{currentData.professional.employmentType}</Badge>
                  </div>

                  <div>
                    <Label>Office Location</Label>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{currentData.professional.officeLocation}</span>
                    </div>
                  </div>

                  <div>
                    <Label>Working Hours</Label>
                    <p className="mt-1 text-gray-900">{currentData.professional.workingHours}</p>
                  </div>
                </div>

                <div>
                  <Label>Specializations</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentData.professional.specializations.map((spec, index) => (
                      <Badge key={index} variant="outline">{spec}</Badge>
                    ))}
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
                  <span>Academic Qualifications</span>
                </CardTitle>
                <CardDescription>Educational background and certifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Highest Qualification</Label>
                    <p className="mt-1 text-gray-900 font-semibold">{currentData.academic.highestQualification}</p>
                  </div>
                  
                  <div>
                    <Label>University</Label>
                    <p className="mt-1 text-gray-900">{currentData.academic.university}</p>
                  </div>

                  <div>
                    <Label>Graduation Year</Label>
                    <p className="mt-1 text-gray-900">{currentData.academic.graduationYear}</p>
                  </div>
                </div>

                <div>
                  <Label>Thesis/Dissertation Title</Label>
                  <p className="mt-1 text-gray-900">{currentData.academic.thesis}</p>
                </div>

                <div>
                  <Label>Other Qualifications</Label>
                  <div className="space-y-3 mt-2">
                    {currentData.academic.otherQualifications.map((qual, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="font-medium">{qual.degree}</div>
                        <div className="text-sm text-gray-600">{qual.university} • {qual.year}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Professional Certifications</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentData.academic.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="text-center">{cert}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Research Information */}
          <TabsContent value="research" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Research Profile</span>
                </CardTitle>
                <CardDescription>Research publications, projects, and achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Research Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{currentData.research.publications}</div>
                    <div className="text-sm text-gray-600">Publications</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{currentData.research.hIndex}</div>
                    <div className="text-sm text-gray-600">H-Index</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{currentData.research.citationCount}</div>
                    <div className="text-sm text-gray-600">Citations</div>
                  </div>
                </div>

                <div>
                  <Label>Research Areas</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentData.research.researchAreas.map((area, index) => (
                      <Badge key={index} variant="outline">{area}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Current Research Projects</Label>
                  <div className="space-y-3 mt-2">
                    {currentData.research.currentProjects.map((project, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="font-semibold">{project.title}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Funding: {project.fundingAgency} • {project.amount} • {project.duration}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Patents</Label>
                  <div className="space-y-2 mt-2">
                    {currentData.research.patents.map((patent, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="font-medium">{patent.title}</div>
                        <div className="text-sm text-gray-600">Patent No: {patent.patentNumber} • {patent.year}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Awards & Recognition</Label>
                  <div className="space-y-2 mt-2">
                    {currentData.research.awards.map((award, index) => (
                      <div key={index} className="flex items-center p-3 border rounded-lg">
                        <Trophy className="h-5 w-5 text-yellow-600 mr-3" />
                        <div>
                          <div className="font-medium">{award.title}</div>
                          <div className="text-sm text-gray-600">{award.organization} • {award.year}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Administrative Information */}
          <TabsContent value="administrative" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Administrative Role</span>
                </CardTitle>
                <CardDescription>Leadership responsibilities and achievements as HOD</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Current Administrative Role</Label>
                  <p className="mt-1 text-lg font-semibold text-purple-600">{currentData.administrative.currentRole}</p>
                </div>

                <div>
                  <Label>Previous Roles</Label>
                  <div className="space-y-2 mt-2">
                    {currentData.administrative.previousRoles.map((role, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="font-medium">{role.role}</div>
                        <div className="text-sm text-gray-600">{role.department} • {role.duration}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Committee Memberships</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentData.administrative.committeeMemberships.map((committee, index) => (
                      <Badge key={index} variant="outline">{committee}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Key Responsibilities as HOD</Label>
                  <ul className="mt-2 space-y-1">
                    {currentData.administrative.responsibilitiesAsHOD.map((responsibility, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-purple-600 mr-2">•</span>
                        <span className="text-gray-700">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Label>Key Achievements as HOD</Label>
                  <div className="space-y-2 mt-2">
                    {currentData.administrative.keyAchievements.map((achievement, index) => (
                      <div key={index} className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                        <Award className="h-5 w-5 text-green-600 mr-3" />
                        <span className="text-green-800">{achievement}</span>
                      </div>
                    ))}
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

export default HODProfile;
