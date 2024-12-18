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

    // Ensure each prospect has a company_name before validation
    const validatedProspects = prospects.map(prospect => {
      if (!prospect || typeof prospect !== 'object' || !('company_name' in prospect)) {
        throw new Error('Invalid prospect data: missing company_name');
      }
      return prospectSchema.parse(prospect);
    });

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

// Types for CrewAI configuration
export interface CrewAIConfig {
  search_keywords: string;
  csv_file_path?: string;
  services_offered: string;
  company_name: string;
}

// Function to prepare data for CrewAI
export const prepareCrewAIRequest = (config: CrewAIConfig) => {
  return {
    agents_config: {
      lead_researcher: {
        role: "Lead Research Specialist",
        goal: `Identify and gather comprehensive information on potential leads using ${config.search_keywords}` +
          (config.csv_file_path ? ` and analyze data from ${config.csv_file_path}` : ""),
        backstory: "As a seasoned lead researcher, you excel at uncovering valuable prospects and extracting crucial information from various sources."
      },
      profile_analyzer: {
        role: "Lead Profile Analyst",
        goal: `Analyze gathered data to create comprehensive lead profiles and assess fit for ${config.services_offered}`,
        backstory: "With a keen eye for detail and a deep understanding of business dynamics, you excel at transforming raw data into insightful lead profiles."
      },
      email_crafter: {
        role: "Personalized Email Specialist",
        goal: `Create tailored email drafts for each lead, highlighting the value proposition of ${config.company_name} and relevant ${config.services_offered}`,
        backstory: "As a master of persuasive communication, you have a talent for crafting compelling, personalized emails that resonate with decision-makers."
      },
      data_compiler: {
        role: "Data Integration Expert",
        goal: "Compile all gathered and created information into a structured JSON file that matches the prospects table schema",
        backstory: "With your extensive experience in data management and integration, you excel at organizing complex information into structured formats."
      }
    },
    tasks_config: {
      // ... Task configurations will be added in the next step
    }
  };
};