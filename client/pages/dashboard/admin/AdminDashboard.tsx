import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Users, 
  UserCheck, 
  Settings, 
  BarChart3, 
  FileText,
  Calendar,
  TrendingUp,
  Shield,
  Database,
  Bell,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  Award,
  Upload,
  Globe
} from "lucide-react";

const AdminDashboard = () => {
  const [systemStats, setSystemStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    pendingApprovals: 0,
    systemHealth: 98,
    activeUsers: 245,
    storageUsed: 67
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [contentStats, setContentStats] = useState({
    events: 12,
    gallery: 48,
    announcements: 8,
    placementRecords: 156
  });

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      // Fetch students data
      const studentsResponse = await fetch('/api/students/stats');
      const studentsData = await studentsResponse.json();
      
      if (studentsData.success) {
        setSystemStats(prev => ({
          ...prev,
          totalStudents: studentsData.data.total,
          activeUsers: studentsData.data.total + 45 // Simulated total active users
        }));
      }

      // Simulate other system data
      setSystemStats(prev => ({
        ...prev,
        totalFaculty: 15,
        pendingApprovals: 8,
        systemHealth: 98,
        storageUsed: 67
      }));

      setRecentActivities([
        {
          id: 1,
          type: "user",
          title: "New student registration",
          description: "5 students registered today",
          time: "10 minutes ago",
          icon: Users,
          status: "info"
        },
        {
          id: 2,
          type: "approval",
          title: "Certificate approvals pending",
          description: "8 certificates awaiting review",
          time: "30 minutes ago",
          icon: FileText,
          status: "warning"
        },
        {
          id: 3,
          type: "content",
          title: "Homepage content updated",
          description: "Gallery section updated with new images",
          time: "2 hours ago",
          icon: Globe,
          status: "success"
        },
        {
          id: 4,
          type: "system",
          title: "System backup completed",
          description: "Daily backup process successful",
          time: "6 hours ago",
          icon: Database,
          status: "success"
        }
      ]);

      setSystemAlerts([
        {
          id: 1,
          type: "warning",
          title: "Storage Usage High",
          message: "Storage usage is at 67%. Consider cleaning up old files.",
          priority: "medium"
        },
        {
          id: 2,
          type: "info",
          title: "Scheduled Maintenance",
          message: "System maintenance scheduled for March 30, 2025 at 2:00 AM",
          priority: "low"
        }
      ]);

    } catch (error) {
      console.error('Error fetching system data:', error);
    }
  };

  const quickActions = [
    {
      title: "Manage Students",
      description: "View, add, edit student records",
      link: "/dashboard/admin/students",
      icon: Users,
      color: "bg-blue-600"
    },
    {
      title: "Manage Faculty",
      description: "Faculty profiles and assignments",
      link: "/dashboard/admin/faculty",
      icon: UserCheck,
      color: "bg-green-600"
    },
    {
      title: "Content Management",
      description: "Update homepage and website content",
      link: "/dashboard/admin/content",
      icon: Globe,
      color: "bg-purple-600"
    },
    {
      title: "System Settings",
      description: "Configure system parameters",
      link: "/dashboard/admin/settings",
      icon: Settings,
      color: "bg-orange-600"
    }
  ];

  const systemMetrics = [
    {
      title: "Total Students",
      value: systemStats.totalStudents.toString(),
      description: "Registered students",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+5 this week"
    },
    {
      title: "Total Faculty",
      value: systemStats.totalFaculty.toString(),
      description: "Active faculty members",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "No change"
    },
    {
      title: "Pending Approvals",
      value: systemStats.pendingApprovals.toString(),
      description: "Awaiting review",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+3 today"
    },
    {
      title: "System Health",
      value: `${systemStats.systemHealth}%`,
      description: "Overall system status",
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "Excellent"
    }
  ];

  return (
    <DashboardLayout userType="admin" userName="Admin User">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-red-100">
                Complete system administration and management control
              </p>
            </div>
          </div>
        </div>

        {/* System Alerts */}
        {systemAlerts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>System Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border ${
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{alert.title}</h4>
                    <Badge variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'default' : 'outline'}>
                      {alert.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemMetrics.map((metric, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <div className={`p-2 rounded-md ${metric.bgColor}`}>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
                <p className="text-xs text-green-600 mt-1">{metric.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used administrative functions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} to={action.link}>
                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-md ${action.color}`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Current system status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Health</span>
                  <span>{systemStats.systemHealth}%</span>
                </div>
                <Progress value={systemStats.systemHealth} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Storage Usage</span>
                  <span>{systemStats.storageUsed}%</span>
                </div>
                <Progress value={systemStats.storageUsed} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Active Users</span>
                  <span>{systemStats.activeUsers}</span>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <div className="text-sm text-green-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  All systems operational
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Management Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Content Management Overview</CardTitle>
            <CardDescription>Website content statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{contentStats.events}</div>
                <div className="text-sm text-gray-600">Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{contentStats.gallery}</div>
                <div className="text-sm text-gray-600">Gallery Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{contentStats.announcements}</div>
                <div className="text-sm text-gray-600">Announcements</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{contentStats.placementRecords}</div>
                <div className="text-sm text-gray-600">Placement Records</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent System Activities</CardTitle>
            <CardDescription>Latest administrative actions and system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-50' :
                    activity.status === 'warning' ? 'bg-orange-50' : 'bg-blue-50'
                  }`}>
                    <activity.icon className={`h-5 w-5 ${
                      activity.status === 'success' ? 'text-green-600' :
                      activity.status === 'warning' ? 'text-orange-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{activity.title}</h3>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Management Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Administrative Tools</CardTitle>
            <CardDescription>System management and maintenance tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <Database className="h-5 w-5 mb-2" />
                  <div className="font-medium">Database Backup</div>
                  <div className="text-xs text-gray-600">Create system backup</div>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <Upload className="h-5 w-5 mb-2" />
                  <div className="font-medium">Bulk Import</div>
                  <div className="text-xs text-gray-600">Import student data</div>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <Bell className="h-5 w-5 mb-2" />
                  <div className="font-medium">Send Notifications</div>
                  <div className="text-xs text-gray-600">Broadcast messages</div>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <BarChart3 className="h-5 w-5 mb-2" />
                  <div className="font-medium">Generate Reports</div>
                  <div className="text-xs text-gray-600">System reports</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
