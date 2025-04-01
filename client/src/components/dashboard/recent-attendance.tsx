import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Attendance } from "@shared/schema";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";

export function RecentAttendance() {
  const { data: attendances, isLoading, error } = useQuery<Attendance[]>({
    queryKey: ['/api/attendance'],
  });
  
  // Statuses and their corresponding styles
  const statusStyles = {
    Present: "bg-green-100 text-green-800",
    Absent: "bg-red-100 text-red-800",
    Late: "bg-yellow-100 text-yellow-800",
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="lg:col-span-2 bg-white shadow rounded-lg">
      <CardHeader className="p-6 border-b border-gray-200 flex justify-between items-center">
        <CardTitle className="text-lg font-medium text-gray-900">Recent Attendance</CardTitle>
        <Link href="/attendance">
          <a className="text-sm font-medium text-primary-600 hover:text-primary-500">View all</a>
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    <div className="flex justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-red-500">
                    Failed to load attendance data
                  </TableCell>
                </TableRow>
              ) : attendances && attendances.length > 0 ? (
                attendances.slice(0, 4).map((attendance) => (
                  <TableRow key={attendance.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            {getInitials("Student Name")}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Student Name</div>
                          <div className="text-sm text-gray-500">ID: {attendance.studentId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">Class Name</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">
                        {new Date(attendance.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyles[attendance.status]}>
                        {attendance.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/attendance/${attendance.id}`}>
                        <a className="text-primary-600 hover:text-primary-900">Edit</a>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                    No recent attendance records
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
