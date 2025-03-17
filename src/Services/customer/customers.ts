import { customerRepo } from "@/Repos/customer"

export async function listCustomers() {
    
  const result = await customerRepo.getAll([])
  return result
}
