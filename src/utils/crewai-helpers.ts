import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Zod schema for validating CrewAI prospect data
export const prospectSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  website: z.string().url().nullable(),
  description: z.string().nullable(),
  fit_score: z.number().min(0).max(100).nullable(),
  potential_services: z.string().nullable(),
  fit_summary: z.string().nullable(),
  draft_email: z.string().nullable(),
  contact_name: z.string().nullable(),
  contact_email: z.string().email().nullable(),
  contact_phone: z.string().nullable(),
  linkedin_url: z.string().url().nullable(),
  ai_intro: z.string().nullable(),
  ai_fit_analysis: z.string().nullable(),
  ai_next_steps: z.string().nullable(),
});

export type CrewAIProspect = z.infer<typeof prospectSchema>;

export const processCrewAIResponse = async (
  crewAIResponse: unknown
): Promise<boolean> => {
  try {
    // Parse and validate the CrewAI response
    const prospects = Array.isArray(crewAIResponse) 
      ? crewAIResponse 
      : [crewAIResponse];

    const validatedProspects = prospects.map(prospect => 
      prospectSchema.parse(prospect)
    );

    // Insert prospects into the database
    const { error } = await supabase
      .from("prospects")
      .insert(validatedProspects);

    if (error) {
      console.error("Error inserting prospects:", error);
      toast({
        title: "Error",
        description: "Failed to save prospects to database",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Success",
      description: `Successfully imported ${validatedProspects.length} prospects`,
    });
    return true;

  } catch (error) {
    console.error("Error processing CrewAI response:", error);
    toast({
      title: "Error",
      description: "Invalid prospect data received from CrewAI",
      variant: "destructive",
    });
    return false;
  }
};