import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Construction, 
  MessageCircle,
  Cpu 
} from "lucide-react";

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-4">
              <Cpu className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">AI & DS</span>
            </Link>
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl text-center">
          <CardHeader className="pb-6">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-blue-100">
                <Construction className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </CardTitle>
            <CardDescription className="text-lg">
              This section is currently under development
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Coming Soon!
              </h3>
              <p className="text-gray-700 mb-4">
                We're working hard to bring you comprehensive information about our {title.toLowerCase()} section. 
                This page will include detailed content, interactive features, and up-to-date information.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Department
                </Button>
                <Link to="/">
                  <Button variant="outline">
                    Explore Homepage
                  </Button>
                </Link>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>
                For immediate information, please contact the department directly or visit our main website.
              </p>
              <p className="mt-2">
                <strong>Email:</strong> aids@vignanits.ac.in | <strong>Phone:</strong> +91 9876543210
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>© 2025 Department of Artificial Intelligence & Data Science</p>
            <p className="text-sm mt-1">Vignan Institute of Technology & Science</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PlaceholderPage;
