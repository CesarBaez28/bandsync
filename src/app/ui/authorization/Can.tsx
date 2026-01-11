import { usePermissions } from "@/app/lib/customHooks";
import { UUID } from "node:crypto";

type CanProps = {
  readonly permission?: string;
  readonly musicalBandId: UUID | undefined;
  readonly anyOf?: string[];
  readonly children: React.ReactNode;
  readonly fallback?: React.ReactNode;
};

export function Can({
  permission,
  musicalBandId,
  anyOf,
  children,
  fallback = null,
}: CanProps) {

  const { hasPermission, hasAnyPermission } = usePermissions();

  if (musicalBandId === undefined) {
    return <>{fallback}</>;
  }

  let allowed = false;

  if (permission) allowed = hasPermission(permission, musicalBandId);
  if (anyOf) allowed = hasAnyPermission(anyOf, musicalBandId);

  return allowed ? <>{children}</> : <>{fallback}</>;
}
