import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";

const HODAnalytics = () => {
  return (
    <DashboardLayout userType="hod" userName="Dr. Priya Sharma">
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Construction className="h-12 w-12 text-purple-600" />
            </div>
            <CardTitle>Department Analytics</CardTitle>
            <CardDescription>Comprehensive department insights and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Advanced analytics for department performance, student success rates, and strategic insights.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HODAnalytics;
