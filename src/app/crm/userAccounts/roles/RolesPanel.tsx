import { roleService } from "@/Services/user";
import { RolesTable } from "./RolesTable";

export async function RolesPanel() {
  const allRoles = await roleService.list(true);

  return <RolesTable rolesData={allRoles} />;
}
