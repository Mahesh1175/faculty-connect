import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { addVisitorRequest, getFacultyByDept } from "@/utils/localStorage";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

const VisitorFormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    visitorName: "",
    mobile: "",
    dept: "",
    facultyName: "",
    reason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.visitorName || !formData.mobile || !formData.dept || !formData.facultyName || !formData.reason) {
      toast.error("Please fill all fields");
      return;
    }

    if (formData.mobile.length !== 10) {
      toast.error("Mobile number must be 10 digits");
      return;
    }

    addVisitorRequest({
      visitorName: formData.visitorName,
      mobile: formData.mobile,
      dept: formData.dept,
      facultyName: formData.facultyName,
      reason: formData.reason,
      status: 'pending',
    });

    toast.success("Visit request submitted successfully!");
    setFormData({
      visitorName: "",
      mobile: "",
      dept: "",
      facultyName: "",
      reason: "",
    });
    
    setTimeout(() => navigate("/"), 1500);
  };

  const facultyList = formData.dept ? getFacultyByDept(formData.dept) : [];

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Request Faculty Visit</CardTitle>
            <CardDescription>
              Fill out the form below to request a visit with a faculty member. No login required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="visitorName">Your Name *</Label>
                <Input
                  id="visitorName"
                  placeholder="Enter your full name"
                  value={formData.visitorName}
                  onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dept">Department *</Label>
                <Select
                  value={formData.dept}
                  onValueChange={(value) => setFormData({ ...formData, dept: value, facultyName: "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT">Information Technology (IT)</SelectItem>
                    <SelectItem value="CS">Computer Science (CS)</SelectItem>
                    <SelectItem value="ENTC">Electronics & Telecommunication (ENTC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="facultyName">Faculty Name *</Label>
                <Select
                  value={formData.facultyName}
                  onValueChange={(value) => setFormData({ ...formData, facultyName: value })}
                  disabled={!formData.dept}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={formData.dept ? "Select faculty" : "Select department first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {facultyList.map((faculty) => (
                      <SelectItem key={faculty.id} value={faculty.name}>
                        {faculty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit *</Label>
                <Textarea
                  id="reason"
                  placeholder="Briefly describe the purpose of your visit"
                  rows={4}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg">
                Submit Request
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VisitorFormPage;
