import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { Attendance, Student, Class } from "@shared/schema";
import { PlusCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

export default function AttendanceIndex() {
  const [, navigate] = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>("");
  
  // Fetch all attendance records
  const { data: attendances, isLoading: isLoadingAttendances } = useQuery<Attendance[]>({
    queryKey: ['/api/attendance'],
  });
  
  // Fetch students for reference
  const { data: students } = useQuery<Student[]>({
    queryKey: ['/api/students'],
  });
  
  // Fetch classes for filtering
  const { data: classes } = useQuery<Class[]>({
    queryKey: ['/api/classes'],
  });
  
  // Filtered attendance records based on selected date and class
  const filteredAttendances = attendances?.filter(attendance => {
    let dateMatch = true;
    let classMatch = true;
    
    if (selectedDate) {
      const attendanceDate = new Date(attendance.date);
      dateMatch = attendanceDate.toDateString() === selectedDate.toDateString();
    }
    
    if (selectedClass) {
      const student = students?.find(s => s.id === attendance.studentId);
      classMatch = student?.classId?.toString() === selectedClass;
    }
    
    return dateMatch && classMatch;
  });
  
  // Helper function to get student name by ID
  const getStudentName = (studentId: number) => {
    const student = students?.find(s => s.id === studentId);
    return student?.fullName || `Student #${studentId}`;
  };
  
  // Helper function to get student class by ID
  const getStudentClass = (studentId: number) => {
    const student = students?.find(s => s.id === studentId);
    if (!student?.classId) return "N/A";
    const classItem = classes?.find(c => c.id === student.classId);
    return classItem?.abbreviation || `Class #${student.classId}`;
  };
  
  // Define columns for attendance table
  const attendanceColumns = [
    {
      header: "Date",
      accessorKey: "date",
      cell: (record: Attendance) => new Date(record.date).toLocaleDateString(),
    },
    {
      header: "Student",
      accessorKey: "studentId",
      cell: (record: Attendance) => getStudentName(record.studentId),
    },
    {
      header: "Class",
      accessorKey: "studentId",
      cell: (record: Attendance) => getStudentClass(record.studentId),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (record: Attendance) => {
        const statusColors: Record<string, string> = {
          Present: "bg-green-100 text-green-800",
          Absent: "bg-red-100 text-red-800",
          Late: "bg-yellow-100 text-yellow-800",
        };
        return (
          <Badge className={statusColors[record.status || "Present"]}>
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

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Records</h1>
        <Button asChild>
          <Link href="/attendance/mark">
            <PlusCircle className="mr-2 h-4 w-4" />
            Mark Attendance
          </Link>
        </Button>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <DatePicker
                date={selectedDate}
                setDate={setSelectedDate}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
              <Select
                value={selectedClass}
                onValueChange={setSelectedClass}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Classes</SelectItem>
                  {classes?.map(cls => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.abbreviation} - {cls.name}
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
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={attendanceColumns} 
            data={filteredAttendances || []} 
            isLoading={isLoadingAttendances}
            searchPlaceholder="Search attendance records..."
          />
        </CardContent>
      </Card>
    </>
  );
}
