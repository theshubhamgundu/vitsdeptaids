import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, User, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const DemoLogins = () => {
  const demoAccounts = [
    {
      type: "Student",
      icon: User,
      color: "bg-blue-100 text-blue-700",
      accounts: [
        {
          name: "Rahul Sharma",
          identifier: "20AI001",
          password: "student123",
          description: "3rd Year AI & DS Student"
        }
      ]
    },
    {
      type: "Faculty",
      icon: Users,
      color: "bg-green-100 text-green-700",
      accounts: [
        {
          name: "Dr. Anita Verma",
          identifier: "FAC001",
          password: "faculty123",
          description: "Assistant Professor - Computer Vision"
        }
      ]
    },
    {
      type: "HOD",
      icon: Users,
      color: "bg-purple-100 text-purple-700",
      accounts: [
        {
          name: "Dr. Priya Sharma",
          identifier: "HOD001",
          password: "hod123",
          description: "Head of Department - AI & DS"
        }
      ]
    },
    {
      type: "Admin",
      icon: Shield,
      color: "bg-red-100 text-red-700",
      accounts: [
        {
          name: "Admin User",
          identifier: "ADMIN001",
          password: "admin123",
          description: "System Administrator"
        }
      ]
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Demo Login Credentials</h1>
          <p className="text-lg text-gray-600">
            Use these credentials to test different user roles in the system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demoAccounts.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${category.color}`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>{category.type} Login</CardTitle>
                    <CardDescription>
                      {category.type === "HOD" ? "Use Faculty login page" : `Use ${category.type.toLowerCase()} login page`}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.accounts.map((account, accountIndex) => (
                  <div key={accountIndex} className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{account.name}</h3>
                      <Badge variant="outline">{account.description}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">
                          {category.type === "Student" ? "Hall Ticket" : "Employee ID"}
                        </label>
                        <div className="flex items-center space-x-2">
                          <code className="px-2 py-1 bg-white border rounded text-sm">
                            {account.identifier}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(account.identifier)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">Password</label>
                        <div className="flex items-center space-x-2">
                          <code className="px-2 py-1 bg-white border rounded text-sm">
                            {account.password}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(account.password)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-6 bg-white rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Login Instructions</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p><strong>Students:</strong> Use the "Student Login" button and enter your Hall Ticket Number</p>
            <p><strong>Faculty:</strong> Use the "Faculty Login" button and enter your Employee ID</p>
            <p><strong>HOD:</strong> Use the "Faculty Login" button and enter HOD001 as Employee ID (system will automatically detect HOD role)</p>
            <p><strong>Admin:</strong> Use the "Admin Login" option and enter your Admin ID</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoLogins;
