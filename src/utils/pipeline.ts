
export const PIPELINE_STAGES = [
  "qualification",
  "discovery",
  "proposal",
  "negotiation",
  "closing",
  "won",
  "lost",
] as const;

export const getPipelineStageColor = (stage: string) => {
  switch (stage) {
    case "qualification":
      return "default";
    case "discovery":
      return "secondary";
    case "proposal":
      return "default";
    case "negotiation":
      return "destructive";
    case "closing":
      return "secondary";
    case "won":
      return "default";
    case "lost":
      return "destructive";
    default:
      return "default";
  }
};
