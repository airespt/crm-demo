import { userService } from "@/Services/user";
import { UserTable } from "./UserTable";

export async function UserPanel() {
  const allUsers = await userService.list(true);

  return <UserTable rowData={allUsers} />;
}