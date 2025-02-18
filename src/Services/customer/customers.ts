import { useSession } from "@/app/login/actions"
import { customerRepo } from "@/Repos/customer"

export async function listCustomers() {
  const user = useSession()
  
  const result = await customerRepo.getAll()
  return result
}
