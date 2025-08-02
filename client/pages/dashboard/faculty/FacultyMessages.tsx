import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

const FacultyMessages = () => {
  return (
    <DashboardLayout userType="faculty" userName="Dr. Anita Verma">
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Construction className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Send messages to students</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Communicate with students through announcements and direct messages.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FacultyMessages;
