import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, Users, Layers, Calendar, Briefcase, Clock, Settings, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const links = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/students", label: "Students", icon: Users },
    { href: "/filieres-classes", label: "Filieres & Classes", icon: Layers },
    { href: "/attendance", label: "Attendance", icon: Calendar },
    { href: "/internships", label: "Internships", icon: Briefcase },
    { href: "/timetables", label: "Timetables", icon: Clock },
    { href: "/settings", label: "Settings", icon: Settings }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 z-20 p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMenu}
          className="text-gray-500 hover:text-gray-900 focus:outline-none"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Sidebar for mobile and desktop */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 bg-primary-800 text-white z-50 flex flex-col w-64 transition-transform duration-300 ease-in-out transform",
          isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className
        )}
      >
        <div className="p-4 flex items-center justify-center border-b border-primary-700">
          <h1 className="text-xl font-semibold tracking-wider">Nursing School Admin</h1>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-2 space-y-1">
            {links.map((link) => {
              const isActive = location === link.href;
              const Icon = link.icon;
              
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-primary-900 text-white"
                      : "text-primary-100 hover:bg-primary-700"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-primary-700">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
              {user?.fullName?.charAt(0) || user?.username?.charAt(0) || "U"}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.fullName || user?.username}</p>
              <button
                onClick={handleLogout}
                className="text-xs font-medium text-primary-200 hover:text-white"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}
