const packages = [
  { price: "Custom", credits: "$20+ min", highlight: false },
  { price: "$30", credits: "35 credits", highlight: false },
  { price: "$100", credits: "125 credits", highlight: false },
  { price: "$350", credits: "Lifetime Unlimited", highlight: true },
];

const CreditPackages = () => {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto">
        <div className="glass-card p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Get More Value with Credit Packages</h3>
          <p className="text-muted-foreground mb-8">
            Save up to 25% with bulk credit purchases. From $30 starter packs to lifetime unlimited access.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.price}
                className={`px-6 py-4 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-105 ${
                  pkg.highlight
                    ? "bg-primary/10 border-primary/50 hover:border-primary"
                    : "bg-secondary/50 border-border hover:border-muted-foreground"
                }`}
              >
                <div className="font-bold text-lg">{pkg.price}</div>
                <div className="text-sm text-muted-foreground">→ {pkg.credits}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreditPackages;
