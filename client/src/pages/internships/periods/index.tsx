import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PeriodeDeStage } from "@shared/schema";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPeriodeDeStageSchema, InsertPeriodeDeStage } from "@shared/schema";
import { DatePicker } from "@/components/ui/date-picker";
import { z } from "zod";

// Extend the schema to use Date objects with client-side validation
const formSchema = insertPeriodeDeStageSchema.extend({
  startDate: z.date(),
  endDate: z.date(),
}).refine(data => data.startDate < data.endDate, {
  message: "End date must be after start date",
  path: ["endDate"],
});

type FormValues = z.infer<typeof formSchema>;

export default function PeriodsIndex() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodeDeStage | null>(null);
  
  // Fetch periods data
  const { data: periods, isLoading: isLoadingPeriods } = useQuery<PeriodeDeStage[]>({
    queryKey: ['/api/periode-de-stages'],
  });
  
  // Setup form for adding a new period
  const addForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Default to 1 month later
    }
  });
  
  // Setup form for editing a period
  const editForm = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    }
  });
  
  // Create period mutation
  const createPeriodMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Convert Date objects to ISO strings for the API
      const apiData = {
        ...data,
        startDate: data.startDate.toISOString().split('T')[0],
        endDate: data.endDate.toISOString().split('T')[0],
      };
      
      const res = await apiRequest("POST", "/api/periode-de-stages", apiData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Period created",
        description: "The internship period has been successfully created",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/periode-de-stages'] });
      setIsAddDialogOpen(false);
      addForm.reset({
        name: "",
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create period",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Update period mutation
  const updatePeriodMutation = useMutation({
    mutationFn: async (data: { id: number; period: FormValues }) => {
      // Convert Date objects to ISO strings for the API
      const apiData = {
        ...data.period,
        startDate: data.period.startDate.toISOString().split('T')[0],
        endDate: data.period.endDate.toISOString().split('T')[0],
      };
      
      const res = await apiRequest("PUT", `/api/periode-de-stages/${data.id}`, apiData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Period updated",
        description: "The internship period has been successfully updated",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/periode-de-stages'] });
      setIsEditDialogOpen(false);
      setSelectedPeriod(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update period",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Delete period mutation
  const deletePeriodMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/periode-de-stages/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Period deleted",
        description: "The internship period has been successfully deleted",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/periode-de-stages'] });
      setIsDeleteDialogOpen(false);
      setSelectedPeriod(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete period",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Form submissions
  const onAddSubmit = (data: FormValues) => {
    createPeriodMutation.mutate(data);
  };
  
  const onEditSubmit = (data: FormValues) => {
    if (selectedPeriod) {
      updatePeriodMutation.mutate({ id: selectedPeriod.id, period: data });
    }
  };
  
  const handleEdit = (period: PeriodeDeStage) => {
    setSelectedPeriod(period);
    // Convert ISO date strings to Date objects for the form
    editForm.reset({
      name: period.name,
      startDate: new Date(period.startDate),
      endDate: new Date(period.endDate),
    });
    setIsEditDialogOpen(true);
  };
  
  const handleDelete = (period: PeriodeDeStage) => {
    setSelectedPeriod(period);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedPeriod) {
      deletePeriodMutation.mutate(selectedPeriod.id);
    }
  };
  
  // Define columns for periods table
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Start Date",
      accessorKey: "startDate",
      cell: (period: PeriodeDeStage) => new Date(period.startDate).toLocaleDateString(),
    },
    {
      header: "End Date",
      accessorKey: "endDate",
      cell: (period: PeriodeDeStage) => new Date(period.endDate).toLocaleDateString(),
    },
    {
      header: "Duration",
      cell: (period: PeriodeDeStage) => {
        const start = new Date(period.startDate);
        const end = new Date(period.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} days`;
      },
    },
    {
      header: "Actions",
      cell: (period: PeriodeDeStage) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleEdit(period)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDelete(period)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Internship Periods</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Period
          </Button>
          <Button variant="outline" asChild>
            <Link href="/internships">
              Back to Internships
            </Link>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Internship Periods</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={periods || []} 
            isLoading={isLoadingPeriods}
            searchPlaceholder="Search periods..."
            searchKeys={["name"]}
          />
        </CardContent>
      </Card>
      
      {/* Add Period Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Internship Period</DialogTitle>
            <DialogDescription>
              Add a new internship period for students.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...addForm}>
            <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
              <FormField
                control={addForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter period name (e.g. Spring 2025)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={addForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date *</FormLabel>
                      <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date *</FormLabel>
                      <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createPeriodMutation.isPending}
                >
                  {createPeriodMutation.isPending ? "Creating..." : "Create Period"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Period Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Internship Period</DialogTitle>
            <DialogDescription>
              Update internship period details.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter period name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date *</FormLabel>
                      <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date *</FormLabel>
                      <DatePicker
                        date={field.value}
                        setDate={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={updatePeriodMutation.isPending}
                >
                  {updatePeriodMutation.isPending ? "Updating..." : "Update Period"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this internship period? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDelete}
              disabled={deletePeriodMutation.isPending}
            >
              {deletePeriodMutation.isPending ? "Deleting..." : "Delete Period"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}