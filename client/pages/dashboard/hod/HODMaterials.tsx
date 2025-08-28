import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { materialsService } from "@/services/materialsService";
import {
  Upload,
  Download,
  FileText,
  Video,
  Link as LinkIcon,
  Trash2,
  Edit,
  Eye,
  Plus,
  Search,
  Filter,
  BookOpen,
  Users,
  Calendar,
} from "lucide-react";

const HODMaterials = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [editingMaterial, setEditingMaterial] = useState<any>(null);

  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    subject: "",
    year: "",
    semester: "",
    fileType: "pdf",
    tags: "",
  });

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const semesters = ["1st Semester", "2nd Semester"];
  const subjects = [
    "Data Structures",
    "Algorithms",
    "Database Systems",
    "Machine Learning",
    "Artificial Intelligence",
    "Computer Networks",
    "Operating Systems",
    "Software Engineering",
    "Web Development",
    "Mobile Development",
    "Cloud Computing",
    "Cybersecurity",
    "Data Science",
    "Statistics",
    "Mathematics",
    "Programming",
    "Other",
  ];

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const allMaterials = materialsService.getAllMaterials();
      setMaterials(allMaterials);
    } catch (error) {
      console.error("Error loading materials:", error);
      toast({
        title: "Error",
        description: "Failed to load materials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 50MB",
        variant: "destructive",
      });
      return;
    }

    try {
      const materialData = {
        title: uploadForm.title,
        description: uploadForm.description,
        subject: uploadForm.subject,
        fileType: uploadForm.fileType as any,
        fileName: file.name,
        fileSize: file.size,
        fileUrl: URL.createObjectURL(file), // For demo, using object URL
        uploadedBy: user?.id || "",
        uploadedByName: user?.name || "HOD",
        year: uploadForm.year,
        semester: uploadForm.semester,
        isActive: true,
        tags: uploadForm.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      };

      const newMaterial = materialsService.addMaterial(materialData);
      setMaterials(prev => [newMaterial, ...prev]);
      
      toast({
        title: "Success",
        description: "Material uploaded successfully",
      });

      // Reset form
      setUploadForm({
        title: "",
        description: "",
        subject: "",
        year: "",
        semester: "",
        fileType: "pdf",
        tags: "",
      });
      setShowUploadForm(false);
    } catch (error) {
      console.error("Error uploading material:", error);
      toast({
        title: "Error",
        description: "Failed to upload material",
        variant: "destructive",
      });
    }
  };

  const handleEditMaterial = (material: any) => {
    setEditingMaterial(material);
    setUploadForm({
      title: material.title,
      description: material.description,
      subject: material.subject,
      year: material.year,
      semester: material.semester,
      fileType: material.fileType,
      tags: material.tags.join(", "),
    });
    setShowUploadForm(true);
  };

  const handleUpdateMaterial = () => {
    if (!editingMaterial) return;

    try {
      const updatedMaterial = materialsService.updateMaterial(editingMaterial.id, {
        title: uploadForm.title,
        description: uploadForm.description,
        subject: uploadForm.subject,
        year: uploadForm.year,
        semester: uploadForm.semester,
        tags: uploadForm.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      });

      if (updatedMaterial) {
        setMaterials(prev => 
          prev.map(m => m.id === editingMaterial.id ? updatedMaterial : m)
        );
        
        toast({
          title: "Success",
          description: "Material updated successfully",
        });

        setEditingMaterial(null);
        setShowUploadForm(false);
        setUploadForm({
          title: "",
          description: "",
          subject: "",
          year: "",
          semester: "",
          fileType: "pdf",
          tags: "",
        });
      }
    } catch (error) {
      console.error("Error updating material:", error);
      toast({
        title: "Error",
        description: "Failed to update material",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMaterial = (materialId: string) => {
    try {
      materialsService.deleteMaterial(materialId);
      setMaterials(prev => prev.filter(m => m.id !== materialId));
      
      toast({
        title: "Success",
        description: "Material deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting material:", error);
      toast({
        title: "Error",
        description: "Failed to delete material",
        variant: "destructive",
      });
    }
  };

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === "all" || material.year === selectedYear;
    const matchesSubject = selectedSubject === "all" || material.subject === selectedSubject;
    
    return matchesSearch && matchesYear && matchesSubject;
  });

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf": return <FileText className="h-5 w-5 text-red-500" />;
      case "doc": return <FileText className="h-5 w-5 text-blue-500" />;
      case "ppt": return <FileText className="h-5 w-5 text-orange-500" />;
      case "video": return <Video className="h-5 w-5 text-purple-500" />;
      case "link": return <LinkIcon className="h-5 w-5 text-green-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <DashboardLayout userType="hod" userName={user?.name || "HOD"}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Study Materials</h1>
            <p className="text-muted-foreground">
              Upload and manage study materials for students
            </p>
          </div>
          <Button onClick={() => setShowUploadForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Upload Material
          </Button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingMaterial ? "Edit Material" : "Upload New Material"}
              </CardTitle>
              <CardDescription>
                {editingMaterial 
                  ? "Update material information" 
                  : "Share study materials with students"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter material title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select
                    value={uploadForm.subject}
                    onValueChange={(value) => setUploadForm(prev => ({ ...prev, subject: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Select
                    value={uploadForm.year}
                    onValueChange={(value) => setUploadForm(prev => ({ ...prev, year: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester">Semester *</Label>
                  <Select
                    value={uploadForm.semester}
                    onValueChange={(value) => setUploadForm(prev => ({ ...prev, semester: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((semester) => (
                        <SelectItem key={semester} value={semester}>
                          {semester}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fileType">File Type</Label>
                  <Select
                    value={uploadForm.fileType}
                    onValueChange={(value) => setUploadForm(prev => ({ ...prev, fileType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="doc">Document</SelectItem>
                      <SelectItem value="ppt">Presentation</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="link">Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="Enter tags separated by commas"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter material description"
                  rows={3}
                />
              </div>

              {!editingMaterial && (
                <div className="space-y-2">
                  <Label htmlFor="file">File *</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum file size: 50MB. Supported formats: PDF, DOC, PPT, Video
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                {editingMaterial ? (
                  <Button onClick={handleUpdateMaterial} className="flex-1">
                    Update Material
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setShowUploadForm(false)} 
                    variant="outline" 
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                )}
                {editingMaterial && (
                  <Button 
                    onClick={() => {
                      setEditingMaterial(null);
                      setShowUploadForm(false);
                      setUploadForm({
                        title: "",
                        description: "",
                        subject: "",
                        year: "",
                        semester: "",
                        fileType: "pdf",
                        tags: "",
                      });
                    }} 
                    variant="outline" 
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search materials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Materials List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading materials...</p>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No materials found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedYear !== "all" || selectedSubject !== "all"
                  ? "Try adjusting your filters"
                  : "Start by uploading your first study material"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredMaterials.map((material) => (
              <Card key={material.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {getFileIcon(material.fileType)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-lg truncate">
                            {material.title}
                          </h3>
                          <Badge variant="secondary">{material.fileType.toUpperCase()}</Badge>
                        </div>
                        
                        <p className="text-muted-foreground mb-3 line-clamp-2">
                          {material.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {material.subject}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {material.year} - {material.semester}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(material.uploadDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            {material.downloadCount} downloads
                          </div>
                        </div>
                        
                        {material.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {material.tags.map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(material.fileUrl, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditMaterial(material)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMaterial(material.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HODMaterials;
