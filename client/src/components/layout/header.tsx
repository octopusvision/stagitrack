import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h1>
          </div>
          
          <div className="flex items-center">
            <div className="relative">
              <Button variant="ghost" size="icon" className="text-gray-500 rounded-full hover:text-gray-900 focus:outline-none">
                <Bell className="h-6 w-6" />
              </Button>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
