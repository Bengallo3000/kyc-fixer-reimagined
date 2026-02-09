import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, CheckCircle } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Email not confirmed")) {
            toast({
              title: "E-Mail nicht bestätigt",
              description: "Bitte bestätige zuerst deine E-Mail-Adresse.",
              variant: "destructive",
            });
          } else if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Ungültige Anmeldedaten",
              description: "E-Mail oder Passwort ist falsch.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Fehler",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Erfolgreich eingeloggt",
            description: "Willkommen zurück!",
          });
          navigate("/");
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes("User already registered")) {
            toast({
              title: "Konto existiert bereits",
              description: "Diese E-Mail-Adresse ist bereits registriert.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Fehler",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          setShowVerificationMessage(true);
        }
      }
    } catch (err) {
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showVerificationMessage) {
    return (
      <>
        <Helmet>
          <title>E-Mail bestätigen - KYC Fixer</title>
        </Helmet>
        
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="glass-card p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-4">E-Mail bestätigen</h1>
              <p className="text-muted-foreground mb-6">
                Wir haben eine Bestätigungs-E-Mail an <strong>{email}</strong> gesendet. 
                Bitte klicke auf den Link in der E-Mail, um dein Konto zu aktivieren.
              </p>
              <Alert className="mb-6 bg-secondary/50 border-border">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Überprüfe auch deinen Spam-Ordner, falls die E-Mail nicht ankommt.
                </AlertDescription>
              </Alert>
              <Button
                variant="outline"
                onClick={() => {
                  setShowVerificationMessage(false);
                  setIsLogin(true);
                }}
                className="w-full"
              >
                Zurück zum Login
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isLogin ? "Anmelden" : "Registrieren"} - KYC Fixer</title>
        <meta name="description" content="Melde dich an oder erstelle ein Konto, um die KI-Tools von KYC Fixer zu nutzen." />
      </Helmet>
      
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="glass-card p-8">
            <div className="text-center mb-8">
              <Link to="/" className="inline-block">
                <h1 className="text-2xl font-bold gradient-text">KYC Fixer</h1>
              </Link>
              <p className="text-muted-foreground mt-2">
                {isLogin ? "Melde dich in deinem Konto an" : "Erstelle dein Konto"}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="du@beispiel.de"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-secondary/50 border-border"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                  className="bg-secondary/50 border-border"
                />
                {!isLogin && (
                  <p className="text-xs text-muted-foreground">
                    Mindestens 6 Zeichen
                  </p>
                )}
              </div>
              
              <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isLogin ? "Anmelden..." : "Registrieren..."}
                  </>
                ) : (
                  isLogin ? "Anmelden" : "Registrieren"
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline"
                disabled={loading}
              >
                {isLogin ? "Noch kein Konto? Registrieren" : "Bereits ein Konto? Anmelden"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
