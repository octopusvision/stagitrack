import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Menu, Bell, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { user, logoutMutation } = useAuth();
  
  const getInitials = (name?: string) => {
    if (!name) return user?.username?.charAt(0)?.toUpperCase() || "U";
    
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const toggleMobileMenu = () => {
    // We'll use this to toggle the sidebar from this component
    const sidebar = document.querySelector('.mobile-sidebar');
    const overlay = document.querySelector('.mobile-overlay');
    
    if (sidebar?.classList.contains('translate-x-0')) {
      sidebar.classList.remove('translate-x-0');
      sidebar.classList.add('-translate-x-full');
      overlay?.classList.add('hidden');
    } else {
      sidebar?.classList.remove('-translate-x-full');
      sidebar?.classList.add('translate-x-0');
      overlay?.classList.remove('hidden');
    }
  };
  
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 flex items-center justify-between h-16 px-4 md:px-6">
      <div className="flex items-center space-x-2 md:hidden">
        <Button 
          size="icon" 
          variant="ghost" 
          className="md:hidden"
          onClick={toggleMobileMenu}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      
      <div className="hidden md:block">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </Button>
        
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{getInitials(user?.fullName)}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{user?.fullName || user?.username || "User"}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role || "Role"}</p>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}