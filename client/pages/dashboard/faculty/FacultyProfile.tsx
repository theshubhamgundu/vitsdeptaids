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
    address: "",
    joiningDate: "",
    experience: `${facultyData?.experience || 0} years`,
    education: facultyData?.qualification || "Ph.D. in Computer Science",
    specialization: facultyData?.specialization || "Computer Science",
    subjects: facultyData?.specialization?.split(", ") || ["Computer Science"],
    researchInterests: facultyData?.specialization?.split(", ") || ["Computer Science"],
    publications: 0,
    conferences: 0,
    awards: [],
    certifications: [],
    officeHours: "",
    room: "",
    linkedIn: "",
    googleScholar: "",
    orcid: "",
    biography: "",
    currentProjects: [],
    mentorshipStats: {
      currentStudents: 0,
      graduatedStudents: 0,
      phdStudents: 0,
      mTechStudents: 0
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
    <DashboardLayout userType="faculty" userName={profile.name}>
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

        <div className="space-y-6">
          {/* Personal Information Section */}
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
        </div>

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
