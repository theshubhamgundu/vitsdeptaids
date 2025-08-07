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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  CheckCircle,
  User,
  Phone,
  Mail,
  MapPin,
  Users,
  Calendar,
} from "lucide-react";

interface ProfileData {
  phone: string;
  address: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  bloodGroup: string;
  emergencyContact: string;
  alternateEmail: string;
}

const ProfileCompletion = ({ onComplete }: { onComplete: () => void }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileData>({
    phone: "",
    address: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    bloodGroup: "",
    emergencyContact: "",
    alternateEmail: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const requiredFields = [
    { key: "phone", label: "Phone Number", icon: Phone },
    { key: "address", label: "Address", icon: MapPin },
    { key: "fatherName", label: "Father's Name", icon: Users },
    { key: "motherName", label: "Mother's Name", icon: Users },
    { key: "dateOfBirth", label: "Date of Birth", icon: Calendar },
    { key: "emergencyContact", label: "Emergency Contact", icon: Phone },
  ];

  const optionalFields = [
    { key: "bloodGroup", label: "Blood Group" },
    { key: "alternateEmail", label: "Alternate Email" },
  ];

  const calculateProgress = () => {
    const filledRequired = requiredFields.filter(
      (field) => profileData[field.key as keyof ProfileData].trim() !== "",
    ).length;
    const filledOptional = optionalFields.filter(
      (field) => profileData[field.key as keyof ProfileData].trim() !== "",
    ).length;

    const total = requiredFields.length + optionalFields.length;
    const filled = filledRequired + filledOptional;

    return {
      percentage: Math.round((filled / total) * 100),
      required: filledRequired,
      total: requiredFields.length,
      isComplete: filledRequired === requiredFields.length,
    };
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    requiredFields.forEach((field) => {
      if (!profileData[field.key as keyof ProfileData].trim()) {
        newErrors[field.key] = `${field.label} is required`;
      }
    });

    // Validate phone numbers
    const phoneRegex = /^[6-9]\d{9}$/;
    if (
      profileData.phone &&
      !phoneRegex.test(profileData.phone.replace(/\D/g, ""))
    ) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (
      profileData.emergencyContact &&
      !phoneRegex.test(profileData.emergencyContact.replace(/\D/g, ""))
    ) {
      newErrors.emergencyContact =
        "Please enter a valid 10-digit emergency contact";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      profileData.alternateEmail &&
      !emailRegex.test(profileData.alternateEmail)
    ) {
      newErrors.alternateEmail = "Please enter a valid email address";
    }

    // Validate date of birth
    if (profileData.dateOfBirth) {
      const dob = new Date(profileData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 16 || age > 30) {
        newErrors.dateOfBirth = "Please enter a valid date of birth";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Complete all required fields correctly",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Update user profile in localStorage
      const localUsers = JSON.parse(localStorage.getItem("localUsers") || "[]");
      const userIndex = localUsers.findIndex((u: any) => u.id === user?.id);

      if (userIndex !== -1) {
        localUsers[userIndex] = {
          ...localUsers[userIndex],
          ...profileData,
          profileCompleted: true,
        };
        localStorage.setItem("localUsers", JSON.stringify(localUsers));
      }

      // Update current user
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}",
      );
      const updatedUser = {
        ...currentUser,
        ...profileData,
        profileCompleted: true,
      };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      toast({
        title: "Profile Completed!",
        description: "Your profile has been saved successfully.",
      });

      onComplete();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
            <CardDescription>
              Please provide the following information to access all features
            </CardDescription>

            {/* Progress Bar */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Profile Completion</span>
                <span>{progress.percentage}%</span>
              </div>
              <Progress value={progress.percentage} className="w-full" />
              <div className="text-xs text-gray-600">
                {progress.required} of {progress.total} required fields
                completed
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please complete all required fields marked with * to continue.
                Your information is securely stored.
              </AlertDescription>
            </Alert>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number *
                    {profileData.phone && !errors.phone && (
                      <CheckCircle className="h-4 w-4 text-green-500 inline ml-2" />
                    )}
                  </Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="9876543210"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">
                    Emergency Contact *
                    {profileData.emergencyContact &&
                      !errors.emergencyContact && (
                        <CheckCircle className="h-4 w-4 text-green-500 inline ml-2" />
                      )}
                  </Label>
                  <Input
                    id="emergencyContact"
                    value={profileData.emergencyContact}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        emergencyContact: e.target.value,
                      }))
                    }
                    placeholder="9876543210"
                    className={errors.emergencyContact ? "border-red-500" : ""}
                  />
                  {errors.emergencyContact && (
                    <p className="text-sm text-red-500">
                      {errors.emergencyContact}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  Address *
                  {profileData.address && !errors.address && (
                    <CheckCircle className="h-4 w-4 text-green-500 inline ml-2" />
                  )}
                </Label>
                <Textarea
                  id="address"
                  value={profileData.address}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="Enter your complete address"
                  rows={3}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="alternateEmail">
                  Alternate Email (Optional)
                </Label>
                <Input
                  id="alternateEmail"
                  type="email"
                  value={profileData.alternateEmail}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      alternateEmail: e.target.value,
                    }))
                  }
                  placeholder="your.email@example.com"
                  className={errors.alternateEmail ? "border-red-500" : ""}
                />
                {errors.alternateEmail && (
                  <p className="text-sm text-red-500">
                    {errors.alternateEmail}
                  </p>
                )}
              </div>
            </div>

            {/* Family Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Family Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fatherName">
                    Father's Name *
                    {profileData.fatherName && !errors.fatherName && (
                      <CheckCircle className="h-4 w-4 text-green-500 inline ml-2" />
                    )}
                  </Label>
                  <Input
                    id="fatherName"
                    value={profileData.fatherName}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fatherName: e.target.value,
                      }))
                    }
                    placeholder="Enter father's name"
                    className={errors.fatherName ? "border-red-500" : ""}
                  />
                  {errors.fatherName && (
                    <p className="text-sm text-red-500">{errors.fatherName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motherName">
                    Mother's Name *
                    {profileData.motherName && !errors.motherName && (
                      <CheckCircle className="h-4 w-4 text-green-500 inline ml-2" />
                    )}
                  </Label>
                  <Input
                    id="motherName"
                    value={profileData.motherName}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        motherName: e.target.value,
                      }))
                    }
                    placeholder="Enter mother's name"
                    className={errors.motherName ? "border-red-500" : ""}
                  />
                  {errors.motherName && (
                    <p className="text-sm text-red-500">{errors.motherName}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">
                    Date of Birth *
                    {profileData.dateOfBirth && !errors.dateOfBirth && (
                      <CheckCircle className="h-4 w-4 text-green-500 inline ml-2" />
                    )}
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        dateOfBirth: e.target.value,
                      }))
                    }
                    className={errors.dateOfBirth ? "border-red-500" : ""}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group (Optional)</Label>
                  <Select
                    value={profileData.bloodGroup}
                    onValueChange={(value) =>
                      setProfileData((prev) => ({ ...prev, bloodGroup: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleSubmit}
                disabled={loading || !progress.isComplete}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving Profile...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Complete Profile & Continue</span>
                  </div>
                )}
              </Button>

              {!progress.isComplete && (
                <p className="text-sm text-gray-600 text-center mt-2">
                  Please complete all required fields to continue
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileCompletion;
