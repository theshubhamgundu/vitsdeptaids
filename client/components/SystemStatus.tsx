import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Database, AlertTriangle, CheckCircle } from "lucide-react";

const SystemStatus = () => {
  const [showStatus, setShowStatus] = useState(true);

  useEffect(() => {
    // Auto-hide after 10 seconds if Supabase is configured
    if (isSupabaseConfigured) {
      const timer = setTimeout(() => setShowStatus(false), 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!showStatus) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {isSupabaseConfigured ? (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="flex items-center justify-between">
            <span className="text-green-800">Database connected</span>
            <Badge
              variant="outline"
              className="text-green-700 border-green-300"
            >
              Production Mode
            </Badge>
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Demo Mode</span>
              <Badge
                variant="outline"
                className="text-yellow-700 border-yellow-300"
              >
                Local Data
              </Badge>
            </div>
            <div className="text-xs">
              Configure Supabase environment variables to enable full database
              features.
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SystemStatus;
