import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Camera, Edit, Save, X } from "lucide-react";

const StudentProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Rahul Sharma",
    hallTicket: "20AI001",
    email: "rahul.sharma@vignanits.ac.in",
    phone: "+91 9876543210",
    year: 3,
    branch: "AI & DS",
    semester: 6,
    address: "123 Tech Street, Hyderabad, Telangana 500001",
    emergencyContact: "+91 9876543211",
    fatherName: "Suresh Sharma",
    motherName: "Priya Sharma",
    dateOfBirth: "2003-05-15",
    bloodGroup: "O+",
    admissionDate: "2021-08-01",
    counsellor: "Dr. Anita Verma",
    status: "Active"
  });

  const handleSave = () => {
    // In real app, this would save to API
    setIsEditing(false);
    // Show success toast
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const academicInfo = [
    { label: "Hall Ticket", value: profileData.hallTicket },
    { label: "Year", value: `${profileData.year}rd Year` },
    { label: "Branch", value: profileData.branch },
    { label: "Current Semester", value: profileData.semester },
    { label: "Admission Date", value: new Date(profileData.admissionDate).toLocaleDateString() },
    { label: "Status", value: profileData.status },
    { label: "Counsellor", value: profileData.counsellor }
  ];

  return (
    <DashboardLayout userType="student" userName={profileData.fullName}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Student Profile</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </div>
              <div className="flex space-x-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
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
                  <AvatarImage src="/api/placeholder/100/100" />
                  <AvatarFallback className="text-2xl">
                    {profileData.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button 
                    size="sm" 
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profileData.fullName}</h2>
                <p className="text-gray-600">{profileData.hallTicket}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline">{profileData.year}rd Year</Badge>
                  <Badge variant="outline">{profileData.branch}</Badge>
                  <Badge className="bg-green-100 text-green-800">{profileData.status}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your personal details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={profileData.fullName}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={profileData.dateOfBirth}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Input
                  id="bloodGroup"
                  value={profileData.bloodGroup}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bloodGroup: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={profileData.emergencyContact}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={profileData.address}
                disabled={!isEditing}
                onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                rows={3}
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
                  onChange={(e) => setProfileData(prev => ({ ...prev, fatherName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motherName">Mother's Name</Label>
                <Input
                  id="motherName"
                  value={profileData.motherName}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData(prev => ({ ...prev, motherName: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
            <CardDescription>Your academic details and current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {academicInfo.map((info, index) => (
                <div key={index} className="space-y-1">
                  <Label className="text-sm font-medium text-gray-600">{info.label}</Label>
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
