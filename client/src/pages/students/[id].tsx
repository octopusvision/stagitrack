import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Student, Class, Filiere, Attendance, Internship } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  BookOpen, 
  GraduationCap, 
  Clock, 
  BarChart 
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DataTable } from "@/components/ui/data-table";

export default function StudentDetails() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/students/:id");
  const { toast } = useToast();
  const studentId = params?.id ? parseInt(params.id) : null;
  
  // Fetch student data
  const { 
    data: student, 
    isLoading: isLoadingStudent,
    error
  } = useQuery<Student>({
    queryKey: [`/api/students/${studentId}`],
    enabled: !!studentId,
  });
  
  // Fetch related data
  const { data: filiere } = useQuery<Filiere>({
    queryKey: [`/api/filieres/${student?.filiereId}`],
    enabled: !!student?.filiereId,
  });
  
  const { data: classData } = useQuery<Class>({
    queryKey: [`/api/classes/${student?.classId}`],
    enabled: !!student?.classId,
  });
  
  // Fetch attendance records
  const { data: attendanceRecords } = useQuery<Attendance[]>({
    queryKey: ['/api/attendance', { studentId }],
    enabled: !!studentId,
  });
  
  // Fetch internships
  const { data: internships } = useQuery<Internship[]>({
    queryKey: ['/api/internships', { studentId }],
    enabled: !!studentId,
  });
  
  // Define columns for attendance table
  const attendanceColumns = [
    {
      header: "Date",
      accessorKey: "date",
      cell: (record: Attendance) => new Date(record.date).toLocaleDateString(),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (record: Attendance) => {
        const statusColors = {
          Present: "bg-green-100 text-green-800",
          Absent: "bg-red-100 text-red-800",
          Late: "bg-yellow-100 text-yellow-800",
        };
        return (
          <Badge className={statusColors[record.status]}>
            {record.status}
          </Badge>
        );
      },
    },
    {
      header: "Remarks",
      accessorKey: "remarks",
    },
  ];
  
  // Define columns for internships table
  const internshipColumns = [
    {
      header: "Service",
      accessorKey: "serviceId",
      cell: () => "Service Name", // Would need to fetch service details
    },
    {
      header: "Period",
      accessorKey: "periodeDeStageId",
      cell: () => "Period Name", // Would need to fetch period details
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
  
  // Delete student mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!studentId) return;
      await apiRequest("DELETE", `/api/students/${studentId}`);
    },
    onSuccess: () => {
      toast({
        title: "Student deleted",
        description: "The student has been successfully removed",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/students'] });
      navigate("/students");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete student",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle delete
  const handleDelete = () => {
    deleteMutation.mutate();
  };
  
  // Redirect if student not found
  useEffect(() => {
    if (error) {
      toast({
        title: "Student not found",
        description: "The requested student could not be found",
        variant: "destructive",
      });
      navigate("/students");
    }
  }, [error, navigate, toast]);
  
  // Loading state
  if (isLoadingStudent || !student) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Student Details" />
          
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </main>
        </div>
      </div>
    );
  }
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actif': return "bg-green-100 text-green-800";
      case 'Suspendu': return "bg-amber-100 text-amber-800";
      case 'Diplômé': return "bg-blue-100 text-blue-800";
      case 'Exclu': return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Student Details" />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <Button 
                variant="outline" 
                onClick={() => navigate("/students")}
                className="mb-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Students
              </Button>
              
              <h1 className="text-2xl font-bold text-gray-900">{student.fullName}</h1>
              <Badge className={getStatusColor(student.status || 'Actif')}>
                {student.status || 'Actif'}
              </Badge>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => navigate(`/students/edit/${student.id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the student record
                      and all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {deleteMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Delete"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Filiere</dt>
                    <dd className="mt-1 text-sm text-gray-900">{filiere?.name || 'Not assigned'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Class</dt>
                    <dd className="mt-1 text-sm text-gray-900">{classData?.name || 'Not assigned'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Student ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{student.id}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID Card Number</dt>
                    <dd className="mt-1 text-sm text-gray-900">{student.idCardNumber || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{student.email || 'Not provided'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{student.phone || 'Not provided'}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Total Attendances</dt>
                    <dd className="mt-1 text-sm text-gray-900">{attendanceRecords?.length || 0}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Total Absences</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {attendanceRecords?.filter(a => a.status === 'Absent').length || 0}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Total Internships</dt>
                    <dd className="mt-1 text-sm text-gray-900">{internships?.length || 0}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900">{student.address || 'No address provided'}</p>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="attendance">
            <TabsList className="mb-4">
              <TabsTrigger value="attendance">Attendance Records</TabsTrigger>
              <TabsTrigger value="internships">Internships</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="attendance">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance History</CardTitle>
                  <CardDescription>
                    Track student's attendance records over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable 
                    columns={attendanceColumns} 
                    data={attendanceRecords || []} 
                    searchPlaceholder="Search attendance records..."
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="internships">
              <Card>
                <CardHeader>
                  <CardTitle>Internships</CardTitle>
                  <CardDescription>
                    View all internships assigned to this student
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable 
                    columns={internshipColumns} 
                    data={internships || []} 
                    searchPlaceholder="Search internships..."
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>
                    Student's uploaded documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {student.documents ? (
                    <div className="border rounded-md p-4 bg-gray-50">
                      <p className="text-sm">Document: {student.documents}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">No documents have been uploaded yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
