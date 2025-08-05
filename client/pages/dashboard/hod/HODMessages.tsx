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
  const hodData = getFacultyByRole("HOD")[0]; // Get the HOD

  const [messages, setMessages] = useState([]);


  const [communications, setCommunications] = useState([]);

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

  const recipients = [
    "All Faculty",
    "All Students",
    "Admin Staff",
    ...facultyOnly.map(f => f.name), // Individual faculty members
    "Associate Professors",
    "Assistant Professors"
  ];
  const priorities = ["High", "Medium", "Low"];
  const categories = ["General", "Academic", "Meeting", "Research", "Administrative"];

  const handleSendMessage = () => {
    if (!newMessage.title || !newMessage.content) {
      toast({
        title: "Error",
        description: "Please fill in both title and content",
        variant: "destructive"
      });
      return;
    }

    let recipientCount = 0;
    if (newMessage.recipients === "All Faculty") {
      recipientCount = allFaculty.length;
    } else if (newMessage.recipients === "All Students") {
      recipientCount = 240; // Estimated student count
    } else if (newMessage.recipients === "Admin Staff") {
      recipientCount = getFacultyByRole("Admin").length;
    } else if (newMessage.recipients === "Associate Professors") {
      recipientCount = allFaculty.filter(f => f.designation === "Associate Prof.").length;
    } else if (newMessage.recipients === "Assistant Professors") {
      recipientCount = allFaculty.filter(f => f.designation === "Asst. Prof.").length;
    } else {
      recipientCount = 1; // Individual faculty member
    }

    const message = {
      id: Date.now(),
      ...newMessage,
      sentDate: newMessage.scheduledDate || new Date().toISOString().split('T')[0],
      sentBy: hodData?.name || "HOD", // HOD name from faculty data
      status: newMessage.scheduledDate ? "Scheduled" : "Sent",
      recipientCount,
      readBy: 0,
      acknowledgments: 0
    };

    setMessages(prev => [message, ...prev]);

    toast({
      title: "Message Sent Successfully",
      description: `Message sent to ${recipientCount} recipient(s): ${newMessage.recipients}`,
    });

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
    <DashboardLayout userType="hod" userName={hodData?.name || "HOD"}>
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


        {/* Department Messages */}
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
      </div>
    </DashboardLayout>
  );
};

export default HODMessages;
