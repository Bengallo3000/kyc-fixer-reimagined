import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TopBanner = () => {
  return (
    <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto flex items-center justify-center gap-4 py-3 px-4">
        <span className="text-sm text-muted-foreground">
          Ready to use our AI-powered tools?
        </span>
        <Button variant="hero" size="sm" asChild>
          <Link to="/auth">Sign In / Register</Link>
        </Button>
      </div>
    </div>
  );
};

export default TopBanner;
