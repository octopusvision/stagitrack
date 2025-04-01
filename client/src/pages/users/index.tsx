import { useUsers } from "@/hooks/use-users";
import { useAuth } from "@/hooks/use-auth";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { Loader2, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { User } from "@shared/schema";

export default function UsersPage() {
  const { data: users, isLoading, error } = useUsers();
  const { user: currentUser } = useAuth();

  // Only admin users should see this page
  if (currentUser?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] space-y-4">
        <UserRound className="w-16 h-16 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Access Denied</h1>
        <p className="text-muted-foreground text-center max-w-md">
          You don't have permission to access the user management page.
        </p>
        <Button asChild>
          <Link href="/">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const columns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Username",
      accessorKey: "username",
    },
    {
      header: "Full Name",
      accessorKey: "fullName",
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: (user: User) => user.email || "—",
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: (user: User) => {
        let badgeVariant: "default" | "outline" | "secondary" | "destructive" = "outline";
        
        switch (user.role) {
          case "admin":
            badgeVariant = "default";
            break;
          case "teacher":
            badgeVariant = "secondary";
            break;
          case "student":
            badgeVariant = "outline";
            break;
        }
        
        return <Badge variant={badgeVariant}>{user.role}</Badge>;
      },
    },
  ];

  return (
    <div className="container space-y-6 p-4 md:p-8">
      <PageHeader 
        title="User Management" 
        description="Manage platform users (Admin, Teachers, Students)"
        actions={
          <Button asChild>
            <Link href="/users/new">
              New User
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-border" />
        </div>
      ) : error ? (
        <div className="bg-destructive/10 p-4 rounded-md text-destructive text-center">
          Error loading users: {error.message}
        </div>
      ) : (
        <DataTable 
          data={users || []} 
          columns={columns} 
          searchKey="username"
          searchPlaceholder="Search by username..."
        />
      )}
    </div>
  );
}