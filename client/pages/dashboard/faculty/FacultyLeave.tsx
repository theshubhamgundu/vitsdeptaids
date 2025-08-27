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
  // Personal leave applications - will be loaded from database/localStorage
  const [leaveApplications, setLeaveApplications] = useState<any[]>([]);

  // Student leave applications that need faculty approval - will be loaded from database/localStorage
  const [studentLeaveRequests, setStudentLeaveRequests] = useState<any[]>([]);

  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showStudentViewDialog, setShowStudentViewDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedStudentRequest, setSelectedStudentRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const [newApplication, setNewApplication] = useState({
    fromDate: "",
    toDate: "",
    reason: ""
  });

  // Load leave data on component mount
  useEffect(() => {
    if (user) {
      loadLeaveData();
    }
  }, [user]);

  const loadLeaveData = () => {
    try {
      // Load personal leave applications from localStorage (placeholder for database)
      const personalLeaves = JSON.parse(localStorage.getItem(`faculty_leaves_${user?.id}`) || "[]");
      setLeaveApplications(personalLeaves);

      // Load student leave requests from localStorage (placeholder for database)
      const studentLeaves = JSON.parse(localStorage.getItem(`student_leaves_pending`) || "[]");
      // Filter to those assigned to this faculty (assigned_to matches id) or visible by coordinator for their year(s)
      const myRequests = studentLeaves.filter((req: any) => {
        if (req.assigned_to && user?.id && req.assigned_to === user.id) return true;
        return false;
      });
      setStudentLeaveRequests(myRequests);
    } catch (error) {
      console.error('Error loading leave data:', error);
    }
  };

  const leaveTypes: string[] = [];

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

    const updatedApplications = [application, ...leaveApplications];
    setLeaveApplications(updatedApplications);
    
    // Save to localStorage (placeholder for database)
    localStorage.setItem(`faculty_leaves_${user?.id}`, JSON.stringify(updatedApplications));

    // Notify HOD: append a minimal leave message for HOD dashboard
    try {
      const hodMessages = JSON.parse(localStorage.getItem('hod_faculty_leaves') || '[]');
      const message = {
        id: application.id,
        facultyId: user?.id,
        facultyName: user?.name || 'Faculty',
        type: application.type,
        reason: application.reason,
        fromDate: application.fromDate,
        toDate: application.toDate,
        days: application.days,
        status: application.status,
        appliedDate: application.appliedDate,
      };
      localStorage.setItem('hod_faculty_leaves', JSON.stringify([message, ...hodMessages]));
      // Broadcast change for listeners
      window.dispatchEvent(new StorageEvent('storage', { key: 'hod_faculty_leaves' }));
    } catch {}
    
    setShowApplyDialog(false);
    setNewApplication({
      fromDate: "",
      toDate: "",
      reason: "",
      
    });
  };

  const handleApproveStudentLeave = (id) => {
    const updatedRequests = studentLeaveRequests.map(request =>
      request.id === id ? { ...request, status: "Approved", approvedBy: user?.name || "Faculty", approvedDate: new Date().toISOString().split('T')[0] } : request
    );
    setStudentLeaveRequests(updatedRequests);
    
    // Save to localStorage (placeholder for database)
    localStorage.setItem(`student_leaves_pending`, JSON.stringify(updatedRequests));
  };

  const handleRejectStudentLeave = (id) => {
    const updatedRequests = studentLeaveRequests.map(request =>
      request.id === id ? { ...request, status: "Rejected", approvedBy: user?.name || "Faculty", approvedDate: new Date().toISOString().split('T')[0] } : request
    );
    setStudentLeaveRequests(updatedRequests);
    
    // Save to localStorage (placeholder for database)
    localStorage.setItem(`student_leaves_pending`, JSON.stringify(updatedRequests));
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
    const reason = (app?.reason || "").toString();
    const type = (app?.type || "").toString();
    const status = (app?.status || "").toString();
    const matchesSearch = reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || status === filterStatus;
    const matchesType = filterType === "all" || type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredStudentRequests = studentLeaveRequests.filter(request => {
    const studentName = (request?.studentName || "").toString();
    const hallTicket = (request?.hallTicket || "").toString();
    const reason = (request?.reason || "").toString();
    const status = (request?.status || "").toString();
    const type = (request?.type || "").toString();
    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hallTicket.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || status === filterStatus;
    const matchesType = filterType === "all" || type === filterType;
    
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
    switch ((status || '').toLowerCase()) {
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
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogDescription>From date, to date and reason</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div className="space-y-2">
                  <Label>Reason for Leave</Label>
                  <Input
                    value={newApplication.reason}
                    onChange={(e) => setNewApplication(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Brief reason for leave"
                  />
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
            </TabsTrigger>
          </TabsList>

          {/* Personal Leave Applications Tab */}
          <TabsContent value="personal" className="space-y-6">


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
