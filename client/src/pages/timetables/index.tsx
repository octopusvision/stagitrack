import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { useQuery } from "@tanstack/react-query";
import { Timetable, Class, Subject, Room, Teacher } from "@shared/schema";
import { PlusCircle } from "lucide-react";
import { Link } from "wouter";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TimetablesIndex() {
  const [selectedClass, setSelectedClass] = useState<string | undefined>(undefined);
  const [selectedDay, setSelectedDay] = useState<string | undefined>(undefined);
  
  // Fetch all timetables
  const { data: timetables, isLoading: isLoadingTimetables } = useQuery<Timetable[]>({
    queryKey: ['/api/timetables'],
  });
  
  // Fetch related data for references
  const { data: classes } = useQuery<Class[]>({
    queryKey: ['/api/classes'],
  });
  
  const { data: subjects } = useQuery<Subject[]>({
    queryKey: ['/api/subjects'],
  });
  
  const { data: rooms } = useQuery<Room[]>({
    queryKey: ['/api/rooms'],
  });
  
  const { data: teachers } = useQuery<Teacher[]>({
    queryKey: ['/api/teachers'],
  });
  
  // Filter timetables based on selected filters
  const filteredTimetables = timetables?.filter(timetable => {
    let classMatch = true;
    let dayMatch = true;
    
    if (selectedClass && selectedClass !== "all") {
      classMatch = timetable.classId.toString() === selectedClass;
    }
    
    if (selectedDay && selectedDay !== "all") {
      dayMatch = timetable.dayOfWeek.toString() === selectedDay;
    }
    
    return classMatch && dayMatch;
  });
  
  // Helper functions to get names instead of just IDs
  const getClassName = (classId: number) => {
    const classObj = classes?.find(c => c.id === classId);
    return classObj?.abbreviation || `Class #${classId}`;
  };
  
  const getSubjectName = (subjectId: number) => {
    const subject = subjects?.find(s => s.id === subjectId);
    return subject?.name || `Subject #${subjectId}`;
  };
  
  const getTeacherName = (teacherId: number) => {
    const teacher = teachers?.find(t => t.id === teacherId);
    return teacher?.fullName || `Teacher #${teacherId}`;
  };
  
  const getRoomName = (roomId: number) => {
    const room = rooms?.find(r => r.id === roomId);
    return room?.name || `Room #${roomId}`;
  };
  
  const getDayName = (dayOfWeek: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayOfWeek];
  };
  
  // Define columns for timetables table
  const timetableColumns = [
    {
      header: "Day",
      accessorKey: "dayOfWeek",
      cell: (record: Timetable) => getDayName(record.dayOfWeek),
    },
    {
      header: "Class",
      accessorKey: "classId",
      cell: (record: Timetable) => getClassName(record.classId),
    },
    {
      header: "Time",
      accessorKey: "startTime",
      cell: (record: Timetable) => `${record.startTime} - ${record.endTime}`,
    },
    {
      header: "Subject",
      accessorKey: "subjectId",
      cell: (record: Timetable) => getSubjectName(record.subjectId),
    },
    {
      header: "Teacher",
      accessorKey: "teacherId",
      cell: (record: Timetable) => getTeacherName(record.teacherId),
    },
    {
      header: "Room",
      accessorKey: "roomId",
      cell: (record: Timetable) => getRoomName(record.roomId),
    },
  ];

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button asChild>
          <Link href="/timetables/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Timetable Entry
          </Link>
        </Button>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Timetables</CardTitle>
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
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes?.map(cls => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.abbreviation} - {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
              <Select
                value={selectedDay}
                onValueChange={setSelectedDay}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Days</SelectItem>
                  <SelectItem value="0">Sunday</SelectItem>
                  <SelectItem value="1">Monday</SelectItem>
                  <SelectItem value="2">Tuesday</SelectItem>
                  <SelectItem value="3">Wednesday</SelectItem>
                  <SelectItem value="4">Thursday</SelectItem>
                  <SelectItem value="5">Friday</SelectItem>
                  <SelectItem value="6">Saturday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Class Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={timetableColumns} 
            data={filteredTimetables || []} 
            isLoading={isLoadingTimetables}
            searchPlaceholder="Search timetables..."
          />
        </CardContent>
      </Card>
    </>
  );
}
