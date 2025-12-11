import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  credits: string;
  isPremium?: boolean;
  isAutomated?: boolean;
}

const ToolCard = ({ icon: Icon, title, description, credits, isPremium, isAutomated }: ToolCardProps) => {
  return (
    <div className="glass-card p-6 group hover:border-primary/50 transition-all duration-300 cursor-pointer relative overflow-hidden">
      {isPremium && (
        <div className="absolute top-4 right-4 premium-badge">Premium</div>
      )}
      {isAutomated && (
        <div className="absolute top-4 right-4 premium-badge">Automated</div>
      )}
      
      <div className="icon-box mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
      
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{description}</p>
      
      <div className="credit-badge w-fit">{credits}</div>
    </div>
  );
};

export default ToolCard;
