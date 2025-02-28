
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const useProspects = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: prospects, refetch } = useQuery({
    queryKey: ["prospects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prospects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const refetchProspects = () => {
    return queryClient.invalidateQueries({ queryKey: ["prospects"] });
  };

  const handleApprove = async (id: string) => {
    // Start a transaction by using the REST API
    const { data: prospect, error: prospectError } = await supabase
      .from("prospects")
      .select("*")
      .eq("id", id)
      .single();

    if (prospectError) {
      toast({
        title: "Error",
        description: "Failed to fetch prospect details",
        variant: "destructive",
      });
      return;
    }

    // Create organization
    const { data: organization, error: orgError } = await supabase
      .from("organizations")
      .insert({
        prospect_id: prospect.id,
        name: prospect.company_name,
        website: prospect.website,
        description: prospect.description,
        status: 'lead',
      })
      .select()
      .single();

    if (orgError) {
      toast({
        title: "Error",
        description: "Failed to create organization",
        variant: "destructive",
      });
      return;
    }

    // Create contact if contact information exists
    if (prospect.contact_name || prospect.contact_email || prospect.contact_phone) {
      const { error: contactError } = await supabase
        .from("contacts")
        .insert({
          organization_id: organization.id,
          first_name: prospect.contact_name?.split(' ')[0],
          last_name: prospect.contact_name?.split(' ').slice(1).join(' '),
          email: prospect.contact_email,
          phone: prospect.contact_phone,
          linkedin_url: prospect.linkedin_url,
          is_primary: true,
        });

      if (contactError) {
        toast({
          title: "Warning",
          description: "Organization created but failed to create contact",
          variant: "destructive",
        });
      }
    }

    // Update prospect status
    const { error: updateError } = await supabase
      .from("prospects")
      .update({ status: "approved" })
      .eq("id", id);

    if (updateError) {
      toast({
        title: "Warning",
        description: "Organization created but failed to update prospect status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Prospect approved and organization created successfully",
      });
      refetchProspects();
      // Redirect to the new organization page
      navigate(`/organizations/${organization.id}`);
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from("prospects")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to reject prospect",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Prospect rejected successfully",
      });
      refetchProspects();
    }
  };

  return {
    prospects,
    handleApprove,
    handleReject,
    refetchProspects,
  };
};
