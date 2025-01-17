import { supabase } from "@/integrations/supabase/client";

export const createProspect = async (prospectData: {
  company_name: string;
  website?: string;
  description?: string;
  linkedin_url?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  ai_intro?: string;
  ai_fit_analysis?: string;
  ai_next_steps?: string;
  potential_services?: string;
}) => {
  const { data, error } = await supabase
    .from("prospects")
    .insert({
      company_name: prospectData.company_name,
      website: prospectData.website || null,
      description: prospectData.description || null,
      linkedin_url: prospectData.linkedin_url || null,
      contact_name: prospectData.contact_name || null,
      contact_email: prospectData.contact_email || null,
      contact_phone: prospectData.contact_phone || null,
      ai_intro: prospectData.ai_intro || null,
      ai_fit_analysis: prospectData.ai_fit_analysis || null,
      ai_next_steps: prospectData.ai_next_steps || null,
      potential_services: prospectData.potential_services || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const processCrewAIResponse = async (prospects: Array<{
  company_name: string;
  website?: string;
  description?: string;
  fit_score?: number;
  potential_services?: string;
  contact_name?: string;
  contact_email?: string;
}>) => {
  try {
    const results = await Promise.all(
      prospects.map(prospect => createProspect({
        company_name: prospect.company_name,
        website: prospect.website,
        description: prospect.description,
        potential_services: prospect.potential_services,
        contact_name: prospect.contact_name,
        contact_email: prospect.contact_email,
      }))
    );
    return true;
  } catch (error) {
    console.error("Error processing prospects:", error);
    return false;
  }
};
