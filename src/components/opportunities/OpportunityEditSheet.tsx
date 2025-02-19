
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";

interface OpportunityEditSheetProps {
  opportunity: Tables<"opportunities"> & {
    organization: { name: string } | null;
    owner: { username: string; avatar_url: string | null } | null;
    primary_contact: { first_name: string | null; last_name: string | null; email: string | null } | null;
  };
  isOpen: boolean;
  onClose: () => void;
}

export const OpportunityEditSheet = ({ opportunity, isOpen, onClose }: OpportunityEditSheetProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: opportunity.name,
      description: opportunity.description || "",
      expected_value: opportunity.expected_value?.toString() || "",
      probability: opportunity.probability?.toString() || "",
      expected_close_date: opportunity.expected_close_date ? 
        format(new Date(opportunity.expected_close_date), "yyyy-MM-dd") : "",
      next_steps: opportunity.next_steps || "",
    },
  });

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("opportunities")
        .update({
          name: values.name,
          description: values.description,
          expected_value: values.expected_value ? parseFloat(values.expected_value) : null,
          probability: values.probability ? parseInt(values.probability) : null,
          expected_close_date: values.expected_close_date || null,
          next_steps: values.next_steps,
        })
        .eq("id", opportunity.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      toast.success("Opportunity updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating opportunity:", error);
      toast.error("Failed to update opportunity");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Opportunity</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expected_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Value ($)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="probability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Probability (%)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="0" max="100" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expected_close_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Close Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="next_steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next Steps</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
