import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Camera, Edit, Save, X, User } from "lucide-react";

interface StudentData {
  id: string;
  name: string;
  role: string;
  hallTicket: string;
  email: string;
  year: string;
  section: string;
}

const StudentProfile = () => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    hallTicket: "",
    email: "",
    phone: "",
    year: "",
    branch: "AI & DS",
    section: "",
    address: "",
    emergencyContact: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    bloodGroup: "",
    admissionDate: "",
    counsellor: "",
    status: "Active",
    profilePhoto: null,
  });

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    setStudentData(currentUser);

    // Initialize profile data with actual user data
    if (currentUser) {
      setProfileData((prev) => ({
        ...prev,
        fullName: currentUser.name || "",
        hallTicket: currentUser.hallTicket || "",
        email: currentUser.email || "",
        year: currentUser.year || "",
        section: currentUser.section || "",
      }));
    }
  }, []);

  const handleSave = () => {
    // Save updated profile data to localStorage
    if (studentData) {
      const updatedUser = {
        ...studentData,
        name: profileData.fullName,
        email: profileData.email,
        year: profileData.year,
        section: profileData.section,
      };

      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setStudentData(updatedUser);
    }

    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData((prev) => ({
          ...prev,
          profilePhoto: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (studentData) {
      setProfileData((prev) => ({
        ...prev,
        fullName: studentData.name || "",
        hallTicket: studentData.hallTicket || "",
        email: studentData.email || "",
        year: studentData.year || "",
        section: studentData.section || "",
      }));
    }
  };

  const academicInfo = [
    { label: "Hall Ticket", value: profileData.hallTicket || "Not provided" },
    { label: "Year", value: profileData.year || "Not provided" },
    { label: "Branch", value: profileData.branch },
    { label: "Section", value: profileData.section || "Not provided" },
    {
      label: "Admission Date",
      value: profileData.admissionDate || "Not provided",
    },
    { label: "Status", value: profileData.status },
    { label: "Counsellor", value: profileData.counsellor || "Not assigned" },
  ];

  if (!studentData) {
    return (
      <DashboardLayout userType="student" userName="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="student" userName={studentData.name}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Student Profile</CardTitle>
                <CardDescription>
                  Manage your personal information
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSave}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileData.profilePhoto || undefined} />
                  <AvatarFallback className="text-2xl">
                    {profileData.fullName ? (
                      profileData.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    ) : (
                      <User className="h-8 w-8" />
                    )}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                        type="button"
                        asChild
                      >
                        <span>
                          <Camera className="h-4 w-4" />
                        </span>
                      </Button>
                    </label>
                  </>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {profileData.fullName || "Student Name"}
                </h2>
                <p className="text-gray-600">
                  {profileData.hallTicket || "Hall Ticket"}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline">{profileData.year || "Year"}</Badge>
                  <Badge variant="outline">{profileData.branch}</Badge>
                  <Badge className="bg-green-100 text-green-800">
                    {profileData.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profileData.fullName}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Enter your email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={profileData.emergencyContact}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      emergencyContact: e.target.value,
                    }))
                  }
                  placeholder="Emergency contact number"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={profileData.address}
                disabled={!isEditing}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                rows={3}
                placeholder="Enter your complete address"
              />
            </div>
          </CardContent>
        </Card>

        {/* Family Information */}
        <Card>
          <CardHeader>
            <CardTitle>Family Information</CardTitle>
            <CardDescription>Parent and guardian details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name</Label>
                <Input
                  id="fatherName"
                  value={profileData.fatherName}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      fatherName: e.target.value,
                    }))
                  }
                  placeholder="Enter father's name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motherName">Mother's Name</Label>
                <Input
                  id="motherName"
                  value={profileData.motherName}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      motherName: e.target.value,
                    }))
                  }
                  placeholder="Enter mother's name"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
            <CardDescription>
              Your academic details and current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {academicInfo.map((info, index) => (
                <div key={index} className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">
                    {info.label}
                  </Label>
                  <p className="text-base font-medium">{info.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
