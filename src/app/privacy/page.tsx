"use client";


export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-6 flex flex-col items-center transition-colors duration-300">
      <div className="max-w-3xl w-full bg-card border border-border shadow-sm rounded-2xl p-8 transition-colors duration-300">
        <h1 className="text-3xl font-semibold text-foreground text-center mb-6">
          Privacy Policy
        </h1>

        <p className="text-muted-foreground mb-4 leading-relaxed">
          At <span className="text-primary font-medium">NutriLens</span>, your
          privacy is our top priority. We collect and process only essential
          information to improve your experience, such as nutritional data and
          profile preferences.
        </p>

        <p className="text-muted-foreground mb-4 leading-relaxed">
          We never share your personal details with third parties without your
          consent. All sensitive data is encrypted and securely stored to
          maintain your confidentiality.
        </p>

        <p className="text-muted-foreground leading-relaxed">
          By using our app, you agree to this privacy policy. For any privacy
          concerns, please contact our support team.
        </p>
      </div>
    </div>
  );
}
