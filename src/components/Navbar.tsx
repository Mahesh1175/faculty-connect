import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/isquareit-logo.png";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Request Visit", path: "/visitor-form" },
    { name: "Faculty Portal", path: "/faculty-dashboard" },
  ];

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="iSquareIT Logo" className="h-10 md:h-12" />
            <span className="text-sm md:text-lg font-semibold text-foreground">
              Faculty Visit Portal
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Button variant="outline" size="sm" asChild>
              <a
                href="https://www.isquareit.edu.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                College Website
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block text-sm font-medium ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Button
              variant="outline"
              size="sm"
              asChild
              className="w-full"
            >
              <a
                href="https://www.isquareit.edu.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                College Website
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;