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

export const analyzeProspect = async (prospectData: {
  company_name: string;
  website?: string;
  description?: string;
  linkedin_url?: string;
}) => {
  try {
    // Analyze company data
    const analysis = {
      intro: `Based on the available information about ${prospectData.company_name}, `,
      fitAnalysis: "Analysis of potential fit: ",
      nextSteps: "Recommended next steps: ",
      potentialServices: "Potential services to offer: "
    };

    // Update prospect with AI analysis
    const { data, error } = await supabase
      .from("prospects")
      .update({
        ai_intro: analysis.intro,
        ai_fit_analysis: analysis.fitAnalysis,
        ai_next_steps: analysis.nextSteps,
        potential_services: analysis.potentialServices
      })
      .eq("company_name", prospectData.company_name)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error analyzing prospect:", error);
    throw error;
  }
};

export const getProspectAnalysis = async (companyName: string) => {
  try {
    const { data, error } = await supabase
      .from("prospects")
      .select("ai_intro, ai_fit_analysis, ai_next_steps, potential_services")
      .eq("company_name", companyName)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching prospect analysis:", error);
    throw error;
  }
};

export const updateProspectAnalysis = async (
  companyName: string,
  analysis: {
    ai_intro?: string;
    ai_fit_analysis?: string;
    ai_next_steps?: string;
    potential_services?: string;
  }
) => {
  try {
    const { data, error } = await supabase
      .from("prospects")
      .update(analysis)
      .eq("company_name", companyName)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating prospect analysis:", error);
    throw error;
  }
};