import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

const AdminFaculty = () => {
  return (
    <DashboardLayout userType="admin" userName="Admin User">
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Construction className="h-12 w-12 text-red-600" />
            </div>
            <CardTitle>Faculty Management</CardTitle>
            <CardDescription>Manage faculty profiles and assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Faculty profile management, workload tracking, and performance evaluation.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminFaculty;
