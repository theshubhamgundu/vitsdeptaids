import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

const StudentLeave = () => {
  return (
    <DashboardLayout userType="student" userName="Rahul Sharma">
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Construction className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle>Leave Applications</CardTitle>
            <CardDescription>
              Apply for and track your leave requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              This section will allow you to submit leave applications, 
              track approval status, and view leave history.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentLeave;
