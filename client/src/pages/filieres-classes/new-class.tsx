import { useState } from "react";
import { useLocation } from "wouter";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertClassSchema, InsertClass } from "@shared/schema";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";

// Extend the schema with custom validations if needed
const formSchema = insertClassSchema;
type FormValues = z.infer<typeof formSchema>;

export default function NewClass() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Fetch filieres for select dropdown
  const { data: filieres, isLoading: isLoadingFilieres } = useQuery({
    queryKey: ['/api/filieres'],
  });
  
  // Setup form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      abbreviation: "",
    }
  });
  
  // Create class mutation
  const classMutation = useMutation({
    mutationFn: async (data: InsertClass) => {
      const res = await apiRequest("POST", "/api/classes", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Class created",
        description: "The class has been successfully created",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/classes'] });
      navigate("/filieres-classes");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create class",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Form submission
  const onSubmit = (data: FormValues) => {
    classMutation.mutate(data);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Add New Class" />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate("/filieres-classes")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Filieres & Classes
            </Button>
            
            <h1 className="text-2xl font-bold text-gray-900">Create New Class</h1>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Class Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="filiereId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Filière *</FormLabel>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={field.value?.toString() || ""}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          disabled={isLoadingFilieres}
                        >
                          <option value="">Select a filière</option>
                          {filieres?.map(filiere => (
                            <option key={filiere.id} value={filiere.id}>
                              {filiere.name} ({filiere.abbreviation})
                            </option>
                          ))}
                        </select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Infirmier Polyvalent 1ère Année" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="abbreviation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Abbreviation *</FormLabel>
                        <FormControl>
                          <Input placeholder="IP1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="mr-2"
                      onClick={() => navigate("/filieres-classes")}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={classMutation.isPending}
                    >
                      {classMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Class"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
