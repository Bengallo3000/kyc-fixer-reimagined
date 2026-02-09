import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";

const TopBanner = () => {
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto flex items-center justify-center gap-4 py-3 px-4">
          <span className="text-sm text-muted-foreground">Laden...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {user ? (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{user.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Abmelden
            </Button>
          </>
        ) : (
          <>
            <span className="text-sm text-muted-foreground">
              Bereit für unsere KI-Tools?
            </span>
            <Button variant="hero" size="sm" asChild>
              <Link to="/auth">Anmelden / Registrieren</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TopBanner;
