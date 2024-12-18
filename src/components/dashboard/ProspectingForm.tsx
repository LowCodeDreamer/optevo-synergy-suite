import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { agentConfigSchema, type AgentConfig } from "@/integrations/crewai/agents";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { processCrewAIResponse } from "@/utils/crewai-helpers";
import { useToast } from "@/hooks/use-toast";

export const ProspectingForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<AgentConfig>({
    resolver: zodResolver(agentConfigSchema),
    defaultValues: {
      search_keywords: "",
      services_offered: "",
      company_name: "",
    },
  });

  const onSubmit = async (data: AgentConfig) => {
    setIsLoading(true);
    try {
      // TODO: Replace this with actual CrewAI integration
      // This is a placeholder to demonstrate the flow
      const mockResponse = [{
        company_name: "Example Corp",
        website: "https://example.com",
        description: "An example company",
        fit_score: 85,
        potential_services: "Web Development, AI Integration",
        contact_name: "John Doe",
        contact_email: "john@example.com",
      }];

      const success = await processCrewAIResponse(mockResponse);
      
      if (success) {
        toast({
          title: "Success",
          description: "Prospects have been generated and saved",
        });
        form.reset();
      }
    } catch (error) {
      console.error("Error running prospecting agents:", error);
      toast({
        title: "Error",
        description: "Failed to generate prospects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="search_keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search Keywords</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter keywords to search for prospects (e.g., industry, location, company size)"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Keywords help our AI agents find relevant prospects
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="services_offered"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Services Offered</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Web Development, AI Integration, Consulting"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Services you want to offer to prospects
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Company Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your company name"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Used in email templates and communications
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Generating Prospects..." : "Generate Prospects"}
        </Button>
      </form>
    </Form>
  );
};