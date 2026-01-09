import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import logo from "@/assets/isquareit-logo.png";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="iSquareIT Logo" className="h-12" />
            <span className="text-lg font-semibold text-foreground hidden sm:inline">
              Faculty Visit Portal
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            <Link
              to="/visitor-form"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/visitor-form') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Request Visit
            </Link>
            <Link
              to="/faculty-dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/faculty-dashboard') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Faculty Portal
            </Link>
            
            {/* College Website Button */}
            <Button
              variant="outline"
              size="sm"
              asChild
              className="ml-2"
            >
              <a 
                href="https://www.isquareit.edu.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Visit College Website
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
