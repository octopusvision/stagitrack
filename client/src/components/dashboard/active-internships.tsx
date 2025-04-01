import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Internship, Service, PeriodeDeStage, Student } from "@shared/schema";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";

export function ActiveInternships() {
  const { data: internships, isLoading: isLoadingInternships } = useQuery<Internship[]>({
    queryKey: ['/api/internships'],
  });
  
  const { data: services } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });
  
  const { data: periods } = useQuery<PeriodeDeStage[]>({
    queryKey: ['/api/periode-de-stages'],
  });
  
  const { data: students } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });

  // Function to get service name by id
  const getServiceName = (serviceId: number) => {
    const service = services?.find(s => s.id === serviceId);
    return service?.name || "Unknown Service";
  };
  
  // Function to get period name by id
  const getPeriodName = (periodId: number) => {
    const period = periods?.find(p => p.id === periodId);
    return period?.name || "Unknown Period";
  };
  
  // Function to get period dates
  const getPeriodDates = (periodId: number) => {
    const period = periods?.find(p => p.id === periodId);
    if (!period) return "Unknown dates";
    
    const startDate = new Date(period.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const endDate = new Date(period.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    
    return `${startDate} - ${endDate}`;
  };
  
  // Function to get students count by internship
  const getStudentsCount = (internshipServiceId: number, internshipPeriodId: number) => {
    return internships?.filter(i => 
      i.serviceId === internshipServiceId && i.periodeDeStageId === internshipPeriodId
    ).length || 0;
  };
  
  // Group internships by service and period
  const groupedInternships = internships?.reduce((acc, internship) => {
    const key = `${internship.serviceId}-${internship.periodeDeStageId}`;
    if (!acc[key]) {
      acc[key] = {
        serviceId: internship.serviceId,
        periodId: internship.periodeDeStageId,
        internships: []
      };
    }
    acc[key].internships.push(internship);
    return acc;
  }, {} as Record<string, { serviceId: number, periodId: number, internships: Internship[] }>);

  // Calculate days remaining
  const getDaysRemaining = (endDate: Date) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <Card className="bg-white shadow rounded-lg">
      <CardHeader className="p-6 border-b border-gray-200">
        <CardTitle className="text-lg font-medium text-gray-900">Active Internships</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {isLoadingInternships ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : !groupedInternships || Object.keys(groupedInternships).length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No active internships at the moment
          </div>
        ) : (
          Object.values(groupedInternships).slice(0, 3).map(group => {
            const serviceName = getServiceName(group.serviceId);
            const periodName = getPeriodName(group.periodId);
            const periodDates = getPeriodDates(group.periodId);
            const studentsCount = group.internships.length;
            
            // Get the end date of the first internship in the group
            // (assuming all internships in the same group have the same end date)
            const sampleEndDate = group.internships[0]?.endDate;
            const daysRemaining = sampleEndDate ? getDaysRemaining(sampleEndDate) : 0;
            
            return (
              <div key={`${group.serviceId}-${group.periodId}`} className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{serviceName}</h3>
                    <p className="text-sm text-gray-500">{periodName}: {periodDates}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="mt-3">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-900">{studentsCount} Students</span> • {daysRemaining} days remaining
                  </div>
                  <div className="mt-2 flex">
                    <div className="flex -space-x-2 overflow-hidden">
                      {/* Display student avatars - max 3 plus a +X indicator */}
                      {group.internships.slice(0, 3).map((internship, idx) => (
                        <div 
                          key={idx} 
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-xs text-gray-600"
                        >
                          {students?.find(s => s.id === internship.studentId)?.fullName?.charAt(0) || 'S'}
                        </div>
                      ))}
                      {studentsCount > 3 && (
                        <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-800 ring-2 ring-white">
                          +{studentsCount - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        <div className="mt-4 flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/internships">View All Internships</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
