import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

const FacultyProfile = () => {
  return (
    <DashboardLayout userType="faculty" userName="Dr. Anita Verma">
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Construction className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle>Faculty Profile</CardTitle>
            <CardDescription>Manage your faculty profile and information</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Update personal information, qualifications, specializations, and contact details.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FacultyProfile;
