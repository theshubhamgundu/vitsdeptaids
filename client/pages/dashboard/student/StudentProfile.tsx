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
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { profilePhotoService } from "@/services/profilePhotoService";
import { profileService } from "@/services/profileService";
import { Camera, Edit, Save, X, User, Loader2 } from "lucide-react";

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const { toast } = useToast();
  
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
    profilePhoto: null as string | null,
  });

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      
      // Get current user from localStorage
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );
      
      if (!currentUser.id) {
        toast({
          title: "Error",
          description: "User session not found. Please login again.",
          variant: "destructive",
        });
        return;
      }

      setStudentData(currentUser);

      // Load complete profile from database
      const profile = await profileService.getStudentProfile(currentUser.id);
      
      if (profile) {
        setProfileData({
          fullName: profile.name || "",
          hallTicket: profile.hall_ticket || "",
          email: profile.email || "",
          phone: profile.phone || "",
          year: profile.year || "",
          branch: "AI & DS",
          section: profile.section || "",
          address: profile.address || "",
          emergencyContact: "",
          fatherName: profile.father_name || "",
          motherName: profile.mother_name || "",
          dateOfBirth: profile.date_of_birth || "",
          bloodGroup: profile.blood_group || "",
          admissionDate: profile.created_at ? new Date(profile.created_at).toISOString().split("T")[0] : "",
          counsellor: "Dr. Academic Counselor",
          status: profile.is_active ? "Active" : "Inactive",
          profilePhoto: profile.profile_photo_url || null,
        });
      } else {
        // Initialize with localStorage data
        setProfileData(prev => ({
          ...prev,
          fullName: currentUser.name || "",
          hallTicket: currentUser.hallTicket || "",
          email: currentUser.email || "",
          year: currentUser.year || "",
          section: currentUser.section || "",
          admissionDate: currentUser.createdAt
            ? new Date(currentUser.createdAt).toISOString().split("T")[0]
            : "",
        }));
      }

      // Load profile photo
      try {
        const photoUrl = await profilePhotoService.getProfilePhotoUrl(
          currentUser.id,
          "student"
        );
        if (photoUrl) {
          setProfileData(prev => ({ ...prev, profilePhoto: photoUrl }));
        }
      } catch (photoError) {
        console.warn("Profile photo loading failed:", photoError);
      }
    } catch (error) {
      console.error("Error loading student data:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (!studentData?.id) {
        toast({
          title: "Error",
          description: "User session invalid.",
          variant: "destructive",
        });
        return;
      }

      // Update profile in database and localStorage
      const updateSuccess = await profileService.updateStudentProfile(
        studentData.id,
        {
          name: profileData.fullName,
          email: profileData.email,
          phone: profileData.phone,
          year: profileData.year,
          section: profileData.section,
          father_name: profileData.fatherName,
          mother_name: profileData.motherName,
          address: profileData.address,
          date_of_birth: profileData.dateOfBirth,
          blood_group: profileData.bloodGroup,
        }
      );

      if (updateSuccess) {
        // Update local student data
        const updatedUser = {
          ...studentData,
          name: profileData.fullName,
          email: profileData.email,
          year: profileData.year,
          section: profileData.section,
        };
        setStudentData(updatedUser);

        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
        setIsEditing(false);
      } else {
        toast({
          title: "Warning",
          description: "Profile saved locally. Database sync may be delayed.",
          variant: "destructive",
        });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !studentData?.id) return;

    try {
      setUploadingPhoto(true);
      
      const result = await profilePhotoService.uploadProfilePhoto(
        studentData.id,
        file,
        "student"
      );

      if (result.success && result.photoUrl) {
        setProfileData(prev => ({ ...prev, profilePhoto: result.photoUrl! }));
        toast({
          title: "Success",
          description: result.isLocalStorage 
            ? "Photo uploaded (stored locally)" 
            : "Photo uploaded successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to upload photo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Photo upload error:", error);
      toast({
        title: "Error",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadStudentData(); // Reload original data
  };

  const academicInfo = [
    { label: "Hall Ticket", value: profileData.hallTicket || "Not provided" },
    { label: "Year", value: profileData.year || "Not provided" },
    { label: "Branch", value: profileData.branch },
    { label: "Section", value: profileData.section || "Not provided" },
    { label: "Admission Date", value: profileData.admissionDate || "Not provided" },
    { label: "Status", value: profileData.status },
    { label: "Counsellor", value: profileData.counsellor || "Not assigned" },
  ];

  if (loading) {
    return (
      <DashboardLayout userType="student" userName="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!studentData) {
    return (
      <DashboardLayout userType="student" userName="Error">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600">Failed to load profile data.</p>
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
                      disabled={saving}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                    <Button onClick={handleCancel} variant="outline" disabled={saving}>
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
                      disabled={uploadingPhoto}
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                        type="button"
                        asChild
                        disabled={uploadingPhoto}
                      >
                        <span>
                          {uploadingPhoto ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Camera className="h-4 w-4" />
                          )}
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
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={profileData.dateOfBirth}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      dateOfBirth: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Input
                  id="bloodGroup"
                  value={profileData.bloodGroup}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      bloodGroup: e.target.value,
                    }))
                  }
                  placeholder="Enter your blood group"
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
