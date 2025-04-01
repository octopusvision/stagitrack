import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Users, Layers, Calendar, Briefcase, Clock, Settings, X, GraduationCap, UserCog } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const closeMobileMenu = () => {
    const sidebar = document.querySelector('.mobile-sidebar');
    const overlay = document.querySelector('.mobile-overlay');
    
    sidebar?.classList.remove('translate-x-0');
    sidebar?.classList.add('-translate-x-full');
    overlay?.classList.add('hidden');
  };

  // Check if current location is in the internships section
  const isInInternshipsSection = location.startsWith('/internships');
  
  // Create links array based on user role
  const links = [
    { href: "/", label: "Tableau de bord", icon: Home },
    { href: "/students", label: "Étudiants", icon: Users },
    { href: "/teachers", label: "Enseignants", icon: GraduationCap },
    { href: "/filieres-classes", label: "Filières & Classes", icon: Layers },
    { href: "/attendance", label: "Présences", icon: Calendar },
    { href: "/internships", label: "Stages", icon: Briefcase },
    
    // Internship sub-pages (only shown when in the internships section)
    ...(isInInternshipsSection ? [
      { href: "/internships/services", label: "→ Services", icon: () => <span className="w-5" /> },
      { href: "/internships/periods", label: "→ Périodes", icon: () => <span className="w-5" /> },
      { href: "/internships/attendance", label: "→ Présences", icon: () => <span className="w-5" /> },
    ] : []),
    
    { href: "/timetables", label: "Emplois du temps", icon: Clock },
    ...(user?.role === "admin" ? [{ href: "/users", label: "Utilisateurs", icon: UserCog }] : []),
    { href: "/settings", label: "Paramètres", icon: Settings }
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <div className={cn(
        "hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:flex md:flex-col md:w-64 md:bg-gray-900 md:text-white md:shadow-lg",
        className
      )}>
        <div className="p-4 flex items-center justify-center border-b border-gray-800">
          <h1 className="text-xl font-semibold tracking-wider">Administration École d'Infirmiers</h1>
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
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
              {user?.fullName?.charAt(0) || user?.username?.charAt(0) || "U"}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.fullName || user?.username}</p>
              <button
                onClick={handleLogout}
                className="text-xs font-medium text-gray-400 hover:text-white"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 bg-gray-900 text-white z-50 flex flex-col w-64 transition-transform duration-300 ease-in-out transform h-full -translate-x-full md:hidden mobile-sidebar"
      )}>
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          <h1 className="text-lg font-semibold truncate">Administration École d'Infirmiers</h1>
          <button 
            onClick={closeMobileMenu}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
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
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                  onClick={closeMobileMenu}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
              {user?.fullName?.charAt(0) || user?.username?.charAt(0) || "U"}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.fullName || user?.username}</p>
              <button
                onClick={handleLogout}
                className="text-xs font-medium text-gray-400 hover:text-white"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      <div
        className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 hidden mobile-overlay"
        onClick={closeMobileMenu}
      />
    </>
  );
}