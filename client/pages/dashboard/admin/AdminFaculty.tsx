import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getAllFaculty } from "@/data/facultyData";
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Download,
  Eye,
  BarChart3,
  Filter,
  BookOpen,
  Calendar,
  Award,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Clock
} from "lucide-react";

const AdminFaculty = () => {
  const [faculty, setFaculty] = useState([]);

  const [filteredFaculty, setFilteredFaculty] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [designationFilter, setDesignationFilter] = useState("all");
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);

  const [newFaculty, setNewFaculty] = useState({
    name: "",
    employeeId: "",
    email: "",
    phone: "",
    designation: "",
    specialization: "",
    qualification: "",
    experience: "",
    joinDate: "",
    officeRoom: "",
    status: "Active"
  });

  useEffect(() => {
    setFilteredFaculty(faculty);
  }, [faculty]);

  useEffect(() => {
    filterFaculty();
  }, [faculty, searchTerm, designationFilter]);

  const filterFaculty = () => {
    let filtered = faculty;
    
    if (searchTerm) {
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (designationFilter !== "all") {
      filtered = filtered.filter(member => 
        member.designation.toLowerCase().includes(designationFilter.toLowerCase())
      );
    }
    
    setFilteredFaculty(filtered);
  };

  const handleAddFaculty = () => {
    const newMember = {
      ...newFaculty,
      id: Date.now().toString(),
      department: "AI & DS",
      studentsAssigned: 0,
      researchPapers: 0,
      workload: 0
    };
    
    setFaculty(prev => [...prev, newMember]);
    setShowAddDialog(false);
    setNewFaculty({
      name: "",
      employeeId: "",
      email: "",
      phone: "",
      designation: "",
      specialization: "",
      qualification: "",
      experience: "",
      joinDate: "",
      officeRoom: "",
      status: "Active"
    });
  };

  const handleEditFaculty = () => {
    setFaculty(prev => prev.map(member => 
      member.id === selectedFaculty.id ? selectedFaculty : member
    ));
    setShowEditDialog(false);
    setSelectedFaculty(null);
  };

  const handleDeleteFaculty = (facultyId) => {
    setFaculty(prev => prev.filter(member => member.id !== facultyId));
  };

  const getWorkloadColor = (workload) => {
    if (workload > 85) return "text-red-600";
    if (workload > 70) return "text-yellow-600";
    return "text-green-600";
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout userType="admin" userName="Admin User">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Faculty Management</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage faculty profiles, assignments, and performance</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => window.location.href = "/dashboard/admin/faculty/create"}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Faculty
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Add
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Faculty Member</DialogTitle>
                  <DialogDescription>
                    Enter faculty information to create a new profile
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={newFaculty.name}
                        onChange={(e) => setNewFaculty(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter faculty name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <Input
                        id="employeeId"
                        value={newFaculty.employeeId}
                        onChange={(e) => setNewFaculty(prev => ({ ...prev, employeeId: e.target.value }))}
                        placeholder="FAC001"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newFaculty.email}
                        onChange={(e) => setNewFaculty(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newFaculty.phone}
                        onChange={(e) => setNewFaculty(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation</Label>
                      <Select value={newFaculty.designation} onValueChange={(value) => setNewFaculty(prev => ({ ...prev, designation: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Professor">Professor</SelectItem>
                          <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                          <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                          <SelectItem value="Lecturer">Lecturer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience (Years)</Label>
                      <Input
                        id="experience"
                        type="number"
                        value={newFaculty.experience}
                        onChange={(e) => setNewFaculty(prev => ({ ...prev, experience: e.target.value }))}
                        placeholder="5"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={newFaculty.specialization}
                      onChange={(e) => setNewFaculty(prev => ({ ...prev, specialization: e.target.value }))}
                      placeholder="Enter specialization areas"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qualification">Qualification</Label>
                    <Input
                      id="qualification"
                      value={newFaculty.qualification}
                      onChange={(e) => setNewFaculty(prev => ({ ...prev, qualification: e.target.value }))}
                      placeholder="Enter qualification"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="joinDate">Join Date</Label>
                      <Input
                        id="joinDate"
                        type="date"
                        value={newFaculty.joinDate}
                        onChange={(e) => setNewFaculty(prev => ({ ...prev, joinDate: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="officeRoom">Office Room</Label>
                      <Input
                        id="officeRoom"
                        value={newFaculty.officeRoom}
                        onChange={(e) => setNewFaculty(prev => ({ ...prev, officeRoom: e.target.value }))}
                        placeholder="Enter office room number"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleAddFaculty} className="flex-1">Add Faculty</Button>
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{faculty.length}</div>
              <p className="text-xs text-muted-foreground">Active faculty members</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Professors</CardTitle>
              <GraduationCap className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {faculty.filter(f => f.designation.includes('Professor')).length}
              </div>
              <p className="text-xs text-muted-foreground">All professor levels</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Experience</CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {faculty.length > 0 ? Math.round(faculty.reduce((sum, f) => sum + f.experience, 0) / faculty.length) : 0} years
              </div>
              <p className="text-xs text-muted-foreground">Department average</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Research Papers</CardTitle>
              <BookOpen className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {faculty.reduce((sum, f) => sum + f.researchPapers, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Total publications</p>
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
                <Label htmlFor="search">Search Faculty</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search by name, ID, email, or specialization"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="designation">Filter by Designation</Label>
                <Select value={designationFilter} onValueChange={setDesignationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Designations</SelectItem>
                    <SelectItem value="professor">Professor</SelectItem>
                    <SelectItem value="associate">Associate Professor</SelectItem>
                    <SelectItem value="assistant">Assistant Professor</SelectItem>
                    <SelectItem value="lecturer">Lecturer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Results</Label>
                <div className="text-sm text-gray-600">
                  Showing {filteredFaculty.length} of {faculty.length} faculty members
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Faculty Table */}
        <Card>
          <CardHeader>
            <CardTitle>Faculty Directory</CardTitle>
            <CardDescription>Complete list of faculty members with management options</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faculty</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Workload</TableHead>
                  <TableHead>Research Papers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFaculty.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/api/placeholder/40/40" />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-gray-600">{member.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.employeeId}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.designation}</Badge>
                    </TableCell>
                    <TableCell>{member.experience} years</TableCell>
                    <TableCell>
                      <span className={`font-medium ${getWorkloadColor(member.workload)}`}>
                        {member.workload}%
                      </span>
                    </TableCell>
                    <TableCell>{member.researchPapers}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            setSelectedFaculty(member);
                            setShowViewDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            setSelectedFaculty(member);
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDeleteFaculty(member.id)}
                        >
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

        {/* View Faculty Dialog */}
        {selectedFaculty && (
          <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/api/placeholder/50/50" />
                    <AvatarFallback>{selectedFaculty.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div>{selectedFaculty.name}</div>
                    <div className="text-sm text-gray-600 font-normal">{selectedFaculty.designation}</div>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{selectedFaculty.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{selectedFaculty.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{selectedFaculty.officeRoom}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Academic Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div><strong>Employee ID:</strong> {selectedFaculty.employeeId}</div>
                      <div><strong>Department:</strong> {selectedFaculty.department}</div>
                      <div><strong>Qualification:</strong> {selectedFaculty.qualification}</div>
                      <div><strong>Experience:</strong> {selectedFaculty.experience} years</div>
                      <div><strong>Join Date:</strong> {new Date(selectedFaculty.joinDate).toLocaleDateString()}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Specialization */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Specialization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{selectedFaculty.specialization}</p>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Students Assigned</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{selectedFaculty.studentsAssigned}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Research Papers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{selectedFaculty.researchPapers}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Workload</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${getWorkloadColor(selectedFaculty.workload)}`}>
                        {selectedFaculty.workload}%
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Faculty Dialog */}
        {selectedFaculty && (
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Faculty: {selectedFaculty.name}</DialogTitle>
                <DialogDescription>
                  Update faculty information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={selectedFaculty.name}
                      onChange={(e) => setSelectedFaculty(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Employee ID</Label>
                    <Input
                      value={selectedFaculty.employeeId}
                      onChange={(e) => setSelectedFaculty(prev => ({ ...prev, employeeId: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={selectedFaculty.email}
                      onChange={(e) => setSelectedFaculty(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={selectedFaculty.phone}
                      onChange={(e) => setSelectedFaculty(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Designation</Label>
                    <Select 
                      value={selectedFaculty.designation} 
                      onValueChange={(value) => setSelectedFaculty(prev => ({ ...prev, designation: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Professor">Professor</SelectItem>
                        <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                        <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                        <SelectItem value="Lecturer">Lecturer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select 
                      value={selectedFaculty.status} 
                      onValueChange={(value) => setSelectedFaculty(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <Input
                    value={selectedFaculty.specialization}
                    onChange={(e) => setSelectedFaculty(prev => ({ ...prev, specialization: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Office Room</Label>
                  <Input
                    value={selectedFaculty.officeRoom}
                    onChange={(e) => setSelectedFaculty(prev => ({ ...prev, officeRoom: e.target.value }))}
                  />
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleEditFaculty} className="flex-1">Update Faculty</Button>
                  <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminFaculty;
