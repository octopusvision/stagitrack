import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { InternshipAttendance, Internship, Student } from "@shared/schema";
import { Calendar, Pencil } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

export default function InternshipAttendanceIndex() {
  const [selectedInternship, setSelectedInternship] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Fetch all internship attendance records
  const { data: attendances, isLoading: isLoadingAttendances } = useQuery<InternshipAttendance[]>({
    queryKey: ['/api/internship-attendance', { internshipId: selectedInternship, date: selectedDate?.toISOString().split('T')[0] }],
    // Only fetch if we have both an internship and date selected
    enabled: Boolean(selectedInternship && selectedDate),
  });
  
  // Fetch related data for references
  const { data: internships, isLoading: isLoadingInternships } = useQuery<Internship[]>({
    queryKey: ['/api/internships'],
  });
  
  const { data: students } = useQuery<Student[]>({
    queryKey: ['/api/students'],
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
  
  // Define columns for attendance table
  const attendanceColumns = [
    {
      header: "Student",
      accessorKey: "studentId",
      cell: (record: InternshipAttendance) => getStudentName(record.studentId),
    },
    {
      header: "Date",
      accessorKey: "date",
      cell: (record: InternshipAttendance) => new Date(record.date).toLocaleDateString(),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (record: InternshipAttendance) => {
        const statusColors = {
          Present: "bg-green-100 text-green-800",
          Absent: "bg-red-100 text-red-800",
          Late: "bg-yellow-100 text-yellow-800",
        };
        return (
          <Badge className={statusColors[record.status || "Absent"]}>
            {record.status || "Absent"}
          </Badge>
        );
      },
    },
    {
      header: "Remarks",
      accessorKey: "remarks",
      cell: (record: InternshipAttendance) => record.remarks || "-",
    },
    {
      header: "Actions",
      cell: (record: InternshipAttendance) => (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/internships/attendance/edit/${record.id}`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Internship Attendance</h1>
        <Button asChild>
          <Link href="/internships/attendance/mark">
            <Calendar className="mr-2 h-4 w-4" />
            Mark Attendance
          </Link>
        </Button>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Internship</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <DatePicker
                date={selectedDate}
                setDate={setSelectedDate}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedInternship || !selectedDate ? (
            <div className="text-center py-8 text-gray-500">
              Please select an internship and date to view attendance records
            </div>
          ) : isLoadingAttendances || isLoadingInternships ? (
            <div className="text-center py-8 text-gray-500">
              Loading attendance records...
            </div>
          ) : attendances && attendances.length > 0 ? (
            <DataTable 
              columns={attendanceColumns} 
              data={attendances} 
              isLoading={isLoadingAttendances}
              searchPlaceholder="Search attendance records..."
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No attendance records found for the selected criteria
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}