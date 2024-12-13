import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { DocumentUpload } from "./documents/DocumentUpload";
import { DocumentItem } from "./documents/DocumentItem";

interface ProjectDocumentsProps {
  project: Tables<"projects"> & {
    organization: Tables<"organizations">;
    primary_contact: Tables<"contacts">;
    manager: Tables<"profiles">;
  };
}

export const ProjectDocuments = ({ project }: ProjectDocumentsProps) => {
  const { data: documents, refetch } = useQuery({
    queryKey: ["project-documents", project.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_documents")
        .select("*")
        .eq("project_id", project.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Project Documents</h2>
        <DocumentUpload project={project} onUploadComplete={refetch} />
      </div>

      <div className="grid gap-4">
        {documents?.map((document) => (
          <DocumentItem 
            key={document.id} 
            document={document} 
            onDelete={refetch}
          />
        ))}

        {documents?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No documents uploaded yet
          </div>
        )}
      </div>
    </div>
  );
};