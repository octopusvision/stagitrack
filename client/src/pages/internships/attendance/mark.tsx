import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Internship, Student, InsertInternshipAttendance } from "@shared/schema";
import { ArrowLeft, Check, X, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function MarkInternshipAttendance() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [selectedInternship, setSelectedInternship] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [remarks, setRemarks] = useState<{ [key: number]: string }>({});
  const [statuses, setStatuses] = useState<{ [key: number]: string }>({});
  
  // Fetch related data for references
  const { data: internships, isLoading: isLoadingInternships } = useQuery<Internship[]>({
    queryKey: ['/api/internships'],
  });
  
  const { data: students } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });
  
  // Fetch students for the selected internship
  const { data: internshipStudents, isLoading: isLoadingStudents } = useQuery<Student[]>({
    queryKey: ['/api/students', { internshipId: selectedInternship }],
    enabled: !!selectedInternship,
    select: (data) => {
      if (!selectedInternship) return [];
      const internship = internships?.find(i => i.id.toString() === selectedInternship);
      if (!internship) return [];
      return data.filter(student => student.id === internship.studentId);
    }
  });
  
  // Helper functions to get names instead of just IDs
  const getStudentName = (studentId: number) => {
    const student = students?.find(s => s.id === studentId);
    return student?.fullName || `Student #${studentId}`;
  };
  
  const getInternshipName = (internshipId: number) => {
    const internship = internships?.find(i => i.id === internshipId);
    if (!internship) return `Internship #${internshipId}`;
    
    const studentName = getStudentName(internship.studentId);
    return `${studentName} - ${new Date(internship.startDate).toLocaleDateString()} to ${new Date(internship.endDate).toLocaleDateString()}`;
  };
  
  // Create attendance records mutation
  const markAttendanceMutation = useMutation({
    mutationFn: async (data: InsertInternshipAttendance) => {
      const res = await apiRequest("POST", "/api/internship-attendance", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Attendance marked",
        description: "The attendance has been successfully recorded",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/internship-attendance'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to mark attendance",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handler for marking attendance
  const handleMarkAttendance = (studentId: number, status: string) => {
    setStatuses(prev => ({ ...prev, [studentId]: status }));
  };
  
  // Handler for adding remarks
  const handleAddRemarks = (studentId: number, remark: string) => {
    setRemarks(prev => ({ ...prev, [studentId]: remark }));
  };
  
  // Handler for submitting all attendance records
  const handleSubmit = async () => {
    if (!selectedInternship || !internshipStudents) {
      toast({
        title: "Missing information",
        description: "Please select an internship and date",
        variant: "destructive",
      });
      return;
    }
    
    const internshipId = parseInt(selectedInternship);
    
    // Submit attendance records for each student
    for (const student of internshipStudents) {
      const status = statuses[student.id] || "Absent"; // Default to absent if not marked
      const remark = remarks[student.id] || "";
      
      try {
        await markAttendanceMutation.mutateAsync({
          internshipId,
          studentId: student.id,
          date: selectedDate.toISOString().split('T')[0],
          status,
          remarks: remark,
        });
      } catch (error) {
        console.error("Error marking attendance for student", student.id, error);
      }
    }
    
    toast({
      title: "Attendance submitted",
      description: "All attendance records have been saved",
    });
    
    navigate("/internships/attendance");
  };
  
  // Define columns for students table
  const studentsColumns = [
    {
      header: "Student",
      accessorKey: "fullName",
    },
    {
      header: "Status",
      cell: (student: Student) => (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant={statuses[student.id] === "Present" ? "default" : "outline"}
            className={statuses[student.id] === "Present" ? "bg-green-600" : ""}
            onClick={() => handleMarkAttendance(student.id, "Present")}
          >
            <Check className="h-4 w-4 mr-1" />
            Present
          </Button>
          <Button 
            size="sm" 
            variant={statuses[student.id] === "Absent" ? "default" : "outline"}
            className={statuses[student.id] === "Absent" ? "bg-red-600" : ""}
            onClick={() => handleMarkAttendance(student.id, "Absent")}
          >
            <X className="h-4 w-4 mr-1" />
            Absent
          </Button>
          <Button 
            size="sm" 
            variant={statuses[student.id] === "Late" ? "default" : "outline"}
            className={statuses[student.id] === "Late" ? "bg-yellow-600" : ""}
            onClick={() => handleMarkAttendance(student.id, "Late")}
          >
            <Clock className="h-4 w-4 mr-1" />
            Late
          </Button>
        </div>
      ),
    },
    {
      header: "Remarks",
      cell: (student: Student) => (
        <Textarea
          placeholder="Add any remarks or notes..."
          value={remarks[student.id] || ""}
          onChange={(e) => handleAddRemarks(student.id, e.target.value)}
          className="min-h-[80px]"
        />
      ),
    },
  ];

  return (
    <>
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/internships/attendance")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Attendance Records
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-900">Mark Internship Attendance</h1>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select Internship & Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Internship *</label>
              <Select
                value={selectedInternship}
                onValueChange={setSelectedInternship}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Internship" />
                </SelectTrigger>
                <SelectContent>
                  {internships?.map(internship => (
                    <SelectItem key={internship.id} value={internship.id.toString()}>
                      {getInternshipName(internship.id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
              <DatePicker
                date={selectedDate}
                setDate={setSelectedDate}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {selectedInternship && (
        <Card>
          <CardHeader>
            <CardTitle>Mark Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStudents || isLoadingInternships ? (
              <div className="text-center py-8 text-gray-500">
                Loading students...
              </div>
            ) : internshipStudents && internshipStudents.length > 0 ? (
              <>
                <DataTable 
                  columns={studentsColumns} 
                  data={internshipStudents} 
                  isLoading={isLoadingStudents}
                />
                
                <div className="mt-6 flex justify-end">
                  <Button 
                    variant="outline" 
                    className="mr-2"
                    onClick={() => navigate("/internships/attendance")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={markAttendanceMutation.isPending}
                  >
                    {markAttendanceMutation.isPending ? "Saving..." : "Save Attendance"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No students found for this internship
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}