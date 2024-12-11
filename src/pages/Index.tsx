import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check current session
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    // Handle auth errors
    const handleAuthError = (error: Error) => {
      const errorMessage = error.message;
      if (errorMessage.includes("User already registered")) {
        toast({
          title: "Account exists",
          description: "This email is already registered. Please try logging in instead.",
          variant: "destructive",
        });
      } else if (errorMessage.includes("Invalid login credentials")) {
        toast({
          title: "Invalid credentials",
          description: "Please check your email and password and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Authentication error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    // Subscribe to auth events
    const {
      data: { subscription },
    } = supabase.auth.onError(handleAuthError);

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-card">
        <h1 className="text-2xl font-bold text-center text-foreground">Welcome to Optevo HQ</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(147 51 234)',
                  brandAccent: 'rgb(126 34 206)',
                }
              }
            }
          }}
          providers={[]}
        />
      </Card>
    </div>
  );
};

export default Index;