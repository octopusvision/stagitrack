import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { UsersRound, Activity, Calendar, GraduationCap, ClipboardList } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container py-4">
      <p className="text-muted-foreground mb-6">
        Welcome back, {user?.fullName || user?.username}!
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/students">
          <Card className="cursor-pointer hover:bg-accent/10 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                Students Management
              </CardTitle>
              <UsersRound className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Register, view and manage student profiles and information.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/filieres-classes">
          <Card className="cursor-pointer hover:bg-accent/10 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                Filières & Classes
              </CardTitle>
              <GraduationCap className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Manage training programs, specializations and class assignments.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/timetables">
          <Card className="cursor-pointer hover:bg-accent/10 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                Timetables
              </CardTitle>
              <Calendar className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create and manage class schedules and teaching assignments.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/attendance">
          <Card className="cursor-pointer hover:bg-accent/10 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                Attendance Tracking
              </CardTitle>
              <ClipboardList className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track and manage student attendance for classes and activities.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        <Link href="/internships">
          <Card className="cursor-pointer hover:bg-accent/10 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                Internships
              </CardTitle>
              <Activity className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Manage clinical placements, rotations and internship evaluations.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}