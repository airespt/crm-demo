import { VistaGroup } from "@/prisma/coreDb/interfaces";
import { FieldRef } from "@/prisma/sageDb/prismaClient/runtime/library";
import { vistasRepo } from "@/Repos/vistas";

export async function listVistas(groupId: string) {
  return vistasRepo.getOrCreateGroup(groupId)
}

export async function updateGroup(group: VistaGroup) {
  return vistasRepo.updateGroup(group)
}

export function listFields(groupId: string, namesOnly?: boolean) {
  const name = groupId.split(',')[0]
  const fields = vistasRepo.getTableFields(name)
  if( namesOnly ) {
    return Object.keys(fields) as string[]
  }
  else {
    return fields as Map<string, FieldRef<any, any>>
  }

}

