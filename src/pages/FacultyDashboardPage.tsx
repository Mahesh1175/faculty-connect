import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import RequestCard from "@/components/RequestCard";
import { getFaculty, getRequestsByFaculty, updateRequestStatus, VisitorRequest } from "@/utils/localStorage";
import toast from "react-hot-toast";
import { Users, CheckCircle2, Clock, XCircle } from "lucide-react";

const FacultyDashboardPage = () => {
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [requests, setRequests] = useState<VisitorRequest[]>([]);
  const facultyList = getFaculty();

  useEffect(() => {
    if (selectedFaculty) {
      loadRequests();
    }
  }, [selectedFaculty]);

  const loadRequests = () => {
    const facultyRequests = getRequestsByFaculty(selectedFaculty);
    setRequests(facultyRequests);
  };

  const handleStatusChange = (requestId: string, status: VisitorRequest['status']) => {
    updateRequestStatus(requestId, status);
    loadRequests();
    
    const statusMessages = {
      approved: "Request approved successfully!",
      hold: "Request put on hold",
      declined: "Request declined",
    };
    toast.success(statusMessages[status]);
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
            <CardTitle className="text-2xl">Faculty Dashboard</CardTitle>
            <CardDescription>
              Manage visitor requests and communicate with visitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md">
              <label className="text-sm font-medium mb-2 block">Select Faculty Profile</label>
              <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
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
          </CardContent>
        </Card>

        {selectedFaculty && (
          <>
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
                        key={request.id}
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
                        key={request.id}
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
                        key={request.id}
                        request={request}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboardPage;
