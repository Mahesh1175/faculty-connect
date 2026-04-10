import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import RequestCard from "@/components/RequestCard";
import { getFaculty } from "@/utils/localStorage";
import { VisitorRequest } from "@/types/visitor";
import toast from "react-hot-toast";
import { Users, CheckCircle2, Clock, XCircle } from "lucide-react";
import axios from "axios";
import api from "@/utils/api";

// Main Dashboard Component (your existing component)
const FacultyDashboard = ({ selectedFaculty }: { selectedFaculty: string }) => {
  const [requests, setRequests] = useState<VisitorRequest[]>([]);

  useEffect(() => {
    loadRequests();
  }, [selectedFaculty]);

const loadRequests = async () => {
  try {
    const res = await api.get(
      `/api/visitors/${encodeURIComponent(selectedFaculty)}`
    );

    setRequests(res.data);
    console.log("res data-from faculty->", res.data);
  } catch (err) {
    toast.error("Failed to load requests");
    console.error(err);
  }
};


const handleStatusChange = async (_id: string, status: VisitorRequest["status"]) => {
  const resStatus = await api.put(
    `/api/visitors/${_id}`,
    { status }
  );

  console.log("resStatus", resStatus);
  loadRequests();
};

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const otherRequests = requests.filter(r => r.status === 'hold' || r.status === 'declined');

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">Faculty Dashboard</CardTitle>
            <CardDescription>
              Welcome {selectedFaculty}!
               Manage visitor requests and communicate with visitors
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Requests</p>
                      <p className="text-2xl font-bold">{requests.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold">{pendingRequests.length}</p>
                    </div>
                    <Clock className="h-8 w-8 text-warning" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Approved</p>
                      <p className="text-2xl font-bold">{approvedRequests.length}</p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Declined/Hold</p>
                      <p className="text-2xl font-bold">{otherRequests.length}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-destructive" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Requests Tabs */}
            <Tabs defaultValue="pending" className="space-y-4">
              <TabsList>
                <TabsTrigger value="pending">
                  Pending ({pendingRequests.length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({approvedRequests.length})
                </TabsTrigger>
                <TabsTrigger value="other">
                  Other ({otherRequests.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {pendingRequests.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">No pending requests</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {pendingRequests.map((request) => (
                      <RequestCard
                        key={request._id}
                        request={request}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="approved" className="space-y-4">
                {approvedRequests.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">No approved requests</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {approvedRequests.map((request) => (
                      <RequestCard
                        key={request._id}
                        request={request}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="other" className="space-y-4">
                {otherRequests.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">No declined or hold requests</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {otherRequests.map((request) => (
                      <RequestCard
                        key={request._id}
                        request={request}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
      </div>
    </div>
  );
};

// Authentication Wrapper Component
const FacultyDashboardPage = () => {
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState(1); // 1: name, 2: phone, 3: otp
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    otp: ""
  });
  const facultyList = getFaculty();

  const handleFacultySelect = (faculty: string) => {
    setSelectedFaculty(faculty);
    setFormData(prev => ({ ...prev, name: faculty }));
    setStep(2); // Go to phone number step
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      setStep(2);
    } else {
      toast.error("Please enter your name");
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone === "9999999999") {
      setStep(3);
      toast.success("OTP sent to your phone");
    } else {
      toast.error("Invalid phone number");
    }
  };

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp === "123456") {
      setIsAuthenticated(true);
      toast.success("Authentication successful!");
    } else {
      toast.error("Invalid OTP");
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isAuthenticated && selectedFaculty) {
    return <FacultyDashboard selectedFaculty={selectedFaculty} />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {!selectedFaculty ? "Faculty Selection" : "Faculty Authentication"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedFaculty && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="faculty-select">Select Faculty Profile</Label>
                <Select value={selectedFaculty} onValueChange={handleFacultySelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose your faculty profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {facultyList.map((faculty) => (
                      <SelectItem key={faculty.id} value={faculty.name}>
                        {faculty.name} ({faculty.dept})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {selectedFaculty && step === 1 && (
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Faculty Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedFaculty("");
                    setStep(1);
                    setFormData({ name: "", phone: "", otp: "" });
                  }}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Continue
                </Button>
              </div>
            </form>
          )}

          {selectedFaculty && step === 2 && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Authenticating: <strong>{selectedFaculty}</strong>
                </p>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number (9999999999)"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Use: 9999999999
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedFaculty("");
                    setStep(1);
                    setFormData({ name: "", phone: "", otp: "" });
                  }}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Send OTP
                </Button>
              </div>
            </form>
          )}

          {selectedFaculty && step === 3 && (
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Authenticating: <strong>{selectedFaculty}</strong>
                </p>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  value={formData.otp}
                  onChange={(e) => handleInputChange("otp", e.target.value)}
                  placeholder="Enter OTP (123456)"
                  maxLength={6}
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Use: 123456
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Verify
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-2">Demo Credentials:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Name: Any name</li>
              <li>• Phone: 9999999999</li>
              <li>• OTP: 123456</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyDashboardPage;