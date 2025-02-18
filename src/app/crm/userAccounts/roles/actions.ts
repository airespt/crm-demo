'use server'

import { roleService } from "@/Services/user/"
import { RolePermissions, User } from "@/prisma/coreDb/interfaces"
import { revalidatePath } from "next/cache"

export async function listRoles() {
  try {
    const result = await roleService.list(true)
    return {
      data: result,
      success: true,
    }
  } catch (error) {
    console.error('Failed to list roles:', error)
    return {
      data: [],
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list roles',
    }
  }
}

export async function createRole(roleName: string, user?: User) {
  try {
    const result = await roleService.create({
      name: roleName,
      userAccounts: 0,
      rolePermissions: 0,
      customers: 0,
    })
    return {
      data: result,
      success: true
    }
  } catch (error) {
    console.error('Failed to create role:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create role',
    }
  }
}

export async function copyRole(name: string, fromRole: RolePermissions, user?: User) {
  try {
    const result = await roleService.create({
      name: name,
      userAccounts: fromRole.userAccounts || 0,
      rolePermissions: fromRole.rolePermissions || 0,
      customers: fromRole.customers || 0,
    })
    revalidatePath('/crm/userAccounts/roles')
    return {
      data: result,
      success: true
    }
  } catch (error) {
    console.error('Failed to create role:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create role',
    }
  }
}

export async function updateRoles(roles: RolePermissions[], user?: User) {
  try {
    const result = await roleService.update(roles)
    revalidatePath('/crm/userAccounts/roles')
    return {
      data: result,
      success: true
    }
  } catch (error) {
    console.error('Failed to update roles:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update roles' 
    }
  }
}

export async function deleteRole(id: number, user?: User) {
  try {
    const result = await roleService.delete(id)
    revalidatePath('/crm/userAccounts/roles')
    return {
      data: result,
      success: true
    }
  } catch (error) {
    console.error('Failed to delete role:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete role'
    }
  }
}


