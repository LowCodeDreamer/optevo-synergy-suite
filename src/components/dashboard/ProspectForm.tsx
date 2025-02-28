
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

const prospectFormSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  website: z.string().optional(),
  description: z.string().optional(),
  contact_name: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal("")),
  contact_phone: z.string().optional(),
  linkedin_url: z.string().optional(),
});

type ProspectFormValues = z.infer<typeof prospectFormSchema>;

interface ProspectFormProps {
  onComplete: () => void;
  initialData?: Tables<"prospects">;
  mode: "create" | "edit";
}

export const ProspectForm = ({ onComplete, initialData, mode }: ProspectFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProspectFormValues>({
    resolver: zodResolver(prospectFormSchema),
    defaultValues: {
      company_name: initialData?.company_name || "",
      website: initialData?.website || "",
      description: initialData?.description || "",
      contact_name: initialData?.contact_name || "",
      contact_email: initialData?.contact_email || "",
      contact_phone: initialData?.contact_phone || "",
      linkedin_url: initialData?.linkedin_url || "",
    },
  });

  const onSubmit = async (values: ProspectFormValues) => {
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        // Fix: Ensure company_name is provided when creating a new prospect
        const { error } = await supabase.from("prospects").insert({
          company_name: values.company_name,
          website: values.website,
          description: values.description,
          contact_name: values.contact_name,
          contact_email: values.contact_email,
          contact_phone: values.contact_phone,
          linkedin_url: values.linkedin_url,
        });
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Prospect created successfully",
        });
      } else {
        if (!initialData?.id) {
          throw new Error("Prospect ID is required for updates");
        }
        const { error } = await supabase
          .from("prospects")
          .update({
            company_name: values.company_name,
            website: values.website,
            description: values.description,
            contact_name: values.contact_name,
            contact_email: values.contact_email,
            contact_phone: values.contact_phone,
            linkedin_url: values.linkedin_url,
          })
          .eq("id", initialData.id);
          
        if (error) throw error;
        toast({
          title: "Success",
          description: "Prospect updated successfully",
        });
      }
      onComplete();
    } catch (error) {
      console.error("Error submitting prospect:", error);
      toast({
        title: "Error",
        description: `Failed to ${mode === "create" ? "create" : "update"} prospect`,
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
          name="company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name*</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter company name" />
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

        <div className="border-t pt-4 mt-4">
          <h3 className="text-md font-medium mb-3">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contact_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Full name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="email@example.com" type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Phone number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="linkedin_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="LinkedIn profile URL" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : mode === "create" ? "Create Prospect" : "Update Prospect"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
