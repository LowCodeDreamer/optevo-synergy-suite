import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AuthChangeEvent } from "@supabase/supabase-js";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      if (session) {
        navigate("/dashboard");
      }
      
      // Handle authentication events
      if (event === "SIGNED_OUT") {
        toast({
          title: "Signed out",
          description: "You have been successfully signed out.",
        });
      } else if (event === "PASSWORD_RECOVERY") {
        toast({
          title: "Password recovery",
          description: "Check your email for password reset instructions.",
        });
      }
    });

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
          view="sign_in"
          showLinks={true}
          localization={{
            variables: {
              sign_in: {
                email_label: "Email",
                password_label: "Password",
              },
              sign_up: {
                email_label: "Email",
                password_label: "Password",
              },
            },
          }}
          viewOptions={{
            signIn: {
              emailRedirectTo: `${window.location.origin}/dashboard`,
              onError: (error) => {
                toast({
                  title: "Invalid credentials",
                  description: "Please check your email and password and try again.",
                  variant: "destructive",
                });
              },
            },
            signUp: {
              emailRedirectTo: `${window.location.origin}/dashboard`,
              onError: (error) => {
                if (error.message.includes("User already registered")) {
                  toast({
                    title: "Account exists",
                    description: "This email is already registered. Please try logging in instead.",
                    variant: "destructive",
                  });
                } else {
                  toast({
                    title: "Sign up error",
                    description: error.message,
                    variant: "destructive",
                  });
                }
              },
            },
          }}
        />
      </Card>
    </div>
  );
};

export default Index;