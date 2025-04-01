import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { Student, Filiere, Class } from "@shared/schema";
import { PlusCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function StudentsIndex() {
  const [, navigate] = useLocation();
  
  // Fetch students data
  const { data: students, isLoading: isLoadingStudents } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });
  
  // Fetch filieres and classes for reference
  const { data: filieres } = useQuery<Filiere[]>({
    queryKey: ['/api/filieres'],
  });
  
  const { data: classes } = useQuery<Class[]>({
    queryKey: ['/api/classes'],
  });
  
  // Helper functions to get names instead of just IDs
  const getFiliereName = (filiereId: number | null | undefined) => {
    if (!filiereId) return "N/A";
    return filieres?.find(f => f.id === filiereId)?.name || "Unknown";
  };
  
  const getClassName = (classId: number | null | undefined) => {
    if (!classId) return "N/A";
    return classes?.find(c => c.id === classId)?.abbreviation || "Unknown";
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif': return "bg-green-100 text-green-800";
      case 'Suspendu': return "bg-amber-100 text-amber-800";
      case 'Diplômé': return "bg-blue-100 text-blue-800";
      case 'Exclu': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Define columns for DataTable
  const columns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Full Name",
      accessorKey: "fullName",
    },
    {
      header: "ID Card",
      accessorKey: "idCardNumber",
    },
    {
      header: "Filiere",
      accessorKey: "filiereId",
      cell: (student: Student) => getFiliereName(student.filiereId),
    },
    {
      header: "Class",
      accessorKey: "classId",
      cell: (student: Student) => getClassName(student.classId),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (student: Student) => (
        <Badge className={getStatusColor(student.status || 'Actif')}>
          {student.status || 'Actif'}
        </Badge>
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
    },
  ];
  
  const handleRowClick = (student: Student) => {
    navigate(`/students/${student.id}`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Students Management" />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Students</h1>
            <Button asChild>
              <Link href="/students/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Student
              </Link>
            </Button>
          </div>
          
          <DataTable 
            columns={columns} 
            data={students || []} 
            isLoading={isLoadingStudents}
            onRowClick={handleRowClick}
            searchPlaceholder="Search students..."
            searchKeys={["fullName", "idCardNumber", "email"]}
          />
        </main>
      </div>
    </div>
  );
}
