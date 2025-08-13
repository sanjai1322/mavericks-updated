import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { queryClient } from "./lib/queryClient";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Assessments from "@/pages/Assessments";
import LearningPath from "@/pages/LearningPath";
import Hackathons from "@/pages/Hackathons";
import Leaderboard from "@/pages/Leaderboard";
import Recommendations from "@/pages/Recommendations";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/assessments" component={Assessments} />
      <Route path="/learning" component={LearningPath} />
      <Route path="/ai-learning" component={LearningPath} />
      <Route path="/hackathons" component={Hackathons} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/recommendations" component={Recommendations} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
