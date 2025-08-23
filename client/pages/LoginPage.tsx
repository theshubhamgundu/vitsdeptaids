import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
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
import { useAuth } from "@/contexts/AuthContext";
import {
  authenticateFaculty,
  authenticateStudent,
} from "@/services/authService";
import {
  User,
  GraduationCap,
  Users,
  Shield,
  Crown,
  Eye,
  EyeOff,
  Cpu,
  ArrowLeft,
} from "lucide-react";

const LoginPage = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, isAuthenticated, logout } = useAuth();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forceShowLogin, setForceShowLogin] = useState(false);

  // Simple authentication handling
  useEffect(() => {
    // If user is authenticated, redirect them to appropriate dashboard
    if (isAuthenticated) {
      const from = location.state?.from?.pathname;
      if (from) {
        console.log("🔄 Redirecting authenticated user to:", from);
        navigate(from, { replace: true });
      } else {
        // Redirect to appropriate dashboard based on user role
        console.log("🔄 User already authenticated, redirecting to dashboard");
        logout(); // Clear auth for fresh login
      }
      return;
    }

    // Show login form
    setForceShowLogin(true);
  }, [isAuthenticated, location.state?.from, navigate, logout]);

  const loginTypes = {
    student: {
      title: "Student Login",
      icon: GraduationCap,
      placeholder: "Hall Ticket Number",
      description: "Access your student dashboard",
      gradient: "from-blue-500 to-purple-600",
    },
    faculty: {
      title: "Faculty / HOD Login",
      icon: Users,
      placeholder: "Employee ID",
      description: "Access your faculty or HOD dashboard",
      gradient: "from-green-500 to-blue-600",
    },
    admin: {
      title: "Admin Login",
      icon: Shield,
      placeholder: "Admin ID",
      description: "Access admin panel",
      gradient: "from-red-500 to-pink-600",
    },
  };

  const currentType =
    loginTypes[type as keyof typeof loginTypes] || loginTypes.student;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (loading) {
      console.log("🔄 Login already in progress, ignoring submission");
      return;
    }

    setLoading(true);
    setError("");
    console.log("🔐 Starting login attempt for:", formData.identifier);

    try {
      if (type === "faculty" || type === "admin") {
        // Use faculty database for authentication
        const faculty = await authenticateFaculty(
          formData.identifier,
          formData.password,
        );

        if (faculty) {
          console.log("✅ Faculty authentication successful");

          // Show success toast only once
          toast({
            title: "Login Successful",
            description: `Welcome back, ${faculty.name}!`,
          });

          // Route based on faculty role
          const dashboardRoutes = {
            HOD: "/dashboard/hod",
            Faculty: "/dashboard/faculty",
            Admin: "/dashboard/admin",
          };

          const route = dashboardRoutes[faculty.role] || "/dashboard/faculty";

          // Use auth context to store user data
          login({
            id: faculty.id,
            name: faculty.name,
            role: faculty.role.toLowerCase(),
            facultyId: faculty.facultyId,
            email: faculty.email,
            designation: faculty.designation,
          });

          // Navigate immediately after login
          const from = location.state?.from?.pathname || route;
          console.log("🔄 Navigating immediately to:", from);

          // Use setTimeout to ensure state is updated before navigation
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 0);
        } else {
          setError(
            "Invalid credentials. Please check your Faculty/Employee ID and password.",
          );
        }
      } else if (type === "student") {
        // Use student authentication service
        const student = await authenticateStudent(
          formData.identifier,
          formData.password,
        );

        if (student) {
          console.log("✅ Student authentication successful");

          // Show success toast only once
          toast({
            title: "Login Successful",
            description: `Welcome back, ${student.name}!`,
          });

          // Use auth context to store user data
          login({
            id: student.id,
            name: student.name,
            role: "student",
            hallTicket: student.hallTicket,
            email: student.email,
            year: student.year,
            section: student.section,
          });

          // Navigate immediately after login
          const from = location.state?.from?.pathname || "/dashboard/student";
          console.log("🔄 Navigating immediately to:", from);

          // Use setTimeout to ensure state is updated before navigation
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 0);
        } else {
          setError(
            "Invalid credentials. Please check your Hall Ticket Number and password.",
          );
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while determining whether to show login form
  if (!forceShowLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const IconComponent = currentType.icon;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${currentType.gradient} flex items-center justify-center p-4`}
    >
      <div className="absolute inset-0 bg-black opacity-20"></div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div
              className={`p-3 rounded-full bg-gradient-to-r ${currentType.gradient}`}
            >
              <IconComponent className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">
              {currentType.title}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {currentType.description}
            </CardDescription>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Cpu className="h-4 w-4" />
            <span>AI & Data Science Department</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">{currentType.placeholder}</Label>
              <Input
                id="identifier"
                placeholder={`Enter your ${currentType.placeholder.toLowerCase()}`}
                value={formData.identifier}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    identifier: e.target.value,
                  }))
                }
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className={`w-full h-11 bg-gradient-to-r ${currentType.gradient} hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={loading || !formData.identifier || !formData.password}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <button className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </button>

            {type === "student" && (
              <div className="space-y-3">
                <div className="border rounded-lg p-3 bg-blue-50 text-center">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Don't have an account?
                  </p>
                  <Link to="/register/student">
                    <Button variant="outline" className="w-full">
                      Create Student Account
                    </Button>
                  </Link>
                  <p className="text-xs text-gray-600 mt-2">
                    Register with your hall ticket and academic details
                  </p>
                </div>

                <div className="border rounded-lg p-3 bg-yellow-50 border-yellow-200">
                  <p className="text-xs font-medium text-yellow-800 mb-1">
                    Demo Credentials:
                  </p>
                  <p className="text-xs text-yellow-700">
                    Hall Ticket: 20AI001 | Password: student123
                  </p>
                </div>
              </div>
            )}

            {(type === "faculty" || type === "admin") && (
              <div className="border rounded-lg p-3 bg-gray-50 text-left">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Demo Credentials:
                </p>
                <div className="space-y-1 text-xs text-gray-600">
                  <div>
                    <strong>HOD:</strong> AIDS-HVS1 / @VSrinivas231
                  </div>
                  <div>
                    <strong>Faculty:</strong> AIDS-ANK1 / @NMKrishna342
                  </div>
                  <div>
                    <strong>Admin:</strong> AIDS-DKS1 / @KSomesh702
                  </div>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <p className="text-sm text-gray-600 mb-3">
                Login as different role:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(loginTypes).map(
                  ([key, config]) =>
                    key !== type && (
                      <Link
                        key={key}
                        to={`/login/${key}`}
                        className="text-xs px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors text-center"
                      >
                        {config.title}
                      </Link>
                    ),
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center space-x-2 text-white hover:text-gray-200 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Home</span>
      </Link>
    </div>
  );
};

export default LoginPage;
