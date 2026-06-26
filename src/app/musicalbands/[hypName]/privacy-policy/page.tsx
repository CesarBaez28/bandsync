import { config } from "@/app/lib/config";
import PrivacyPolicyContent from "@/app/ui/legal/PrivacyPolicyContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Políticas de privacidad",
  description: `Políticas de privacidad para ${config.appName}.`,
};

export default function PrivacyPage() {
  return (
    <PrivacyPolicyContent appName={config.appName} />
  );
}