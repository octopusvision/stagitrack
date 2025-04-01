import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Student, Class, InsertAttendance } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Check, X, Clock } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MarkAttendance() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/attendance/mark");
  const { toast } = useToast();
  
  // State for filters and attendance records
  const [selectedClass, setSelectedClass] = useState<string | undefined>(
    new URLSearchParams(window.location.search).get("classId") || undefined
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState<Record<number, InsertAttendance>>({});
  
  // Fetch classes for the dropdown
  const { data: classes } = useQuery<Class[]>({
    queryKey: ['/api/classes'],
  });
  
  // Fetch students filtered by class
  const { data: students, isLoading: isLoadingStudents } = useQuery<Student[]>({
    queryKey: ['/api/students', { classId: selectedClass ? Number(selectedClass) : undefined }],
    enabled: !!selectedClass,
  });
  
  // Initialize attendance records when students or date changes
  useEffect(() => {
    if (students) {
      const newRecords: Record<number, InsertAttendance> = {};
      students.forEach(student => {
        newRecords[student.id] = {
          studentId: student.id,
          date: selectedDate,
          status: 'Present', // Default to present
          remarks: '',
        };
      });
      setAttendanceRecords(newRecords);
    }
  }, [students, selectedDate]);
  
  // Handle status change for a student
  const handleStatusChange = (studentId: number, status: 'Present' | 'Absent' | 'Late') => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      }
    }));
  };
  
  // Handle remarks change for a student
  const handleRemarksChange = (studentId: number, remarks: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      }
    }));
  };
  
  // Submit all attendance records
  const submitAttendanceMutation = useMutation({
    mutationFn: async () => {
      const records = Object.values(attendanceRecords);
      const promises = records.map(record => 
        apiRequest("POST", "/api/attendance", record)
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      toast({
        title: "Attendance records saved",
        description: "All attendance records have been successfully saved",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/attendance'] });
      navigate("/attendance");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save attendance records",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Define columns for student attendance table
  const studentColumns = [
    {
      header: "Student ID",
      accessorKey: "id",
    },
    {
      header: "Full Name",
      accessorKey: "fullName",
    },
    {
      header: "Status",
      accessorKey: "id",
      cell: (student: Student) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={attendanceRecords[student.id]?.status === 'Present' ? "default" : "outline"}
            className={attendanceRecords[student.id]?.status === 'Present' ? "bg-green-600 hover:bg-green-700" : ""}
            onClick={() => handleStatusChange(student.id, 'Present')}
          >
            <Check className="h-4 w-4 mr-1" />
            Present
          </Button>
          <Button
            size="sm"
            variant={attendanceRecords[student.id]?.status === 'Absent' ? "default" : "outline"}
            className={attendanceRecords[student.id]?.status === 'Absent' ? "bg-red-600 hover:bg-red-700" : ""}
            onClick={() => handleStatusChange(student.id, 'Absent')}
          >
            <X className="h-4 w-4 mr-1" />
            Absent
          </Button>
          <Button
            size="sm"
            variant={attendanceRecords[student.id]?.status === 'Late' ? "default" : "outline"}
            className={attendanceRecords[student.id]?.status === 'Late' ? "bg-yellow-600 hover:bg-yellow-700" : ""}
            onClick={() => handleStatusChange(student.id, 'Late')}
          >
            <Clock className="h-4 w-4 mr-1" />
            Late
          </Button>
        </div>
      ),
    },
    {
      header: "Remarks",
      accessorKey: "id",
      cell: (student: Student) => (
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Enter remarks"
          value={attendanceRecords[student.id]?.remarks || ''}
          onChange={(e) => handleRemarksChange(student.id, e.target.value)}
        />
      ),
    },
  ];
  
  const handleSubmit = () => {
    submitAttendanceMutation.mutate();
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Mark Attendance" />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate("/attendance")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Attendance
            </Button>
            
            <h1 className="text-2xl font-bold text-gray-900">Mark Student Attendance</h1>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Class and Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <Select
                    value={selectedClass}
                    onValueChange={setSelectedClass}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes?.map(cls => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.abbreviation} - {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <DatePicker
                    date={selectedDate}
                    setDate={setSelectedDate}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {selectedClass ? (
            <Card>
              <CardHeader>
                <CardTitle>Student Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingStudents ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                  </div>
                ) : !students || students.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No students found in this class
                  </div>
                ) : (
                  <>
                    <DataTable 
                      columns={studentColumns} 
                      data={students} 
                      searchPlaceholder="Search students..."
                      searchKeys={["fullName", "id"]}
                    />
                    
                    <div className="mt-6 flex justify-end">
                      <Button 
                        className="ml-auto"
                        onClick={handleSubmit}
                        disabled={submitAttendanceMutation.isPending}
                      >
                        {submitAttendanceMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Attendance"
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="text-center p-6 bg-gray-100 rounded-lg">
              <p className="text-gray-600">Please select a class to mark attendance</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
