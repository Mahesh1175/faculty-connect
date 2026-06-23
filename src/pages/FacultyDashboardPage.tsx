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
  const [password, setPassword] = useState("");

  const facultyList = getFaculty();

  const handleFacultySelect = (faculty: string) => {
    setSelectedFaculty(faculty);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === "faculty@24") {
      setIsAuthenticated(true);
      toast.success("Login successful!");
    } else {
      toast.error("Invalid password");
    }
  };

  const handleBack = () => {
    setSelectedFaculty("");
    setPassword("");
  };

  if (isAuthenticated && selectedFaculty) {
    return <FacultyDashboard selectedFaculty={selectedFaculty} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>
              {!selectedFaculty
                ? "Faculty Selection"
                : "Faculty Authentication"}
            </CardTitle>

            <CardDescription>
              {!selectedFaculty
                ? "Select Faculty Profile"
                : `Login as ${selectedFaculty}`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!selectedFaculty ? (
              <div className="space-y-4">
                <Label>Select Faculty</Label>

                <Select onValueChange={handleFacultySelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Faculty" />
                  </SelectTrigger>

                  <SelectContent>
                    {facultyList.map((faculty) => (
                      <SelectItem
                        key={faculty.name}
                        value={faculty.name}
                      >
                        {faculty.name} ({faculty.dept})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Faculty: <strong>{selectedFaculty}</strong>
                  </p>

                  <Label htmlFor="password">
                    Password
                  </Label>

                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  {/* <p className="text-sm text-muted-foreground mt-2">
                    Demo Password: faculty@24
                  </p> */}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    Back
                  </Button>

                  <Button
                    type="submit"
                    className="flex-1"
                  >
                    Login
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FacultyDashboardPage;
