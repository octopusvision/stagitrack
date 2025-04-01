import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { Internship, Student, Service, PeriodeDeStage } from "@shared/schema";
import { PlusCircle } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InternshipsIndex() {
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [selectedPeriod, setSelectedPeriod] = useState<string | undefined>(undefined);
  
  // Fetch all internships
  const { data: internships, isLoading: isLoadingInternships } = useQuery<Internship[]>({
    queryKey: ['/api/internships'],
  });
  
  // Fetch related data for references
  const { data: students } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });
  
  const { data: services } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });
  
  const { data: periods } = useQuery<PeriodeDeStage[]>({
    queryKey: ['/api/periode-de-stages'],
  });
  
  // Filter internships based on selected filters
  const filteredInternships = internships?.filter(internship => {
    let serviceMatch = true;
    let periodMatch = true;
    
    if (selectedService) {
      serviceMatch = internship.serviceId.toString() === selectedService;
    }
    
    if (selectedPeriod) {
      periodMatch = internship.periodeDeStageId.toString() === selectedPeriod;
    }
    
    return serviceMatch && periodMatch;
  });
  
  // Helper functions to get names instead of just IDs
  const getStudentName = (studentId: number) => {
    const student = students?.find(s => s.id === studentId);
    return student?.fullName || `Student #${studentId}`;
  };
  
  const getServiceName = (serviceId: number) => {
    const service = services?.find(s => s.id === serviceId);
    return service?.name || `Service #${serviceId}`;
  };
  
  const getPeriodName = (periodId: number) => {
    const period = periods?.find(p => p.id === periodId);
    return period?.name || `Period #${periodId}`;
  };
  
  // Define columns for internships table
  const internshipColumns = [
    {
      header: "Student",
      accessorKey: "studentId",
      cell: (record: Internship) => getStudentName(record.studentId),
    },
    {
      header: "Service",
      accessorKey: "serviceId",
      cell: (record: Internship) => getServiceName(record.serviceId),
    },
    {
      header: "Period",
      accessorKey: "periodeDeStageId",
      cell: (record: Internship) => getPeriodName(record.periodeDeStageId),
    },
    {
      header: "Start Date",
      accessorKey: "startDate",
      cell: (record: Internship) => new Date(record.startDate).toLocaleDateString(),
    },
    {
      header: "End Date",
      accessorKey: "endDate",
      cell: (record: Internship) => new Date(record.endDate).toLocaleDateString(),
    },
    {
      header: "Status",
      accessorKey: "validationStatus",
      cell: (record: Internship) => {
        const statusColors = {
          Pending: "bg-yellow-100 text-yellow-800",
          Validated: "bg-green-100 text-green-800",
          Rejected: "bg-red-100 text-red-800",
        };
        return (
          <Badge className={statusColors[record.validationStatus]}>
            {record.validationStatus}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Internships Management" />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Internships</h1>
            <Button asChild>
              <Link href="/internships/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Internship
              </Link>
            </Button>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Filter Internships</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                  <Select
                    value={selectedService}
                    onValueChange={setSelectedService}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Services" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={undefined}>All Services</SelectItem>
                      {services?.map(service => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                  <Select
                    value={selectedPeriod}
                    onValueChange={setSelectedPeriod}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Periods" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={undefined}>All Periods</SelectItem>
                      {periods?.map(period => (
                        <SelectItem key={period.id} value={period.id.toString()}>
                          {period.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Internship Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={internshipColumns} 
                data={filteredInternships || []} 
                isLoading={isLoadingInternships}
                searchPlaceholder="Search internships..."
              />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
