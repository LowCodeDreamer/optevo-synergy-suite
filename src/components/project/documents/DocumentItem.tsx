import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Download, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DocumentItemProps {
  document: Tables<"project_documents">;
  onDelete: () => void;
}

export const DocumentItem = ({ document, onDelete }: DocumentItemProps) => {
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("project-files")
        .download(document.file_path!);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = document.name;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { error: storageError } = await supabase.storage
        .from("project-files")
        .remove([document.file_path!]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from("project_documents")
        .delete()
        .eq("id", document.id);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });

      onDelete();
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
    <Card className="p-4">
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
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};