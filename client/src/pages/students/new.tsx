import { useState } from "react";
import { useLocation } from "wouter";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertStudentSchema, InsertStudent } from "@shared/schema";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Upload } from "lucide-react";

// Extend the insert schema with form-specific validations
const formSchema = insertStudentSchema.extend({
  status: z.enum(["Actif", "Suspendu", "Diplômé", "Exclu"]).optional().default("Actif"),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewStudent() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Fetch filieres and classes for select dropdowns
  const { data: filieres } = useQuery({
    queryKey: ['/api/filieres'],
  });
  
  const { data: classes, refetch: refetchClasses } = useQuery({
    queryKey: ['/api/classes'],
  });
  
  // Filter classes by selected filiere
  const [selectedFiliereId, setSelectedFiliereId] = useState<number | null>(null);
  
  const filteredClasses = classes?.filter(c => 
    selectedFiliereId ? c.filiereId === selectedFiliereId : true
  );
  
  // Setup form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      idCardNumber: "",
      phone: "",
      address: "",
      email: "",
      status: "Actif",
      documents: "",
    }
  });
  
  // Handle filiere selection change
  const handleFiliereChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filiereId = e.target.value ? Number(e.target.value) : null;
    setSelectedFiliereId(filiereId);
    form.setValue("filiereId", filiereId || undefined);
    form.setValue("classId", undefined); // Reset class when filiere changes
    refetchClasses(); // Refetch classes based on new filiere
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      
      // Store filename in documents field
      form.setValue("documents", e.target.files[0].name);
    }
  };
  
  // Create student mutation
  const studentMutation = useMutation({
    mutationFn: async (data: InsertStudent) => {
      const res = await apiRequest("POST", "/api/students", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Student created",
        description: "The student has been successfully registered",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/students'] });
      navigate("/students");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create student",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Form submission
  const onSubmit = (data: FormValues) => {
    studentMutation.mutate(data);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Add New Student" />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => navigate("/students")}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Students
            </Button>
            
            <h1 className="text-2xl font-bold text-gray-900">Register New Student</h1>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="idCardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID Card Number</FormLabel>
                          <FormControl>
                            <Input placeholder="AB123456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+212 612345678" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Student's address" 
                              className="min-h-[80px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Class Assignment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="filiereId">Filière</Label>
                      <select
                        id="filiereId"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                        onChange={handleFiliereChange}
                      >
                        <option value="">Select a filière</option>
                        {filieres?.map(filiere => (
                          <option key={filiere.id} value={filiere.id}>
                            {filiere.name} ({filiere.abbreviation})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="classId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class</FormLabel>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={!selectedFiliereId}
                            value={field.value?.toString() || ""}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          >
                            <option value="">Select a class</option>
                            {filteredClasses?.map(cls => (
                              <option key={cls.id} value={cls.id}>
                                {cls.abbreviation} - {cls.name}
                              </option>
                            ))}
                          </select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Student Status */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={field.value}
                          onChange={field.onChange}
                        >
                          <option value="Actif">Actif</option>
                          <option value="Suspendu">Suspendu</option>
                          <option value="Diplômé">Diplômé</option>
                          <option value="Exclu">Exclu</option>
                        </select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Document Upload */}
                  <div>
                    <Label>Documents</Label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                          >
                            <span>Upload files</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, PDF up to 10MB
                        </p>
                        {selectedFile && (
                          <p className="text-sm text-gray-800 bg-gray-100 p-2 rounded mt-2">
                            Selected: {selectedFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="mr-2"
                      onClick={() => navigate("/students")}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={studentMutation.isPending}
                    >
                      {studentMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Student"
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
