import { z } from "zod";

// Agent configuration types
export const agentConfigSchema = z.object({
  search_keywords: z.string(),
  csv_file_path: z.string().optional(),
  services_offered: z.string(),
  company_name: z.string()
});

export type AgentConfig = z.infer<typeof agentConfigSchema>;

// Agent definitions
export const agents = {
  lead_researcher: {
    role: "Lead Research Specialist",
    getGoal: (config: AgentConfig) => 
      `Identify and gather comprehensive information on potential leads using ${config.search_keywords}` +
      (config.csv_file_path ? ` and analyze data from ${config.csv_file_path}` : ""),
    backstory: "As a seasoned lead researcher, you excel at uncovering valuable prospects and extracting crucial information from various sources. Your expertise in web searching, data analysis, and information gathering is unparalleled, making you an essential part of the lead prospecting process."
  },
  profile_analyzer: {
    role: "Lead Profile Analyst",
    getGoal: (config: AgentConfig) => 
      `Analyze gathered data to create comprehensive lead profiles and assess fit for ${config.services_offered}`,
    backstory: "With a keen eye for detail and a deep understanding of business dynamics, you excel at transforming raw data into insightful lead profiles. Your ability to evaluate a company's potential fit with our services is crucial in identifying the most promising prospects."
  },
  email_crafter: {
    role: "Personalized Email Specialist",
    getGoal: (config: AgentConfig) => 
      `Create tailored email drafts for each lead, highlighting the value proposition of ${config.company_name} and relevant ${config.services_offered}`,
    backstory: "As a master of persuasive communication, you have a talent for crafting compelling, personalized emails that resonate with decision-makers. Your ability to align our offerings with a prospect's needs is key to driving engagement and initiating meaningful conversations."
  },
  data_compiler: {
    role: "Data Integration Expert",
    getGoal: () => 
      "Compile all gathered and created information into a structured JSON file that matches the prospects table schema",
    backstory: "With your extensive experience in data management and integration, you excel at organizing complex information into structured formats. Your attention to detail ensures that all lead data is accurately compiled and ready for seamless import into the CRM system."
  }
} as const;