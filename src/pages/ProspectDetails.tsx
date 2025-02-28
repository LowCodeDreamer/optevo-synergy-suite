
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Building2, Mail, Phone, Target, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useProspects } from "@/hooks/use-prospects";
import { Separator } from "@/components/ui/separator";

const ProspectDetails = () => {
  // Get the ID directly from the URL
  const pathSegments = window.location.pathname.split('/');
  const id = pathSegments[pathSegments.length - 1];
  
  const navigate = useNavigate();
  const { handleApprove, handleReject } = useProspects();
  
  console.log("Current prospect ID from URL path:", id);

  const { data: prospect, isLoading, error } = useQuery({
    queryKey: ["prospect", id],
    queryFn: async () => {
      if (!id) {
        console.error("No prospect ID provided in URL params");
        throw new Error("No prospect ID provided");
      }

      const { data: prospect, error } = await supabase
        .from("prospects")
        .select(`
          *,
          prospect_activities (*),
          prospect_notes (*),
          prospect_tasks (*)
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching prospect:", error);
        throw error;
      }

      if (!prospect) {
        throw new Error("Prospect not found");
      }

      return prospect;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load prospect details"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!prospect) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertDescription>Prospect not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const isPending = prospect.status === "pending";
  const isApproved = prospect.status === "approved";
  const isRejected = prospect.status === "rejected";

  return (
    <div className="container mx-auto p-6">
      {/* Prospect Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">{prospect.company_name}</h1>
          <p className="text-muted-foreground">{prospect.website || "No website specified"}</p>
        </div>
        <Badge 
          variant={
            isPending ? "outline" : 
            isApproved ? "default" : 
            "destructive"
          } 
          className="text-sm"
        >
          {prospect.status}
        </Badge>
      </div>

      {/* Three-panel Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Prospect Details */}
        <div className="col-span-3">
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Company</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prospect.description && (
                    <div>
                      <h3 className="text-sm font-medium mb-1">About</h3>
                      <p className="text-sm text-muted-foreground">{prospect.description}</p>
                    </div>
                  )}
                  
                  {prospect.website && (
                    <div>
                      <h3 className="text-sm font-medium mb-1">Website</h3>
                      <a 
                        href={prospect.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {prospect.website}
                      </a>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium mb-1">Created</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(prospect.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Primary Contact</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prospect.contact_name && (
                    <div className="text-base font-medium">{prospect.contact_name}</div>
                  )}
                  
                  {prospect.contact_email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <a 
                        href={`mailto:${prospect.contact_email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {prospect.contact_email}
                      </a>
                    </div>
                  )}
                  
                  {prospect.contact_phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{prospect.contact_phone}</span>
                    </div>
                  )}
                  
                  {prospect.linkedin_url && (
                    <div>
                      <a 
                        href={prospect.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-2"
                      >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                        </svg>
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fit Score</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold">{prospect.fit_score || 0}/100</div>
                  {prospect.potential_services && (
                    <div className="mt-3 bg-muted p-2 rounded-md w-full">
                      <h3 className="text-sm font-medium mb-1">Potential Services</h3>
                      <p className="text-sm text-muted-foreground">{prospect.potential_services}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Center Panel - AI Assistant and Content */}
        <div className="col-span-6">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md text-sm">
                <p className="font-medium mb-2">Here's what I know about {prospect.company_name}:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>This prospect has a fit score of {prospect.fit_score || 0}/100</li>
                  {prospect.potential_services && (
                    <li>Potential services: {prospect.potential_services}</li>
                  )}
                  {prospect.ai_fit_analysis && (
                    <li>Our AI determined this prospect is a good fit because: {prospect.ai_fit_analysis}</li>
                  )}
                </ul>
                <p className="mt-4">What would you like to know about this prospect?</p>
              </div>
              <div className="mt-4">
                <input 
                  type="text" 
                  placeholder="Ask AI about this prospect..." 
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Timeline if prospect has activities */}
          {prospect.prospect_activities && prospect.prospect_activities.length > 0 ? (
            <div className="bg-card rounded-md border shadow-sm">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">Activity Timeline</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {/* Activity Items */}
                  {prospect.prospect_activities.map((activity, index) => (
                    <div key={activity.id} className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          {activity.type === 'email' ? (
                            <Mail className="h-4 w-4 text-blue-600" />
                          ) : activity.type === 'meeting' ? (
                            <Calendar className="h-4 w-4 text-purple-600" />
                          ) : (
                            <Target className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        {index < prospect.prospect_activities.length - 1 && (
                          <div className="h-full w-0.5 bg-gray-200 mt-1"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">{activity.title}</h3>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(activity.created_at), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-md border shadow-sm p-6 text-center text-muted-foreground">
              <p>No activities recorded for this prospect yet.</p>
            </div>
          )}
          
          {/* Fit Analysis if available */}
          {prospect.ai_fit_analysis && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>AI Fit Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{prospect.ai_fit_analysis}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Panel - Insights and Actions */}
        <div className="col-span-3">
          <div className="space-y-6">
            {/* Action Buttons - only show if pending */}
            {isPending && (
              <Card className="p-4">
                <h3 className="text-sm font-medium mb-3">Prospect Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => id && handleApprove(id)}
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => id && handleReject(id)}
                  >
                    Reject
                  </Button>
                </div>
                <Separator className="my-4" />
                <p className="text-xs text-muted-foreground">
                  Approving will create an organization and move this prospect to your active pipeline.
                </p>
              </Card>
            )}

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prospect.fit_score && prospect.fit_score > 70 ? (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                      <h3 className="text-sm font-medium text-green-800 dark:text-green-300">High Fit Score</h3>
                      <p className="text-xs mt-1 text-green-700 dark:text-green-400">
                        This prospect's high fit score of {prospect.fit_score}/100 suggests they're an excellent match for our services.
                      </p>
                    </div>
                  ) : prospect.fit_score && prospect.fit_score > 40 ? (
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                      <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Moderate Fit</h3>
                      <p className="text-xs mt-1 text-yellow-700 dark:text-yellow-400">
                        This prospect shows moderate alignment with our ideal customer profile. Consider exploring their needs further.
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Low Fit Warning</h3>
                      <p className="text-xs mt-1 text-red-700 dark:text-red-400">
                        This prospect may not align well with our services. Consider reviewing the fit analysis before proceeding.
                      </p>
                    </div>
                  )}

                  {prospect.ai_next_steps && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Suggested Approach</h3>
                      <p className="text-xs mt-1 text-blue-700 dark:text-blue-400">
                        {prospect.ai_next_steps}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Suggested Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Suggested Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {!prospect.email_sent && (
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-xs font-medium text-blue-600">1</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Send initial outreach email</p>
                        {prospect.draft_email && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            AI has generated a draft email for you
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {prospect.email_sent && !prospect.meeting_scheduled && (
                    <div className="flex items-start">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                        <span className="text-xs font-medium text-blue-600">1</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Schedule discovery call</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Initial email was sent, now follow up with a call
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Research company further</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Look for recent news, product launches, or funding rounds
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Identify stakeholders</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Find additional contacts who might be involved in decision-making
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Draft Email if available */}
            {prospect.draft_email && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Generated Email Draft</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-muted rounded-md text-sm">
                    <p>{prospect.draft_email}</p>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button variant="outline" size="sm">
                      <Mail className="mr-2 h-4 w-4" />
                      Open in Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProspectDetails;
