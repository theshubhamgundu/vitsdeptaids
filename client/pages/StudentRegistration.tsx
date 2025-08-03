import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase, tables } from "@/lib/supabase";
import {
  GraduationCap,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Upload,
  CheckCircle
} from "lucide-react";

const StudentRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    // Step 1: Basic Authentication
    email: "",
    password: "",
    confirmPassword: "",
    
    // Step 2: Academic Details
    fullName: "",
    hallTicket: "",
    year: "",
    section: "",
    
    // Step 3: Personal Details
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    bloodGroup: "",
    phone: "",
    emergencyContact: "",
    address: "",
    
    // Step 4: Profile
    profilePhoto: null
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.fullName || !formData.hallTicket || !formData.year) {
      setError("Please fill in all required fields");
      return false;
    }
    // Validate hall ticket format (you can adjust this pattern)
    const hallTicketPattern = /^[0-9]{2}[A-Z]{2,4}[0-9]{3}$/;
    if (!hallTicketPattern.test(formData.hallTicket)) {
      setError("Please enter a valid hall ticket number (e.g., 20AI001)");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.fatherName || !formData.motherName || !formData.dateOfBirth || !formData.phone) {
      setError("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    let isValid = false;
    
    if (currentStep === 1) isValid = validateStep1();
    if (currentStep === 2) isValid = validateStep2();
    if (currentStep === 3) isValid = validateStep3();
    
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRegister = async () => {
    if (!validateStep3()) return;
    
    setLoading(true);
    setError("");

    try {
      // Check if Supabase is available
      if (!supabase) {
        throw new Error("Database not available. Please try again later.");
      }

      // Check if hall ticket already exists
      const { data: existingStudent } = await tables.students()
        ?.select('hall_ticket')
        .eq('hall_ticket', formData.hallTicket)
        .single();

      if (existingStudent) {
        setError("Hall ticket already registered. Please contact admin if this is an error.");
        setLoading(false);
        return;
      }

      // Create user profile
      const userProfileId = crypto.randomUUID();
      const { error: userError } = await tables.userProfiles()
        ?.insert([{
          id: userProfileId,
          email: formData.email,
          role: 'student',
          is_active: true
        }]);

      if (userError) throw userError;

      // Create student record
      const { error: studentError } = await tables.students()
        ?.insert([{
          id: crypto.randomUUID(),
          user_id: userProfileId,
          hall_ticket: formData.hallTicket,
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          year: formData.year,
          section: formData.section || 'A',
          father_name: formData.fatherName,
          mother_name: formData.motherName,
          address: formData.address,
          date_of_birth: formData.dateOfBirth,
          blood_group: formData.bloodGroup,
          is_active: true
        }]);

      if (studentError) throw studentError;

      toast({
        title: "Registration Successful!",
        description: "Your account has been created. You can now login with your credentials.",
      });

      // Store user data for auto-login
      localStorage.setItem('currentUser', JSON.stringify({
        id: userProfileId,
        name: formData.fullName,
        role: "student",
        hallTicket: formData.hallTicket,
        email: formData.email,
        year: formData.year,
        section: formData.section || 'A'
      }));

      // Redirect to student dashboard
      navigate("/dashboard/student");

    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Account Setup", description: "Email and password" },
    { number: 2, title: "Academic Details", description: "Hall ticket and year" },
    { number: 3, title: "Personal Info", description: "Contact and family details" },
    { number: 4, title: "Complete Profile", description: "Final details" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/login/student" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Student Registration</h1>
          <p className="text-gray-600">Create your student account for Vignan AI & Data Science Department</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep >= step.number 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.number ? <CheckCircle className="h-5 w-5" /> : step.number}
                </div>
                <div className="text-center mt-2">
                  <p className="text-sm font-medium text-gray-900">{step.title}</p>
                  <p className="text-xs text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Step {currentStep}: {steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: Account Setup */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@vignan.ac.in"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Create a secure password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Academic Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Your full name as per college records"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hallTicket">Hall Ticket Number</Label>
                    <Input
                      id="hallTicket"
                      value={formData.hallTicket}
                      onChange={(e) => handleInputChange('hallTicket', e.target.value.toUpperCase())}
                      placeholder="20AI001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Academic Year</Label>
                    <Select value={formData.year} onValueChange={(value) => handleInputChange('year', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st Year">1st Year</SelectItem>
                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                        <SelectItem value="4th Year">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section">Section (Optional)</Label>
                  <Select value={formData.section} onValueChange={(value) => handleInputChange('section', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Section A</SelectItem>
                      <SelectItem value="B">Section B</SelectItem>
                      <SelectItem value="C">Section C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: Personal Details */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fatherName">Father's Name</Label>
                    <Input
                      id="fatherName"
                      value={formData.fatherName}
                      onChange={(e) => handleInputChange('fatherName', e.target.value)}
                      placeholder="Father's full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motherName">Mother's Name</Label>
                    <Input
                      id="motherName"
                      value={formData.motherName}
                      onChange={(e) => handleInputChange('motherName', e.target.value)}
                      placeholder="Mother's full name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange('bloodGroup', value)}>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      placeholder="+91 9876543211"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Complete address with city, state, and pincode"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Profile Completion */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Complete Your Profile</h3>
                  <p className="text-gray-600 mb-6">Review your information and complete registration</p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2">
                    <div><strong>Name:</strong> {formData.fullName}</div>
                    <div><strong>Hall Ticket:</strong> {formData.hallTicket}</div>
                    <div><strong>Year:</strong> {formData.year}</div>
                    <div><strong>Email:</strong> {formData.email}</div>
                    <div><strong>Phone:</strong> {formData.phone}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button onClick={handleNextStep}>
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleRegister}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Complete Registration"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentRegistration;
