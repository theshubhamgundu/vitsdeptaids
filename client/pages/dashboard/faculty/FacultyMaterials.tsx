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
import { materialsService, StudyMaterial } from "@/services/materialsService";
import { useToast } from "@/hooks/use-toast";
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [myMaterials, setMyMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<StudyMaterial | null>(null);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    subject: "",
    year: "3rd Year",
    semester: "6th Semester",
    file: null as File | null,
    tags: ""
  });

  useEffect(() => {
    loadMaterials();
    // Initialize demo data on first load
    materialsService.initializeDemoData();
  }, []);

  useEffect(() => {
    filterMaterials();
  }, [materials, searchTerm, selectedSubject, selectedYear]);

  const loadMaterials = () => {
    setLoading(true);
    try {
      const allMaterials = materialsService.getAllMaterials();
      setMaterials(allMaterials);
      
      if (user?.id) {
        const userMaterials = materialsService.getMaterialsByUploader(user.id);
        setMyMaterials(userMaterials);
      }
    } catch (error) {
      console.error('Error loading materials:', error);
      toast({
        title: "Error",
        description: "Failed to load study materials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterMaterials = () => {
    let filtered = materials;

    if (searchTerm) {
      filtered = materialsService.searchMaterials(searchTerm, {
        subject: selectedSubject !== "all" ? selectedSubject : undefined,
        year: selectedYear !== "all" ? selectedYear : undefined
      });
    } else {
      // Apply filters without search
      if (selectedSubject !== "all") {
        filtered = filtered.filter(m => m.subject === selectedSubject);
      }
      if (selectedYear !== "all") {
        filtered = filtered.filter(m => m.year === selectedYear);
      }
    }

    setMaterials(filtered);
  };

  const handleUpload = async () => {
    if (!uploadForm.title || !uploadForm.subject || !uploadForm.file || !user) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields and select a file",
        variant: "destructive",
      });
      return;
    }

    try {
      const tags = uploadForm.tags ? uploadForm.tags.split(',').map(t => t.trim()) : [];
      
      materialsService.uploadMaterial(
        uploadForm.title,
        uploadForm.description,
        uploadForm.subject,
        uploadForm.year,
        uploadForm.semester,
        uploadForm.file,
        user.id,
        user.name,
        tags
      );

      toast({
        title: "Upload Successful",
        description: "Study material uploaded successfully",
      });

      // Reset form and reload materials
      setUploadForm({
        title: "",
        description: "",
        subject: "",
        year: "3rd Year",
        semester: "6th Semester",
        file: null,
        tags: ""
      });
      setShowUploadDialog(false);
      loadMaterials();
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload study material",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    if (!editingMaterial || !uploadForm.title || !uploadForm.subject) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const tags = uploadForm.tags ? uploadForm.tags.split(',').map(t => t.trim()) : [];
      
      materialsService.updateMaterial(editingMaterial.id, {
        title: uploadForm.title,
        description: uploadForm.description,
        subject: uploadForm.subject,
        year: uploadForm.year,
        semester: uploadForm.semester,
        tags
      });

      toast({
        title: "Update Successful",
        description: "Study material updated successfully",
      });

      setEditingMaterial(null);
      resetForm();
      loadMaterials();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update study material",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (materialId: string) => {
    if (confirm("Are you sure you want to delete this material?")) {
      try {
        materialsService.deleteMaterial(materialId);
        toast({
          title: "Deleted",
          description: "Study material deleted successfully",
        });
        loadMaterials();
      } catch (error) {
        toast({
          title: "Delete Failed",
          description: "Failed to delete study material",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (material: StudyMaterial) => {
    setEditingMaterial(material);
    setUploadForm({
      title: material.title,
      description: material.description,
      subject: material.subject,
      year: material.year,
      semester: material.semester,
      file: null,
      tags: material.tags.join(", ")
    });
    setShowUploadDialog(true);
  };

  const resetForm = () => {
    setUploadForm({
      title: "",
      description: "",
      subject: "",
      year: "3rd Year",
      semester: "6th Semester",
      file: null,
      tags: ""
    });
    setShowUploadDialog(false);
    setEditingMaterial(null);
  };

  const handleDownload = (material: StudyMaterial) => {
    materialsService.incrementDownloadCount(material.id);
    // In a real app, this would trigger the actual file download
    toast({
      title: "Download Started",
      description: `Downloading ${material.fileName}`,
    });
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
      case 'doc':
        return <FileText className="h-5 w-5 text-red-600" />;
      case 'video':
        return <Video className="h-5 w-5 text-blue-600" />;
      case 'image':
        return <Image className="h-5 w-5 text-green-600" />;
      default:
        return <File className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const subjects = materialsService.getSubjects();
  const years = materialsService.getYears();

  if (loading) {
    return (
      <DashboardLayout userType="faculty" userName={user?.name || "Faculty"}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading materials...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="faculty" userName={user?.name || "Faculty"}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Study Materials</h1>
            <p className="text-gray-600">Upload and manage course materials for students</p>
          </div>
          
          <Dialog open={showUploadDialog} onOpenChange={(open) => {
            if (!open) resetForm();
            setShowUploadDialog(open);
          }}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Material
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingMaterial ? 'Edit Material' : 'Upload New Material'}
                </DialogTitle>
                <DialogDescription>
                  {editingMaterial ? 'Update the material details' : 'Add a new study material for students'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter material title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the material"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Select value={uploadForm.subject} onValueChange={(value) => setUploadForm(prev => ({ ...prev, subject: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                        <SelectItem value="Deep Learning">Deep Learning</SelectItem>
                        <SelectItem value="Data Structures">Data Structures</SelectItem>
                        <SelectItem value="Algorithms">Algorithms</SelectItem>
                        <SelectItem value="Database Systems">Database Systems</SelectItem>
                        <SelectItem value="Computer Networks">Computer Networks</SelectItem>
                        <SelectItem value="Operating Systems">Operating Systems</SelectItem>
                        <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select value={uploadForm.year} onValueChange={(value) => setUploadForm(prev => ({ ...prev, year: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st Year">1st Year</SelectItem>
                        <SelectItem value="2nd Year">2nd Year</SelectItem>
                        <SelectItem value="3rd Year">3rd Year</SelectItem>
                        <SelectItem value="4th Year">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <Select value={uploadForm.semester} onValueChange={(value) => setUploadForm(prev => ({ ...prev, semester: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st Semester">1st Semester</SelectItem>
                        <SelectItem value="2nd Semester">2nd Semester</SelectItem>
                        <SelectItem value="3rd Semester">3rd Semester</SelectItem>
                        <SelectItem value="4th Semester">4th Semester</SelectItem>
                        <SelectItem value="5th Semester">5th Semester</SelectItem>
                        <SelectItem value="6th Semester">6th Semester</SelectItem>
                        <SelectItem value="7th Semester">7th Semester</SelectItem>
                        <SelectItem value="8th Semester">8th Semester</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={uploadForm.tags}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="tag1, tag2, tag3"
                    />
                  </div>
                </div>

                {!editingMaterial && (
                  <div className="space-y-2">
                    <Label htmlFor="file">File *</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov,.jpg,.jpeg,.png"
                      onChange={(e) => setUploadForm(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                    />
                    <p className="text-xs text-gray-500">
                      Supported formats: PDF, DOC, PPT, MP4, JPG, PNG (Max 50MB)
                    </p>
                  </div>
                )}

                <div className="flex space-x-4">
                  <Button
                    onClick={editingMaterial ? handleUpdate : handleUpload}
                    className="flex-1"
                  >
                    {editingMaterial ? 'Update Material' : 'Upload Material'}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Materials</p>
                  <p className="text-2xl font-bold">{materials.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">My Uploads</p>
                  <p className="text-2xl font-bold">{myMaterials.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Subjects</p>
                  <p className="text-2xl font-bold">{subjects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Downloads</p>
                  <p className="text-2xl font-bold">
                    {materials.reduce((sum, m) => sum + m.downloadCount, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Materials</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by title, subject, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject-filter">Filter by Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="All subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year-filter">Filter by Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="All years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Materials Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Materials ({materials.length})</TabsTrigger>
            <TabsTrigger value="my">My Uploads ({myMaterials.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Study Materials</CardTitle>
                <CardDescription>
                  Browse all available study materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MaterialsTable 
                  materials={materials}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                  getFileIcon={getFileIcon}
                  formatFileSize={formatFileSize}
                  currentUserId={user?.id}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Uploads</CardTitle>
                <CardDescription>
                  Materials you have uploaded
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MaterialsTable 
                  materials={myMaterials}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDownload={handleDownload}
                  getFileIcon={getFileIcon}
                  formatFileSize={formatFileSize}
                  currentUserId={user?.id}
                  showActions={true}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// Materials Table Component
interface MaterialsTableProps {
  materials: StudyMaterial[];
  onEdit: (material: StudyMaterial) => void;
  onDelete: (materialId: string) => void;
  onDownload: (material: StudyMaterial) => void;
  getFileIcon: (fileType: string) => React.ReactNode;
  formatFileSize: (bytes: number) => string;
  currentUserId?: string;
  showActions?: boolean;
}

const MaterialsTable: React.FC<MaterialsTableProps> = ({
  materials,
  onEdit,
  onDelete,
  onDownload,
  getFileIcon,
  formatFileSize,
  currentUserId,
  showActions = false
}) => {
  if (materials.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
        <p className="text-gray-600">Try adjusting your search criteria or upload some materials.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Material</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Year/Semester</TableHead>
          <TableHead>Uploaded By</TableHead>
          <TableHead>Downloads</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {materials.map((material) => (
          <TableRow key={material.id}>
            <TableCell>
              <div className="flex items-center space-x-3">
                {getFileIcon(material.fileType)}
                <div>
                  <div className="font-medium">{material.title}</div>
                  <div className="text-sm text-gray-600">{material.fileName}</div>
                  <div className="text-xs text-gray-500">{formatFileSize(material.fileSize)}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{material.subject}</Badge>
            </TableCell>
            <TableCell>
              <div>
                <div className="text-sm">{material.year}</div>
                <div className="text-xs text-gray-600">{material.semester}</div>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div className="text-sm font-medium">{material.uploadedByName}</div>
                <div className="text-xs text-gray-600">
                  {new Date(material.uploadDate).toLocaleDateString()}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{material.downloadCount}</Badge>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDownload(material)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                
                {(showActions || material.uploadedBy === currentUserId) && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(material)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(material.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FacultyMaterials;
