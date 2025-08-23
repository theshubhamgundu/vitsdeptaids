import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { sessionService } from "@/services/sessionService";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  X,
  Home,
  User,
  Award,
  BarChart3,
  Calendar,
  BookOpen,
  Clock,
  FileText,
  Plane,
  Users,
  Upload,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Cpu,
  Crown,
  Shield,
  GraduationCap,
  CreditCard,
  Wrench,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: "student" | "faculty" | "admin" | "hod";
  userName?: string; // Make optional since we'll use AuthContext
}

const DashboardLayout = ({
  children,
  userType,
  userName,
}: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, logoutAllDevices } = useAuth();

  // Use real user data from AuthContext, fallback to prop
  const displayName = user?.name || userName || "User";
  const displayEmail = user?.email || "";

  const navigationConfig = {
    student: {
      title: "Student Dashboard",
      icon: GraduationCap,
      color: "bg-blue-600",
      items: [
        { name: "Dashboard", href: "/dashboard/student", icon: Home },
        { name: "Profile", href: "/dashboard/student/profile", icon: User },
        {
          name: "Certificates",
          href: "/dashboard/student/certificates",
          icon: Award,
        },
        {
          name: "Results",
          href: "/dashboard/student/results",
          icon: BarChart3,
        },
        {
          name: "Attendance",
          href: "/dashboard/student/attendance",
          icon: Calendar,
        },
        {
          name: "Study Materials",
          href: "/dashboard/student/materials",
          icon: BookOpen,
        },
        {
          name: "Timetable",
          href: "/dashboard/student/timetable",
          icon: Clock,
        },
        {
          name: "Leave Applications",
          href: "/dashboard/student/leave",
          icon: Plane,
        },
        {
          name: "Fee Payment",
          href: "/dashboard/student/fees",
          icon: CreditCard,
        },
      ],
    },
    faculty: {
      title: "Faculty Dashboard",
      icon: Users,
      color: "bg-green-600",
      items: [
        { name: "Dashboard", href: "/dashboard/faculty", icon: Home },
        { name: "Profile", href: "/dashboard/faculty/profile", icon: User },
        { name: "Students", href: "/dashboard/faculty/students", icon: Users },
        {
          name: "Study Materials",
          href: "/dashboard/faculty/materials",
          icon: Upload,
        },
        {
          name: "Results",
          href: "/dashboard/faculty/results",
          icon: BarChart3,
        },
        {
          name: "Messages",
          href: "/dashboard/faculty/messages",
          icon: MessageSquare,
        },
        {
          name: "Leave Applications",
          href: "/dashboard/faculty/leave",
          icon: Plane,
        },
      ],
    },
    admin: {
      title: "Admin Panel",
      icon: Shield,
      color: "bg-red-600",
      items: [
        { name: "Dashboard", href: "/dashboard/admin", icon: Home },
        { name: "Profile", href: "/dashboard/admin/profile", icon: User },
        { name: "Students", href: "/dashboard/admin/students", icon: Users },
        { name: "Faculty", href: "/dashboard/admin/faculty", icon: Users },
        {
          name: "Timetable Creator",
          href: "/dashboard/admin/timetable-creator",
          icon: Clock,
        },
        {
          name: "Content Management",
          href: "/dashboard/admin/content",
          icon: Settings,
        },
        { name: "Admin Tools", href: "/dashboard/admin/tools", icon: Wrench },
      ],
    },
    hod: {
      title: "HOD Dashboard",
      icon: Crown,
      color: "bg-purple-600",
      items: [
        { name: "Dashboard", href: "/dashboard/hod", icon: Home },
        { name: "Profile", href: "/dashboard/hod/profile", icon: User },
        { name: "Students", href: "/dashboard/hod/students", icon: Users },
        {
          name: "Faculty Leaves",
          href: "/dashboard/hod/faculty-leaves",
          icon: FileText,
        },
        { name: "Timetables", href: "/dashboard/hod/timetables", icon: Clock },
        {
          name: "Messages",
          href: "/dashboard/hod/messages",
          icon: MessageSquare,
        },
      ],
    },
  };

  const config = navigationConfig[userType];
  const IconComponent = config.icon;

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:block ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 border-b">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className={`p-1.5 sm:p-2 rounded-lg ${config.color}`}>
              <IconComponent className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-sm sm:text-lg font-semibold text-gray-900">
                AI & DS
              </h1>
              <Badge variant="outline" className="text-xs">
                {userType.toUpperCase()}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        <nav className="mt-4 sm:mt-6 px-2 sm:px-3">
          <div className="space-y-1">
            {config.items.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-2 sm:px-3 py-2.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                  isActivePath(item.href)
                    ? `${config.color} text-white`
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="truncate">{item.name}</span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-4 sm:bottom-6 left-2 right-2 sm:left-3 sm:right-3">
          <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarImage src="/api/placeholder/40/40" />
                <AvatarFallback className="text-xs sm:text-sm">
                  {displayName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500 capitalize">{userType}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b h-14 sm:h-16 flex-shrink-0">
          <div className="flex items-center justify-between h-full px-3 sm:px-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1"
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <div>
                <h1 className="text-base sm:text-xl font-semibold text-gray-900 truncate">
                  {config.title}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  Welcome back, {displayName}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="relative p-1 sm:p-2"
                onClick={() => {
                  // In real app, this would open notifications panel
                  console.log("Open notifications");
                }}
                title="View notifications"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full p-0"
                  >
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                      <AvatarImage src="/api/placeholder/40/40" />
                      <AvatarFallback className="text-xs sm:text-sm">
                        {userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 sm:w-56"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-xs sm:text-sm font-medium leading-none truncate">
                        {userName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {userType}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to={`/dashboard/${userType}/profile`}
                      className="cursor-pointer"
                    >
                      <User className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user && sessionService.hasMultipleSessions(user.id) && (
                    <DropdownMenuItem
                      onClick={() => logoutAllDevices()}
                      className="cursor-pointer"
                    >
                      <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">
                        Log out all devices
                      </span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">
                      Log out this device
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-3 sm:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
