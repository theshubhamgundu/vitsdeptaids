import { useState, useEffect } from "react";
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
} from "lucide-react";

const StudentMaterials = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    setCurrentUser(user);
  }, []);

  const [materials] = useState([]);


  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case "Lecture Notes":
        return "bg-blue-100 text-blue-800";
      case "Assignment":
        return "bg-orange-100 text-orange-800";
      case "Lab Manual":
        return "bg-green-100 text-green-800";
      case "Reference Material":
        return "bg-purple-100 text-purple-800";
      case "Presentation":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewMaterial = (material) => {
    setSelectedMaterial(material);
    setShowMaterialDialog(true);
  };

  const handleDownload = (material) => {
    // Simulate download
    console.log(`Downloading ${material.title}`);
    alert(`Downloading ${material.title}...`);
  };

  if (!currentUser) {
    return (
      <DashboardLayout userType="student" userName="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading materials...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userType="student"
      userName={currentUser.name || "Student"}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Study Materials
            </h1>
            <p className="text-gray-600">
              Access course materials, assignments, and reference documents
            </p>
          </div>
          <Card className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {materials.length}
              </div>
              <div className="text-sm text-gray-600">Total Materials</div>
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Search Materials</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by title, subject, or faculty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="materials" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="materials">All Materials</TabsTrigger>
            <TabsTrigger value="recent">Recently Added</TabsTrigger>
          </TabsList>

          {/* All Materials Tab */}
          <TabsContent value="materials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Materials</CardTitle>
                <CardDescription>
                  Found {filteredMaterials.length} materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Uploaded By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaterials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{material.title}</div>
                            <div className="text-sm text-gray-600">
                              {material.semester}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{material.subject}</TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(material.type)}>
                            {material.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {material.uploadedBy}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">
                              {new Date(
                                material.uploadDate,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">
                            {material.size}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewMaterial(material)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Materials Tab */}
          <TabsContent value="recent" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.slice(0, 6).map((material) => (
                <Card
                  key={material.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <Badge className={getTypeColor(material.type)}>
                        {material.type}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{material.title}</CardTitle>
                    <CardDescription>{material.subject}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        By {material.uploadedBy}
                      </span>
                      <Badge
                        className={getDifficultyColor(material.difficulty)}
                      >
                        {material.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Download className="h-4 w-4" />
                        <span>{material.downloads}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(material.uploadDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {material.description}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleViewMaterial(material)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDownload(material)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Material Detail Dialog */}
        {selectedMaterial && (
          <Dialog
            open={showMaterialDialog}
            onOpenChange={setShowMaterialDialog}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>{selectedMaterial.title}</span>
                </DialogTitle>
                <DialogDescription>
                  {selectedMaterial.subject}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Material Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Type</Label>
                    <Badge className={getTypeColor(selectedMaterial.type)}>
                      {selectedMaterial.type}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Difficulty</Label>
                    <Badge
                      className={getDifficultyColor(
                        selectedMaterial.difficulty,
                      )}
                    >
                      {selectedMaterial.difficulty}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Uploaded By</Label>
                    <p>{selectedMaterial.uploadedBy}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Upload Date</Label>
                    <p>
                      {new Date(
                        selectedMaterial.uploadDate,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">File Size</Label>
                    <p>{selectedMaterial.size}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Downloads</Label>
                    <p>{selectedMaterial.downloads} downloads</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-gray-700 mt-1">
                    {selectedMaterial.description}
                  </p>
                </div>

                {/* Topics Covered */}
                <div>
                  <Label className="text-sm font-medium">Topics Covered</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedMaterial.topics.map((topic, index) => (
                      <Badge key={index} variant="outline">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowMaterialDialog(false)}
                  >
                    Close
                  </Button>
                  <Button onClick={() => handleDownload(selectedMaterial)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentMaterials;
