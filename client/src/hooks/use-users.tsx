import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useUsers() {
  const { toast } = useToast();
  
  return useQuery<User[], Error>({
    queryKey: ["/api/users"],
    onError: (error: Error) => {
      toast({
        title: "Error fetching users",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}