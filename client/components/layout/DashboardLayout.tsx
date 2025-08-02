import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  Wrench
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: "student" | "faculty" | "admin" | "hod";
  userName: string;
}

const DashboardLayout = ({ children, userType, userName }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationConfig = {
    student: {
      title: "Student Dashboard",
      icon: GraduationCap,
      color: "bg-blue-600",
      items: [
        { name: "Dashboard", href: "/dashboard/student", icon: Home },
        { name: "Profile", href: "/dashboard/student/profile", icon: User },
        { name: "Certificates", href: "/dashboard/student/certificates", icon: Award },
        { name: "Results", href: "/dashboard/student/results", icon: BarChart3 },
        { name: "Attendance", href: "/dashboard/student/attendance", icon: Calendar },
        { name: "Study Materials", href: "/dashboard/student/materials", icon: BookOpen },
        { name: "Timetable", href: "/dashboard/student/timetable", icon: Clock },
        { name: "Leave Applications", href: "/dashboard/student/leave", icon: Plane },
        { name: "Fee Payment", href: "/dashboard/student/fees", icon: CreditCard },
      ]
    },
    faculty: {
      title: "Faculty Dashboard",
      icon: Users,
      color: "bg-green-600",
      items: [
        { name: "Dashboard", href: "/dashboard/faculty", icon: Home },
        { name: "Profile", href: "/dashboard/faculty/profile", icon: User },
        { name: "Students", href: "/dashboard/faculty/students", icon: Users },
        { name: "Study Materials", href: "/dashboard/faculty/materials", icon: Upload },
        { name: "Results", href: "/dashboard/faculty/results", icon: BarChart3 },
        { name: "Messages", href: "/dashboard/faculty/messages", icon: MessageSquare },
        { name: "Leave Applications", href: "/dashboard/faculty/leave", icon: Plane },
      ]
    },
    admin: {
      title: "Admin Panel",
      icon: Shield,
      color: "bg-red-600",
      items: [
        { name: "Dashboard", href: "/dashboard/admin", icon: Home },
        { name: "Students", href: "/dashboard/admin/students", icon: Users },
        { name: "Faculty", href: "/dashboard/admin/faculty", icon: Users },
        { name: "Content Management", href: "/dashboard/admin/content", icon: Settings },
        { name: "Admin Tools", href: "/dashboard/admin/tools", icon: Wrench },
      ]
    },
    hod: {
      title: "HOD Dashboard",
      icon: Crown,
      color: "bg-purple-600",
      items: [
        { name: "Dashboard", href: "/dashboard/hod", icon: Home },
        { name: "Profile", href: "/dashboard/hod/profile", icon: User },
        { name: "Students", href: "/dashboard/hod/students", icon: Users },
        { name: "Faculty Leaves", href: "/dashboard/hod/faculty-leaves", icon: FileText },
        { name: "Timetables", href: "/dashboard/hod/timetables", icon: Clock },
        { name: "Messages", href: "/dashboard/hod/messages", icon: MessageSquare },
        { name: "Analytics", href: "/dashboard/hod/analytics", icon: BarChart3 },
      ]
    }
  };

  const config = navigationConfig[userType];
  const IconComponent = config.icon;

  const handleLogout = () => {
    // In real app, this would clear authentication tokens
    navigate("/");
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
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:block ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${config.color}`}>
              <IconComponent className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">AI & DS</h1>
              <Badge variant="outline" className="text-xs">
                {userType.toUpperCase()}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {config.items.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActivePath(item.href)
                    ? `${config.color} text-white`
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-6 left-3 right-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/api/placeholder/40/40" />
                <AvatarFallback>{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userName}
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
        <header className="bg-white shadow-sm border-b h-16 flex-shrink-0">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{config.title}</h1>
                <p className="text-sm text-gray-600">Welcome back, {userName}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/api/placeholder/40/40" />
                      <AvatarFallback>{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userName}</p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {userType}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={`/dashboard/${userType}/profile`} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
