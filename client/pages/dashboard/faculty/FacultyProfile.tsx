import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getFacultyById } from "@/data/facultyData";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Edit,
  Save,
  Upload,
  Eye,
  FileText,
  Users,
  Clock,
  Camera,
  GraduationCap,
  Building,
  Globe,
  Linkedin,
  Github
} from "lucide-react";

const FacultyProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState("/api/placeholder/150/150");

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const facultyData = getFacultyById(currentUser.facultyId);

  const [profile, setProfile] = useState({
    id: facultyData?.id || 1,
    name: facultyData?.name || "Faculty Member",
    designation: facultyData?.designation || "Faculty",
    department: facultyData?.department || "AI & Data Science",
    employeeId: facultyData?.facultyId || "FACULTY001",
    email: facultyData?.email || "faculty@vignan.ac.in",
    phone: facultyData?.phone || "+91 9876543210",
    address: "Faculty Quarters, Vignan University, Guntur, AP",
    joiningDate: "2018-07-15",
    experience: `${facultyData?.experience || 0} years`,
    education: facultyData?.qualification || "Ph.D. in Computer Science",
    specialization: facultyData?.specialization || "Computer Science",
    subjects: facultyData?.specialization?.split(", ") || ["Computer Science"],
    researchInterests: facultyData?.specialization?.split(", ") || ["Computer Science"],
    publications: Math.floor(Math.random() * 50), // Random for now
    conferences: Math.floor(Math.random() * 30), // Random for now
    awards: ["Excellence Award", "Teaching Award"],
    certifications: ["Industry Certification"],
    officeHours: "Monday-Friday, 2:00 PM - 4:00 PM",
    room: `Faculty Block - Room 20${facultyData?.id || 1}`,
    linkedIn: `https://linkedin.com/in/${facultyData?.name?.toLowerCase().replace(/\s+/g, '-') || 'faculty'}`,
    googleScholar: "https://scholar.google.com/citations?user=xyz",
    orcid: "0000-0000-0000-0000",
    biography: `${facultyData?.name || 'Faculty Member'} is a ${facultyData?.designation || 'Faculty'} in the Department of ${facultyData?.department || 'AI & Data Science'} with ${facultyData?.experience || 0} years of experience in teaching and research.`,
    currentProjects: [
      "Research Project 1",
      "Research Project 2",
      "Research Project 3"
    ],
    mentorshipStats: {
      currentStudents: Math.floor(Math.random() * 100), // Random for now
      graduatedStudents: Math.floor(Math.random() * 200), // Random for now
      phdStudents: Math.floor(Math.random() * 10),
      mTechStudents: Math.floor(Math.random() * 20)
    }
  });

  const [editProfile, setEditProfile] = useState({ ...profile });

  const handleSave = () => {
    setProfile({ ...editProfile });
    setIsEditing(false);
    console.log("Profile updated:", editProfile);
  };

  const handleCancel = () => {
    setEditProfile({ ...profile });
    setIsEditing(false);
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhoto(e.target.result);
        setShowPhotoDialog(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DashboardLayout userType="faculty" userName="Dr. Anita Verma">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Faculty Profile</h1>
            <p className="text-gray-600">Manage your personal and professional information</p>
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="bg-green-600 hover:bg-green-700">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Photo Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Photo</CardTitle>
                  <CardDescription>Update your profile picture</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                      <img 
                        src={profilePhoto} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/api/placeholder/150/150";
                        }}
                      />
                    </div>
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                      onClick={() => setShowPhotoDialog(true)}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">{profile.name}</h3>
                    <p className="text-gray-600">{profile.designation}</p>
                    <Badge variant="secondary">{profile.department}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Personal Details Card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Your personal contact and basic information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      {isEditing ? (
                        <Input
                          value={editProfile.name}
                          onChange={(e) => setEditProfile(prev => ({ ...prev, name: e.target.value }))}
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>{profile.name}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Employee ID</Label>
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="h-4 w-4 text-gray-500" />
                        <span>{profile.employeeId}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editProfile.email}
                          onChange={(e) => setEditProfile(prev => ({ ...prev, email: e.target.value }))}
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{profile.email}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      {isEditing ? (
                        <Input
                          value={editProfile.phone}
                          onChange={(e) => setEditProfile(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{profile.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Address</Label>
                    {isEditing ? (
                      <Textarea
                        value={editProfile.address}
                        onChange={(e) => setEditProfile(prev => ({ ...prev, address: e.target.value }))}
                        rows={3}
                      />
                    ) : (
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                        <span>{profile.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Office Room</Label>
                      {isEditing ? (
                        <Input
                          value={editProfile.room}
                          onChange={(e) => setEditProfile(prev => ({ ...prev, room: e.target.value }))}
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span>{profile.room}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Office Hours</Label>
                      {isEditing ? (
                        <Input
                          value={editProfile.officeHours}
                          onChange={(e) => setEditProfile(prev => ({ ...prev, officeHours: e.target.value }))}
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{profile.officeHours}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Biography Card */}
            <Card>
              <CardHeader>
                <CardTitle>Biography</CardTitle>
                <CardDescription>Brief professional biography</CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editProfile.biography}
                    onChange={(e) => setEditProfile(prev => ({ ...prev, biography: e.target.value }))}
                    rows={4}
                    placeholder="Enter your professional biography..."
                  />
                ) : (
                  <p className="text-gray-700">{profile.biography}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Information Tab */}
          <TabsContent value="professional" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Details</CardTitle>
                  <CardDescription>Your professional information and experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Designation</Label>
                    {isEditing ? (
                      <Select 
                        value={editProfile.designation} 
                        onValueChange={(value) => setEditProfile(prev => ({ ...prev, designation: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Professor">Professor</SelectItem>
                          <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                          <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                          <SelectItem value="HOD">HOD</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-gray-500" />
                        <span>{profile.designation}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span>{profile.department}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Joining Date</Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editProfile.joiningDate}
                        onChange={(e) => setEditProfile(prev => ({ ...prev, joiningDate: e.target.value }))}
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{new Date(profile.joiningDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Total Experience</Label>
                    {isEditing ? (
                      <Input
                        value={editProfile.experience}
                        onChange={(e) => setEditProfile(prev => ({ ...prev, experience: e.target.value }))}
                        placeholder="e.g., 10 years"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{profile.experience}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Teaching Statistics</CardTitle>
                  <CardDescription>Your mentorship and teaching metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{profile.mentorshipStats.currentStudents}</div>
                      <div className="text-sm text-gray-600">Current Students</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{profile.mentorshipStats.graduatedStudents}</div>
                      <div className="text-sm text-gray-600">Graduated Students</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{profile.mentorshipStats.phdStudents}</div>
                      <div className="text-sm text-gray-600">PhD Students</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{profile.mentorshipStats.mTechStudents}</div>
                      <div className="text-sm text-gray-600">M.Tech Students</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Teaching Subjects */}
            <Card>
              <CardHeader>
                <CardTitle>Teaching Subjects</CardTitle>
                <CardDescription>Subjects you are currently teaching</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.subjects.map((subject, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Academic Information Tab */}
          <TabsContent value="academic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>Your educational qualifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Highest Qualification</Label>
                    {isEditing ? (
                      <Textarea
                        value={editProfile.education}
                        onChange={(e) => setEditProfile(prev => ({ ...prev, education: e.target.value }))}
                        rows={3}
                      />
                    ) : (
                      <div className="flex items-start space-x-2">
                        <GraduationCap className="h-4 w-4 text-gray-500 mt-1" />
                        <span>{profile.education}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Specialization</Label>
                    {isEditing ? (
                      <Textarea
                        value={editProfile.specialization}
                        onChange={(e) => setEditProfile(prev => ({ ...prev, specialization: e.target.value }))}
                        rows={2}
                      />
                    ) : (
                      <div className="flex items-start space-x-2">
                        <Award className="h-4 w-4 text-gray-500 mt-1" />
                        <span>{profile.specialization}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Professional Links</CardTitle>
                  <CardDescription>Your academic and professional profiles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>LinkedIn Profile</Label>
                    {isEditing ? (
                      <Input
                        value={editProfile.linkedIn}
                        onChange={(e) => setEditProfile(prev => ({ ...prev, linkedIn: e.target.value }))}
                        placeholder="https://linkedin.com/in/username"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Linkedin className="h-4 w-4 text-blue-600" />
                        <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Google Scholar</Label>
                    {isEditing ? (
                      <Input
                        value={editProfile.googleScholar}
                        onChange={(e) => setEditProfile(prev => ({ ...prev, googleScholar: e.target.value }))}
                        placeholder="https://scholar.google.com/citations?user=xyz"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-blue-600" />
                        <a href={profile.googleScholar} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Google Scholar
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>ORCID ID</Label>
                    {isEditing ? (
                      <Input
                        value={editProfile.orcid}
                        onChange={(e) => setEditProfile(prev => ({ ...prev, orcid: e.target.value }))}
                        placeholder="0000-0000-0000-0000"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="font-mono">{profile.orcid}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Awards and Certifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Awards & Honors</CardTitle>
                  <CardDescription>Recognition and awards received</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.awards.map((award, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Award className="h-5 w-5 text-yellow-500" />
                        <span>{award}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Certifications</CardTitle>
                  <CardDescription>Professional certifications earned</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Award className="h-5 w-5 text-blue-500" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Research Information Tab */}
          <TabsContent value="research" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Research Metrics</CardTitle>
                  <CardDescription>Your research statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{profile.publications}</div>
                      <div className="text-sm text-gray-600">Publications</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{profile.conferences}</div>
                      <div className="text-sm text-gray-600">Conferences</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Research Interests</CardTitle>
                  <CardDescription>Your primary areas of research</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.researchInterests.map((interest, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Projects */}
            <Card>
              <CardHeader>
                <CardTitle>Current Research Projects</CardTitle>
                <CardDescription>Ongoing research initiatives and projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profile.currentProjects.map((project, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <span>{project}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Photo Upload Dialog */}
        <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Profile Photo</DialogTitle>
              <DialogDescription>Choose a new profile picture</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                  <img 
                    src={profilePhoto} 
                    alt="Current profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Upload New Photo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="cursor-pointer"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => setShowPhotoDialog(false)} className="flex-1">
                  Done
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default FacultyProfile;
