import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AIAssistant from "@/pages/AIAssistant";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/layout/Sidebar";
import Contacts from "@/pages/Contacts";
import Dashboard from "@/pages/Dashboard";
import Organizations from "@/pages/Organizations";
import OrganizationDetails from "@/pages/OrganizationDetails";
import Projects from "@/pages/Projects";
import Prospects from "@/pages/Prospects";
import Analytics from "@/pages/Analytics";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/prospects" element={<Prospects />} />
                <Route path="/organizations" element={<Organizations />} />
                <Route path="/organizations/:id" element={<OrganizationDetails />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/assistant" element={<AIAssistant />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<div>Settings</div>} />
              </Routes>
            </main>
          </div>
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;