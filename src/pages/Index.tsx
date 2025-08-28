import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6">Welcome to Your Dyad App!</h1>
      <p className="text-lg text-muted-foreground mb-8 text-center">
        This is your starting point. Explore the features or add new ones.</p>
      <Button asChild>
        <Link to="/chat">Go to Chat Agent</Link>
      </Button>
    </div>
  );
};

export default Index;