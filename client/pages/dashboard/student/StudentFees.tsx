import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  CreditCard,
  Download,
  ExternalLink,
  Receipt,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  IndianRupee,
  Phone,
  Mail,
  Building,
  Eye,
  Printer,
  Banknote
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

  const [paymentHistory, setPaymentHistory] = useState([
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
      lateFee: 0,
      breakdown: {
        tuitionFee: 45000,
        developmentFee: 5000,
        labFee: 3000,
        libraryFee: 1000,
        examFee: 2000,
        transportFee: 8000,
        hostelFee: 25000,
        miscellaneous: 2000
      }
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
      lateFee: 500,
      breakdown: {
        tuitionFee: 45000,
        developmentFee: 5000,
        labFee: 3000,
        libraryFee: 1000,
        examFee: 2000,
        transportFee: 8000,
        hostelFee: 25000,
        miscellaneous: 2000
      }
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

  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [pendingPayment, setPendingPayment] = useState(null);

  const totalSemesterFee = Object.values(feeStructure).reduce((sum, fee) => sum + fee, 0);
  const totalPaid = paymentHistory.filter(p => p.status === "Paid").reduce((sum, p) => sum + p.paidAmount, 0);
  const totalPending = paymentHistory.filter(p => p.status === "Pending").reduce((sum, p) => sum + p.amount + p.lateFee, 0);

  const handlePayOnline = (payment) => {
    setPendingPayment(payment);
    setShowPaymentDialog(true);
  };

  const proceedToPayment = () => {
    // Redirect to ICICI Bank EazyPay
    const paymentUrl = "https://eazypay.icicibank.com/eazypayLink?P1=/2/SVNghjulFgj4uw2vsXQ==";
    window.open(paymentUrl, '_blank', 'noopener,noreferrer');
    setShowPaymentDialog(false);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'overdue':
        return AlertTriangle;
      default:
        return Clock;
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
            <p className="text-gray-600">Manage your academic fee payments and view payment history</p>
          </div>
          <Button
            onClick={() => window.open("https://eazypay.icicibank.com/eazypayLink?P1=/2/SVNghjulFgj4uw2vsXQ==", '_blank')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <CreditCard className="h-4 w-4 mr-2" />
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

        <Tabs defaultValue="payments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="structure">Fee Structure</TabsTrigger>
            <TabsTrigger value="info">Student Info</TabsTrigger>
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
                      const StatusIcon = getStatusIcon(payment.status);
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
                            <div className="flex items-center space-x-2">
                              <StatusIcon className="h-4 w-4" />
                              <Badge className={getStatusColor(displayStatus)}>
                                {displayStatus}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {payment.status === "Paid" ? (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => {
                                      setSelectedReceipt(payment);
                                      setShowReceiptDialog(true);
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <Button 
                                  size="sm" 
                                  onClick={() => handlePayOnline(payment)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <CreditCard className="h-4 w-4 mr-1" />
                                  Pay Now
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

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
                      onClick={() => window.open("https://eazypay.icicibank.com/eazypayLink?P1=/2/SVNghjulFgj4uw2vsXQ==", '_blank')}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Pay Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
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
                      <li className="flex items-center space-x-2">
                        <Receipt className="h-4 w-4 text-orange-600" />
                        <span>Cash Payment at Accounts Office</span>
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Student Information Tab */}
          <TabsContent value="info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
                <CardDescription>Your academic and personal details for fee payment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Student Name</Label>
                      <p className="text-lg font-semibold">{studentInfo.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Hall Ticket Number</Label>
                      <p className="text-lg font-mono">{studentInfo.hallTicket}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Current Year</Label>
                      <p className="text-lg">{studentInfo.year}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Current Semester</Label>
                      <p className="text-lg">{studentInfo.semester}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Branch</Label>
                      <p className="text-lg">{studentInfo.branch}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Admission Year</Label>
                      <p className="text-lg">{studentInfo.admissionYear}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Category</Label>
                      <p className="text-lg">{studentInfo.category}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Quota</Label>
                      <p className="text-lg">{studentInfo.quota}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>For fee-related queries and support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Accounts Office</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-blue-600" />
                        <span>+91 863-234-5678</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <span>accounts@vignan.ac.in</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>Mon-Fri: 9:00 AM - 5:00 PM</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Fee Support</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-green-600" />
                        <span>+91 863-234-5679</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-green-600" />
                        <span>fees.support@vignan.ac.in</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span>Mon-Sat: 8:00 AM - 6:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Receipt Dialog */}
        {selectedReceipt && (
          <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Payment Receipt</DialogTitle>
                <DialogDescription>Receipt No: {selectedReceipt.receiptNo}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Receipt Header */}
                <div className="text-center border-b pb-4">
                  <h2 className="text-xl font-bold">Vignan Institute of Technology & Science</h2>
                  <p className="text-gray-600">Fee Payment Receipt</p>
                </div>

                {/* Student Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Student Name</Label>
                    <p>{studentInfo.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Hall Ticket</Label>
                    <p>{studentInfo.hallTicket}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Academic Year</Label>
                    <p>{selectedReceipt.academicYear}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Semester</Label>
                    <p>{selectedReceipt.semester}</p>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Payment Details</h3>
                  <div className="space-y-2">
                    {Object.entries(selectedReceipt.breakdown).map(([key, amount]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span>₹{amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total Amount</span>
                      <span>₹{selectedReceipt.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Payment Date</Label>
                    <p>{new Date(selectedReceipt.paymentDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Payment Method</Label>
                    <p>{selectedReceipt.paymentMethod}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Transaction ID</Label>
                    <p className="font-mono">{selectedReceipt.transactionId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge className={getStatusColor(selectedReceipt.status)}>
                      {selectedReceipt.status}
                    </Badge>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button variant="outline" onClick={() => setShowReceiptDialog(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Payment Confirmation Dialog */}
        {pendingPayment && (
          <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Payment</DialogTitle>
                <DialogDescription>You will be redirected to ICICI Bank EazyPay portal</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Payment Details</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Semester:</span>
                      <span>{pendingPayment.semester}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span>₹{pendingPayment.amount.toLocaleString()}</span>
                    </div>
                    {pendingPayment.lateFee > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Late Fee:</span>
                        <span>₹{pendingPayment.lateFee.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold border-t pt-1">
                      <span>Total:</span>
                      <span>₹{(pendingPayment.amount + pendingPayment.lateFee).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p>• You will be redirected to ICICI Bank's secure payment portal</p>
                  <p>• Accepted payment methods: Credit Card, Debit Card, Net Banking</p>
                  <p>• Keep your transaction ID for future reference</p>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={proceedToPayment} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Proceed to Payment
                  </Button>
                  <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentFees;
