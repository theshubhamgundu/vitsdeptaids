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
import { mappingService } from "@/services/mappingService";
import { useToast } from "@/hooks/use-toast";
import {
  Send,
  Plus,
  MessageCircle,
  Users,
  Clock,
  Eye,
  Trash2,
  UserCheck,
  Heart,
  Bell,
  AlertTriangle,
  Calendar
} from "lucide-react";

interface Message {
  id: string;
  title: string;
  content: string;
  type: 'General' | 'Academic' | 'Alert' | 'Reminder';
  recipients: string[];
  recipientNames: string[];
  sentDate: string;
  status: 'Sent' | 'Draft';
}

interface AssignedStudent {
  id: string;
  name: string;
  hallTicket: string;
  email: string;
  mappingType: 'coordinator' | 'counsellor';
}

const FacultyMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [assignedStudents, setAssignedStudents] = useState<AssignedStudent[]>([]);
  const [showComposeDialog, setShowComposeDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const [newMessage, setNewMessage] = useState({
    title: "",
    content: "",
    type: "General" as const,
    recipients: [] as string[],
    sendToAll: true
  });

  useEffect(() => {
    loadAssignedStudents();
    loadMessages();
  }, [user]);

  const loadAssignedStudents = () => {
    if (!user?.id) return;

    try {
      // Get mappings for this faculty member
      const mappings = mappingService.getFacultyStudents(user.id);
      
      // Get student details from localStorage
      const storedStudents = localStorage.getItem('students');
      const students = storedStudents ? JSON.parse(storedStudents) : [];

      // Combine mapping data with student details
      const assignedStudentsList = mappings.map(mapping => {
        const student = students.find(s => s.id === mapping.studentId);
        return {
          id: student?.id || mapping.studentId,
          name: student?.name || student?.fullName || 'Unknown Student',
          hallTicket: student?.hallTicket || '',
          email: student?.email || '',
          mappingType: mapping.mappingType
        };
      });

      setAssignedStudents(assignedStudentsList);
    } catch (error) {
      console.error('Error loading assigned students:', error);
    }
  };

  const loadMessages = () => {
    try {
      const storedMessages = localStorage.getItem(`facultyMessages_${user?.id}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const saveMessages = (updatedMessages: Message[]) => {
    try {
      localStorage.setItem(`facultyMessages_${user?.id}`, JSON.stringify(updatedMessages));
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.title || !newMessage.content) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and content",
        variant: "destructive",
      });
      return;
    }

    const recipients = newMessage.sendToAll 
      ? assignedStudents.map(s => s.id)
      : newMessage.recipients;

    if (recipients.length === 0) {
      toast({
        title: "No Recipients",
        description: "Please select at least one student",
        variant: "destructive",
      });
      return;
    }

    const recipientNames = recipients.map(id => {
      const student = assignedStudents.find(s => s.id === id);
      return student?.name || 'Unknown';
    });

    const message: Message = {
      id: Date.now().toString(),
      title: newMessage.title,
      content: newMessage.content,
      type: newMessage.type,
      recipients,
      recipientNames,
      sentDate: new Date().toISOString(),
      status: 'Sent'
    };

    const updatedMessages = [message, ...messages];
    saveMessages(updatedMessages);

    toast({
      title: "Message Sent",
      description: `Message sent to ${recipients.length} students`,
    });

    // Reset form
    setNewMessage({
      title: "",
      content: "",
      type: "General",
      recipients: [],
      sendToAll: true
    });
    setShowComposeDialog(false);
  };

  const handleDeleteMessage = (messageId: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      const updatedMessages = messages.filter(m => m.id !== messageId);
      saveMessages(updatedMessages);
      
      toast({
        title: "Message Deleted",
        description: "Message has been deleted successfully",
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'General': return MessageCircle;
      case 'Academic': return Calendar;
      case 'Alert': return AlertTriangle;
      case 'Reminder': return Bell;
      default: return MessageCircle;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'General': return 'bg-blue-100 text-blue-800';
      case 'Academic': return 'bg-green-100 text-green-800';
      case 'Alert': return 'bg-red-100 text-red-800';
      case 'Reminder': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const coordinatorStudents = assignedStudents.filter(s => s.mappingType === 'coordinator');
  const counsellorStudents = assignedStudents.filter(s => s.mappingType === 'counsellor');

  return (
    <DashboardLayout userType="faculty" userName={user?.name || "Faculty"}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600">Send messages to your assigned students</p>
          </div>
          
          <Dialog open={showComposeDialog} onOpenChange={setShowComposeDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Compose Message
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Send Message to Students</DialogTitle>
                <DialogDescription>
                  Send a message to your assigned students
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Message Title</Label>
                  <Input
                    id="title"
                    value={newMessage.title}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter message title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Message Type</Label>
                  <Select 
                    value={newMessage.type} 
                    onValueChange={(value: 'General' | 'Academic' | 'Alert' | 'Reminder') => 
                      setNewMessage(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General">General</SelectItem>
                      <SelectItem value="Academic">Academic</SelectItem>
                      <SelectItem value="Alert">Alert</SelectItem>
                      <SelectItem value="Reminder">Reminder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Message Content</Label>
                  <Textarea
                    id="content"
                    value={newMessage.content}
                    onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter your message content"
                    rows={5}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sendToAll"
                      checked={newMessage.sendToAll}
                      onChange={(e) => setNewMessage(prev => ({ ...prev, sendToAll: e.target.checked }))}
                    />
                    <Label htmlFor="sendToAll">Send to all assigned students ({assignedStudents.length})</Label>
                  </div>

                  {!newMessage.sendToAll && (
                    <div className="space-y-2">
                      <Label>Select Students</Label>
                      <div className="border rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                        {assignedStudents.map(student => (
                          <div key={student.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`student-${student.id}`}
                              checked={newMessage.recipients.includes(student.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewMessage(prev => ({
                                    ...prev,
                                    recipients: [...prev.recipients, student.id]
                                  }));
                                } else {
                                  setNewMessage(prev => ({
                                    ...prev,
                                    recipients: prev.recipients.filter(id => id !== student.id)
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={`student-${student.id}`} className="text-sm cursor-pointer flex items-center space-x-2">
                              <span>{student.name} ({student.hallTicket})</span>
                              <Badge variant="outline" className="text-xs">
                                {student.mappingType === 'coordinator' ? <UserCheck className="h-3 w-3" /> : <Heart className="h-3 w-3" />}
                              </Badge>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleSendMessage} className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" onClick={() => setShowComposeDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Student Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold">{assignedStudents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Coordinator</p>
                  <p className="text-2xl font-bold">{coordinatorStudents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Counsellor</p>
                  <p className="text-2xl font-bold">{counsellorStudents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {assignedStudents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Assigned</h3>
              <p className="text-gray-600">You haven't been assigned any students yet. Contact admin to get student assignments.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Message History */}
            <Card>
              <CardHeader>
                <CardTitle>Message History</CardTitle>
                <CardDescription>
                  Your sent messages ({messages.length} total)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Messages Sent</h3>
                    <p className="text-gray-600">Start communicating with your students by sending your first message.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Message</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Recipients</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {messages.map((message) => {
                        const TypeIcon = getTypeIcon(message.type);
                        return (
                          <TableRow key={message.id}>
                            <TableCell>
                              <div className="flex items-start space-x-3">
                                <TypeIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                                <div>
                                  <div className="font-medium">{message.title}</div>
                                  <div className="text-sm text-gray-600 line-clamp-2">
                                    {message.content.substring(0, 100)}...
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getTypeColor(message.type)}>
                                {message.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{message.recipients.length} students</div>
                                <div className="text-sm text-gray-600">
                                  {message.recipientNames.slice(0, 2).join(', ')}
                                  {message.recipientNames.length > 2 && ` +${message.recipientNames.length - 2} more`}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {new Date(message.sentDate).toLocaleDateString()}
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
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* View Message Dialog */}
        {selectedMessage && (
          <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedMessage.title}</DialogTitle>
                <DialogDescription>
                  {selectedMessage.type} message sent to {selectedMessage.recipients.length} students
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Message Content</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900">{selectedMessage.content}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Recipients ({selectedMessage.recipients.length})</Label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {selectedMessage.recipientNames.map((name, index) => (
                      <Badge key={index} variant="outline">{name}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Type</Label>
                    <Badge className={getTypeColor(selectedMessage.type)}>
                      {selectedMessage.type}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Sent Date</Label>
                    <p className="text-sm">{new Date(selectedMessage.sentDate).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex justify-end">
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
