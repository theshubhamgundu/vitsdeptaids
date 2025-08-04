import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  ExternalLink,
  IndianRupee
} from "lucide-react";

const StudentFees = () => {
  const { toast } = useToast();

  const handlePayOnline = () => {
    // Simple redirect to external payment link
    toast({
      title: "Redirecting to Payment Gateway",
      description: "You will be redirected to ICICI Bank EazyPay for secure payment.",
    });

    setTimeout(() => {
      window.open("https://eazypay.icicibank.com/eazypayLink?P1=/2/SVNghjulFgj4uw2vsXQ==", '_blank', 'noopener,noreferrer');
    }, 1000);
  };

  return (
    <DashboardLayout userType="student" userName="Student">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Fee Payment</h1>
          <p className="text-gray-600 text-lg">Pay your academic fees securely online</p>
        </div>

        {/* Pay Online Card */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IndianRupee className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Online Fee Payment</CardTitle>
              <CardDescription>
                Make your fee payment quickly and securely through our online portal
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  • Secure payment gateway
                </p>
                <p className="text-sm text-gray-600">
                  • Instant payment confirmation
                </p>
                <p className="text-sm text-gray-600">
                  • Digital receipt generation
                </p>
              </div>
              
              <Button
                onClick={handlePayOnline}
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                size="lg"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Pay Online
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>

              <div className="text-center text-sm text-gray-500">
                <p>Powered by ICICI Bank EazyPay</p>
                <p>Accepts all major credit/debit cards and net banking</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Accepted Payment Methods:</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Credit Cards (Visa, MasterCard, Rupay)</li>
                  <li>• Debit Cards (All major banks)</li>
                  <li>• Net Banking</li>
                  <li>• UPI Payments</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Important Notes:</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Keep your hall ticket number ready</li>
                  <li>• Save payment receipt for records</li>
                  <li>• Contact admin for payment issues</li>
                  <li>• All transactions are secure</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentFees;
