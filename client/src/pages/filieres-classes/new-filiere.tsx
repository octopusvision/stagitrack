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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFiliereSchema, InsertFiliere } from "@shared/schema";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";

// Extend the schema with custom validations if needed
const formSchema = insertFiliereSchema;
type FormValues = z.infer<typeof formSchema>;

export default function NewFiliere() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Setup form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      abbreviation: "",
      numYears: 3, // Default value
    }
  });
  
  // Create filiere mutation
  const filiereMutation = useMutation({
    mutationFn: async (data: InsertFiliere) => {
      const res = await apiRequest("POST", "/api/filieres", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Filière created",
        description: "The filière has been successfully created",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/filieres'] });
      navigate("/filieres-classes");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create filière",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Form submission
  const onSubmit = (data: FormValues) => {
    filiereMutation.mutate(data);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Add New Filière" />
        
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
            
            <h1 className="text-2xl font-bold text-gray-900">Create New Filière</h1>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Filière Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Infirmier Polyvalent" {...field} />
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
                          <Input placeholder="IP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="numYears"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Years *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1} 
                            max={5} 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
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
                      disabled={filiereMutation.isPending}
                    >
                      {filiereMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Filière"
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
