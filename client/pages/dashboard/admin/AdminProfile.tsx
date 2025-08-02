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
  Settings,
  Shield,
  Key,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  UserCheck
} from "lucide-react";

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const [profileData, setProfileData] = useState({
    personal: {
      name: "Admin User",
      email: "admin@vignan.ac.in",
      phone: "+91 9876543210",
      employeeId: "VIT-ADMIN-001",
      dateOfBirth: "1985-05-15",
      address: "Admin Office, Vignan Institute of Technology & Science, Hyderabad",
      emergencyContact: "+91 9876543211",
      bloodGroup: "B+",
      profilePhoto: null
    },
    professional: {
      designation: "System Administrator",
      department: "Administration",
      institute: "Vignan Institute of Technology & Science",
      joiningDate: "2018-01-01",
      experience: "6+ years",
      responsibilities: [
        "System administration and maintenance",
        "User account management",
        "Database administration",
        "Security management",
        "Technical support"
      ],
      officeLocation: "Admin Block, Room 105",
      workingHours: "9:00 AM - 6:00 PM"
    },
    security: {
      lastLogin: "2024-12-20 10:30:00",
      loginAttempts: 0,
      accountStatus: "Active",
      twoFactorEnabled: true,
      sessionTimeout: "30 minutes",
      permissionLevel: "Super Admin",
      accessRights: [
        "User Management",
        "System Configuration",
        "Database Access",
        "Report Generation",
        "Security Settings"
      ]
    },
    system: {
      systemRole: "Super Administrator",
      createdDate: "2018-01-01",
      lastModified: "2024-12-20",
      databaseAccess: "Full Access",
      backupAccess: true,
      serverAccess: true,
      logAccess: true
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
    <DashboardLayout userType="admin" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
            <p className="text-gray-600">Manage your administrative profile and system settings</p>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
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
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center overflow-hidden">
                      {currentData.personal.profilePhoto ? (
                        <img 
                          src={currentData.personal.profilePhoto} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserCheck className="h-12 w-12 text-white" />
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
                    <Badge className="mt-1">{currentData.security.permissionLevel}</Badge>
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
                  <Settings className="h-5 w-5" />
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
                    <Label>Office Location</Label>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{currentData.professional.officeLocation}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Key Responsibilities</Label>
                  <ul className="mt-2 space-y-1">
                    {currentData.professional.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span className="text-gray-700">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <Label>Working Hours</Label>
                  <p className="mt-1 text-gray-900">{currentData.professional.workingHours}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Information */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Settings</span>
                </CardTitle>
                <CardDescription>Account security and access control settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Permission Level</Label>
                    <Badge className="mt-1 bg-red-100 text-red-800">{currentData.security.permissionLevel}</Badge>
                  </div>
                  
                  <div>
                    <Label>Account Status</Label>
                    <Badge className="mt-1 bg-green-100 text-green-800">{currentData.security.accountStatus}</Badge>
                  </div>

                  <div>
                    <Label>Last Login</Label>
                    <p className="mt-1 text-gray-900">{new Date(currentData.security.lastLogin).toLocaleString()}</p>
                  </div>

                  <div>
                    <Label>Session Timeout</Label>
                    <p className="mt-1 text-gray-900">{currentData.security.sessionTimeout}</p>
                  </div>

                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <Badge className={`mt-1 ${currentData.security.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {currentData.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>

                  <div>
                    <Label>Failed Login Attempts</Label>
                    <p className="mt-1 text-gray-900">{currentData.security.loginAttempts}</p>
                  </div>
                </div>

                <div>
                  <Label>Access Rights</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentData.security.accessRights.map((right, index) => (
                      <Badge key={index} variant="outline">{right}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Information */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>System Information</span>
                </CardTitle>
                <CardDescription>System-level information and technical details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>System Role</Label>
                    <p className="mt-1 text-gray-900 font-semibold">{currentData.system.systemRole}</p>
                  </div>
                  
                  <div>
                    <Label>Account Created</Label>
                    <p className="mt-1 text-gray-900">{new Date(currentData.system.createdDate).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <Label>Last Modified</Label>
                    <p className="mt-1 text-gray-900">{new Date(currentData.system.lastModified).toLocaleDateString()}</p>
                  </div>

                  <div>
                    <Label>Database Access</Label>
                    <Badge className="mt-1 bg-blue-100 text-blue-800">{currentData.system.databaseAccess}</Badge>
                  </div>

                  <div>
                    <Label>Backup Access</Label>
                    <Badge className={`mt-1 ${currentData.system.backupAccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {currentData.system.backupAccess ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>

                  <div>
                    <Label>Server Access</Label>
                    <Badge className={`mt-1 ${currentData.system.serverAccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {currentData.system.serverAccess ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>

                  <div>
                    <Label>Log Access</Label>
                    <Badge className={`mt-1 ${currentData.system.logAccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {currentData.system.logAccess ? 'Enabled' : 'Disabled'}
                    </Badge>
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

export default AdminProfile;
