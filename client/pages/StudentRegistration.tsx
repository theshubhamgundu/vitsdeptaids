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
import { supabase, tables } from "@/lib/supabase";
import { testDatabaseConnection } from "@/utils/databaseTest";
import { verifySupabaseCredentials } from "@/utils/supabaseVerify";
import { validateStudentLocally } from "@/utils/localStudentData";
import { GraduationCap, ArrowLeft, User, CheckCircle } from "lucide-react";

const StudentRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    hallTicket: "",
    fullName: "",
    year: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateForm = () => {
    if (
      !formData.hallTicket ||
      !formData.fullName ||
      !formData.year ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields");
      return false;
    }

    // Validate hall ticket format - matches patterns like 23891A7205, 24891A7201, etc.
    const hallTicketPattern = /^[0-9]{2}[0-9]{3}[A-Z][0-9]{4}$/;
    if (!hallTicketPattern.test(formData.hallTicket)) {
      setError("Please enter a valid hall ticket number (e.g., 23891A7205)");
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

    // Validate email if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      // Check if Supabase is available
      if (!supabase) {
        throw new Error("Database not available. Please try again later.");
      }

      // Test database connection first (skip if Supabase not configured properly)
      let skipDatabase = false;

      if (!supabase) {
        console.log("⚠️ Supabase not configured - using local fallback only");
        skipDatabase = true;
      } else {
        try {
          const connectionTest = await testDatabaseConnection();
          if (!connectionTest) {
            console.log("⚠️ Database test failed - using local fallback only");
            skipDatabase = true;
          }
        } catch (testError) {
          if (testError.message && testError.message.includes("Headers")) {
            console.log(
              "🔑 Headers error detected - using local fallback only",
            );
            skipDatabase = true;
          } else {
            console.log(
              "⚠️ Database connection issue - using local fallback only",
            );
            skipDatabase = true;
          }
        }
      }

      // Check if student exists in student_data table
      let studentData = null;
      let useLocalFallback = skipDatabase;

      if (!skipDatabase) {
        try {
          const { data, error: searchError } = await supabase
            .from("student_data")
            .select("*")
            .eq("ht_no", formData.hallTicket)
            .eq("student_name", formData.fullName.toUpperCase())
            .eq("year", formData.year)
            .single();

          if (searchError && searchError.code !== "PGRST116") {
            console.warn(
              "Database query failed, using local fallback:",
              searchError.message,
            );
            useLocalFallback = true;
          } else {
            studentData = data;
          }
        } catch (dbError) {
          console.warn(
            "Database connection failed, using local fallback:",
            dbError,
          );

          // Force local fallback on Headers errors
          if (dbError.message && dbError.message.includes("Headers")) {
            console.log("🔑 Headers error - forcing local fallback mode");
          }

          useLocalFallback = true;
        }
      }

      // Use local fallback if database fails
      if (useLocalFallback) {
        const isValidStudent = validateStudentLocally(
          formData.hallTicket,
          formData.fullName,
          formData.year,
        );
        if (!isValidStudent) {
          setError(
            "Student data not found in local records. Please verify your Hall Ticket Number, Name, and Year match our records exactly.",
          );
          setLoading(false);
          return;
        }
        console.log("✅ Student validated using local fallback data");
      } else if (!studentData) {
        setError(
          "Student data not found. Please verify your Hall Ticket Number, Name, and Year match our records exactly.",
        );
        setLoading(false);
        return;
      }

      // If using local fallback or database is unavailable, skip database operations and create local user
      if (useLocalFallback || skipDatabase) {
        console.log(
          "⚠️ Using local fallback - creating temporary user session",
        );

        // Check if user already exists in localStorage
        const existingUsers = JSON.parse(
          localStorage.getItem("localUsers") || "[]",
        );
        const existingUser = existingUsers.find(
          (u) => u.hallTicket === formData.hallTicket,
        );

        if (existingUser) {
          setError(
            "Account already exists for this hall ticket. Please login instead.",
          );
          setLoading(false);
          return;
        }

        // Create local user record
        const userProfileId = crypto.randomUUID();
        const newUser = {
          id: userProfileId,
          name: formData.fullName,
          role: "student",
          hallTicket: formData.hallTicket,
          email: formData.email || `${formData.hallTicket}@vignan.ac.in`,
          phone: formData.phone || "",
          year: formData.year,
          section: "A",
          password: formData.password, // Store password for authentication
          createdAt: new Date().toISOString(),
          cgpa: 0.0,
          attendance: 0,
          status: "Active",
        };

        existingUsers.push(newUser);
        localStorage.setItem("localUsers", JSON.stringify(existingUsers));

        // Store current user session with complete data
        const userSession = {
          id: newUser.id,
          name: newUser.name,
          role: newUser.role,
          hallTicket: newUser.hallTicket,
          email: newUser.email,
          phone: newUser.phone,
          year: newUser.year,
          section: newUser.section,
          createdAt: newUser.createdAt,
        };
        localStorage.setItem("currentUser", JSON.stringify(userSession));
      } else {
        // Normal database operations
        // Check if user profile already exists
        const { data: existingUser } = await tables
          .userProfiles()
          ?.select("*")
          .eq("hall_ticket", formData.hallTicket)
          .single();

        if (existingUser) {
          setError(
            "Account already exists for this hall ticket. Please login instead.",
          );
          setLoading(false);
          return;
        }

        // Create user profile
        const userProfileId = crypto.randomUUID();
        const { error: userError } = await tables.userProfiles()?.insert([
          {
            id: userProfileId,
            email: `${formData.hallTicket}@vignan.ac.in`,
            role: "student",
            hall_ticket: formData.hallTicket,
            name: formData.fullName,
            year: formData.year,
            is_active: true,
          },
        ]);

        if (userError) throw userError;

        // Create student record
        const { error: studentError } = await tables.students()?.insert([
          {
            id: crypto.randomUUID(),
            user_id: userProfileId,
            hall_ticket: formData.hallTicket,
            name: formData.fullName,
            email: `${formData.hallTicket}@vignan.ac.in`,
            year: formData.year,
            section: "A", // Default section since there's only one
            is_active: true,
          },
        ]);

        if (studentError) throw studentError;

        // Store user data for auto-login
        const userSession = {
          id: userProfileId,
          name: formData.fullName,
          role: "student",
          hallTicket: formData.hallTicket,
          email: formData.email || `${formData.hallTicket}@vignan.ac.in`,
          phone: formData.phone || "",
          year: formData.year,
          section: "A",
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem("currentUser", JSON.stringify(userSession));
      }

      toast({
        title: "Registration Successful!",
        description:
          "Your account has been created. Complete your profile in the dashboard.",
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
            Student Registration
          </h1>
          <p className="text-gray-600">Create your student account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Student Information
            </CardTitle>
            <CardDescription>
              Enter your details to create an account
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
                <Label htmlFor="hallTicket">Hall Ticket Number</Label>
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
                />
                <p className="text-xs text-gray-500">
                  Enter your hall ticket number exactly as provided by the
                  college
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value.toUpperCase())
                  }
                  placeholder="ENTER YOUR FULL NAME"
                  className="uppercase"
                />
                <p className="text-xs text-gray-500">
                  Enter your name exactly as it appears in college records
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Academic Year</Label>
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

              <div className="space-y-2">
                <Label htmlFor="email">Email Address (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your.email@example.com"
                />
                <p className="text-xs text-gray-500">
                  If not provided, we'll use{" "}
                  {formData.hallTicket && `${formData.hallTicket}@vignan.ac.in`}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Create Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Enter a secure password"
                  required
                />
                <p className="text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Re-enter your password"
                  required
                />
              </div>
            </div>

            <Button
              onClick={handleRegister}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
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
