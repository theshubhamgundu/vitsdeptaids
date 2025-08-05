import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, User, Mail, Phone, MapPin, GraduationCap, Users, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { User as UserType } from '@/services/authService';

interface ProfileData {
  // Common fields
  phone?: string;
  email?: string;
  profilePhoto?: string;
  bio?: string;
  
  // Student specific
  year?: string;
  section?: string;
  guardian?: string;
  guardianPhone?: string;
  
  // Faculty/HOD specific
  designation?: string;
  specialization?: string;
  qualification?: string;
  experience?: string;
  officeLocation?: string;
  
  // Admin specific
  department?: string;
  permissions?: string[];
}

interface ProfileCompletionProps {
  onComplete: (profileData: ProfileData) => void;
}

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<ProfileData>({
    phone: '',
    email: user?.email || '',
    bio: '',
  });

  if (!user) return null;

  const totalSteps = user.role === 'student' ? 3 : user.role === 'admin' ? 2 : 3;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Save profile data
    const existingUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const updatedUser = {
      ...existingUser,
      ...profileData,
      profileCompleted: true,
      profileCompletedAt: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    onComplete(profileData);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return profileData.phone && profileData.email;
      case 2:
        if (user.role === 'student') {
          return profileData.year && profileData.section;
        } else if (user.role === 'admin') {
          return profileData.department;
        } else {
          return profileData.designation && profileData.specialization;
        }
      case 3:
        return true; // Optional step
      default:
        return false;
    }
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case 'student': return <GraduationCap className="h-8 w-8 text-blue-600" />;
      case 'faculty': return <Users className="h-8 w-8 text-green-600" />;
      case 'hod': return <Crown className="h-8 w-8 text-purple-600" />;
      case 'admin': return <User className="h-8 w-8 text-red-600" />;
      default: return <User className="h-8 w-8 text-gray-600" />;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <p className="text-gray-600">Please provide your contact details</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+91 9876543210"
                required
              />
            </div>
          </div>
        );

      case 2:
        if (user.role === 'student') {
          return (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Academic Information</h3>
                <p className="text-gray-600">Tell us about your academic details</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="year">Current Year</Label>
                <Select value={profileData.year} onValueChange={(value) => handleInputChange('year', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Year">1st Year</SelectItem>
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Select value={profileData.section} onValueChange={(value) => handleInputChange('section', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Section A</SelectItem>
                    <SelectItem value="B">Section B</SelectItem>
                    <SelectItem value="C">Section C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="guardian">Guardian Name</Label>
                <Input
                  id="guardian"
                  value={profileData.guardian}
                  onChange={(e) => handleInputChange('guardian', e.target.value)}
                  placeholder="Guardian's full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="guardianPhone">Guardian Phone</Label>
                <Input
                  id="guardianPhone"
                  type="tel"
                  value={profileData.guardianPhone}
                  onChange={(e) => handleInputChange('guardianPhone', e.target.value)}
                  placeholder="+91 9876543210"
                />
              </div>
            </div>
          );
        } else if (user.role === 'admin') {
          return (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Administrative Information</h3>
                <p className="text-gray-600">Please provide your role details</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={profileData.department} onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AI & Data Science">AI & Data Science</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          );
        } else {
          // Faculty/HOD
          return (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold">Professional Information</h3>
                <p className="text-gray-600">Tell us about your professional background</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={profileData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  placeholder="Assistant Professor, Associate Professor, etc."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={profileData.specialization}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  placeholder="Machine Learning, Data Science, etc."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="qualification">Highest Qualification</Label>
                <Input
                  id="qualification"
                  value={profileData.qualification}
                  onChange={(e) => handleInputChange('qualification', e.target.value)}
                  placeholder="Ph.D., M.Tech., etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Experience (Years)</Label>
                <Input
                  id="experience"
                  type="number"
                  value={profileData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  placeholder="5"
                />
              </div>
            </div>
          );
        }

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              <p className="text-gray-600">Optional details to complete your profile</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us a bit about yourself..."
                rows={4}
              />
            </div>
            
            {(user.role === 'faculty' || user.role === 'hod') && (
              <div className="space-y-2">
                <Label htmlFor="officeLocation">Office Location</Label>
                <Input
                  id="officeLocation"
                  value={profileData.officeLocation}
                  onChange={(e) => handleInputChange('officeLocation', e.target.value)}
                  placeholder="Room 301, AI & DS Department"
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getRoleIcon()}
          </div>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Welcome {user.name}! Please complete your profile to get started.
          </CardDescription>
          
          <div className="mt-4">
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStep()}
          
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep === totalSteps ? (
              <Button
                onClick={handleComplete}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Profile
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCompletion;
