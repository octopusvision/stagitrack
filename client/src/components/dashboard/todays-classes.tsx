import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Timetable, Class, Subject, Room, Teacher } from "@shared/schema";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";

export function TodaysClasses() {
  // Current day of the week (0 = Sunday, 1 = Monday, ...)
  const today = new Date().getDay();
  
  const { data: timetables, isLoading: isLoadingTimetables } = useQuery<Timetable[]>({
    queryKey: ['/api/timetables', { dayOfWeek: today }],
  });
  
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

  // Function to get class abbreviation by id
  const getClassAbbr = (classId: number) => {
    const classObj = classes?.find(c => c.id === classId);
    return classObj?.abbreviation || "Unknown Class";
  };
  
  // Function to get subject name by id
  const getSubjectName = (subjectId: number) => {
    const subject = subjects?.find(s => s.id === subjectId);
    return subject?.name || "Unknown Subject";
  };
  
  // Function to get teacher name by id
  const getTeacherName = (teacherId: number) => {
    const teacher = teachers?.find(t => t.id === teacherId);
    return teacher?.fullName || "Unknown Teacher";
  };
  
  // Function to get room name by id
  const getRoomName = (roomId: number) => {
    const room = rooms?.find(r => r.id === roomId);
    return room?.name || "Unknown Room";
  };

  return (
    <Card className="mt-8 bg-white shadow rounded-lg">
      <CardHeader className="p-6 border-b border-gray-200">
        <CardTitle className="text-lg font-medium text-gray-900">Today's Classes</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingTimetables ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    <div className="flex justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : !timetables || timetables.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                    No classes scheduled for today
                  </TableCell>
                </TableRow>
              ) : (
                timetables.map((timetable) => (
                  <TableRow key={timetable.id}>
                    <TableCell>
                      <div className="text-sm font-medium text-gray-900">
                        {getClassAbbr(timetable.classId)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {timetable.startTime} - {timetable.endTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {getSubjectName(timetable.subjectId)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {getTeacherName(timetable.teacherId)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {getRoomName(timetable.roomId)}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-gray-500">
                      <Link href={`/attendance/mark?classId=${timetable.classId}`}>
                        <a className="text-primary-600 hover:text-primary-900 mr-3">Track Attendance</a>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
