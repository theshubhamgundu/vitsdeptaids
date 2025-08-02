import { useState } from "react";
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
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  FileText,
  Send,
  Filter,
  Download,
  Eye,
  MessageSquare,
  CalendarDays,
  Users,
  TrendingUp
} from "lucide-react";

const HODFacultyLeaves = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalAction, setApprovalAction] = useState("");
  const [approvalComments, setApprovalComments] = useState("");

  const [leaveApplications, setLeaveApplications] = useState([
    {
      id: 1,
      facultyName: "Dr. Anita Verma",
      employeeId: "VIT-CSE-005",
      designation: "Assistant Professor",
      leaveType: "Conference Attendance",
      startDate: "2024-12-25",
      endDate: "2024-12-27",
      days: 3,
      reason: "Attending International Conference on Machine Learning at IIT Bombay",
      appliedDate: "2024-12-18",
      status: "Pending",
      priority: "medium",
      documents: ["conference_invitation.pdf", "travel_itinerary.pdf"],
      substituteArrangement: "Dr. Rajesh Kumar will handle ML classes",
      contactDuringLeave: "+91 9876543210",
      previousLeaves: 5,
      remainingLeaves: 10
    },
    {
      id: 2,
      facultyName: "Dr. Rajesh Kumar",
      employeeId: "VIT-CSE-003",
      designation: "Associate Professor",
      leaveType: "Medical Leave",
      startDate: "2024-12-20",
      endDate: "2024-12-22",
      days: 3,
      reason: "Medical treatment for back pain - doctor's recommendation for rest",
      appliedDate: "2024-12-19",
      status: "Pending",
      priority: "high",
      documents: ["medical_certificate.pdf"],
      substituteArrangement: "Dr. Suresh Reddy will cover Data Mining classes",
      contactDuringLeave: "+91 9876543211",
      previousLeaves: 3,
      remainingLeaves: 12
    },
    {
      id: 3,
      facultyName: "Dr. Suresh Reddy",
      employeeId: "VIT-CSE-008",
      designation: "Assistant Professor",
      leaveType: "Personal Leave",
      startDate: "2024-11-15",
      endDate: "2024-11-17",
      days: 3,
      reason: "Family wedding ceremony in hometown",
      appliedDate: "2024-11-10",
      status: "Approved",
      priority: "low",
      documents: [],
      substituteArrangement: "Dr. Anita Verma covered NLP classes",
      contactDuringLeave: "+91 9876543212",
      previousLeaves: 8,
      remainingLeaves: 7,
      approvedDate: "2024-11-11",
      approvedBy: "Dr. Priya Sharma",
      hodComments: "Approved for family occasion. Ensure proper handover of classes."
    },
    {
      id: 4,
      facultyName: "Dr. Kavitha Rao",
      employeeId: "VIT-MATH-002",
      designation: "Associate Professor",
      leaveType: "Academic Leave",
      startDate: "2024-10-28",
      endDate: "2024-10-30",
      days: 3,
      reason: "Research collaboration with IISc Bangalore",
      appliedDate: "2024-10-25",
      status: "Approved",
      priority: "medium",
      documents: ["collaboration_letter.pdf"],
      substituteArrangement: "Guest faculty arranged for Statistics classes",
      contactDuringLeave: "+91 9876543213",
      previousLeaves: 2,
      remainingLeaves: 13,
      approvedDate: "2024-10-26",
      approvedBy: "Dr. Priya Sharma",
      hodComments: "Research collaboration approved. Will benefit department research."
    },
    {
      id: 5,
      facultyName: "Dr. Anita Verma",
      employeeId: "VIT-CSE-005",
      designation: "Assistant Professor",
      leaveType: "Casual Leave",
      startDate: "2024-09-05",
      endDate: "2024-09-06",
      days: 2,
      reason: "Personal work",
      appliedDate: "2024-09-03",
      status: "Rejected",
      priority: "low",
      documents: [],
      substituteArrangement: "Not specified",
      contactDuringLeave: "+91 9876543210",
      previousLeaves: 3,
      remainingLeaves: 12,
      rejectedDate: "2024-09-04",
      rejectedBy: "Dr. Priya Sharma",
      hodComments: "Rejected due to important departmental meeting scheduled. Please reschedule."
    }
  ]);

  const [facultyLeaveStats] = useState({
    totalApplications: 24,
    pendingApprovals: 2,
    approvedThisMonth: 8,
    averageResponseTime: "1.2 days",
    mostCommonLeaveType: "Conference Attendance"
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
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
      default:
        return AlertTriangle;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = leaveApplications.filter(app => {
    if (selectedFilter === "all") return true;
    return app.status.toLowerCase() === selectedFilter;
  });

  const handleApproval = (application, action) => {
    setSelectedLeave(application);
    setApprovalAction(action);
    setApprovalComments("");
    setShowApprovalDialog(true);
  };

  const submitApproval = () => {
    const updatedApplications = leaveApplications.map(app => {
      if (app.id === selectedLeave.id) {
        return {
          ...app,
          status: approvalAction === "approve" ? "Approved" : "Rejected",
          [`${approvalAction === "approve" ? "approved" : "rejected"}Date`]: new Date().toISOString().split('T')[0],
          [`${approvalAction === "approve" ? "approved" : "rejected"}By`]: "Dr. Priya Sharma",
          hodComments: approvalComments
        };
      }
      return app;
    });

    setLeaveApplications(updatedApplications);
    setShowApprovalDialog(false);
    setSelectedLeave(null);
    setApprovalComments("");
    
    alert(`Leave application ${approvalAction === "approve" ? "approved" : "rejected"} successfully!`);
  };

  const getLeaveTypeStats = () => {
    const typeCount = {};
    leaveApplications.forEach(app => {
      typeCount[app.leaveType] = (typeCount[app.leaveType] || 0) + 1;
    });
    return Object.entries(typeCount).map(([type, count]) => ({ type, count }));
  };

  return (
    <DashboardLayout userType="hod" userName="Dr. Priya Sharma">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Faculty Leave Management</h1>
            <p className="text-gray-600">Review and approve faculty leave applications</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Applications</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{facultyLeaveStats.totalApplications}</div>
              <p className="text-xs text-muted-foreground">This academic year</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{facultyLeaveStats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">Require action</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{facultyLeaveStats.approvedThisMonth}</div>
              <p className="text-xs text-muted-foreground">December 2024</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{facultyLeaveStats.averageResponseTime}</div>
              <p className="text-xs text-muted-foreground">Processing time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Common Type</CardTitle>
              <CalendarDays className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-indigo-600">{facultyLeaveStats.mostCommonLeaveType}</div>
              <p className="text-xs text-muted-foreground">Most requested</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applications">Leave Applications</TabsTrigger>
            <TabsTrigger value="calendar">Faculty Calendar</TabsTrigger>
            <TabsTrigger value="analytics">Leave Analytics</TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Faculty Leave Applications</CardTitle>
                <CardDescription>
                  Showing {filteredApplications.length} applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Faculty</TableHead>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
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
                              <div className="font-medium">{application.facultyName}</div>
                              <div className="text-sm text-gray-600">{application.designation}</div>
                              <div className="text-xs text-gray-500">{application.employeeId}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{application.leaveType}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{new Date(application.startDate).toLocaleDateString()}</div>
                              <div className="text-gray-500">to</div>
                              <div>{new Date(application.endDate).toLocaleDateString()}</div>
                              <div className="text-xs text-gray-500">{application.days} days</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">
                                {new Date(application.appliedDate).toLocaleDateString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(application.priority)}>
                              {application.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <StatusIcon className="h-4 w-4" />
                              <Badge className={getStatusColor(application.status)}>
                                {application.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="ghost">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Leave Application Details</DialogTitle>
                                    <DialogDescription>Application ID: #{application.id}</DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Faculty Name</Label>
                                        <p>{application.facultyName}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Employee ID</Label>
                                        <p className="font-mono">{application.employeeId}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Designation</Label>
                                        <p>{application.designation}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Leave Type</Label>
                                        <Badge>{application.leaveType}</Badge>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Start Date</Label>
                                        <p>{new Date(application.startDate).toLocaleDateString()}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">End Date</Label>
                                        <p>{new Date(application.endDate).toLocaleDateString()}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Duration</Label>
                                        <p>{application.days} days</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Priority</Label>
                                        <Badge className={getPriorityColor(application.priority)}>
                                          {application.priority}
                                        </Badge>
                                      </div>
                                    </div>

                                    <div>
                                      <Label className="text-sm font-medium">Reason</Label>
                                      <p className="text-gray-700 mt-1">{application.reason}</p>
                                    </div>

                                    <div>
                                      <Label className="text-sm font-medium">Substitute Arrangement</Label>
                                      <p className="text-gray-700 mt-1">{application.substituteArrangement}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium">Contact During Leave</Label>
                                        <p>{application.contactDuringLeave}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium">Previous Leaves</Label>
                                        <p>{application.previousLeaves} days used this year</p>
                                      </div>
                                    </div>

                                    {application.documents.length > 0 && (
                                      <div>
                                        <Label className="text-sm font-medium">Supporting Documents</Label>
                                        <div className="space-y-1 mt-1">
                                          {application.documents.map((doc, index) => (
                                            <div key={index} className="flex items-center space-x-2 text-sm">
                                              <FileText className="h-4 w-4 text-blue-600" />
                                              <span>{doc}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {application.status !== "Pending" && (
                                      <div className="border-t pt-4">
                                        <Label className="text-sm font-medium">HOD Decision</Label>
                                        <div className="mt-2">
                                          <div className="flex items-center space-x-2 mb-2">
                                            <Badge className={getStatusColor(application.status)}>
                                              {application.status}
                                            </Badge>
                                            <span className="text-sm text-gray-600">
                                              by {application[application.status.toLowerCase() + 'By']} on{' '}
                                              {new Date(application[application.status.toLowerCase() + 'Date']).toLocaleDateString()}
                                            </span>
                                          </div>
                                          {application.hodComments && (
                                            <p className="text-gray-700 text-sm">{application.hodComments}</p>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>

                              {application.status === "Pending" && (
                                <>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleApproval(application, "approve")}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={() => handleApproval(application, "reject")}
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

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Faculty Leave Calendar</CardTitle>
                <CardDescription>Visual overview of faculty leave schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Current Leaves</h3>
                      <div className="space-y-2">
                        {leaveApplications
                          .filter(app => {
                            const today = new Date();
                            const startDate = new Date(app.startDate);
                            const endDate = new Date(app.endDate);
                            return today >= startDate && today <= endDate && app.status === "Approved";
                          })
                          .map(app => (
                            <div key={app.id} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                              <User className="h-4 w-4 text-orange-600" />
                              <div>
                                <div className="font-medium">{app.facultyName}</div>
                                <div className="text-sm text-gray-600">
                                  {app.leaveType} • {new Date(app.startDate).toLocaleDateString()} - {new Date(app.endDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Upcoming Leaves</h3>
                      <div className="space-y-2">
                        {leaveApplications
                          .filter(app => new Date(app.startDate) > new Date() && app.status === "Approved")
                          .slice(0, 3)
                          .map(app => (
                            <div key={app.id} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                              <CalendarDays className="h-4 w-4 text-blue-600" />
                              <div>
                                <div className="font-medium">{app.facultyName}</div>
                                <div className="text-sm text-gray-600">
                                  {app.leaveType} • {new Date(app.startDate).toLocaleDateString()} - {new Date(app.endDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Leave Types Distribution</CardTitle>
                  <CardDescription>Most common types of leave requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getLeaveTypeStats().map(({ type, count }) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm">{type}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(count / leaveApplications.length) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Faculty Leave Summary</CardTitle>
                  <CardDescription>Individual faculty leave utilization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from(new Set(leaveApplications.map(app => app.facultyName)))
                      .map(facultyName => {
                        const facultyLeaves = leaveApplications.filter(app => app.facultyName === facultyName);
                        const totalDays = facultyLeaves.reduce((sum, app) => sum + app.days, 0);
                        return (
                          <div key={facultyName} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{facultyName}</span>
                              <Badge variant="outline">{totalDays} days</Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              {facultyLeaves.length} applications • {facultyLeaves.filter(app => app.status === "Approved").length} approved
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Approval Dialog */}
        {selectedLeave && (
          <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {approvalAction === "approve" ? "Approve" : "Reject"} Leave Application
                </DialogTitle>
                <DialogDescription>
                  Faculty: {selectedLeave.facultyName} • {selectedLeave.leaveType}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Leave Details</h3>
                  <div className="text-sm space-y-1">
                    <div>Duration: {selectedLeave.days} days ({new Date(selectedLeave.startDate).toLocaleDateString()} - {new Date(selectedLeave.endDate).toLocaleDateString()})</div>
                    <div>Reason: {selectedLeave.reason}</div>
                    <div>Substitute: {selectedLeave.substituteArrangement}</div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="comments">Comments (Required)</Label>
                  <Textarea
                    id="comments"
                    placeholder={`Add your comments for ${approvalAction === "approve" ? "approval" : "rejection"}...`}
                    value={approvalComments}
                    onChange={(e) => setApprovalComments(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button 
                    onClick={submitApproval} 
                    disabled={!approvalComments.trim()}
                    className={approvalAction === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {approvalAction === "approve" ? "Approve" : "Reject"} Application
                  </Button>
                  <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HODFacultyLeaves;
