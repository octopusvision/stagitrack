import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Filiere, Class } from "@shared/schema";
import { PlusCircle } from "lucide-react";
import { Link } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";

export default function FilieresClassesIndex() {
  const [activeTab, setActiveTab] = useState("filieres");
  
  // Fetch filieres data
  const { data: filieres, isLoading: isLoadingFilieres } = useQuery<Filiere[]>({
    queryKey: ['/api/filieres'],
  });
  
  // Fetch classes data
  const { data: classes, isLoading: isLoadingClasses } = useQuery<Class[]>({
    queryKey: ['/api/classes'],
  });
  
  // Define columns for filieres table
  const filiereColumns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Abbreviation",
      accessorKey: "abbreviation",
    },
    {
      header: "Number of Years",
      accessorKey: "numYears",
    },
  ];
  
  // Define columns for classes table
  const classColumns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Abbreviation",
      accessorKey: "abbreviation",
    },
    {
      header: "Filiere",
      accessorKey: "filiereId",
      cell: (cls: Class) => {
        const filiere = filieres?.find(f => f.id === cls.filiereId);
        return filiere ? `${filiere.name} (${filiere.abbreviation})` : "Unknown";
      },
    },
  ];

  return (
    <AppLayout title="Filieres & Classes Management">
      <div className="mb-6 flex justify-end">
        <div className="flex space-x-2">
          <Button asChild>
            <Link href="/filieres-classes/new-filiere">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Filière
            </Link>
          </Button>
          <Button asChild>
            <Link href="/filieres-classes/new-class">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Class
            </Link>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="filieres">Filières</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="filieres">
          <Card>
            <CardHeader>
              <CardTitle>Filières</CardTitle>
              <CardDescription>
                Manage nursing programs and specializations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={filiereColumns} 
                data={filieres || []} 
                isLoading={isLoadingFilieres}
                searchPlaceholder="Search filières..."
                searchKeys={["name", "abbreviation"]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Classes</CardTitle>
              <CardDescription>
                Manage student classes within each filière
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={classColumns} 
                data={classes || []} 
                isLoading={isLoadingClasses}
                searchPlaceholder="Search classes..."
                searchKeys={["name", "abbreviation"]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
