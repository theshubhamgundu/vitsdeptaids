import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

const StudentMaterials = () => {
  return (
    <DashboardLayout userType="student" userName="Rahul Sharma">
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Construction className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle>Study Materials</CardTitle>
            <CardDescription>
              Access course materials and resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This section will provide access to lecture notes, assignments, 
              reference materials, and downloadable resources.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentMaterials;
