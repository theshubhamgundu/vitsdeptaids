import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import {
  CreditCard,
  ExternalLink,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  IndianRupee,
  Banknote,
  Building
} from "lucide-react";

const StudentFees = () => {
  const [feeStructure] = useState({
    tuitionFee: 45000,
    developmentFee: 5000,
    labFee: 3000,
    libraryFee: 1000,
    examFee: 2000,
    transportFee: 8000,
    hostelFee: 25000,
    miscellaneous: 2000
  });

  const [paymentHistory] = useState([
    {
      id: 1,
      receiptNo: "RC2024001",
      semester: "5th Semester",
      academicYear: "2024-25",
      amount: 91000,
      paidAmount: 91000,
      paymentDate: "2024-08-15",
      dueDate: "2024-08-10",
      paymentMethod: "Online",
      transactionId: "TXN123456789",
      status: "Paid",
      lateFee: 0
    },
    {
      id: 2,
      receiptNo: "RC2025001",
      semester: "6th Semester",
      academicYear: "2024-25",
      amount: 91000,
      paidAmount: 0,
      paymentDate: null,
      dueDate: "2025-01-15",
      paymentMethod: null,
      transactionId: null,
      status: "Pending",
      lateFee: 500
    }
  ]);

  const [studentInfo] = useState({
    name: "Rahul Sharma",
    hallTicket: "20AI001",
    year: "3rd Year",
    semester: "6th Semester",
    branch: "AI & DS",
    admissionYear: "2020",
    category: "General",
    quota: "Management"
  });

  const totalSemesterFee = Object.values(feeStructure).reduce((sum, fee) => sum + fee, 0);
  const totalPaid = paymentHistory.filter(p => p.status === "Paid").reduce((sum, p) => sum + p.paidAmount, 0);
  const totalPending = paymentHistory.filter(p => p.status === "Pending").reduce((sum, p) => sum + p.amount + p.lateFee, 0);

  const handlePayOnline = () => {
    // Simple redirect to external payment link
    window.open("https://eazypay.icicibank.com/eazypayLink?P1=/2/SVNghjulFgj4uw2vsXQ==", '_blank', 'noopener,noreferrer');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate, status) => {
    if (status === "Paid") return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <DashboardLayout userType="student" userName="Rahul Sharma">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fee Payment</h1>
            <p className="text-gray-600">Pay your academic fees online</p>
          </div>
          <Button
            onClick={handlePayOnline}
            className="bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Pay Online
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Fee Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{totalPaid.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This academic year</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">₹{totalPending.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Due for payment</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Semester Fee</CardTitle>
              <IndianRupee className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">₹{totalSemesterFee.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Per semester</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Due Date</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">Jan 15</div>
              <p className="text-xs text-muted-foreground">2025</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Payments Alert */}
        {totalPending > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-orange-800">Payment Reminder</h3>
                  <p className="text-orange-700">
                    You have pending fee payments totaling ₹{totalPending.toLocaleString()}. 
                    Please complete your payment to avoid late fees.
                  </p>
                </div>
                <Button 
                  onClick={handlePayOnline}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Pay Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="payments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="structure">Fee Structure</TabsTrigger>
          </TabsList>

          {/* Payment History Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Your fee payment history and pending payments</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Receipt No.</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map((payment) => {
                      const overdue = isOverdue(payment.dueDate, payment.status);
                      const displayStatus = overdue && payment.status === "Pending" ? "Overdue" : payment.status;
                      
                      return (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.receiptNo}</TableCell>
                          <TableCell>
                            <div>
                              <div>{payment.semester}</div>
                              <div className="text-sm text-gray-600">{payment.academicYear}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">₹{(payment.amount + payment.lateFee).toLocaleString()}</div>
                              {payment.lateFee > 0 && (
                                <div className="text-sm text-red-600">Late Fee: ₹{payment.lateFee}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={overdue ? "text-red-600" : ""}>
                              {new Date(payment.dueDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(displayStatus)}>
                              {displayStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {payment.status !== "Paid" && (
                              <Button 
                                size="sm" 
                                onClick={handlePayOnline}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <CreditCard className="h-4 w-4 mr-1" />
                                Pay Now
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fee Structure Tab */}
          <TabsContent value="structure" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fee Structure</CardTitle>
                <CardDescription>Detailed breakdown of semester fees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(feeStructure).map(([key, amount]) => (
                    <div key={key} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h3 className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h3>
                      </div>
                      <div className="text-lg font-semibold">₹{amount.toLocaleString()}</div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div>
                      <h3 className="font-bold text-blue-800">Total Semester Fee</h3>
                    </div>
                    <div className="text-xl font-bold text-blue-800">₹{totalSemesterFee.toLocaleString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
                <CardDescription>Important details about fee payments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Payment Methods</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                        <span>Online Payment (Credit/Debit Card, Net Banking)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Banknote className="h-4 w-4 text-green-600" />
                        <span>Bank Transfer/NEFT/RTGS</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-purple-600" />
                        <span>Bank Draft/Cheque</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Important Notes</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Fee payment is due by the 15th of each semester</li>
                      <li>• Late fee of ₹500 per month will be charged after due date</li>
                      <li>• Hostel fees are collected separately if applicable</li>
                      <li>• Exam hall tickets will not be issued for pending fees</li>
                      <li>• All payments are non-refundable</li>
                      <li>• Keep payment receipts for future reference</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <Button 
                    onClick={handlePayOnline}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pay Fee Online
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentFees;
