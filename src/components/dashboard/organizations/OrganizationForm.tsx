
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const organizationFormSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  industry: z.string().optional(),
  website: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["lead", "customer", "partner", "inactive"]).default("lead"),
});

type OrganizationFormValues = z.infer<typeof organizationFormSchema>;

interface OrganizationFormProps {
  onComplete: () => void;
  initialData?: Tables<"organizations">;
  mode: "create" | "edit";
}

export const OrganizationForm = ({ onComplete, initialData, mode }: OrganizationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      industry: initialData?.industry || "",
      website: initialData?.website || "",
      description: initialData?.description || "",
      status: initialData?.status || "lead",
    },
  });

  const onSubmit = async (values: OrganizationFormValues) => {
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        const { error } = await supabase.from("organizations").insert({
          name: values.name,
          industry: values.industry,
          website: values.website,
          description: values.description,
          status: values.status,
        });
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Organization created successfully",
        });
      } else {
        if (!initialData?.id) {
          throw new Error("Organization ID is required for updates");
        }
        const { error } = await supabase
          .from("organizations")
          .update({
            name: values.name,
            industry: values.industry,
            website: values.website,
            description: values.description,
            status: values.status,
          })
          .eq("id", initialData.id);
          
        if (error) throw error;
        toast({
          title: "Success",
          description: "Organization updated successfully",
        });
      }
      onComplete();
    } catch (error) {
      console.error("Error submitting organization:", error);
      toast({
        title: "Error",
        description: `Failed to ${mode === "create" ? "create" : "update"} organization`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name*</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter organization name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Technology, Healthcare, Finance" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Brief company description"
                  className="min-h-24"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : mode === "create" ? "Create Organization" : "Update Organization"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
