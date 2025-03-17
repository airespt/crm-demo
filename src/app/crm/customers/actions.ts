'use server'

import { Customer } from "@/prisma/sageDb/interfaces"
import { customerService } from "@/Services/customer"

export async function listCustomers() {
  try {
    const result = await customerService.list()
    return {
      data: result,
      success: true,
    }
  } catch (error) {
    console.error('Failed to list roles:', error)
    return {
      data: [] as Customer[],
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list roles',
    }
  }
}
