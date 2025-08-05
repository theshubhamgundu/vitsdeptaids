import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  MapPin,
} from "lucide-react";

const StudentLeave = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    setCurrentUser(user);
  }, []);
  const [leaveApplications, setLeaveApplications] = useState([]);

  const [newApplication, setNewApplication] = useState({
    type: "",
    startDate: "",
    endDate: "",
    reason: "",
    documents: [],
  });


  const leaveTypes = [
    "Medical Leave",
    "Personal Leave",
    "Emergency Leave",
    "Casual Leave",
    "Bereavement Leave",
    "Academic Leave",
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
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return CheckCircle;
      case "pending":
        return Clock;
      case "rejected":
        return XCircle;
      default:
        return AlertTriangle;
    }
  };

  const handleSubmitApplication = () => {
    if (
      !newApplication.type ||
      !newApplication.startDate ||
      !newApplication.endDate ||
      !newApplication.reason
    ) {
      alert("Please fill all required fields");
      return;
    }

    const days = calculateDays(
      newApplication.startDate,
      newApplication.endDate,
    );
    const application = {
      id: leaveApplications.length + 1,
      ...newApplication,
      days,
      status: "Pending",
      appliedDate: new Date().toISOString().split("T")[0],
      approvedBy: null,
      approvedDate: null,
      comments: null,
    };

    setLeaveApplications([...leaveApplications, application]);
    setNewApplication({
      type: "",
      startDate: "",
      endDate: "",
      reason: "",
      documents: [],
    });
    setShowApplicationDialog(false);
    alert("Leave application submitted successfully!");
  };


  if (!currentUser) {
    return (
      <DashboardLayout userType="student" userName="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading leave applications...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userType="student"
      userName={currentUser.name || "Student"}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Leave Applications
            </h1>
            <p className="text-gray-600">
              Apply for leave and track your applications
            </p>
          </div>
          <Dialog
            open={showApplicationDialog}
            onOpenChange={setShowApplicationDialog}
          >
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Apply for Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogDescription>
                  Fill in the details for your leave application
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="leaveType">Leave Type *</Label>
                  <Select
                    value={newApplication.type}
                    onValueChange={(value) =>
                      setNewApplication({ ...newApplication, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
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
                      onChange={(e) =>
                        setNewApplication({
                          ...newApplication,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newApplication.endDate}
                      onChange={(e) =>
                        setNewApplication({
                          ...newApplication,
                          endDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                {newApplication.startDate && newApplication.endDate && (
                  <div className="text-sm text-gray-600">
                    Duration:{" "}
                    {calculateDays(
                      newApplication.startDate,
                      newApplication.endDate,
                    )}{" "}
                    day(s)
                  </div>
                )}
                <div>
                  <Label htmlFor="reason">Reason *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Describe the reason for your leave..."
                    value={newApplication.reason}
                    onChange={(e) =>
                      setNewApplication({
                        ...newApplication,
                        reason: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Supporting Documents (Optional)</Label>
                  <Input type="file" multiple className="mt-1" />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload medical certificates, invitation cards, etc.
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleSubmitApplication} className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Application
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowApplicationDialog(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>


        {/* Leave Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Applications</CardTitle>
            <CardDescription>
              Track all your leave applications and their status
            </CardDescription>
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
                              <div className="font-medium">
                                {application.type}
                              </div>
                              <div className="text-sm text-gray-600 line-clamp-1">
                                {application.reason}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>
                                {new Date(
                                  application.startDate,
                                ).toLocaleDateString()}
                              </div>
                              <div className="text-gray-500">to</div>
                              <div>
                                {new Date(
                                  application.endDate,
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {application.days} days
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">
                                {new Date(
                                  application.appliedDate,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <StatusIcon className="h-4 w-4" />
                              <Badge
                                className={getStatusColor(application.status)}
                              >
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
                                  <DialogTitle>
                                    Leave Application Details
                                  </DialogTitle>
                                  <DialogDescription>
                                    Application ID: #{application.id}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Type
                                      </Label>
                                      <p>{application.type}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Status
                                      </Label>
                                      <Badge
                                        className={getStatusColor(
                                          application.status,
                                        )}
                                      >
                                        {application.status}
                                      </Badge>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Start Date
                                      </Label>
                                      <p>
                                        {new Date(
                                          application.startDate,
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        End Date
                                      </Label>
                                      <p>
                                        {new Date(
                                          application.endDate,
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Duration
                                      </Label>
                                      <p>{application.days} days</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Applied Date
                                      </Label>
                                      <p>
                                        {new Date(
                                          application.appliedDate,
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">
                                      Reason
                                    </Label>
                                    <p className="text-gray-700 mt-1">
                                      {application.reason}
                                    </p>
                                  </div>
                                  {application.approvedBy && (
                                    <>
                                      <div>
                                        <Label className="text-sm font-medium">
                                          Approved By
                                        </Label>
                                        <p>{application.approvedBy}</p>
                                      </div>
                                      {application.comments && (
                                        <div>
                                          <Label className="text-sm font-medium">
                                            Comments
                                          </Label>
                                          <p className="text-gray-700 mt-1">
                                            {application.comments}
                                          </p>
                                        </div>
                                      )}
                                    </>
                                  )}
                                  {application.documents.length > 0 && (
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Documents
                                      </Label>
                                      <div className="space-y-1 mt-1">
                                        {application.documents.map(
                                          (doc, index) => (
                                            <div
                                              key={index}
                                              className="flex items-center space-x-2 text-sm"
                                            >
                                              <FileText className="h-4 w-4 text-blue-600" />
                                              <span>{doc}</span>
                                            </div>
                                          ),
                                        )}
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
      </div>
    </DashboardLayout>
  );
};

export default StudentLeave;
