import { config } from "@/app/lib/config";
import TermsOfServiceContent from "@/app/ui/legal/TermsOfServiceContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Condiciones de uso",
  description: `Condiciones de uso para ${config.appName}.`,
};

export default function PrivacyPage() {
  return (
    <TermsOfServiceContent appName={config.appName} />
  );
}