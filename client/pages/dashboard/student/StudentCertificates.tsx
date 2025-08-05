import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  getStudentCertificates,
  addStudentCertificate,
  subscribeToStudentData,
  Certificate,
} from "@/services/studentDataService";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  Award,
  Eye,
  Download,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  File,
  Calendar,
} from "lucide-react";

const StudentCertificates = () => {
  const { toast } = useToast();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    issueDate: "",
    organization: "",
  });
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get current user
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    setCurrentUser(user);

    if (user.id) {
      loadCertificates(user.id);
    }

    // Subscribe to real-time updates
    const unsubscribe = subscribeToStudentData(() => {
      if (user.id) {
        loadCertificates(user.id);
      }
    });

    return unsubscribe;
  }, []);

  const loadCertificates = async (studentId: string) => {
    try {
      setLoading(true);
      const studentCertificates = await getStudentCertificates(studentId);
      setCertificates(studentCertificates);
    } catch (error) {
      console.error("Error loading certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Demo certificates for display when no real data exists
  const demoCertificates = [
    {
      id: 1,
      title: "AWS Cloud Practitioner",
      description: "Amazon Web Services Cloud Practitioner Certification",
      organization: "Amazon Web Services",
      issueDate: "2024-02-15",
      uploadDate: "2024-02-16",
      status: "approved",
      fileUrl: "/certificates/aws-cert.pdf",
      approvedBy: "Faculty",
      approvedAt: "2024-02-17",
    },
    {
      id: 2,
      title: "Google Data Analytics Certificate",
      description: "Professional Data Analytics Certificate from Google",
      organization: "Google",
      issueDate: "2024-01-20",
      uploadDate: "2024-01-21",
      status: "approved",
      fileUrl: "/certificates/google-cert.pdf",
      approvedBy: "Faculty",
      approvedAt: "2024-01-22",
    },
    {
      id: 3,
      title: "Machine Learning Specialization",
      description: "Stanford Machine Learning Course Certificate",
      organization: "Coursera/Stanford",
      issueDate: "2024-03-01",
      uploadDate: "2024-03-02",
      status: "pending",
      fileUrl: "/certificates/ml-cert.pdf",
    },
    {
      id: 4,
      title: "Python Programming",
      description: "Advanced Python Programming Certificate",
      organization: "HackerRank",
      issueDate: "2023-12-10",
      uploadDate: "2023-12-12",
      status: "rejected",
      fileUrl: "/certificates/python-cert.pdf",
      rejectionReason:
        "Certificate image quality is too low. Please upload a clearer image.",
    },
  ];

  // Use demo data if no real certificates exist
  const displayCertificates =
    certificates.length > 0 ? certificates : demoCertificates;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <File className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadData.title || !currentUser?.id) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select a file",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await addStudentCertificate(currentUser.id, {
        title: uploadData.title,
        description: uploadData.description,
        organization: uploadData.organization,
        issueDate: uploadData.issueDate,
        fileUrl: `/certificates/${selectedFile.name}`, // In real app, this would be the uploaded file URL
      });

      if (success) {
        toast({
          title: "Certificate Uploaded",
          description: "Your certificate has been submitted for verification",
        });
        setUploadDialogOpen(false);
        setSelectedFile(null);
        setUploadData({
          title: "",
          description: "",
          issueDate: "",
          organization: "",
        });
        // Reload certificates
        if (currentUser.id) {
          loadCertificates(currentUser.id);
        }
      } else {
        throw new Error("Failed to upload certificate");
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description:
          "There was an error uploading your certificate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stats = {
    total: displayCertificates.length,
    approved: displayCertificates.filter((c) => c.status === "approved").length,
    pending: displayCertificates.filter((c) => c.status === "pending").length,
    rejected: displayCertificates.filter((c) => c.status === "rejected").length,
  };

  if (loading) {
    return (
      <DashboardLayout
        userType="student"
        userName={currentUser?.name || "Student"}
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading certificates...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userType="student"
      userName={currentUser?.name || "Student"}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
            <p className="text-gray-600">Manage and view your certificates</p>
          </div>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Upload Certificate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload New Certificate</DialogTitle>
                <DialogDescription>
                  Add a new certificate to your profile for verification
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Certificate Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., AWS Cloud Practitioner"
                    value={uploadData.title}
                    onChange={(e) =>
                      setUploadData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Issuing Organization</Label>
                  <Input
                    id="organization"
                    placeholder="e.g., Amazon Web Services"
                    value={uploadData.organization}
                    onChange={(e) =>
                      setUploadData((prev) => ({
                        ...prev,
                        organization: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issueDate">Issue Date</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={uploadData.issueDate}
                    onChange={(e) =>
                      setUploadData((prev) => ({
                        ...prev,
                        issueDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the certificate"
                    value={uploadData.description}
                    onChange={(e) =>
                      setUploadData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Certificate File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">
                    Supported formats: PDF, JPG, PNG (Max 5MB)
                  </p>
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button onClick={handleUpload} className="flex-1">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setUploadDialogOpen(false)}
                  >
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Certificates
              </CardTitle>
              <Award className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.approved}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.rejected}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certificates List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Certificates</CardTitle>
            <CardDescription>
              All your uploaded certificates and their verification status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayCertificates.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    No certificates uploaded yet
                  </p>
                  <p className="text-gray-400 text-xs">
                    Upload your first certificate to get started
                  </p>
                </div>
              ) : (
                displayCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          {getStatusIcon(cert.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-lg">
                              {cert.title}
                            </h3>
                            {getStatusBadge(cert.status)}
                          </div>
                          <p className="text-gray-600 mb-2">
                            {cert.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Issued:{" "}
                              {new Date(cert.issueDate).toLocaleDateString()}
                            </div>
                            <div>Organization: {cert.organization}</div>
                            <div>
                              Uploaded:{" "}
                              {new Date(cert.uploadDate).toLocaleDateString()}
                            </div>
                          </div>

                          {cert.status === "approved" && cert.approvedBy && (
                            <p className="text-sm text-green-600 mt-2">
                              ✓ Approved by {cert.approvedBy} on{" "}
                              {new Date(cert.approvedAt!).toLocaleDateString()}
                            </p>
                          )}

                          {cert.status === "rejected" &&
                            cert.rejectionReason && (
                              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                                <p className="text-sm text-red-800">
                                  <strong>Rejection Reason:</strong>{" "}
                                  {cert.rejectionReason}
                                </p>
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {cert.status === "approved" && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentCertificates;
