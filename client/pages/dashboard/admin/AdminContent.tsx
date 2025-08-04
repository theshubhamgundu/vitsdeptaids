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
import { getAllFaculty } from "@/data/facultyData";
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
  AlertCircle,
  GraduationCap,
  Trophy,
  Search,
  Filter,
  Download,
  Star,
  MapPin,
  Phone,
  Mail,
  ExternalLink
} from "lucide-react";

const AdminContent = () => {
  const [events, setEvents] = useState([]);

  const [gallery, setGallery] = useState([
    {
      id: 1,
      title: "Department Lab",
      description: "State-of-the-art AI lab facility",
      category: "Infrastructure",
      imageUrl: "/api/placeholder/300/200",
      uploadDate: "2025-03-01",
      status: "Published",
      photographer: "Admin",
      tags: ["lab", "infrastructure", "AI"]
    },
    {
      id: 2,
      title: "Student Project Demo",
      description: "Final year project presentations",
      category: "Academic",
      imageUrl: "/api/placeholder/300/200",
      uploadDate: "2025-02-28",
      status: "Published",
      photographer: "Dr. Smith",
      tags: ["students", "projects", "demo"]
    }
  ]);

  const [facultyData, setFacultyData] = useState([]);

  const [placements, setPlacements] = useState([
    {
      id: 1,
      studentName: "Rahul Sharma",
      hallTicket: "20AI001",
      company: "TechCorp Solutions",
      position: "Software Engineer",
      package: "12.5",
      placementDate: "2025-02-15",
      featured: true,
      location: "Bangalore",
      companyType: "Product",
      offerType: "Full-time"
    },
    {
      id: 2,
      studentName: "Priya Reddy",
      hallTicket: "20AI002",
      company: "DataTech Industries",
      position: "Data Scientist",
      package: "15.0",
      placementDate: "2025-02-20",
      featured: true,
      location: "Hyderabad",
      companyType: "Service",
      offerType: "Full-time"
    }
  ]);

  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: "Best Department Award 2024",
      description: "Recognized as the best AI & Data Science department in the state",
      category: "Institutional",
      awardedBy: "State Government",
      date: "2024-12-15",
      recipient: "Department of AI & Data Science",
      featured: true,
      imageUrl: "/api/placeholder/300/200"
    },
    {
      id: 2,
      title: "IEEE Student Paper Competition Winner",
      description: "First place in national level IEEE student paper competition",
      category: "Student",
      awardedBy: "IEEE India",
      date: "2025-01-20",
      recipient: "Amit Kumar (20AI003)",
      featured: true,
      imageUrl: "/api/placeholder/300/200"
    }
  ]);

  // Dialog states
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showGalleryDialog, setShowGalleryDialog] = useState(false);
  const [showFacultyDialog, setShowFacultyDialog] = useState(false);
  const [showPlacementDialog, setShowPlacementDialog] = useState(false);
  const [showAchievementDialog, setShowAchievementDialog] = useState(false);
  
  // Form states
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    type: "",
    venue: "",
    organizer: "",
    featured: false
  });

  const [newGalleryItem, setNewGalleryItem] = useState({
    title: "",
    description: "",
    category: "",
    photographer: "",
    tags: "",
    imageUrl: ""
  });

  const [newFaculty, setNewFaculty] = useState({
    name: "",
    designation: "",
    specialization: "",
    experience: "",
    education: "",
    email: "",
    phone: "",
    researchPapers: ""
  });

  const [newPlacement, setNewPlacement] = useState({
    studentName: "",
    hallTicket: "",
    company: "",
    position: "",
    package: "",
    placementDate: "",
    location: "",
    companyType: "",
    offerType: "",
    featured: false
  });

  const [newAchievement, setNewAchievement] = useState({
    title: "",
    description: "",
    category: "",
    awardedBy: "",
    date: "",
    recipient: "",
    featured: false
  });

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("events");

  // Handle functions
  const handleAddEvent = () => {
    const event = {
      ...newEvent,
      id: Date.now(),
      status: "Active"
    };
    setEvents(prev => [...prev, event]);
    setShowEventDialog(false);
    setNewEvent({ title: "", description: "", date: "", type: "", venue: "", organizer: "", featured: false });
  };

  const handleAddGalleryItem = () => {
    const item = {
      ...newGalleryItem,
      id: Date.now(),
      uploadDate: new Date().toISOString().split('T')[0],
      status: "Published",
      tags: newGalleryItem.tags.split(',').map(tag => tag.trim())
    };
    setGallery(prev => [...prev, item]);
    setShowGalleryDialog(false);
    setNewGalleryItem({ title: "", description: "", category: "", photographer: "", tags: "", imageUrl: "" });
  };

  const handleAddFaculty = () => {
    const faculty = {
      ...newFaculty,
      id: Date.now(),
      department: "AI & Data Science",
      imageUrl: "/api/placeholder/150/150",
      status: "Active",
      researchPapers: parseInt(newFaculty.researchPapers) || 0
    };
    setFacultyData(prev => [...prev, faculty]);
    setShowFacultyDialog(false);
    setNewFaculty({ name: "", designation: "", specialization: "", experience: "", education: "", email: "", phone: "", researchPapers: "" });
  };

  const handleAddPlacement = () => {
    const placement = {
      ...newPlacement,
      id: Date.now()
    };
    setPlacements(prev => [...prev, placement]);
    setShowPlacementDialog(false);
    setNewPlacement({ studentName: "", hallTicket: "", company: "", position: "", package: "", placementDate: "", location: "", companyType: "", offerType: "", featured: false });
  };

  const handleAddAchievement = () => {
    const achievement = {
      ...newAchievement,
      id: Date.now(),
      imageUrl: "/api/placeholder/300/200"
    };
    setAchievements(prev => [...prev, achievement]);
    setShowAchievementDialog(false);
    setNewAchievement({ title: "", description: "", category: "", awardedBy: "", date: "", recipient: "", featured: false });
  };

  const handleDelete = (id, type) => {
    switch (type) {
      case 'event':
        setEvents(prev => prev.filter(item => item.id !== id));
        break;
      case 'gallery':
        setGallery(prev => prev.filter(item => item.id !== id));
        break;
      case 'faculty':
        setFacultyData(prev => prev.filter(item => item.id !== id));
        break;
      case 'placement':
        setPlacements(prev => prev.filter(item => item.id !== id));
        break;
      case 'achievement':
        setAchievements(prev => prev.filter(item => item.id !== id));
        break;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}</div>
              <p className="text-xs text-muted-foreground">Active events</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gallery</CardTitle>
              <Camera className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gallery.length}</div>
              <p className="text-xs text-muted-foreground">Published images</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faculty</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{facultyData.length}</div>
              <p className="text-xs text-muted-foreground">Faculty members</p>
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{achievements.length}</div>
              <p className="text-xs text-muted-foreground">Awards & honors</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Management Tabs */}
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="events">📅 Events</TabsTrigger>
            <TabsTrigger value="gallery">📷 Gallery</TabsTrigger>
            <TabsTrigger value="faculty">👨‍🏫 Faculty</TabsTrigger>
            <TabsTrigger value="placements">💼 Placements</TabsTrigger>
            <TabsTrigger value="achievements">�� Achievements</TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>📅 Events Manager</CardTitle>
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
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Venue</Label>
                            <Input
                              value={newEvent.venue}
                              onChange={(e) => setNewEvent(prev => ({ ...prev, venue: e.target.value }))}
                              placeholder="Event venue"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Organizer</Label>
                            <Input
                              value={newEvent.organizer}
                              onChange={(e) => setNewEvent(prev => ({ ...prev, organizer: e.target.value }))}
                              placeholder="Event organizer"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="eventFeatured"
                            checked={newEvent.featured}
                            onChange={(e) => setNewEvent(prev => ({ ...prev, featured: e.target.checked }))}
                          />
                          <Label htmlFor="eventFeatured">Mark as featured</Label>
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
                      <TableHead>Venue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.filter(event => 
                      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      event.description.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-gray-600">{event.description}</div>
                            <div className="text-xs text-gray-500">Organizer: {event.organizer}</div>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{event.type}</Badge>
                        </TableCell>
                        <TableCell>{event.venue}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {event.featured ? (
                            <Star className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <div className="h-4 w-4"></div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(event.id, 'event')}>
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
                    <CardTitle>📷 Gallery Manager</CardTitle>
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
                        <div className="grid grid-cols-2 gap-3">
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
                            <Label>Photographer</Label>
                            <Input
                              value={newGalleryItem.photographer}
                              onChange={(e) => setNewGalleryItem(prev => ({ ...prev, photographer: e.target.value }))}
                              placeholder="Photographer name"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Tags (comma separated)</Label>
                          <Input
                            value={newGalleryItem.tags}
                            onChange={(e) => setNewGalleryItem(prev => ({ ...prev, tags: e.target.value }))}
                            placeholder="lab, infrastructure, AI"
                          />
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
                  {gallery.filter(item => 
                    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((item) => (
                    <Card key={item.id}>
                      <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{item.category}</Badge>
                          <span className="text-xs text-gray-500">by {item.photographer}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {item.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id, 'gallery')}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Faculty Tab - Redirect to dedicated management */}
          <TabsContent value="faculty" className="space-y-6">
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Faculty Management</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Faculty management has been moved to a dedicated section for better organization and functionality.
                </p>
                <Link to="/dashboard/admin/faculty">
                  <Button size="lg">
                    <Users className="h-5 w-5 mr-2" />
                    Go to Faculty Management
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Placements Tab */}
          <TabsContent value="placements" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>💼 Placements Manager</CardTitle>
                    <CardDescription>Manage student placement information</CardDescription>
                  </div>
                  <Dialog open={showPlacementDialog} onOpenChange={setShowPlacementDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Placement
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Placement Record</DialogTitle>
                        <DialogDescription>Record a new student placement</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Student Name</Label>
                            <Input
                              value={newPlacement.studentName}
                              onChange={(e) => setNewPlacement(prev => ({ ...prev, studentName: e.target.value }))}
                              placeholder="Enter student name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Hall Ticket</Label>
                            <Input
                              value={newPlacement.hallTicket}
                              onChange={(e) => setNewPlacement(prev => ({ ...prev, hallTicket: e.target.value }))}
                              placeholder="20AI001"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
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
                        <div className="grid grid-cols-3 gap-4">
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
                            <Label>Location</Label>
                            <Input
                              value={newPlacement.location}
                              onChange={(e) => setNewPlacement(prev => ({ ...prev, location: e.target.value }))}
                              placeholder="Bangalore"
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
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Company Type</Label>
                            <Select value={newPlacement.companyType} onValueChange={(value) => setNewPlacement(prev => ({ ...prev, companyType: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Product">Product</SelectItem>
                                <SelectItem value="Service">Service</SelectItem>
                                <SelectItem value="Startup">Startup</SelectItem>
                                <SelectItem value="MNC">MNC</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Offer Type</Label>
                            <Select value={newPlacement.offerType} onValueChange={(value) => setNewPlacement(prev => ({ ...prev, offerType: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Full-time">Full-time</SelectItem>
                                <SelectItem value="Internship">Internship</SelectItem>
                                <SelectItem value="Contract">Contract</SelectItem>
                              </SelectContent>
                            </Select>
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
                      <TableHead>Location</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {placements.filter(placement => 
                      placement.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      placement.company.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map((placement) => (
                      <TableRow key={placement.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{placement.studentName}</div>
                            <div className="text-sm text-gray-600">{placement.hallTicket}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{placement.company}</div>
                            <Badge variant="outline" className="text-xs">{placement.companyType}</Badge>
                          </div>
                        </TableCell>
                        <TableCell>{placement.position}</TableCell>
                        <TableCell>₹{placement.package} LPA</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span>{placement.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(placement.placementDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {placement.featured ? (
                            <Star className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <div className="h-4 w-4"></div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDelete(placement.id, 'placement')}>
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

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>🏆 Achievements Manager</CardTitle>
                    <CardDescription>Manage awards and achievements</CardDescription>
                  </div>
                  <Dialog open={showAchievementDialog} onOpenChange={setShowAchievementDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Achievement
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add Achievement</DialogTitle>
                        <DialogDescription>Record a new achievement or award</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Achievement Title</Label>
                          <Input
                            value={newAchievement.title}
                            onChange={(e) => setNewAchievement(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter achievement title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea
                            value={newAchievement.description}
                            onChange={(e) => setNewAchievement(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter achievement description"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={newAchievement.category} onValueChange={(value) => setNewAchievement(prev => ({ ...prev, category: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Institutional">Institutional</SelectItem>
                                <SelectItem value="Faculty">Faculty</SelectItem>
                                <SelectItem value="Student">Student</SelectItem>
                                <SelectItem value="Research">Research</SelectItem>
                                <SelectItem value="Academic">Academic</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                              type="date"
                              value={newAchievement.date}
                              onChange={(e) => setNewAchievement(prev => ({ ...prev, date: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Awarded By</Label>
                            <Input
                              value={newAchievement.awardedBy}
                              onChange={(e) => setNewAchievement(prev => ({ ...prev, awardedBy: e.target.value }))}
                              placeholder="Organization/Institution"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Recipient</Label>
                            <Input
                              value={newAchievement.recipient}
                              onChange={(e) => setNewAchievement(prev => ({ ...prev, recipient: e.target.value }))}
                              placeholder="Department/Person"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="achievementFeatured"
                            checked={newAchievement.featured}
                            onChange={(e) => setNewAchievement(prev => ({ ...prev, featured: e.target.checked }))}
                          />
                          <Label htmlFor="achievementFeatured">Feature on homepage</Label>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleAddAchievement} className="flex-1">Add Achievement</Button>
                          <Button variant="outline" onClick={() => setShowAchievementDialog(false)}>Cancel</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {achievements.filter(achievement => 
                    achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    achievement.description.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((achievement) => (
                    <Card key={achievement.id}>
                      <div className="aspect-video bg-gradient-to-r from-yellow-100 to-orange-100 rounded-t-lg flex items-center justify-center">
                        <Trophy className="h-12 w-12 text-yellow-600" />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          {achievement.featured && <Star className="h-4 w-4 text-yellow-500" />}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        <div className="space-y-1 text-xs text-gray-500">
                          <div>Category: <Badge variant="outline" className="text-xs">{achievement.category}</Badge></div>
                          <div>Awarded by: {achievement.awardedBy}</div>
                          <div>Recipient: {achievement.recipient}</div>
                          <div>Date: {new Date(achievement.date).toLocaleDateString()}</div>
                        </div>
                        <div className="flex justify-between mt-4">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(achievement.id, 'achievement')}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminContent;
