import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

const AdminDashboard = () => {
  return (
    <DashboardLayout userType="admin" userName="Admin User">
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Construction className="h-12 w-12 text-red-600" />
            </div>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>
              Complete system administration and management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Comprehensive admin panel for managing students, faculty, content, and system settings.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
