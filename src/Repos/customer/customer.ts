import { Prisma } from '@/prisma/sageDb/prismaClient';
import { sageDb } from '@/prisma/sageDb/client';
import { Customer } from '@/prisma/sageDb/interfaces';
import { DefaultArgs } from '@/prisma/sageDb/prismaClient/runtime/library';

export async function getAllCustomers(fields: Prisma.CustomerSelect<DefaultArgs>[]): Promise<Customer[]> {
  try {
    const result = await sageDb.customer.findMany()
    return result;
  }
  catch(e) {
    console.log(JSON.stringify(e))
  }
  return []
}