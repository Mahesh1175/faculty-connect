import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Calendar, MessageSquare, Users, ArrowRight } from "lucide-react";
import logo from "@/assets/isquareit-logo.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-light to-primary-dark text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <img src={logo} alt="ISquareIT Logo" className="h-24 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Welcome to ISquareIT
              <br />
              Faculty Visit Portal
            </h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Seamlessly connect with faculty members. Request visits, get approvals, and chat in real-time.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/visitor-form")}
                className="font-semibold"
              >
                Request Faculty Visit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/faculty-dashboard")}
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30"
              >
                Faculty Portal
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">1. Submit Request</h3>
                <p className="text-muted-foreground">
                  Fill out a simple form with your details and reason for visit. No login required.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">2. Faculty Reviews</h3>
                <p className="text-muted-foreground">
                  Faculty members review your request and can approve, hold, or decline based on availability.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">3. Chat in Real-Time</h3>
                <p className="text-muted-foreground">
                  Once approved, communicate directly with faculty through our integrated chat system.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20">
            <CardContent className="py-12 text-center space-y-6">
              <h2 className="text-3xl font-bold text-foreground">
                Ready to Connect?
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Start your faculty visit request now and experience seamless communication.
              </p>
              <Button
                size="lg"
                onClick={() => navigate("/visitor-form")}
                className="font-semibold"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 iSquareIT International Institute of Information Technology. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
