import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getAllStudents } from "@/services/studentDataService";
import { resultsService } from "@/services/resultsService";
import { materialsService } from "@/services/materialsService";
import {
  Users,
  BarChart3,
  Upload,
  Download,
  FileText,
  Settings,
  Database,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  Eye,
  Search,
  Filter,
  Save,
  Eye,
  Calculator
} from "lucide-react";

const AdminTools = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("results");
  const [loading, setLoading] = useState(false);

  // Results management
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showAddResult, setShowAddResult] = useState(false);

  // Attendance management
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  
  // Materials management
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  
  // System settings
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    backupFrequency: "daily",
    notificationSettings: {
      email: true,
      sms: false,
      push: true
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load results
      const allResults = resultsService.getAllResults();
      setResults(allResults);
      
      // Load attendance records
      loadAttendanceRecords();
      
      // Load materials
      const allMaterials = materialsService.getAllMaterials();
      setMaterials(allMaterials);
      
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load attendance records from localStorage or database
  const loadAttendanceRecords = () => {
    try {
      const savedAttendance = localStorage.getItem('adminAttendance');
      if (savedAttendance) {
        setAttendanceRecords(JSON.parse(savedAttendance));
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const semesters = ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"];
  const subjects = ["Machine Learning", "Deep Learning", "Data Science", "Programming", "Statistics", "Mathematics"];
  const examTypes = ["Mid-term", "End-term", "Internal Assessment", "Quiz", "Assignment"];

  const handleUploadResults = () => {
    // TODO: Implement file upload and processing
    toast({
      title: "Upload Started",
      description: "Results file is being processed...",
    });
    setShowAddResult(false);
  };

  const handleBulkUpload = () => {
    // TODO: Implement bulk upload functionality
    toast({
      title: "Bulk Upload",
      description: "Processing bulk upload...",
    });
  };

  const handleExportData = () => {
    // TODO: Implement data export functionality
    toast({
      title: "Export Started",
      description: "Data export in progress...",
    });
  };

  const handleSystemBackup = () => {
    // TODO: Implement system backup
    toast({
      title: "Backup Started",
      description: "System backup in progress...",
    });
  };

  const handleMaintenanceToggle = () => {
    setSystemSettings(prev => ({
      ...prev,
      maintenanceMode: !prev.maintenanceMode
    }));
    
    toast({
      title: "Maintenance Mode",
      description: `Maintenance mode ${!systemSettings.maintenanceMode ? 'enabled' : 'disabled'}`,
    });
  };

  const handleSaveSettings = () => {
    // TODO: Save settings to database
    toast({
      title: "Settings Saved",
      description: "System settings updated successfully",
    });
  };

  if (loading) {
    return (
      <DashboardLayout userType="admin" userName="Admin User">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading admin tools...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Administrative Tools
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Advanced system management and data operations
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleSystemBackup} variant="outline" size="sm">
              <Database className="h-4 w-4 mr-2" />
              Backup
            </Button>
          </div>
        </div>

        {/* Main Tools */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="results">Results Management</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="materials">Study Materials</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          {/* Results Management */}
          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Results Management</span>
                  <Button onClick={() => setShowAddResult(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Result
                  </Button>
                </CardTitle>
                <CardDescription>
                  Manage student results and academic records
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No results found</p>
                    <p className="text-gray-400 text-xs">
                      Results will appear here once added
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button onClick={handleUploadResults} variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Results
                      </Button>
                      <Button onClick={handleExportData} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                        </div>
                    <p className="text-sm text-gray-600">
                      {results.length} results found in system
                    </p>
                              </div>
                            )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Management */}
          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Management</CardTitle>
                <CardDescription>
                  Monitor and manage student attendance records
                </CardDescription>
              </CardHeader>
              <CardContent>
                {attendanceRecords.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No attendance records found</p>
                    <p className="text-gray-400 text-xs">
                      Attendance data will appear here once recorded
                    </p>
                  </div>
                ) : (
                      <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      {attendanceRecords.length} attendance records found
                    </p>
                              </div>
                            )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Study Materials Management */}
          <TabsContent value="materials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Study Materials Management</CardTitle>
                <CardDescription>
                  Manage uploaded study materials and resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                {materials.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No study materials found</p>
                    <p className="text-gray-400 text-xs">
                      Materials will appear here once uploaded
                    </p>
                          </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button onClick={handleBulkUpload} variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Bulk Upload
                            </Button>
                      <Button onClick={handleExportData} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export List
                            </Button>
                          </div>
                    <p className="text-sm text-gray-600">
                      {materials.length} materials found in system
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>
                  Configure system parameters and maintenance settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Maintenance Mode */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Maintenance Mode</h3>
                    <p className="text-sm text-gray-600">
                      Temporarily disable system access for maintenance
                    </p>
                  </div>
                  <Button
                    onClick={handleMaintenanceToggle}
                    variant={systemSettings.maintenanceMode ? "destructive" : "outline"}
                  >
                    {systemSettings.maintenanceMode ? "Disable" : "Enable"}
                  </Button>
                </div>

                {/* Backup Settings */}
                <div className="space-y-3">
                  <h3 className="font-medium">Backup Configuration</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="backupFrequency">Backup Frequency</Label>
                      <select
                        id="backupFrequency"
                        value={systemSettings.backupFrequency}
                        onChange={(e) => setSystemSettings(prev => ({
                          ...prev,
                          backupFrequency: e.target.value
                        }))}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                              </div>
                              </div>
                            </div>

                {/* Notification Settings */}
                <div className="space-y-3">
                  <h3 className="font-medium">Notification Preferences</h3>
                  <div className="space-y-2">
                    {Object.entries(systemSettings.notificationSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={key}
                          checked={value}
                          onChange={(e) => setSystemSettings(prev => ({
                            ...prev,
                            notificationSettings: {
                              ...prev.notificationSettings,
                              [key]: e.target.checked
                            }
                          }))}
                        />
                        <Label htmlFor={key} className="capitalize">
                          {key} Notifications
                        </Label>
                            </div>
                    ))}
                            </div>
                            </div>

                <Button onClick={handleSaveSettings} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                              </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminTools;
