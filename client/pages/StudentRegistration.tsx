import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, tables } from "@/lib/supabase";
import { validateStudentLocally } from "@/utils/localStudentData";
import { validateStudentInList } from "@/services/studentsListService";
import { GraduationCap, ArrowLeft, CheckCircle } from "lucide-react";

const StudentRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    hallTicket: "",
    fullName: "",
    email: "",
    year: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.hallTicket || !formData.fullName || !formData.email || !formData.year || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields");
      return false;
    }

    // Validate password
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Validate hall ticket format - matches patterns like 23891A7205, 24891A7201, etc.
    const hallTicketPattern = /^[0-9]{2}[0-9]{3}[A-Z][0-9]{4}$/;
    if (!hallTicketPattern.test(formData.hallTicket)) {
      setError("Please enter a valid hall ticket number (e.g., 23891A7205)");
      return false;
    }

    return true;
  };

  const handleCreateAccount = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      console.log("🔍 Validating student data...");

      // First check local data
      const isValidLocal = validateStudentLocally(
        formData.hallTicket,
        formData.fullName,
        formData.year,
      );

      let isValidDatabase = false;

      // Try database validation if available
      if (supabase) {
        try {
          isValidDatabase = await validateStudentInList(
            formData.hallTicket,
            formData.fullName,
            formData.year,
          );

          // Fallback to student_data table if students_list doesn't work
          if (!isValidDatabase) {
            const { data } = await supabase
              .from("student_data")
              .select("*")
              .eq("ht_no", formData.hallTicket)
              .eq("student_name", formData.fullName.toUpperCase())
              .eq("year", formData.year)
              .single();

            isValidDatabase = !!data;
          }
        } catch (dbError) {
          console.warn(
            "Database validation failed, using local only:",
            dbError,
          );
        }
      }

      // Check if student is valid in either local or database
      if (!isValidLocal && !isValidDatabase) {
        setError(
          "Student data not found. Please verify your Hall Ticket Number, Name, and Year match our records exactly.",
        );
        setLoading(false);
        return;
      }

      console.log("✅ Student validated successfully");

      // Check if account already exists (prefer Supabase)
      if (tables.students()) {
        try {
          const { data: existingDbStudent } = await tables
            .students()
            .select("*")
            .eq("hall_ticket", formData.hallTicket)
            .single();

          if (existingDbStudent) {
            console.log("📋 Account exists in database, logging in...");
            login({
              id: existingDbStudent.user_id || existingDbStudent.id,
              name: existingDbStudent.name,
              role: "student",
              hallTicket: existingDbStudent.hall_ticket,
              email: existingDbStudent.email,
              year: existingDbStudent.year,
              section: existingDbStudent.section || "A",
            });

            toast({
              title: "Welcome back!",
              description: "Logging you into your existing account.",
            });

            navigate("/dashboard/student");
            return;
          }
        } catch (_) {
          // ignore and try local fallback
        }
      }

      // Local fallback check for existing account
      const existingUsers = JSON.parse(
        localStorage.getItem("localUsers") || "[]",
      );
      const existingUser = existingUsers.find(
        (u: any) => u.hallTicket === formData.hallTicket,
      );
      if (existingUser) {
        console.log("📋 Account exists locally, logging in...");
        login({
          id: existingUser.id,
          name: existingUser.name,
          role: "student",
          hallTicket: existingUser.hallTicket,
          email: existingUser.email,
          year: existingUser.year,
          section: existingUser.section || "A",
        });
        toast({ title: "Welcome back!", description: "Logging you in." });
        navigate("/dashboard/student");
        return;
      }

      // Create new account
      console.log("✨ Creating new student account...");

      const userProfileId = crypto.randomUUID();
      const newUser = {
        id: userProfileId,
        name: formData.fullName,
        role: "student",
        hallTicket: formData.hallTicket,
        email: formData.email,
        phone: "",
        year: formData.year,
        section: "A",
        password: formData.password, // Use the password created by user
        createdAt: new Date().toISOString(),
        profileCompleted: false, // Flag to force profile completion
      };

      // Prefer storing in database; fall back to local only if DB fails
      let dbStored = false;
      if (supabase && tables.userProfiles() && tables.students()) {
        try {
          console.log("🗄️ Attempting to store in database...");
          console.log("📋 User Profile Data:", {
            id: userProfileId,
            email: formData.email,
            role: "student",
            hall_ticket: formData.hallTicket,
            name: formData.fullName,
            year: formData.year,
          });

          // Insert into user_profiles first
          const userProfileResult = await tables.userProfiles().insert([
            {
              id: userProfileId,
              email: formData.email,
              role: "student",
              hall_ticket: formData.hallTicket,
              name: formData.fullName,
              year: formData.year,
              is_active: true,
              profile_completed: false,
            },
          ]);

          if (userProfileResult.error) {
            throw new Error(`User profile insert failed: ${userProfileResult.error.message}`);
          }

          console.log("✅ User profile created:", userProfileResult.data);

          // Insert into students table
          const studentId = crypto.randomUUID();
          const studentResult = await tables.students().insert([
            {
              id: studentId,
              user_id: userProfileId,
              hall_ticket: formData.hallTicket,
              name: formData.fullName,
              email: newUser.email,
              year: formData.year,
              section: "A",
              is_active: true,
              password: formData.password,
            },
          ]);

          if (studentResult.error) {
            throw new Error(`Student record insert failed: ${studentResult.error.message}`);
          }

          console.log("✅ Student record created:", studentResult.data);

          dbStored = true;
          console.log("✅ Account stored in database successfully");
        } catch (dbError) {
          console.error("❌ Database storage failed:", dbError);
          console.error("Error details:", {
            message: dbError.message,
            code: dbError.code,
            details: dbError.details,
          });
        }
      } else {
        console.warn("⚠️ Database not available:", {
          supabase: !!supabase,
          userProfiles: !!tables.userProfiles(),
          students: !!tables.students(),
        });
      }

      if (!dbStored) {
        // Store locally only if DB not available
        existingUsers.push(newUser);
        localStorage.setItem("localUsers", JSON.stringify(existingUsers));
        console.log("💾 Account stored locally (DB unavailable)");
      }

      // Auto-login the new user
      login({
        id: newUser.id,
        name: newUser.name,
        role: "student",
        hallTicket: newUser.hallTicket,
        email: newUser.email,
        year: newUser.year,
        section: newUser.section,
      });

      toast({
        title: "Account Created!",
        description: "Complete your profile to access all features.",
      });

      // Redirect to student dashboard
      navigate("/dashboard/student");
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/login/student"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create Student Account
          </h1>
          <p className="text-gray-600">
            Enter your basic details to get started
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
            <CardDescription>
              We'll verify your details against our records
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hallTicket">Hall Ticket Number *</Label>
                <Input
                  id="hallTicket"
                  value={formData.hallTicket}
                  onChange={(e) =>
                    handleInputChange(
                      "hallTicket",
                      e.target.value.toUpperCase(),
                    )
                  }
                  placeholder="23891A7205"
                  className="font-mono"
                  required
                />
                <p className="text-xs text-gray-500">
                  Enter your hall ticket number exactly as provided
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value.toUpperCase())
                  }
                  placeholder="ENTER YOUR FULL NAME"
                  className="uppercase"
                  required
                />
                <p className="text-xs text-gray-500">
                  Enter your name exactly as it appears in college records
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    handleInputChange("email", e.target.value.toLowerCase())
                  }
                  placeholder="your.email@example.com"
                  required
                />
                <p className="text-xs text-gray-500">
                  Enter your personal email address
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Academic Year *</Label>
                <Select
                  value={formData.year}
                  onValueChange={(value) => handleInputChange("year", value)}
                >
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
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Create Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Create a strong password"
                  required
                />
                <p className="text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">
                What happens next?
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• We'll verify your details against our records</li>
                <li>• If found, you'll be taken to your dashboard</li>
                <li>• Complete your profile to access all features</li>
                <li>• Use your created password to login in the future</li>
              </ul>
            </div>

            <Button
              onClick={handleCreateAccount}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Create Account</span>
                </div>
              )}
            </Button>

            <div className="text-center text-sm text-gray-600">
              <p>Already have an account?</p>
              <Link
                to="/login/student"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentRegistration;
