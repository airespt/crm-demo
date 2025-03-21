'use server'

import { useSession } from "@/app/login/actions"
import { hasPermission, UserPermissions } from "@/app/login/userPermissions"
import { Customer } from "@/prisma/sageDb/interfaces"
import { customerService } from "@/Services/customer"

export async function listCustomers() {
  const user = await useSession('/crm/customers')
  if( !hasPermission(user.role?.customers, UserPermissions.View) ) {
    return {
      data: [] as Customer[],
      success: false,
      error: 'no permission'
    }
  }

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
