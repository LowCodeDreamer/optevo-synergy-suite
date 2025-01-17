import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AIAssistant from "@/pages/AIAssistant";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/layout/Sidebar";
import Contacts from "@/pages/Contacts";

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
                <Route path="/" element={<div>Home</div>} />
                <Route path="/assistant" element={<AIAssistant />} />
                <Route path="/dashboard" element={<div>Dashboard</div>} />
                <Route path="/contacts" element={<Contacts />} />
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