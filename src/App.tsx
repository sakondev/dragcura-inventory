import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NavHeader from "@/components/NavHeader";
import LoadingSpinner from "@/components/LoadingSpinner";

const Inventory = lazy(() => import("./pages/Inventory"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Router>
        <div>
          <NavHeader />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="//" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
