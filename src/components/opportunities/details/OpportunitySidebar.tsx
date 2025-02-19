
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info } from "lucide-react";

interface OpportunitySidebarProps {
  organization?: {
    name: string;
    website?: string | null;
    industry?: string | null;
  } | null;
  primary_contact?: {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
  } | null;
  aiInsights?: string[];
}

export const OpportunitySidebar = ({
  organization,
  primary_contact,
  aiInsights,
}: OpportunitySidebarProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">Organization Details</span>
        </div>
        <Separator />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Industry</p>
          <p className="font-medium">{organization?.industry}</p>
        </div>
        {organization?.website && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Website</p>
            <a
              href={organization.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {organization.website}
            </a>
          </div>
        )}
      </Card>

      {primary_contact && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Primary Contact</span>
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="font-medium">
              {primary_contact.first_name} {primary_contact.last_name}
            </p>
            {primary_contact.email && (
              <p className="text-sm text-muted-foreground">
                {primary_contact.email}
              </p>
            )}
            {primary_contact.phone && (
              <p className="text-sm text-muted-foreground">
                {primary_contact.phone}
              </p>
            )}
          </div>
        </Card>
      )}

      {aiInsights && aiInsights.length > 0 && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">AI Insights</span>
          </div>
          <Separator />
          <ScrollArea className="h-[200px] w-full">
            <div className="space-y-2">
              {aiInsights.map((point, index) => (
                <p key={index} className="text-sm text-muted-foreground">
                  • {point}
                </p>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
};
