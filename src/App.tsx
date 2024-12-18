import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Prospects from "./pages/Prospects";
import Organizations from "./pages/Organizations";
import Projects from "./pages/Projects";
import Agents from "./pages/Agents";
import OrganizationDetails from "./pages/OrganizationDetails";
import ProjectDetails from "./pages/ProjectDetails";
import { Sidebar } from "./components/layout/Sidebar";

const queryClient = new QueryClient();

const App = () => (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex">
              <Sidebar />
              <main className="flex-1 ml-16">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/prospects" element={<Prospects />} />
                  <Route path="/organizations" element={<Organizations />} />
                  <Route path="/organizations/:id" element={<OrganizationDetails />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetails />} />
                  <Route path="/agents" element={<Agents />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);

export default App;