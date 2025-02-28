
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Building2, User, Target, FolderGit2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const OrganizationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: organization, isLoading, error } = useQuery({
    queryKey: ["organization", id],
    queryFn: async () => {
      if (!id) throw new Error("No organization ID provided");

      const { data: organizations, error } = await supabase
        .from("organizations")
        .select(`
          *,
          contacts (*),
          opportunities (*),
          projects (*)
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching organization:", error);
        throw error;
      }

      if (!organizations) {
        throw new Error("Organization not found");
      }

      return organizations;
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
            {error instanceof Error ? error.message : "Failed to load organization details"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertDescription>Organization not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const primaryContact = organization.contacts.find(contact => contact.is_primary);

  return (
    <div className="container mx-auto p-6">
      {/* Organization Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">{organization.name}</h1>
          <p className="text-muted-foreground">{organization.industry || "No industry specified"}</p>
        </div>
        <Badge variant={organization.status === "active" ? "default" : "outline"} className="text-sm">
          {organization.status}
        </Badge>
      </div>

      {/* Three-panel Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Organization Details */}
        <div className="col-span-3">
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Organization</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {organization.description && (
                    <div>
                      <h3 className="text-sm font-medium mb-1">About</h3>
                      <p className="text-sm text-muted-foreground">{organization.description}</p>
                    </div>
                  )}
                  
                  {organization.website && (
                    <div>
                      <h3 className="text-sm font-medium mb-1">Website</h3>
                      <a 
                        href={organization.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {organization.website}
                      </a>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium mb-1">Created</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(organization.created_at), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:bg-muted/50 cursor-pointer" onClick={() => navigate(`/contacts?organization=${organization.id}`)}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Contacts</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{organization.contacts.length}</div>
                {primaryContact && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Primary: {primaryContact.first_name} {primaryContact.last_name}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="hover:bg-muted/50 cursor-pointer" onClick={() => navigate(`/opportunities?organization=${organization.id}`)}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{organization.opportunities.length}</div>
                {organization.opportunities.length > 0 && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Latest: {organization.opportunities[0].name}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="hover:bg-muted/50 cursor-pointer" onClick={() => navigate(`/projects?organization=${organization.id}`)}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Projects</CardTitle>
                <FolderGit2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{organization.projects.length}</div>
                {organization.projects.length > 0 && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Latest: {organization.projects[0].name}
                  </div>
                )}
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
                <p className="font-medium mb-2">Here's what I know about {organization.name}:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>This organization has {organization.contacts.length} contacts</li>
                  <li>There are {organization.opportunities.length} active opportunities</li>
                  <li>The organization has {organization.projects.length} projects</li>
                </ul>
                <p className="mt-4">What would you like to know about this organization?</p>
              </div>
              <div className="mt-4">
                <input 
                  type="text" 
                  placeholder="Ask AI about this organization..." 
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          <div className="bg-card rounded-md border shadow-sm">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Activity Timeline</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Activity Items */}
                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Target className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="h-full w-0.5 bg-gray-200 mt-1"></div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">New opportunity created</h3>
                    <p className="text-sm text-muted-foreground mt-1">Enterprise Solution Proposal</p>
                    <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="h-full w-0.5 bg-gray-200 mt-1"></div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">New contact added</h3>
                    <p className="text-sm text-muted-foreground mt-1">Added Sarah Johnson as a contact</p>
                    <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <FolderGit2 className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Project created</h3>
                    <p className="text-sm text-muted-foreground mt-1">Website Redesign Project</p>
                    <p className="text-xs text-muted-foreground mt-1">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Insights and Related Info */}
        <div className="col-span-3">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Opportunity Alert</h3>
                    <p className="text-xs mt-1 text-yellow-700 dark:text-yellow-400">
                      The Enterprise Solution opportunity has been in the proposal stage for over 2 weeks with no activity.
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Contact Suggestion</h3>
                    <p className="text-xs mt-1 text-blue-700 dark:text-blue-400">
                      Based on LinkedIn data, Mark Thompson (CTO) might be a valuable contact to add to this organization.
                    </p>
                  </div>

                  <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Revenue Potential</h3>
                    <p className="text-xs mt-1 text-green-700 dark:text-green-400">
                      This organization shows 35% higher engagement than similar accounts, suggesting expansion opportunities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Suggested Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Schedule follow-up call</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        It's been 14 days since the last contact
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Send proposal update</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        The current proposal may need revisions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
                      <span className="text-xs font-medium text-blue-600">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Add missing stakeholders</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Identify and add key decision makers
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;
