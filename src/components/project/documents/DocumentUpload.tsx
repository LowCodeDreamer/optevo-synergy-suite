import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tables } from "@/integrations/supabase/types";

interface DocumentUploadProps {
  project: Tables<"projects"> & {
    organization: Tables<"organizations">;
    primary_contact: Tables<"contacts">;
    manager: Tables<"profiles">;
  };
  onUploadComplete: () => void;
}

export const DocumentUpload = ({ project, onUploadComplete }: DocumentUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${project.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("project-files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

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

      onUploadComplete();
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

  return (
    <div className="flex items-center gap-4">
      <Input
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        id="file-upload"
        disabled={uploading}
      />
      <Label
        htmlFor="file-upload"
        className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload Document
      </Label>
    </div>
  );
};