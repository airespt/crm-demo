import { sageDb } from '@/prisma/sageDb/client';
import { Customer } from '@/prisma/sageDb/interfaces';

export async function getAllCustomers(): Promise<Customer[]> {
  try {
    const result = await sageDb.customer.findMany({})
    return result;
  }
  catch(e) {
    console.log(JSON.stringify(e))
  }
  return []
}