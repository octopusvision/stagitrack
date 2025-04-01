import { useState } from "react";
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
    
    if (selectedService && selectedService !== "all") {
      serviceMatch = internship.serviceId.toString() === selectedService;
    }
    
    if (selectedPeriod && selectedPeriod !== "all") {
      periodMatch = internship.periodeDeStageId.toString() === selectedPeriod;
    }
    
    return serviceMatch && periodMatch;
  });
  
  // Helper functions to get names instead of just IDs
  const getStudentName = (studentId: number) => {
    const student = students?.find(s => s.id === studentId);
    return student?.fullName || `Étudiant #${studentId}`;
  };
  
  const getServiceName = (serviceId: number) => {
    const service = services?.find(s => s.id === serviceId);
    return service?.name || `Service #${serviceId}`;
  };
  
  const getPeriodName = (periodId: number) => {
    const period = periods?.find(p => p.id === periodId);
    return period?.name || `Période #${periodId}`;
  };
  
  // Define columns for internships table
  const internshipColumns = [
    {
      header: "Étudiant",
      accessorKey: "studentId",
      cell: (record: Internship) => getStudentName(record.studentId),
    },
    {
      header: "Service",
      accessorKey: "serviceId",
      cell: (record: Internship) => getServiceName(record.serviceId),
    },
    {
      header: "Période",
      accessorKey: "periodeDeStageId",
      cell: (record: Internship) => getPeriodName(record.periodeDeStageId),
    },
    {
      header: "Date de début",
      accessorKey: "startDate",
      cell: (record: Internship) => new Date(record.startDate).toLocaleDateString(),
    },
    {
      header: "Date de fin",
      accessorKey: "endDate",
      cell: (record: Internship) => new Date(record.endDate).toLocaleDateString(),
    },
    {
      header: "Statut",
      accessorKey: "validationStatus",
      cell: (record: Internship) => {
        const statusColors = {
          Pending: "bg-yellow-100 text-yellow-800",
          Validated: "bg-green-100 text-green-800",
          Rejected: "bg-red-100 text-red-800",
        };
        const statusLabels = {
          Pending: "En attente",
          Validated: "Validé",
          Rejected: "Rejeté",
        };
        return (
          <Badge className={statusColors[record.validationStatus]}>
            {statusLabels[record.validationStatus] || record.validationStatus}
          </Badge>
        );
      },
    },
  ];

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Stages</h1>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/internships/services">
              Gérer les Services
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/internships/periods">
              Gérer les Périodes
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/internships/attendance">
              Suivre les Présences
            </Link>
          </Button>
          
          <Button asChild>
            <Link href="/internships/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un Stage
            </Link>
          </Button>
        </div>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filtrer les Stages</CardTitle>
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
                  <SelectValue placeholder="Tous les Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les Services</SelectItem>
                  {services?.map(service => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Période</label>
              <Select
                value={selectedPeriod}
                onValueChange={setSelectedPeriod}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les Périodes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les Périodes</SelectItem>
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
          <CardTitle>Affectations des Stages</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={internshipColumns} 
            data={filteredInternships || []} 
            isLoading={isLoadingInternships}
            searchPlaceholder="Rechercher des stages..."
          />
        </CardContent>
      </Card>
    </>
  );
}
