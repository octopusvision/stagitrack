import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentAttendance } from "@/components/dashboard/recent-attendance";
import { ActiveInternships } from "@/components/dashboard/active-internships";
import { TodaysClasses } from "@/components/dashboard/todays-classes";
import { useQuery } from "@tanstack/react-query";
import { User, Student, Internship, Timetable } from "@shared/schema";
import { Users, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  // Fetch data for dashboard metrics
  const { data: students } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });
  
  const { data: internships } = useQuery<Internship[]>({
    queryKey: ['/api/internships'],
  });
  
  const { data: timetables } = useQuery<Timetable[]>({
    queryKey: ['/api/timetables', { dayOfWeek: new Date().getDay() }],
  });
  
  // Calculate metrics for dashboard cards
  const studentCount = students?.length || 0;
  const activeInternships = internships?.filter(i => i.validationStatus === 'Pending')?.length || 0;
  const classesToday = timetables?.length || 0;
  const pendingIssues = 3; // Placeholder for pending issues count

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <Header title="Dashboard" />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard 
              title="Total Students" 
              value={studentCount} 
              icon={Users} 
              iconColor="text-primary-600" 
              iconBgColor="bg-primary-100"
              linkText="View all"
              linkHref="/students"
            />
            
            <StatCard 
              title="Active Internships" 
              value={activeInternships} 
              icon={CheckCircle} 
              iconColor="text-green-600" 
              iconBgColor="bg-green-100"
              linkText="Manage"
              linkHref="/internships"
            />
            
            <StatCard 
              title="Classes Today" 
              value={classesToday} 
              icon={Clock} 
              iconColor="text-amber-600" 
              iconBgColor="bg-amber-100"
              linkText="View schedule"
              linkHref="/timetables"
            />
            
            <StatCard 
              title="Pending Issues" 
              value={pendingIssues} 
              icon={AlertTriangle} 
              iconColor="text-red-600" 
              iconBgColor="bg-red-100"
              linkText="Resolve now"
              linkHref="#"
            />
          </div>
          
          {/* Main content with attendance and internships */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <RecentAttendance />
            <ActiveInternships />
          </div>
          
          {/* Today's classes */}
          <TodaysClasses />
        </main>
      </div>
    </div>
  );
}
