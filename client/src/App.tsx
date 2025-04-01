import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";

// Students
import StudentsIndex from "@/pages/students/index";
import NewStudent from "@/pages/students/new";
import StudentDetails from "@/pages/students/[id]";

// Filières & Classes
import FilieresClassesIndex from "@/pages/filieres-classes/index";
import NewFiliere from "@/pages/filieres-classes/new-filiere";
import NewClass from "@/pages/filieres-classes/new-class";

// Attendance
import AttendanceIndex from "@/pages/attendance/index";
import MarkAttendance from "@/pages/attendance/mark";

// Internships
import InternshipsIndex from "@/pages/internships/index";
import NewInternship from "@/pages/internships/new";

// Timetables
import TimetablesIndex from "@/pages/timetables/index";
import NewTimetable from "@/pages/timetables/new";

// Teachers
import TeachersIndex from "@/pages/teachers/index";
import NewTeacher from "@/pages/teachers/new";

// Users
import UsersIndex from "@/pages/users/index";
import NewUser from "@/pages/users/new";

// Internship Services
import ServicesIndex from "@/pages/internships/services/index";

// Internship Periods
import PeriodsIndex from "@/pages/internships/periods/index";

// Internship Attendance
import InternshipAttendanceIndex from "@/pages/internships/attendance/index";
import MarkInternshipAttendance from "@/pages/internships/attendance/mark";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/students" component={StudentsIndex} />
      <ProtectedRoute path="/students/new" component={NewStudent} />
      <ProtectedRoute path="/students/:id" component={StudentDetails} />
      <ProtectedRoute path="/teachers" component={TeachersIndex} />
      <ProtectedRoute path="/teachers/new" component={NewTeacher} />
      <ProtectedRoute path="/filieres-classes" component={FilieresClassesIndex} />
      <ProtectedRoute path="/filieres-classes/new-filiere" component={NewFiliere} />
      <ProtectedRoute path="/filieres-classes/new-class" component={NewClass} />
      <ProtectedRoute path="/attendance" component={AttendanceIndex} />
      <ProtectedRoute path="/attendance/mark" component={MarkAttendance} />
      <ProtectedRoute path="/internships" component={InternshipsIndex} />
      <ProtectedRoute path="/internships/new" component={NewInternship} />
      <ProtectedRoute path="/internships/services" component={ServicesIndex} />
      <ProtectedRoute path="/internships/periods" component={PeriodsIndex} />
      <ProtectedRoute path="/internships/attendance" component={InternshipAttendanceIndex} />
      <ProtectedRoute path="/internships/attendance/mark" component={MarkInternshipAttendance} />
      <ProtectedRoute path="/timetables" component={TimetablesIndex} />
      <ProtectedRoute path="/timetables/new" component={NewTimetable} />
      <ProtectedRoute path="/users" component={UsersIndex} />
      <ProtectedRoute path="/users/new" component={NewUser} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
