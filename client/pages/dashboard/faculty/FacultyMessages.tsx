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
  Send,
  Plus,
  MessageCircle,
  Users,
  Clock,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Bell,
  Mail,
  Megaphone,
  AlertTriangle,
  User,
  UserCheck,
  Calendar,
  FileText
} from "lucide-react";

const FacultyMessages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      title: "Mid-term Exam Schedule",
      content: "Mid-term examinations for Machine Learning will be conducted on March 25, 2025. Please prepare accordingly and bring your ID cards.",
      type: "Announcement",
      recipients: "All Students",
      targetGroup: "3rd Year - 6th Semester",
      priority: "High",
      status: "Sent",
      sentDate: "2025-03-10",
      readCount: 45,
      totalRecipients: 50,
      scheduledDate: null,
      attachments: ["exam_schedule.pdf"]
    },
    {
      id: 2,
      title: "Assignment Submission Reminder",
      content: "This is a reminder that your Data Science project assignment is due on March 20, 2025. Late submissions will not be accepted.",
      type: "Reminder",
      recipients: "All Students",
      targetGroup: "3rd Year - 6th Semester",
      priority: "Medium",
      status: "Sent",
      sentDate: "2025-03-08",
      readCount: 48,
      totalRecipients: 50,
      scheduledDate: null,
      attachments: []
    },
    {
      id: 3,
      title: "Guest Lecture on AI Ethics",
      content: "We have arranged a special guest lecture on AI Ethics by Dr. Sarah Johnson from MIT. The lecture will be held on March 30, 2025, at 2:00 PM in the main auditorium.",
      type: "Event",
      recipients: "All Students",
      targetGroup: "All Years",
      priority: "Medium",
      status: "Scheduled",
      sentDate: null,
      readCount: 0,
      totalRecipients: 150,
      scheduledDate: "2025-03-15",
      attachments: ["speaker_bio.pdf"]
    },
    {
      id: 4,
      title: "Lab Session Cancelled",
      content: "Tomorrow's lab session (March 12) is cancelled due to technical maintenance. We will reschedule it for next week.",
      type: "Alert",
      recipients: "Selected Students",
      targetGroup: "ML Lab Group A",
      priority: "High",
      status: "Draft",
      sentDate: null,
      readCount: 0,
      totalRecipients: 25,
      scheduledDate: null,
      attachments: []
    }
  ]);

  const [students, setStudents] = useState([
    { id: 1, name: "Rahul Sharma", hallTicket: "20AI001", year: "3rd Year", semester: "6th Semester", email: "rahul@example.com" },
    { id: 2, name: "Priya Reddy", hallTicket: "20AI002", year: "3rd Year", semester: "6th Semester", email: "priya@example.com" },
    { id: 3, name: "Amit Kumar", hallTicket: "20AI003", year: "3rd Year", semester: "6th Semester", email: "amit@example.com" },
    { id: 4, name: "Sneha Patel", hallTicket: "20AI004", year: "3rd Year", semester: "6th Semester", email: "sneha@example.com" }
  ]);

  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const [newMessage, setNewMessage] = useState({
    title: "",
    content: "",
    type: "Announcement",
    recipients: "All Students",
    targetGroup: "3rd Year - 6th Semester",
    priority: "Medium",
    scheduledDate: "",
    selectedStudents: [],
    attachments: []
  });

  const messageTypes = ["Announcement", "Reminder", "Event", "Alert", "Assignment", "Notice"];
  const priorities = ["Low", "Medium", "High", "Urgent"];
  const recipientTypes = ["All Students", "Selected Students", "Year Group", "Subject Group"];
  const targetGroups = [
    "All Years",
    "1st Year - 1st Semester",
    "1st Year - 2nd Semester", 
    "2nd Year - 3rd Semester",
    "2nd Year - 4th Semester",
    "3rd Year - 5th Semester",
    "3rd Year - 6th Semester",
    "4th Year - 7th Semester",
    "4th Year - 8th Semester"
  ];

  const handleSendMessage = async () => {
    if (!newMessage.title || !newMessage.content) return;

    const message = {
      ...newMessage,
      id: Date.now(),
      status: newMessage.scheduledDate ? "Scheduled" : "Sent",
      sentDate: newMessage.scheduledDate ? null : new Date().toISOString().split('T')[0],
      readCount: 0,
      totalRecipients: newMessage.recipients === "All Students" ? 150 : newMessage.selectedStudents.length,
      attachments: []
    };

    setMessages(prev => [message, ...prev]);
    setShowComposeDialog(false);
    setNewMessage({
      title: "",
      content: "",
      type: "Announcement",
      recipients: "All Students",
      targetGroup: "3rd Year - 6th Semester",
      priority: "Medium",
      scheduledDate: "",
      selectedStudents: [],
      attachments: []
    });
  };

  const handleDeleteMessage = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const handleDuplicateMessage = (message) => {
    const duplicatedMessage = {
      ...message,
      id: Date.now(),
      title: `Copy of ${message.title}`,
      status: "Draft",
      sentDate: null,
      readCount: 0
    };
    setMessages(prev => [duplicatedMessage, ...prev]);
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || message.status === filterStatus;
    const matchesType = filterType === "all" || message.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'announcement':
        return Megaphone;
      case 'reminder':
        return Bell;
      case 'event':
        return Calendar;
      case 'alert':
        return AlertTriangle;
      case 'assignment':
        return FileText;
      default:
        return MessageCircle;
    }
  };

  const stats = {
    totalMessages: messages.length,
    sentMessages: messages.filter(msg => msg.status === "Sent").length,
    scheduledMessages: messages.filter(msg => msg.status === "Scheduled").length,
    totalReads: messages.reduce((acc, msg) => acc + msg.readCount, 0)
  };

  return (
    <DashboardLayout userType="faculty" userName={user?.name || "Faculty"}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages & Notifications</h1>
            <p className="text-gray-600">Send announcements and messages to students</p>
          </div>
          <Dialog open={showComposeDialog} onOpenChange={setShowComposeDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Compose Message
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Compose New Message</DialogTitle>
                <DialogDescription>Send a message or announcement to students</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Message Title</Label>
                    <Input
                      value={newMessage.title}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter message title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Message Type</Label>
                    <Select value={newMessage.type} onValueChange={(value) => setNewMessage(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {messageTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Message Content</Label>
                  <Textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter your message content"
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Recipients</Label>
                    <Select value={newMessage.recipients} onValueChange={(value) => setNewMessage(prev => ({ ...prev, recipients: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {recipientTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Target Group</Label>
                    <Select value={newMessage.targetGroup} onValueChange={(value) => setNewMessage(prev => ({ ...prev, targetGroup: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {targetGroups.map(group => (
                          <SelectItem key={group} value={group}>{group}</SelectItem>
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

                {newMessage.recipients === "Selected Students" && (
                  <div className="space-y-2">
                    <Label>Select Students</Label>
                    <div className="border rounded-lg p-3 max-h-32 overflow-y-auto">
                      {students.map(student => (
                        <div key={student.id} className="flex items-center space-x-2 mb-2">
                          <input
                            type="checkbox"
                            id={`student-${student.id}`}
                            checked={newMessage.selectedStudents.includes(student.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewMessage(prev => ({
                                  ...prev,
                                  selectedStudents: [...prev.selectedStudents, student.id]
                                }));
                              } else {
                                setNewMessage(prev => ({
                                  ...prev,
                                  selectedStudents: prev.selectedStudents.filter(id => id !== student.id)
                                }));
                              }
                            }}
                          />
                          <Label htmlFor={`student-${student.id}`} className="text-sm cursor-pointer">
                            {student.name} ({student.hallTicket})
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Schedule Message (Optional)</Label>
                  <Input
                    type="datetime-local"
                    value={newMessage.scheduledDate}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  />
                  {newMessage.scheduledDate && (
                    <p className="text-xs text-gray-600">
                      Message will be sent on {new Date(newMessage.scheduledDate).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleSendMessage} className="flex-1">
                    {newMessage.scheduledDate ? "Schedule Message" : "Send Message"}
                  </Button>
                  <Button variant="outline" onClick={() => setShowComposeDialog(false)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sent Messages</CardTitle>
              <Send className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sentMessages}</div>
              <p className="text-xs text-muted-foreground">Successfully delivered</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.scheduledMessages}</div>
              <p className="text-xs text-muted-foreground">Pending delivery</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reads</CardTitle>
              <Eye className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReads}</div>
              <p className="text-xs text-muted-foreground">Message opens</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common message templates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                <div className="flex items-center space-x-2 mb-2">
                  <Megaphone className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Class Announcement</span>
                </div>
                <span className="text-sm text-gray-600">Send general announcements to class</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Assignment Reminder</span>
                </div>
                <span className="text-sm text-gray-600">Remind about upcoming deadlines</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span className="font-medium">Urgent Notice</span>
                </div>
                <span className="text-sm text-gray-600">Send urgent notifications</span>
              </Button>
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
                  placeholder="Search messages..."
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
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Message Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {messageTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Messages Table */}
        <Card>
          <CardHeader>
            <CardTitle>Message History</CardTitle>
            <CardDescription>Manage your sent and scheduled messages</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Message</TableHead>
                  <TableHead>Type & Priority</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((message) => {
                  const TypeIcon = getTypeIcon(message.type);
                  return (
                    <TableRow key={message.id}>
                      <TableCell>
                        <div className="flex items-start space-x-3">
                          <TypeIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                          <div>
                            <div className="font-medium">{message.title}</div>
                            <div className="text-sm text-gray-600 line-clamp-2">
                              {message.content.substring(0, 80)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline">{message.type}</Badge>
                          <Badge className={getPriorityColor(message.priority)} size="sm">
                            {message.priority}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{message.recipients}</div>
                          <div className="text-sm text-gray-600">{message.targetGroup}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(message.status)}>
                          {message.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {message.sentDate && (
                            <div>Sent: {new Date(message.sentDate).toLocaleDateString()}</div>
                          )}
                          {message.scheduledDate && (
                            <div className="text-blue-600">
                              Scheduled: {new Date(message.scheduledDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{message.readCount}/{message.totalRecipients}</div>
                          <div className="text-gray-600">
                            {((message.readCount / message.totalRecipients) * 100 || 0).toFixed(0)}% read
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => {
                              setSelectedMessage(message);
                              setShowViewDialog(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDuplicateMessage(message)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleDeleteMessage(message.id)}
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

        {/* View Message Dialog */}
        {selectedMessage && (
          <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedMessage.title}</DialogTitle>
                <DialogDescription>
                  {selectedMessage.type} • {selectedMessage.priority} Priority
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge className={getStatusColor(selectedMessage.status)}>
                      {selectedMessage.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Recipients</Label>
                    <p className="text-sm">{selectedMessage.recipients} • {selectedMessage.targetGroup}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Message Content</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900">{selectedMessage.content}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Sent Date</Label>
                    <p className="text-sm">{selectedMessage.sentDate ? new Date(selectedMessage.sentDate).toLocaleString() : "Not sent"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Read Status</Label>
                    <p className="text-sm">{selectedMessage.readCount}/{selectedMessage.totalRecipients} recipients read</p>
                  </div>
                </div>

                {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Attachments</Label>
                    <div className="flex space-x-2 mt-1">
                      {selectedMessage.attachments.map((attachment, index) => (
                        <Badge key={index} variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          {attachment}
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
      </div>
    </DashboardLayout>
  );
};

export default FacultyMessages;
