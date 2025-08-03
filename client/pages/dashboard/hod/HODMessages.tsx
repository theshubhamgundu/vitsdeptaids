import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getAllFaculty, getFacultyByRole } from "@/data/facultyData";
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
  MessageSquare,
  Send,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Building,
  BookOpen
} from "lucide-react";

const HODMessages = () => {
  const { toast } = useToast();

  // Get faculty data for recipients
  const allFaculty = getAllFaculty();
  const facultyOnly = getFacultyByRole("Faculty");

  const [messages, setMessages] = useState([
    {
      id: 1,
      title: "Department Meeting - Monthly Review",
      content: "Monthly department meeting scheduled for March 25th at 10:00 AM in Conference Room A. All faculty members are requested to attend.",
      recipients: "All Faculty",
      recipientCount: 15,
      sentDate: "2025-03-20",
      sentBy: "Dr. Priya Sharma",
      status: "Sent",
      priority: "High",
      category: "Meeting",
      readBy: 12,
      acknowledgments: 10
    },
    {
      id: 2,
      title: "New Academic Guidelines",
      content: "Please review the updated academic guidelines for the upcoming semester. The guidelines are available in the faculty portal.",
      recipients: "All Faculty",
      recipientCount: 15,
      sentDate: "2025-03-18",
      sentBy: "Dr. Priya Sharma",
      status: "Sent",
      priority: "Medium",
      category: "Academic",
      readBy: 15,
      acknowledgments: 14
    },
    {
      id: 3,
      title: "Student Performance Alert",
      content: "The following students need additional support in Machine Learning course. Please coordinate with respective faculty members.",
      recipients: "Course Faculty",
      recipientCount: 5,
      sentDate: "2025-03-15",
      sentBy: "Dr. Priya Sharma",
      status: "Sent",
      priority: "High",
      category: "Academic",
      readBy: 5,
      acknowledgments: 4
    }
  ]);

  const [pendingApprovals, setPendingApprovals] = useState([
    {
      id: 1,
      title: "Research Project Proposal",
      submittedBy: "Dr. Rajesh Kumar",
      content: "Proposal for AI in Healthcare research project with industry collaboration",
      submittedDate: "2025-03-19",
      category: "Research",
      priority: "High",
      status: "Pending Review"
    },
    {
      id: 2,
      title: "Curriculum Update Request",
      submittedBy: "Dr. Anita Verma",
      content: "Request to update Machine Learning syllabus with latest industry trends",
      submittedDate: "2025-03-17",
      category: "Academic",
      priority: "Medium",
      status: "Pending Review"
    }
  ]);

  const [communications, setCommunications] = useState([
    {
      id: 1,
      from: "Dr. Rajesh Kumar",
      to: "HOD Office",
      subject: "Lab Equipment Request",
      content: "Requesting approval for new GPU servers for the AI lab",
      date: "2025-03-20",
      status: "Unread",
      priority: "Medium",
      type: "Request"
    },
    {
      id: 2,
      from: "Student Representative",
      to: "HOD Office",
      subject: "Student Feedback on Course Structure",
      content: "Compiled feedback from 3rd year students regarding course structure improvements",
      date: "2025-03-19",
      status: "Read",
      priority: "Low",
      type: "Feedback"
    }
  ]);

  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [newMessage, setNewMessage] = useState({
    title: "",
    content: "",
    recipients: "All Faculty",
    priority: "Medium",
    category: "General",
    scheduledDate: ""
  });

  const recipients = ["All Faculty", "All Students", "Course Faculty", "Lab Coordinators", "Admin Staff"];
  const priorities = ["High", "Medium", "Low"];
  const categories = ["General", "Academic", "Meeting", "Research", "Administrative"];

  const handleSendMessage = () => {
    if (!newMessage.title || !newMessage.content) return;

    const message = {
      id: Date.now(),
      ...newMessage,
      sentDate: newMessage.scheduledDate || new Date().toISOString().split('T')[0],
      sentBy: "Dr. Priya Sharma",
      status: newMessage.scheduledDate ? "Scheduled" : "Sent",
      recipientCount: newMessage.recipients === "All Faculty" ? 15 : 
                     newMessage.recipients === "All Students" ? 240 : 5,
      readBy: 0,
      acknowledgments: 0
    };

    setMessages(prev => [message, ...prev]);
    setShowMessageDialog(false);
    setNewMessage({
      title: "",
      content: "",
      recipients: "All Faculty",
      priority: "Medium",
      category: "General",
      scheduledDate: ""
    });
  };

  const handleApproveRequest = (id) => {
    setPendingApprovals(prev => prev.map(approval =>
      approval.id === id ? { ...approval, status: "Approved" } : approval
    ));
  };

  const handleRejectRequest = (id) => {
    setPendingApprovals(prev => prev.map(approval =>
      approval.id === id ? { ...approval, status: "Rejected" } : approval
    ));
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'pending review':
      case 'unread':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || message.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout userType="hod" userName="Dr. Priya Sharma">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages & Communications</h1>
            <p className="text-gray-600">Manage department communications and approvals</p>
          </div>
          <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Send Department Message</DialogTitle>
                <DialogDescription>Send message to faculty, students, or staff</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Recipients</Label>
                    <Select value={newMessage.recipients} onValueChange={(value) => setNewMessage(prev => ({ ...prev, recipients: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {recipients.map(recipient => (
                          <SelectItem key={recipient} value={recipient}>{recipient}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={newMessage.priority} onValueChange={(value) => setNewMessage(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map(priority => (
                          <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={newMessage.category} onValueChange={(value) => setNewMessage(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Schedule for Later (Optional)</Label>
                    <Input
                      type="datetime-local"
                      value={newMessage.scheduledDate}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Message Title</Label>
                  <Input
                    value={newMessage.title}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter message title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message Content</Label>
                  <Textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter your message content..."
                    rows={4}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleSendMessage} className="flex-1 bg-purple-600 hover:bg-purple-700">
                    <Send className="h-4 w-4 mr-2" />
                    {newMessage.scheduledDate ? 'Schedule Message' : 'Send Message'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowMessageDialog(false)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages.length}</div>
              <p className="text-xs text-muted-foreground">Sent this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApprovals.filter(p => p.status === "Pending Review").length}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Communications</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{communications.filter(c => c.status === "Unread").length}</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">Average acknowledgment</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="messages" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="messages">📧 Sent Messages</TabsTrigger>
            <TabsTrigger value="approvals">✅ Pending Approvals</TabsTrigger>
            <TabsTrigger value="communications">📨 Communications</TabsTrigger>
          </TabsList>

          {/* Sent Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Department Messages</CardTitle>
                    <CardDescription>Messages sent to faculty, students, and staff</CardDescription>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Message</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Sent Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{message.title}</div>
                            <div className="text-sm text-gray-600 max-w-48 truncate">
                              {message.content}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{message.recipients}</div>
                            <div className="text-sm text-gray-600">{message.recipientCount} recipients</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{message.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(message.priority)}>
                            {message.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(message.sentDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(message.status)}>
                            {message.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Read: {message.readBy}/{message.recipientCount}</div>
                            <div className="text-gray-600">Ack: {message.acknowledgments}/{message.recipientCount}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Approvals Tab */}
          <TabsContent value="approvals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Requests awaiting your review and approval</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingApprovals.map((approval) => (
                    <div key={approval.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{approval.title}</h3>
                            <Badge className={getPriorityColor(approval.priority)}>
                              {approval.priority}
                            </Badge>
                            <Badge variant="outline">{approval.category}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Submitted by: <span className="font-medium">{approval.submittedBy}</span> on {new Date(approval.submittedDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm">{approval.content}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              setSelectedApproval(approval);
                              setShowApprovalDialog(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {approval.status === "Pending Review" && (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => handleApproveRequest(approval.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleRejectRequest(approval.id)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communications Tab */}
          <TabsContent value="communications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Incoming Communications</CardTitle>
                <CardDescription>Messages received from faculty, students, and staff</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {communications.map((comm) => (
                      <TableRow key={comm.id}>
                        <TableCell className="font-medium">{comm.from}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{comm.subject}</div>
                            <div className="text-sm text-gray-600 max-w-48 truncate">
                              {comm.content}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{comm.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(comm.priority)}>
                            {comm.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(comm.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(comm.status)}>
                            {comm.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default HODMessages;
