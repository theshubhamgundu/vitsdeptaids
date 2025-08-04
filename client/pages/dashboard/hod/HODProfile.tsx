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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getFacultyById } from "@/data/facultyData";
import {
  User,
  Edit,
  Save,
  X,
  Camera,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Crown,
} from "lucide-react";

const HODProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const hodData = getFacultyById(currentUser.facultyId);

  const [profileData, setProfileData] = useState({
    personal: {
      name: hodData?.name || "HOD",
      email: hodData?.email || "hod@vignan.ac.in",
      phone: hodData?.phone || "+91 9876543210",
      employeeId: hodData?.facultyId || "VIT-AIML-001",
      dateOfBirth: "",
      address: "",
      emergencyContact: "",
      bloodGroup: "",
      profilePhoto: null,
    },
    professional: {
      designation: hodData?.designation || "Head of Department",
      department:
        hodData?.department || "Artificial Intelligence & Data Science",
    },
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
    setEditedData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
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

  const currentData = isEditing ? editedData : profileData;

  return (
    <DashboardLayout userType="hod" userName={currentData.personal.name}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Crown className="h-6 w-6 text-yellow-500 mr-2" />
              HOD Profile
            </h1>
            <p className="text-gray-600">Manage your personal information</p>
          </div>
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
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
            </div>
          )}
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Basic personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-yellow-200">
                    {currentData.personal.profilePhoto ? (
                      <img
                        src={currentData.personal.profilePhoto}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                        <User className="h-16 w-16 text-white" />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">
                    {currentData.personal.name}
                  </h3>
                  <p className="text-gray-600">
                    {currentData.professional.designation}
                  </p>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    {currentData.professional.department}
                  </Badge>
                </div>
              </div>

              {/* Personal Details */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    {isEditing ? (
                      <Input
                        value={currentData.personal.name}
                        onChange={(e) =>
                          handleInputChange("personal", "name", e.target.value)
                        }
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span>{currentData.personal.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Employee ID</Label>
                    <div className="flex items-center space-x-2">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <span>{currentData.personal.employeeId}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={currentData.personal.email}
                        onChange={(e) =>
                          handleInputChange("personal", "email", e.target.value)
                        }
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>{currentData.personal.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    {isEditing ? (
                      <Input
                        value={currentData.personal.phone}
                        onChange={(e) =>
                          handleInputChange("personal", "phone", e.target.value)
                        }
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{currentData.personal.phone}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={currentData.personal.dateOfBirth}
                        onChange={(e) =>
                          handleInputChange(
                            "personal",
                            "dateOfBirth",
                            e.target.value,
                          )
                        }
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>
                          {new Date(
                            currentData.personal.dateOfBirth,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Blood Group</Label>
                    {isEditing ? (
                      <Input
                        value={currentData.personal.bloodGroup}
                        onChange={(e) =>
                          handleInputChange(
                            "personal",
                            "bloodGroup",
                            e.target.value,
                          )
                        }
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="w-4 h-4 bg-red-500 rounded-full"></span>
                        <span>{currentData.personal.bloodGroup}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  {isEditing ? (
                    <Textarea
                      value={currentData.personal.address}
                      onChange={(e) =>
                        handleInputChange("personal", "address", e.target.value)
                      }
                      rows={3}
                    />
                  ) : (
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                      <span>{currentData.personal.address}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Emergency Contact</Label>
                  {isEditing ? (
                    <Input
                      value={currentData.personal.emergencyContact}
                      onChange={(e) =>
                        handleInputChange(
                          "personal",
                          "emergencyContact",
                          e.target.value,
                        )
                      }
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-red-500" />
                      <span>{currentData.personal.emergencyContact}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HODProfile;
