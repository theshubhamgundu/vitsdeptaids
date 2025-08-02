import { useState, useEffect } from "react";
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
  Globe, 
  Plus, 
  Edit, 
  Trash2, 
  Upload,
  Eye,
  Calendar,
  Camera,
  Award,
  Briefcase,
  Users,
  FileText,
  Image,
  Video,
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

const AdminContent = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "AI/ML Workshop Series",
      description: "Hands-on workshop covering machine learning fundamentals",
      date: "2025-03-15",
      type: "Workshop",
      status: "Active",
      featured: true
    },
    {
      id: 2,
      title: "Tech Talk: Future of Data Science",
      description: "Industry experts discuss emerging trends",
      date: "2025-03-22",
      type: "Seminar",
      status: "Active",
      featured: false
    }
  ]);

  const [gallery, setGallery] = useState([
    {
      id: 1,
      title: "Department Lab",
      description: "State-of-the-art AI lab facility",
      category: "Infrastructure",
      imageUrl: "/api/placeholder/300/200",
      uploadDate: "2025-03-01",
      status: "Published"
    },
    {
      id: 2,
      title: "Student Project Demo",
      description: "Final year project presentations",
      category: "Academic",
      imageUrl: "/api/placeholder/300/200",
      uploadDate: "2025-02-28",
      status: "Published"
    }
  ]);

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Semester Exam Schedule",
      content: "Final examinations will begin from March 25, 2025",
      priority: "High",
      status: "Active",
      publishDate: "2025-03-10",
      expiryDate: "2025-03-30"
    }
  ]);

  const [placements, setPlacements] = useState([
    {
      id: 1,
      studentName: "Rahul Sharma",
      company: "TechCorp Solutions",
      position: "Software Engineer",
      package: "12.5",
      placementDate: "2025-02-15",
      featured: true
    },
    {
      id: 2,
      studentName: "Priya Reddy",
      company: "DataTech Industries",
      position: "Data Scientist",
      package: "15.0",
      placementDate: "2025-02-20",
      featured: true
    }
  ]);

  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showGalleryDialog, setShowGalleryDialog] = useState(false);
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const [showPlacementDialog, setShowPlacementDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    type: "",
    featured: false
  });

  const [newGalleryItem, setNewGalleryItem] = useState({
    title: "",
    description: "",
    category: "",
    imageUrl: ""
  });

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    priority: "Medium",
    expiryDate: ""
  });

  const [newPlacement, setNewPlacement] = useState({
    studentName: "",
    company: "",
    position: "",
    package: "",
    placementDate: "",
    featured: false
  });

  const handleAddEvent = () => {
    const event = {
      ...newEvent,
      id: Date.now(),
      status: "Active"
    };
    setEvents(prev => [...prev, event]);
    setShowEventDialog(false);
    setNewEvent({ title: "", description: "", date: "", type: "", featured: false });
  };

  const handleAddGalleryItem = () => {
    const item = {
      ...newGalleryItem,
      id: Date.now(),
      uploadDate: new Date().toISOString().split('T')[0],
      status: "Published"
    };
    setGallery(prev => [...prev, item]);
    setShowGalleryDialog(false);
    setNewGalleryItem({ title: "", description: "", category: "", imageUrl: "" });
  };

  const handleAddAnnouncement = () => {
    const announcement = {
      ...newAnnouncement,
      id: Date.now(),
      status: "Active",
      publishDate: new Date().toISOString().split('T')[0]
    };
    setAnnouncements(prev => [...prev, announcement]);
    setShowAnnouncementDialog(false);
    setNewAnnouncement({ title: "", content: "", priority: "Medium", expiryDate: "" });
  };

  const handleAddPlacement = () => {
    const placement = {
      ...newPlacement,
      id: Date.now()
    };
    setPlacements(prev => [...prev, placement]);
    setShowPlacementDialog(false);
    setNewPlacement({ studentName: "", company: "", position: "", package: "", placementDate: "", featured: false });
  };

  const handleDeleteEvent = (id) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const handleDeleteGalleryItem = (id) => {
    setGallery(prev => prev.filter(item => item.id !== id));
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
  };

  const handleDeletePlacement = (id) => {
    setPlacements(prev => prev.filter(placement => placement.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'inactive':
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
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

  return (
    <DashboardLayout userType="admin" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600">Manage homepage and website content</p>
          </div>
        </div>

        {/* Content Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
              <p className="text-xs text-muted-foreground">Active events</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gallery Items</CardTitle>
              <Camera className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gallery.length}</div>
              <p className="text-xs text-muted-foreground">Published images</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Announcements</CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{announcements.length}</div>
              <p className="text-xs text-muted-foreground">Active announcements</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Placements</CardTitle>
              <Briefcase className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{placements.length}</div>
              <p className="text-xs text-muted-foreground">Placement records</p>
            </CardContent>
          </Card>
        </div>

        {/* Content Management Tabs */}
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="placements">Placements</TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Events Management</CardTitle>
                    <CardDescription>Manage department events and activities</CardDescription>
                  </div>
                  <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Event</DialogTitle>
                        <DialogDescription>Create a new event for the homepage</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Event Title</Label>
                          <Input
                            value={newEvent.title}
                            onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter event title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={newEvent.description}
                            onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter event description"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Event Date</Label>
                            <Input
                              type="date"
                              value={newEvent.date}
                              onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Event Type</Label>
                            <Select value={newEvent.type} onValueChange={(value) => setNewEvent(prev => ({ ...prev, type: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Workshop">Workshop</SelectItem>
                                <SelectItem value="Seminar">Seminar</SelectItem>
                                <SelectItem value="Conference">Conference</SelectItem>
                                <SelectItem value="Competition">Competition</SelectItem>
                                <SelectItem value="Exhibition">Exhibition</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="featured"
                            checked={newEvent.featured}
                            onChange={(e) => setNewEvent(prev => ({ ...prev, featured: e.target.checked }))}
                          />
                          <Label htmlFor="featured">Mark as featured</Label>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleAddEvent} className="flex-1">Add Event</Button>
                          <Button variant="outline" onClick={() => setShowEventDialog(false)}>Cancel</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-gray-600">{event.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{event.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {event.featured ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="h-4 w-4"></div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteEvent(event.id)}>
                              <Trash2 className="h-4 w-4 text-red-600" />
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

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gallery Management</CardTitle>
                    <CardDescription>Manage department photos and images</CardDescription>
                  </div>
                  <Dialog open={showGalleryDialog} onOpenChange={setShowGalleryDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Image
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Gallery Item</DialogTitle>
                        <DialogDescription>Upload a new image to the gallery</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Image Title</Label>
                          <Input
                            value={newGalleryItem.title}
                            onChange={(e) => setNewGalleryItem(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter image title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={newGalleryItem.description}
                            onChange={(e) => setNewGalleryItem(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter image description"
                            rows={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select value={newGalleryItem.category} onValueChange={(value) => setNewGalleryItem(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                              <SelectItem value="Academic">Academic</SelectItem>
                              <SelectItem value="Events">Events</SelectItem>
                              <SelectItem value="Achievements">Achievements</SelectItem>
                              <SelectItem value="Campus">Campus</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Image Upload</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleAddGalleryItem} className="flex-1">Add to Gallery</Button>
                          <Button variant="outline" onClick={() => setShowGalleryDialog(false)}>Cancel</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gallery.map((item) => (
                    <Card key={item.id}>
                      <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{item.category}</Badge>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteGalleryItem(item.id)}>
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Announcements</CardTitle>
                    <CardDescription>Manage important announcements and notices</CardDescription>
                  </div>
                  <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Announcement
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Announcement</DialogTitle>
                        <DialogDescription>Post a new announcement</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Title</Label>
                          <Input
                            value={newAnnouncement.title}
                            onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter announcement title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Content</Label>
                          <Textarea
                            value={newAnnouncement.content}
                            onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
                            placeholder="Enter announcement content"
                            rows={4}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select value={newAnnouncement.priority} onValueChange={(value) => setNewAnnouncement(prev => ({ ...prev, priority: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Expiry Date</Label>
                            <Input
                              type="date"
                              value={newAnnouncement.expiryDate}
                              onChange={(e) => setNewAnnouncement(prev => ({ ...prev, expiryDate: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleAddAnnouncement} className="flex-1">Publish</Button>
                          <Button variant="outline" onClick={() => setShowAnnouncementDialog(false)}>Cancel</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <Card key={announcement.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold">{announcement.title}</h3>
                              <Badge className={getPriorityColor(announcement.priority)}>
                                {announcement.priority}
                              </Badge>
                            </div>
                            <p className="text-gray-700 mb-2">{announcement.content}</p>
                            <div className="text-sm text-gray-500">
                              Published: {new Date(announcement.publishDate).toLocaleDateString()}
                              {announcement.expiryDate && ` • Expires: ${new Date(announcement.expiryDate).toLocaleDateString()}`}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteAnnouncement(announcement.id)}>
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Placements Tab */}
          <TabsContent value="placements" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Placement Records</CardTitle>
                    <CardDescription>Manage student placement information</CardDescription>
                  </div>
                  <Dialog open={showPlacementDialog} onOpenChange={setShowPlacementDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Placement
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Placement Record</DialogTitle>
                        <DialogDescription>Record a new student placement</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Student Name</Label>
                          <Input
                            value={newPlacement.studentName}
                            onChange={(e) => setNewPlacement(prev => ({ ...prev, studentName: e.target.value }))}
                            placeholder="Enter student name"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Company</Label>
                            <Input
                              value={newPlacement.company}
                              onChange={(e) => setNewPlacement(prev => ({ ...prev, company: e.target.value }))}
                              placeholder="Company name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Position</Label>
                            <Input
                              value={newPlacement.position}
                              onChange={(e) => setNewPlacement(prev => ({ ...prev, position: e.target.value }))}
                              placeholder="Job position"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Package (LPA)</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={newPlacement.package}
                              onChange={(e) => setNewPlacement(prev => ({ ...prev, package: e.target.value }))}
                              placeholder="12.5"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Placement Date</Label>
                            <Input
                              type="date"
                              value={newPlacement.placementDate}
                              onChange={(e) => setNewPlacement(prev => ({ ...prev, placementDate: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="placementFeatured"
                            checked={newPlacement.featured}
                            onChange={(e) => setNewPlacement(prev => ({ ...prev, featured: e.target.checked }))}
                          />
                          <Label htmlFor="placementFeatured">Feature on homepage</Label>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleAddPlacement} className="flex-1">Add Record</Button>
                          <Button variant="outline" onClick={() => setShowPlacementDialog(false)}>Cancel</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {placements.map((placement) => (
                      <TableRow key={placement.id}>
                        <TableCell className="font-medium">{placement.studentName}</TableCell>
                        <TableCell>{placement.company}</TableCell>
                        <TableCell>{placement.position}</TableCell>
                        <TableCell>₹{placement.package} LPA</TableCell>
                        <TableCell>{new Date(placement.placementDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {placement.featured ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="h-4 w-4"></div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeletePlacement(placement.id)}>
                              <Trash2 className="h-4 w-4 text-red-600" />
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

export default AdminContent;
