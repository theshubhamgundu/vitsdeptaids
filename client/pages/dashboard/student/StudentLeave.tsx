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
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  User,
  FileText,
  Send,
  Calendar,
  MapPin
} from "lucide-react";

const StudentLeave = () => {
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [leaveApplications, setLeaveApplications] = useState([
    {
      id: 1,
      type: "Medical Leave",
      startDate: "2024-12-15",
      endDate: "2024-12-17",
      days: 3,
      reason: "Fever and flu symptoms, doctor advised rest",
      status: "Approved",
      appliedDate: "2024-12-10",
      approvedBy: "Dr. Priya Sharma",
      approvedDate: "2024-12-11",
      comments: "Medical certificate verified. Get well soon!",
      documents: ["medical_certificate.pdf"]
    },
    {
      id: 2,
      type: "Personal Leave",
      startDate: "2024-11-20",
      endDate: "2024-11-22",
      days: 3,
      reason: "Family function - cousin's wedding",
      status: "Approved",
      appliedDate: "2024-11-15",
      approvedBy: "Dr. Priya Sharma",
      approvedDate: "2024-11-16",
      comments: "Approved for family occasion",
      documents: []
    },
    {
      id: 3,
      type: "Emergency Leave",
      startDate: "2024-10-28",
      endDate: "2024-10-28",
      days: 1,
      reason: "Grandmother's hospitalization",
      status: "Approved",
      appliedDate: "2024-10-28",
      approvedBy: "Dr. Priya Sharma",
      approvedDate: "2024-10-28",
      comments: "Emergency leave approved. Hope everything is fine.",
      documents: []
    },
    {
      id: 4,
      type: "Medical Leave",
      startDate: "2024-12-25",
      endDate: "2024-12-27",
      days: 3,
      reason: "Scheduled surgery",
      status: "Pending",
      appliedDate: "2024-12-18",
      approvedBy: null,
      approvedDate: null,
      comments: null,
      documents: ["surgery_appointment.pdf"]
    }
  ]);

  const [newApplication, setNewApplication] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
    documents: []
  });

  const [leaveBalance] = useState({
    medical: { used: 6, total: 15, remaining: 9 },
    personal: { used: 3, total: 10, remaining: 7 },
    emergency: { used: 1, total: 5, remaining: 4 },
    casual: { used: 2, total: 12, remaining: 10 }
  });

  const leaveTypes = [
    "Medical Leave",
    "Personal Leave",
    "Emergency Leave",
    "Casual Leave",
    "Bereavement Leave",
    "Academic Leave"
  ];

  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

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

  const handleSubmitApplication = () => {
    if (!newApplication.type || !newApplication.startDate || !newApplication.endDate || !newApplication.reason) {
      alert("Please fill all required fields");
      return;
    }

    const days = calculateDays(newApplication.startDate, newApplication.endDate);
    const application = {
      id: leaveApplications.length + 1,
      ...newApplication,
      days,
      status: "Pending",
      appliedDate: new Date().toISOString().split('T')[0],
      approvedBy: null,
      approvedDate: null,
      comments: null
    };

    setLeaveApplications([...leaveApplications, application]);
    setNewApplication({
      type: "",
      startDate: "",
      endDate: "",
      reason: "",
      documents: []
    });
    setShowApplicationDialog(false);
    alert("Leave application submitted successfully!");
  };

  const getLeaveTypeStats = (type) => {
    const applications = leaveApplications.filter(app => 
      app.type === type && app.status === "Approved"
    );
    const totalDays = applications.reduce((sum, app) => sum + app.days, 0);
    return { applications: applications.length, days: totalDays };
  };

  return (
    <DashboardLayout userType="student" userName="Rahul Sharma">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leave Applications</h1>
            <p className="text-gray-600">Apply for leave and track your applications</p>
          </div>
          <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Apply for Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogDescription>Fill in the details for your leave application</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="leaveType">Leave Type *</Label>
                  <Select value={newApplication.type} onValueChange={(value) => setNewApplication({...newApplication, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newApplication.startDate}
                      onChange={(e) => setNewApplication({...newApplication, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newApplication.endDate}
                      onChange={(e) => setNewApplication({...newApplication, endDate: e.target.value})}
                    />
                  </div>
                </div>
                {newApplication.startDate && newApplication.endDate && (
                  <div className="text-sm text-gray-600">
                    Duration: {calculateDays(newApplication.startDate, newApplication.endDate)} day(s)
                  </div>
                )}
                <div>
                  <Label htmlFor="reason">Reason *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Describe the reason for your leave..."
                    value={newApplication.reason}
                    onChange={(e) => setNewApplication({...newApplication, reason: e.target.value})}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Supporting Documents (Optional)</Label>
                  <Input type="file" multiple className="mt-1" />
                  <p className="text-xs text-gray-500 mt-1">Upload medical certificates, invitation cards, etc.</p>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleSubmitApplication} className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Application
                  </Button>
                  <Button variant="outline" onClick={() => setShowApplicationDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Leave Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Object.entries(leaveBalance).map(([type, balance]) => (
            <Card key={type}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                  {type} Leave
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{balance.remaining}</div>
                <p className="text-xs text-muted-foreground">
                  {balance.used} used / {balance.total} total
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(balance.used / balance.total) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="calendar">Leave Calendar</TabsTrigger>
            <TabsTrigger value="policies">Leave Policies</TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Leave Applications</CardTitle>
                <CardDescription>Track all your leave applications and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveApplications.map((application) => {
                      const StatusIcon = getStatusIcon(application.status);
                      return (
                        <TableRow key={application.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{application.type}</div>
                              <div className="text-sm text-gray-600 line-clamp-1">
                                {application.reason}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{new Date(application.startDate).toLocaleDateString()}</div>
                              <div className="text-gray-500">to</div>
                              <div>{new Date(application.endDate).toLocaleDateString()}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{application.days} days</Badge>
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
                            <div className="flex items-center space-x-2">
                              <StatusIcon className="h-4 w-4" />
                              <Badge className={getStatusColor(application.status)}>
                                {application.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Leave Application Details</DialogTitle>
                                  <DialogDescription>Application ID: #{application.id}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">Type</Label>
                                      <p>{application.type}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">Status</Label>
                                      <Badge className={getStatusColor(application.status)}>
                                        {application.status}
                                      </Badge>
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
                                      <Label className="text-sm font-medium">Applied Date</Label>
                                      <p>{new Date(application.appliedDate).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Reason</Label>
                                    <p className="text-gray-700 mt-1">{application.reason}</p>
                                  </div>
                                  {application.approvedBy && (
                                    <>
                                      <div>
                                        <Label className="text-sm font-medium">Approved By</Label>
                                        <p>{application.approvedBy}</p>
                                      </div>
                                      {application.comments && (
                                        <div>
                                          <Label className="text-sm font-medium">Comments</Label>
                                          <p className="text-gray-700 mt-1">{application.comments}</p>
                                        </div>
                                      )}
                                    </>
                                  )}
                                  {application.documents.length > 0 && (
                                    <div>
                                      <Label className="text-sm font-medium">Documents</Label>
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
                                </div>
                              </DialogContent>
                            </Dialog>
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
                <CardTitle>Leave Calendar</CardTitle>
                <CardDescription>Visual overview of your leave applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Upcoming Leaves</h3>
                      <div className="space-y-2">
                        {leaveApplications
                          .filter(app => new Date(app.startDate) >= new Date() && app.status === "Approved")
                          .map(app => (
                            <div key={app.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                              <CalendarDays className="h-4 w-4 text-green-600" />
                              <div>
                                <div className="font-medium">{app.type}</div>
                                <div className="text-sm text-gray-600">
                                  {new Date(app.startDate).toLocaleDateString()} - {new Date(app.endDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Recent History</h3>
                      <div className="space-y-2">
                        {leaveApplications
                          .filter(app => new Date(app.endDate) < new Date())
                          .slice(0, 3)
                          .map(app => (
                            <div key={app.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <CheckCircle className="h-4 w-4 text-gray-600" />
                              <div>
                                <div className="font-medium">{app.type}</div>
                                <div className="text-sm text-gray-600">
                                  {new Date(app.startDate).toLocaleDateString()} - {new Date(app.endDate).toLocaleDateString()}
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

          {/* Policies Tab */}
          <TabsContent value="policies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Leave Policies</CardTitle>
                <CardDescription>Important guidelines and policies for leave applications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Leave Entitlements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Medical Leave:</span>
                        <span className="font-medium">15 days/year</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Casual Leave:</span>
                        <span className="font-medium">12 days/year</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Personal Leave:</span>
                        <span className="font-medium">10 days/year</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Emergency Leave:</span>
                        <span className="font-medium">5 days/year</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Application Guidelines</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Apply for leave at least 3 days in advance (except emergency cases)</li>
                    <li>• Medical leave requires medical certificate for more than 3 days</li>
                    <li>• Personal leave should be applied 7 days in advance</li>
                    <li>• Emergency leave can be applied on the same day</li>
                    <li>• All leave applications require HOD approval</li>
                    <li>• Leave without approval will be considered as absence</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span>HOD: Dr. Priya Sharma</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span>Office: AI & DS Department, Room 301</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>Office Hours: Mon-Fri, 9:00 AM - 5:00 PM</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentLeave;
