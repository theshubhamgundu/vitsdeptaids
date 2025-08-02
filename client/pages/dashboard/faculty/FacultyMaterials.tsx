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
  Upload,
  Download,
  Plus,
  Edit,
  Trash2,
  FileText,
  Video,
  Image,
  File,
  BookOpen,
  Calendar,
  Clock,
  Users,
  Eye,
  Search,
  Filter
} from "lucide-react";

const FacultyMaterials = () => {
  const [materials, setMaterials] = useState([
    {
      id: 1,
      title: "Introduction to Machine Learning",
      description: "Comprehensive guide covering ML fundamentals",
      subject: "Machine Learning",
      type: "PDF",
      category: "Lecture Notes",
      uploadDate: "2025-03-10",
      size: "2.5 MB",
      downloads: 45,
      year: "3rd Year",
      semester: "6th Semester",
      status: "Published",
      fileUrl: "/materials/ml-intro.pdf"
    },
    {
      id: 2,
      title: "Neural Networks Tutorial Video",
      description: "Step-by-step implementation of neural networks",
      subject: "Deep Learning",
      type: "Video",
      category: "Tutorial",
      uploadDate: "2025-03-08",
      size: "125 MB",
      downloads: 32,
      year: "3rd Year",
      semester: "6th Semester",
      status: "Published",
      fileUrl: "/materials/nn-tutorial.mp4"
    },
    {
      id: 3,
      title: "Python Programming Assignment",
      description: "Practice exercises for data structures",
      subject: "Programming",
      type: "ZIP",
      category: "Assignment",
      uploadDate: "2025-03-05",
      size: "1.2 MB",
      downloads: 67,
      year: "2nd Year",
      semester: "4th Semester",
      status: "Published",
      fileUrl: "/materials/python-assignment.zip"
    }
  ]);

  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [uploadProgress, setUploadProgress] = useState(0);

  const [newMaterial, setNewMaterial] = useState({
    title: "",
    description: "",
    subject: "",
    type: "PDF",
    category: "Lecture Notes",
    year: "3rd Year",
    semester: "6th Semester",
    file: null
  });

  const subjects = ["Machine Learning", "Deep Learning", "Data Science", "Programming", "Statistics", "Mathematics"];
  const categories = ["Lecture Notes", "Tutorial", "Assignment", "Reference", "Project", "Exam"];
  const fileTypes = ["PDF", "Video", "ZIP", "PPT", "DOC", "Image"];
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const semesters = ["1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"];

  const handleUpload = async () => {
    if (!newMaterial.title || !newMaterial.file) return;
    
    setUploadProgress(0);
    
    // Simulate file upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Add material to list
          const material = {
            ...newMaterial,
            id: Date.now(),
            uploadDate: new Date().toISOString().split('T')[0],
            size: `${(Math.random() * 10 + 1).toFixed(1)} MB`,
            downloads: 0,
            status: "Published",
            fileUrl: `/materials/${newMaterial.file.name}`
          };
          setMaterials(prev => [material, ...prev]);
          setShowUploadDialog(false);
          setNewMaterial({
            title: "",
            description: "",
            subject: "",
            type: "PDF",
            category: "Lecture Notes",
            year: "3rd Year",
            semester: "6th Semester",
            file: null
          });
          setUploadProgress(0);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDownload = (material) => {
    // Simulate download
    const downloads = materials.find(m => m.id === material.id)?.downloads || 0;
    setMaterials(prev => prev.map(m => 
      m.id === material.id ? { ...m, downloads: downloads + 1 } : m
    ));
  };

  const handleDelete = (id) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === "all" || material.subject === filterSubject;
    const matchesType = filterType === "all" || material.type === filterType;
    
    return matchesSearch && matchesSubject && matchesType;
  });

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf':
      case 'doc':
        return FileText;
      case 'video':
        return Video;
      case 'image':
        return Image;
      default:
        return File;
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'bg-red-100 text-red-800';
      case 'video':
        return 'bg-purple-100 text-purple-800';
      case 'zip':
        return 'bg-yellow-100 text-yellow-800';
      case 'ppt':
        return 'bg-orange-100 text-orange-800';
      case 'doc':
        return 'bg-blue-100 text-blue-800';
      case 'image':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalSize = materials.reduce((acc, material) => acc + parseFloat(material.size), 0);
  const totalDownloads = materials.reduce((acc, material) => acc + material.downloads, 0);

  return (
    <DashboardLayout userType="faculty" userName="Dr. Anita Verma">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Study Materials</h1>
            <p className="text-gray-600">Upload and manage course materials for students</p>
          </div>
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Upload className="h-4 w-4 mr-2" />
                Upload Material
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload Study Material</DialogTitle>
                <DialogDescription>Add new study material for students</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Material Title</Label>
                    <Input
                      value={newMaterial.title}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter material title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select value={newMaterial.subject} onValueChange={(value) => setNewMaterial(prev => ({ ...prev, subject: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newMaterial.description}
                    onChange={(e) => setNewMaterial(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter material description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={newMaterial.category} onValueChange={(value) => setNewMaterial(prev => ({ ...prev, category: value }))}>
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
                    <Label>Year</Label>
                    <Select value={newMaterial.year} onValueChange={(value) => setNewMaterial(prev => ({ ...prev, year: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Semester</Label>
                    <Select value={newMaterial.semester} onValueChange={(value) => setNewMaterial(prev => ({ ...prev, semester: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map(semester => (
                          <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Upload File</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <div className="text-sm text-gray-600 mb-2">
                        Click to upload or drag and drop
                      </div>
                      <Input
                        type="file"
                        className="hidden"
                        id="file-upload"
                        onChange={(e) => setNewMaterial(prev => ({ ...prev, file: e.target.files[0] }))}
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Button type="button" variant="outline">Choose File</Button>
                      </label>
                    </div>
                    {newMaterial.file && (
                      <div className="mt-2 text-center text-sm text-green-600">
                        Selected: {newMaterial.file.name}
                      </div>
                    )}
                  </div>
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button onClick={handleUpload} className="flex-1" disabled={!newMaterial.title || !newMaterial.file}>
                    Upload Material
                  </Button>
                  <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Materials</CardTitle>
              <BookOpen className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{materials.length}</div>
              <p className="text-xs text-muted-foreground">Uploaded materials</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDownloads}</div>
              <p className="text-xs text-muted-foreground">Student downloads</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <File className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSize.toFixed(1)} MB</div>
              <p className="text-xs text-muted-foreground">Total storage</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">Accessing materials</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {fileTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Materials Table */}
        <Card>
          <CardHeader>
            <CardTitle>Study Materials</CardTitle>
            <CardDescription>Manage your uploaded materials</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.map((material) => {
                  const TypeIcon = getTypeIcon(material.type);
                  return (
                    <TableRow key={material.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <TypeIcon className="h-5 w-5 text-gray-500" />
                          <div>
                            <div className="font-medium">{material.title}</div>
                            <div className="text-sm text-gray-600">{material.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{material.subject}</div>
                          <Badge variant="outline" className="text-xs">{material.category}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(material.type)}>
                          {material.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{material.year}</div>
                          <div className="text-gray-600">{material.semester}</div>
                        </div>
                      </TableCell>
                      <TableCell>{material.size}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Download className="h-4 w-4 text-gray-500" />
                          <span>{material.downloads}</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(material.uploadDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" onClick={() => handleDownload(material)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(material.id)}>
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
      </div>
    </DashboardLayout>
  );
};

export default FacultyMaterials;
