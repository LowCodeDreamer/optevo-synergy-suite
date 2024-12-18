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

    // Validate each prospect and ensure required fields
    const validatedProspects = prospects.map(prospect => {
      if (!prospect || typeof prospect !== 'object') {
        throw new Error('Invalid prospect data: not an object');
      }

      // Cast to unknown first, then to a partial prospect type
      const prospectData = prospect as Partial<CrewAIProspect>;
      
      if (!prospectData.company_name) {
        throw new Error('Invalid prospect data: missing company_name');
      }

      // Create a complete prospect object with all required fields
      const completeProspect: CrewAIProspect = {
        company_name: prospectData.company_name,
        website: prospectData.website ?? null,
        description: prospectData.description ?? null,
        fit_score: prospectData.fit_score ?? null,
        potential_services: prospectData.potential_services ?? null,
        fit_summary: prospectData.fit_summary ?? null,
        draft_email: prospectData.draft_email ?? null,
        contact_name: prospectData.contact_name ?? null,
        contact_email: prospectData.contact_email ?? null,
        contact_phone: prospectData.contact_phone ?? null,
        linkedin_url: prospectData.linkedin_url ?? null,
        ai_intro: prospectData.ai_intro ?? null,
        ai_fit_analysis: prospectData.ai_fit_analysis ?? null,
        ai_next_steps: prospectData.ai_next_steps ?? null,
      };
      
      return prospectSchema.parse(completeProspect);
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
      search_potential_leads: {
        description: `Use ${config.search_keywords} to find potential companies and decision-makers. Utilize web search tools to identify promising leads based on industry, company size, and relevance to ${config.services_offered}.`,
        expected_output: "A list of potential leads with basic information including company names, websites, and key contact details.",
        agent: "lead_researcher"
      },
      analyze_csv_data: config.csv_file_path ? {
        description: `Extract and analyze initial lead data from ${config.csv_file_path}. Look for patterns, key information, and potential high-value prospects within the provided dataset.`,
        expected_output: "A structured dataset of leads extracted from the CSV file, with initial analysis highlighting promising prospects.",
        agent: "lead_researcher"
      } : null,
      gather_detailed_information: {
        description: "Scrape websites and search for additional information on identified leads. Focus on company descriptions, recent news, key personnel, and any information relevant to services offered.",
        expected_output: "Detailed profiles for each lead, including comprehensive company information, key decision-makers, and relevant business details.",
        agent: "lead_researcher"
      },
      create_lead_profiles: {
        description: "Analyze gathered data to create comprehensive lead profiles. Synthesize information from various sources to build a cohesive picture of each prospect.",
        expected_output: "In-depth lead profiles containing synthesized information, highlighting key aspects of each company and its potential needs.",
        agent: "profile_analyzer"
      },
      assess_fit_and_potential: {
        description: `Evaluate each lead's fit and potential for ${config.services_offered}. Assign a fit score (0-100) and identify potential services that align with the prospect's needs.`,
        expected_output: "A fit assessment for each lead, including a numerical score, potential services, and a brief fit summary.",
        agent: "profile_analyzer"
      },
      craft_personalized_emails: {
        description: `Create tailored email drafts for each lead, mentioning ${config.company_name} and relevant services. Focus on addressing the prospect's specific needs and pain points identified in their profile.`,
        expected_output: "Personalized email drafts for each lead, highlighting the value proposition and how services can address their specific needs.",
        agent: "email_crafter"
      },
      compile_json_output: {
        description: "Organize all gathered and created information into a JSON file matching the prospects table structure. Ensure all required fields are populated and data types are correct.",
        expected_output: "A structured JSON file containing all lead information, ready for import into the CRM's prospects table.",
        agent: "data_compiler"
      }
    }
  };
};