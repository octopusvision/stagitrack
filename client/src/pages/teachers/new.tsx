import { useState } from "react";
import { useLocation } from "wouter";
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
import { insertTeacherSchema, InsertTeacher, User } from "@shared/schema";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";

// Extend the schema with custom validations if needed
const formSchema = insertTeacherSchema;

export default function NewTeacher() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Fetch users for dropdown
  const { data: users } = useQuery<User[]>({
    queryKey: ['/api/users']
  });

  // Setup form
  const form = useForm<InsertTeacher>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      subject: "",
    }
  });
  
  // Create teacher mutation
  const teacherMutation = useMutation({
    mutationFn: async (data: InsertTeacher) => {
      const res = await apiRequest("POST", "/api/teachers", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Teacher created",
        description: "The teacher has been successfully created",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/teachers'] });
      navigate("/teachers");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create teacher",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Form submission
  const onSubmit = (data: InsertTeacher) => {
    teacherMutation.mutate(data);
  };

  // Filter users to only show those with teacher role or no role assigned yet
  const filteredUsers = users?.filter(user => 
    user.role === 'teacher' || 
    !users.some(u => u.id !== user.id && u.role === 'teacher')
  );

  return (
    <>
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/teachers")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Teachers
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-900">Create New Teacher</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Teacher Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Account *</FormLabel>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={field.value?.toString() || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    >
                      <option value="">Select a user</option>
                      {filteredUsers?.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.fullName} ({user.username})
                        </option>
                      ))}
                    </select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter teacher's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter teacher's subject" {...field} />
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
                  onClick={() => navigate("/teachers")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={teacherMutation.isPending}
                >
                  {teacherMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Teacher"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}