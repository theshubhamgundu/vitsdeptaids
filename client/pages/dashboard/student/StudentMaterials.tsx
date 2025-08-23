import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
  BookOpen,
  Download,
  Eye,
  FileText,
  Search,
  Filter,
  Calendar,
  User,
  GraduationCap,
  Star,
  Clock,
  CheckCircle,
  Video,
  Image,
  File
} from "lucide-react";

const StudentMaterials = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedFileType, setSelectedFileType] = useState("all");
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);

  useEffect(() => {
    loadMaterials();
  }, []);

  useEffect(() => {
    filterMaterials();
  }, [materials, searchTerm, selectedSubject, selectedYear, selectedFileType]);

  const loadMaterials = () => {
    setLoading(true);
    try {
      const allMaterials = materialsService.getAllMaterials();
      setMaterials(allMaterials);
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

    // Apply search and filters
    filtered = materialsService.searchMaterials(searchTerm, {
      subject: selectedSubject !== "all" ? selectedSubject : undefined,
      year: selectedYear !== "all" ? selectedYear : undefined,
      fileType: selectedFileType !== "all" ? selectedFileType : undefined
    });

    setFilteredMaterials(filtered);
  };

  const handleDownload = (material: StudyMaterial) => {
    materialsService.incrementDownloadCount(material.id);
    
    // In a real app, this would trigger the actual file download
    toast({
      title: "Download Started",
      description: `Downloading ${material.fileName}`,
    });
    
    // Update the materials list to reflect the new download count
    loadMaterials();
  };

  const handleViewMaterial = (material: StudyMaterial) => {
    setSelectedMaterial(material);
    setShowMaterialDialog(true);
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

  const getFileTypeColor = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return 'bg-red-50 text-red-700';
      case 'doc':
        return 'bg-blue-50 text-blue-700';
      case 'video':
        return 'bg-purple-50 text-purple-700';
      case 'image':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const subjects = materialsService.getSubjects();
  const years = materialsService.getYears();

  // Group materials by subject for the subject-wise view
  const materialsBySubject = subjects.reduce((acc, subject) => {
    acc[subject] = filteredMaterials.filter(m => m.subject === subject);
    return acc;
  }, {} as Record<string, StudyMaterial[]>);

  if (loading) {
    return (
      <DashboardLayout userType="student" userName={user?.name || "Student"}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading study materials...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="student" userName={user?.name || "Student"}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Study Materials</h1>
            <p className="text-gray-600">Access course materials uploaded by faculty</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <BookOpen className="h-4 w-4 mr-2" />
            {filteredMaterials.length} Materials
          </Badge>
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
                <BookOpen className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Subjects Available</p>
                  <p className="text-2xl font-bold">{subjects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Documents</p>
                  <p className="text-2xl font-bold">
                    {materials.filter(m => m.fileType === 'pdf' || m.fileType === 'doc').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Video className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Videos</p>
                  <p className="text-2xl font-bold">
                    {materials.filter(m => m.fileType === 'video').length}
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
              <span>Search & Filter</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Materials</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by title, subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject-filter">Subject</Label>
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
                <Label htmlFor="year-filter">Year</Label>
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

              <div className="space-y-2">
                <Label htmlFor="file-type-filter">File Type</Label>
                <Select value={selectedFileType} onValueChange={setSelectedFileType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="pdf">PDF Documents</SelectItem>
                    <SelectItem value="doc">Word Documents</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Materials Display */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Materials ({filteredMaterials.length})</TabsTrigger>
            <TabsTrigger value="subjects">By Subject</TabsTrigger>
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
                {filteredMaterials.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
                    <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                  </div>
                ) : (
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
                      {filteredMaterials.map((material) => (
                        <TableRow key={material.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              {getFileIcon(material.fileType)}
                              <div>
                                <div className="font-medium">{material.title}</div>
                                <div className="text-sm text-gray-600">{material.fileName}</div>
                                <div className="text-xs text-gray-500">{formatFileSize(material.fileSize)}</div>
                                <div className="flex items-center space-x-1 mt-1">
                                  <Badge variant="outline" className={`text-xs ${getFileTypeColor(material.fileType)}`}>
                                    {material.fileType.toUpperCase()}
                                  </Badge>
                                </div>
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
                            <div className="flex items-center space-x-1">
                              <Download className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{material.downloadCount}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewMaterial(material)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleDownload(material)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-4">
            {subjects.map(subject => {
              const subjectMaterials = materialsBySubject[subject] || [];
              return (
                <Card key={subject}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{subject}</span>
                      <Badge variant="outline">{subjectMaterials.length} materials</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {subjectMaterials.length === 0 ? (
                      <p className="text-gray-600 text-center py-8">No materials available for this subject</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {subjectMaterials.map((material) => (
                          <Card key={material.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                {getFileIcon(material.fileType)}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm truncate">{material.title}</h4>
                                  <p className="text-xs text-gray-600 mt-1">{material.uploadedByName}</p>
                                  <div className="flex items-center justify-between mt-2">
                                    <Badge variant="outline" className={`text-xs ${getFileTypeColor(material.fileType)}`}>
                                      {material.fileType.toUpperCase()}
                                    </Badge>
                                    <div className="flex space-x-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleViewMaterial(material)}
                                        className="h-6 w-6 p-0"
                                      >
                                        <Eye className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDownload(material)}
                                        className="h-6 w-6 p-0"
                                      >
                                        <Download className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>

        {/* Material Detail Dialog */}
        <Dialog open={showMaterialDialog} onOpenChange={setShowMaterialDialog}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {selectedMaterial && getFileIcon(selectedMaterial.fileType)}
                <span>{selectedMaterial?.title}</span>
              </DialogTitle>
              <DialogDescription>
                Material details and information
              </DialogDescription>
            </DialogHeader>
            
            {selectedMaterial && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Subject:</strong> {selectedMaterial.subject}
                  </div>
                  <div>
                    <strong>File Type:</strong> {selectedMaterial.fileType.toUpperCase()}
                  </div>
                  <div>
                    <strong>Year:</strong> {selectedMaterial.year}
                  </div>
                  <div>
                    <strong>Semester:</strong> {selectedMaterial.semester}
                  </div>
                  <div>
                    <strong>File Size:</strong> {formatFileSize(selectedMaterial.fileSize)}
                  </div>
                  <div>
                    <strong>Downloads:</strong> {selectedMaterial.downloadCount}
                  </div>
                  <div>
                    <strong>Uploaded By:</strong> {selectedMaterial.uploadedByName}
                  </div>
                  <div>
                    <strong>Upload Date:</strong> {new Date(selectedMaterial.uploadDate).toLocaleDateString()}
                  </div>
                </div>
                
                {selectedMaterial.description && (
                  <div>
                    <strong>Description:</strong>
                    <p className="text-sm text-gray-600 mt-1">{selectedMaterial.description}</p>
                  </div>
                )}

                {selectedMaterial.tags.length > 0 && (
                  <div>
                    <strong>Tags:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedMaterial.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-4 pt-4">
                  <Button
                    onClick={() => handleDownload(selectedMaterial)}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Material
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowMaterialDialog(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default StudentMaterials;
