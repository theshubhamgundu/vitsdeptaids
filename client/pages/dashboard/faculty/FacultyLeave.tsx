import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Upload,
  Download,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  User,
  Users
} from "lucide-react";

const FacultyLeave = () => {
  const { user } = useAuth();
  // Personal leave applications
  const [leaveApplications, setLeaveApplications] = useState([
    {
      id: 1,
      type: "Medical Leave",
      fromDate: "2025-03-15",
      toDate: "2025-03-17",
      days: 3,
      reason: "Medical treatment for flu symptoms",
      description: "Need to visit doctor and take rest for recovery",
      status: "Approved",
      appliedDate: "2025-03-10",
      approvedBy: "Dr. Head of Department",
      approvedDate: "2025-03-11",
      documents: ["medical_certificate.pdf"],
      emergencyContact: "+91 9876543210"
    },
    {
      id: 2,
      type: "Personal Leave",
      fromDate: "2025-03-22",
      toDate: "2025-03-23",
      days: 2,
      reason: "Family function attendance",
      description: "Sister's wedding ceremony",
      status: "Pending",
      appliedDate: "2025-03-12",
      approvedBy: null,
      approvedDate: null,
      documents: [],
      emergencyContact: "+91 9876543210"
    }
  ]);

  // Student leave applications that need faculty approval
  const [studentLeaveRequests, setStudentLeaveRequests] = useState([
    {
      id: 1,
      studentName: "Rahul Sharma",
      hallTicket: "20AI001",
      year: "3rd Year",
      semester: "6th Semester",
      type: "Medical Leave",
      fromDate: "2025-03-16",
      toDate: "2025-03-18",
      days: 3,
      reason: "Fever and cold",
      description: "Doctor advised rest for 3 days",
      status: "Pending",
      appliedDate: "2025-03-14",
      documents: ["medical_certificate.pdf"],
      parentContact: "+91 9876543200",
      studentContact: "+91 9876543201"
    },
    {
      id: 2,
      studentName: "Priya Reddy", 
      hallTicket: "20AI002",
      year: "3rd Year",
      semester: "6th Semester",
      type: "Personal Leave",
      fromDate: "2025-03-20",
      toDate: "2025-03-21",
      days: 2,
      reason: "Family emergency",
      description: "Grandmother hospitalized",
      status: "Pending",
      appliedDate: "2025-03-15",
      documents: [],
      parentContact: "+91 9876543202",
      studentContact: "+91 9876543203"
    },
    {
      id: 3,
      studentName: "Amit Kumar",
      hallTicket: "20AI003",
      year: "3rd Year",
      semester: "6th Semester",
      type: "Conference Leave",
      fromDate: "2025-03-25",
      toDate: "2025-03-27",
      days: 3,
      reason: "Technical conference participation",
      description: "Presenting paper at IEEE conference",
      status: "Approved",
      appliedDate: "2025-03-10",
      documents: ["conference_invitation.pdf"],
      parentContact: "+91 9876543204",
      studentContact: "+91 9876543205"
    }
  ]);

  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showStudentViewDialog, setShowStudentViewDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedStudentRequest, setSelectedStudentRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const [newApplication, setNewApplication] = useState({
    type: "Medical Leave",
    fromDate: "",
    toDate: "",
    reason: "",
    description: "",
    emergencyContact: "",
    documents: []
  });

  const leaveTypes = [
    "Medical Leave",
    "Personal Leave", 
    "Conference Leave",
    "Emergency Leave",
    "Maternity Leave",
    "Study Leave"
  ];

  const calculateDays = (fromDate, toDate) => {
    if (!fromDate || !toDate) return 0;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleApplyLeave = () => {
    if (!newApplication.fromDate || !newApplication.toDate || !newApplication.reason) return;

    const days = calculateDays(newApplication.fromDate, newApplication.toDate);
    
    const application = {
      ...newApplication,
      id: Date.now(),
      days: days,
      status: "Pending",
      appliedDate: new Date().toISOString().split('T')[0],
      approvedBy: null,
      approvedDate: null
    };

    setLeaveApplications(prev => [application, ...prev]);
    setShowApplyDialog(false);
    setNewApplication({
      type: "Medical Leave",
      fromDate: "",
      toDate: "",
      reason: "",
      description: "",
      emergencyContact: "",
      documents: []
    });
  };

  const handleApproveStudentLeave = (id) => {
    setStudentLeaveRequests(prev => prev.map(request =>
      request.id === id ? { ...request, status: "Approved", approvedBy: user?.name || "Faculty", approvedDate: new Date().toISOString().split('T')[0] } : request
    ));
  };

  const handleRejectStudentLeave = (id) => {
    setStudentLeaveRequests(prev => prev.map(request =>
      request.id === id ? { ...request, status: "Rejected", approvedBy: user?.name || "Faculty", approvedDate: new Date().toISOString().split('T')[0] } : request
    ));
  };

  const handleCancelApplication = (id) => {
    setLeaveApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: "Cancelled" } : app
    ));
  };

  const handleDeleteApplication = (id) => {
    setLeaveApplications(prev => prev.filter(app => app.id !== id));
  };

  const filteredApplications = leaveApplications.filter(app => {
    const matchesSearch = app.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || app.status === filterStatus;
    const matchesType = filterType === "all" || app.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredStudentRequests = studentLeaveRequests.filter(request => {
    const matchesSearch = request.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.hallTicket.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    const matchesType = filterType === "all" || request.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'rejected':
        return XCircle;
      case 'cancelled':
        return AlertCircle;
      default:
        return Clock;
    }
  };


  return (
    <DashboardLayout userType="faculty" userName={user?.name || "Faculty"}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
            <p className="text-gray-600">Manage your leave applications and approve student requests</p>
          </div>
          <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Apply for Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogDescription>Submit a new leave application</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Leave Type</Label>
                    <Select value={newApplication.type} onValueChange={(value) => setNewApplication(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {leaveTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Emergency Contact</Label>
                    <Input
                      value={newApplication.emergencyContact}
                      onChange={(e) => setNewApplication(prev => ({ ...prev, emergencyContact: e.target.value }))}
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>From Date</Label>
                    <Input
                      type="date"
                      value={newApplication.fromDate}
                      onChange={(e) => setNewApplication(prev => ({ ...prev, fromDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>To Date</Label>
                    <Input
                      type="date"
                      value={newApplication.toDate}
                      onChange={(e) => setNewApplication(prev => ({ ...prev, toDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Days</Label>
                    <Input
                      value={calculateDays(newApplication.fromDate, newApplication.toDate)}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Reason for Leave</Label>
                  <Input
                    value={newApplication.reason}
                    onChange={(e) => setNewApplication(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Brief reason for leave"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newApplication.description}
                    onChange={(e) => setNewApplication(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed description (optional)"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Supporting Documents</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <Upload className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                      <div className="text-sm text-gray-600">
                        Upload supporting documents (medical certificate, invitation letter, etc.)
                      </div>
                      <Button variant="outline" className="mt-2">Choose Files</Button>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleApplyLeave} className="flex-1">Submit Application</Button>
                  <Button variant="outline" onClick={() => setShowApplyDialog(false)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>My Leave Applications</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Student Leave Requests</span>
              {studentStats.pending > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">
                  {studentStats.pending}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Personal Leave Applications Tab */}
          <TabsContent value="personal" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                  <FileText className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{personalStats.totalApplications}</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{personalStats.approved}</div>
                  <p className="text-xs text-muted-foreground">Applications approved</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{personalStats.pending}</div>
                  <p className="text-xs text-muted-foreground">Awaiting approval</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Days Taken</CardTitle>
                  <Calendar className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{personalStats.totalDays}</div>
                  <p className="text-xs text-muted-foreground">This academic year</p>
                </CardContent>
              </Card>
            </div>

            {/* Leave Balance */}
            <Card>
              <CardHeader>
                <CardTitle>Leave Balance</CardTitle>
                <CardDescription>Your remaining leave balance by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Medical Leave</span>
                      <span className="text-sm text-gray-600">{leaveBalance.medical.used}/{leaveBalance.medical.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${(leaveBalance.medical.used / leaveBalance.medical.total) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {leaveBalance.medical.total - leaveBalance.medical.used} days remaining
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Personal Leave</span>
                      <span className="text-sm text-gray-600">{leaveBalance.personal.used}/{leaveBalance.personal.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(leaveBalance.personal.used / leaveBalance.personal.total) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {leaveBalance.personal.total - leaveBalance.personal.used} days remaining
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Conference Leave</span>
                      <span className="text-sm text-gray-600">{leaveBalance.conference.used}/{leaveBalance.conference.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(leaveBalance.conference.used / leaveBalance.conference.total) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {leaveBalance.conference.total - leaveBalance.conference.used} days remaining
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Emergency Leave</span>
                      <span className="text-sm text-gray-600">{leaveBalance.emergency.used}/{leaveBalance.emergency.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${(leaveBalance.emergency.used / leaveBalance.emergency.total) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {leaveBalance.emergency.total - leaveBalance.emergency.used} days remaining
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search applications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Leave Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {leaveTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Personal Leave Applications Table */}
            <Card>
              <CardHeader>
                <CardTitle>My Leave Applications</CardTitle>
                <CardDescription>Track your personal leave application status</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type & Reason</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Approved By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((application) => {
                      const StatusIcon = getStatusIcon(application.status);
                      return (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{application.type}</div>
                              <div className="text-sm text-gray-600">{application.reason}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{application.days} days</div>
                              <div className="text-sm text-gray-600">
                                {new Date(application.fromDate).toLocaleDateString()} - {new Date(application.toDate).toLocaleDateString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(application.appliedDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <StatusIcon className="h-4 w-4" />
                              <Badge className={getStatusColor(application.status)}>
                                {application.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            {application.approvedBy ? (
                              <div>
                                <div className="text-sm">{application.approvedBy}</div>
                                <div className="text-xs text-gray-600">
                                  {application.approvedDate && new Date(application.approvedDate).toLocaleDateString()}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => {
                                  setSelectedApplication(application);
                                  setShowViewDialog(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {application.status === "Pending" && (
                                <>
                                  <Button size="sm" variant="ghost">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={() => handleCancelApplication(application.id)}
                                  >
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  </Button>
                                </>
                              )}
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleDeleteApplication(application.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Student Leave Requests Tab */}
          <TabsContent value="students" className="space-y-6">
            {/* Student Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentStats.totalRequests}</div>
                  <p className="text-xs text-muted-foreground">Student applications</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentStats.pending}</div>
                  <p className="text-xs text-muted-foreground">Need approval</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentStats.approved}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                  <XCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{studentStats.rejected}</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters for Students */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by student name, hall ticket..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Leave Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {leaveTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Student Leave Requests Table */}
            <Card>
              <CardHeader>
                <CardTitle>Student Leave Requests</CardTitle>
                <CardDescription>Review and approve student leave applications</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Type & Reason</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudentRequests.map((request) => {
                      const StatusIcon = getStatusIcon(request.status);
                      return (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{request.studentName}</div>
                              <div className="text-sm text-gray-600">{request.hallTicket}</div>
                              <div className="text-xs text-gray-500">{request.year} - {request.semester}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{request.type}</div>
                              <div className="text-sm text-gray-600">{request.reason}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{request.days} days</div>
                              <div className="text-sm text-gray-600">
                                {new Date(request.fromDate).toLocaleDateString()} - {new Date(request.toDate).toLocaleDateString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(request.appliedDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <StatusIcon className="h-4 w-4" />
                              <Badge className={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => {
                                  setSelectedStudentRequest(request);
                                  setShowStudentViewDialog(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {request.status === "Pending" && (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => handleApproveStudentLeave(request.id)}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => handleRejectStudentLeave(request.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Personal Leave View Dialog */}
        {selectedApplication && (
          <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Leave Application Details</DialogTitle>
                <DialogDescription>Application ID: #{selectedApplication.id}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Leave Type</Label>
                    <p className="text-sm text-gray-900">{selectedApplication.type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(selectedApplication.status)}>
                        {selectedApplication.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">From Date</Label>
                    <p className="text-sm text-gray-900">{new Date(selectedApplication.fromDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">To Date</Label>
                    <p className="text-sm text-gray-900">{new Date(selectedApplication.toDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Duration</Label>
                    <p className="text-sm text-gray-900">{selectedApplication.days} days</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Reason</Label>
                  <p className="text-sm text-gray-900">{selectedApplication.reason}</p>
                </div>

                {selectedApplication.description && (
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-gray-900">{selectedApplication.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Applied Date</Label>
                    <p className="text-sm text-gray-900">{new Date(selectedApplication.appliedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Emergency Contact</Label>
                    <p className="text-sm text-gray-900">{selectedApplication.emergencyContact}</p>
                  </div>
                </div>

                {selectedApplication.approvedBy && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Approved By</Label>
                      <p className="text-sm text-gray-900">{selectedApplication.approvedBy}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Approved Date</Label>
                      <p className="text-sm text-gray-900">
                        {selectedApplication.approvedDate && new Date(selectedApplication.approvedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {selectedApplication.documents && selectedApplication.documents.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Attached Documents</Label>
                    <div className="flex space-x-2 mt-1">
                      {selectedApplication.documents.map((doc, index) => (
                        <Badge key={index} variant="outline" className="cursor-pointer">
                          <FileText className="h-3 w-3 mr-1" />
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Student Leave View Dialog */}
        {selectedStudentRequest && (
          <Dialog open={showStudentViewDialog} onOpenChange={setShowStudentViewDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Student Leave Request Details</DialogTitle>
                <DialogDescription>Request from {selectedStudentRequest.studentName}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Student</Label>
                    <p className="text-sm text-gray-900">{selectedStudentRequest.studentName}</p>
                    <p className="text-xs text-gray-600">{selectedStudentRequest.hallTicket}</p>
                    <p className="text-xs text-gray-600">{selectedStudentRequest.year} - {selectedStudentRequest.semester}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Leave Type</Label>
                    <p className="text-sm text-gray-900">{selectedStudentRequest.type}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">From Date</Label>
                    <p className="text-sm text-gray-900">{new Date(selectedStudentRequest.fromDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">To Date</Label>
                    <p className="text-sm text-gray-900">{new Date(selectedStudentRequest.toDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Duration</Label>
                    <p className="text-sm text-gray-900">{selectedStudentRequest.days} days</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Reason</Label>
                  <p className="text-sm text-gray-900">{selectedStudentRequest.reason}</p>
                </div>

                {selectedStudentRequest.description && (
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm text-gray-900">{selectedStudentRequest.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Applied Date</Label>
                    <p className="text-sm text-gray-900">{new Date(selectedStudentRequest.appliedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge className={getStatusColor(selectedStudentRequest.status)}>
                      {selectedStudentRequest.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Student Contact</Label>
                    <p className="text-sm text-gray-900">{selectedStudentRequest.studentContact}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Parent Contact</Label>
                    <p className="text-sm text-gray-900">{selectedStudentRequest.parentContact}</p>
                  </div>
                </div>

                {selectedStudentRequest.documents && selectedStudentRequest.documents.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Attached Documents</Label>
                    <div className="flex space-x-2 mt-1">
                      {selectedStudentRequest.documents.map((doc, index) => (
                        <Badge key={index} variant="outline" className="cursor-pointer">
                          <FileText className="h-3 w-3 mr-1" />
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  {selectedStudentRequest.status === "Pending" && (
                    <>
                      <Button 
                        onClick={() => {
                          handleApproveStudentLeave(selectedStudentRequest.id);
                          setShowStudentViewDialog(false);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button 
                        onClick={() => {
                          handleRejectStudentLeave(selectedStudentRequest.id);
                          setShowStudentViewDialog(false);
                        }}
                        variant="destructive"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  <Button variant="outline" onClick={() => setShowStudentViewDialog(false)}>Close</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FacultyLeave;
