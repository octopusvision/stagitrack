import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { Teacher, User } from "@shared/schema";
import { PlusCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function TeachersIndex() {
  const [, navigate] = useLocation();
  
  // Fetch teachers data
  const { data: teachers, isLoading: isLoadingTeachers } = useQuery<Teacher[]>({
    queryKey: ['/api/teachers'],
  });
  
  // Fetch users for reference (to display additional user information)
  const { data: users } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });
  
  // Helper function to get user information
  const getUserInfo = (userId: number | undefined) => {
    if (!userId) return null;
    return users?.find(u => u.id === userId);
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
      header: "Subject",
      accessorKey: "subject",
    },
    {
      header: "Email",
      cell: (teacher: Teacher) => {
        const user = getUserInfo(teacher.userId);
        return user?.email || "N/A";
      },
    },
    {
      header: "Role",
      cell: (teacher: Teacher) => {
        const user = getUserInfo(teacher.userId);
        return user ? (
          <Badge className="bg-indigo-100 text-indigo-800">
            {user.role}
          </Badge>
        ) : "N/A";
      },
    },
  ];
  
  const handleRowClick = (teacher: Teacher) => {
    navigate(`/teachers/${teacher.id}`);
  };

  return (
    <AppLayout title="Teachers Management">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
        <Button asChild>
          <Link href="/teachers/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Teacher
          </Link>
        </Button>
      </div>
      
      <DataTable 
        columns={columns} 
        data={teachers || []} 
        isLoading={isLoadingTeachers}
        onRowClick={handleRowClick}
        searchPlaceholder="Search teachers..."
        searchKeys={["fullName", "subject"]}
      />
    </AppLayout>
  );
}