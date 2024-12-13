import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { FileText, Upload, Download, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ProjectDocumentsProps {
  project: Tables<"projects"> & {
    organization: Tables<"organizations">;
    primary_contact: Tables<"contacts">;
    manager: Tables<"profiles">;
  };
}

export const ProjectDocuments = ({ project }: ProjectDocumentsProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const filePath = `${project.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("project-files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create document record
      const { error: dbError } = await supabase.from("project_documents").insert({
        project_id: project.id,
        name: file.name,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
      });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      refetch();
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (document: Tables<"project_documents">) => {
    try {
      const { data, error } = await supabase.storage
        .from("project-files")
        .download(document.file_path!);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = document.name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (document: Tables<"project_documents">) => {
    try {
      // Delete file from storage
      const { error: storageError } = await supabase.storage
        .from("project-files")
        .remove([document.file_path!]);

      if (storageError) throw storageError;

      // Delete document record
      const { error: dbError } = await supabase
        .from("project_documents")
        .delete()
        .eq("id", document.id);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });

      refetch();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Project Documents</h2>
        <div className="flex items-center gap-4">
          <Input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Label
            htmlFor="file-upload"
            className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Label>
        </div>
      </div>

      <div className="grid gap-4">
        {documents?.map((document) => (
          <Card key={document.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold">{document.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(document.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDownload(document)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(document)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
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