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
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.hallTicket || !formData.fullName || !formData.year) {
      setError("Please fill in all fields");
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

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      // Check if Supabase is available
      if (!supabase) {
        throw new Error("Database not available. Please try again later.");
      }

      // Test database connection first
      const connectionTest = await testDatabaseConnection();
      if (!connectionTest) {
        throw new Error("Database connection test failed. Please check the console for details.");
      }

      // Check if student exists in student_data table
      const { data: studentData, error: searchError } = await supabase
        .from("student_data")
        .select("*")
        .eq("ht_no", formData.hallTicket)
        .eq("student_name", formData.fullName.toUpperCase())
        .eq("year", formData.year)
        .single();

      if (searchError && searchError.code !== "PGRST116") {
        throw new Error("Database error. Please try again.");
      }

      if (!studentData) {
        setError(
          "Student data not found. Please verify your Hall Ticket Number, Name, and Year match our records exactly.",
        );
        setLoading(false);
        return;
      }

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

      toast({
        title: "Registration Successful!",
        description:
          "Your account has been created. Complete your profile in the dashboard.",
      });

      // Store user data for auto-login
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: userProfileId,
          name: formData.fullName,
          role: "student",
          hallTicket: formData.hallTicket,
          email: `${formData.hallTicket}@vignan.ac.in`,
          year: formData.year,
          section: "A",
        }),
      );

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
                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                    <SelectItem value="4th Year">4th Year</SelectItem>
                  </SelectContent>
                </Select>
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
