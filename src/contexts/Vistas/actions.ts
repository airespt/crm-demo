'use server'

import { ActionResponse } from "@/actions/types"
import { VistaGroup } from "@/prisma/coreDb/interfaces"
import { vistasService } from "@/Services/vistas"


export async function listVistas(groupId: string): Promise<ActionResponse<VistaGroup>> {
  try {
    const result = await vistasService.list(groupId)
    return {
      data: result,
      success: true,
    }
  } catch (error) {
    console.error('Failed to list vistas:', error)
    return {
      data: null,
      success: false,
      error: error instanceof Error ? error.message : `Failed to list vistas of ${groupId}`,
    }
  }
}

export async function updateGroup(group: VistaGroup): Promise<ActionResponse<VistaGroup>> {
  try {
    const result = await vistasService.update(group)
    return {
      data: result,
      success: true,
    }
  } catch (error) {
    console.error('Failed to update vistas:', error)
    return {
      data: null,
      success: false,
      error: error instanceof Error ? error.message : `Failed to update vistas`,
    }
  }
}
