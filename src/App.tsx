import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster as HotToaster } from "react-hot-toast";
import Home from "./pages/Home";
import VisitorFormPage from "./pages/VisitorFormPage";
import FacultyDashboardPage from "./pages/FacultyDashboardPage";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";
import { initializeData } from "./utils/localStorage";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HotToaster position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/visitor-form" element={<VisitorFormPage />} />
            <Route path="/faculty-dashboard" element={<FacultyDashboardPage />} />
            <Route path="/chat/:requestId" element={<ChatPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
