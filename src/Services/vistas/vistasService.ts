import { VistaGroup } from "@/prisma/coreDb/interfaces";
import { vistasRepo } from "@/Repos/vistas";

export async function listVistas(groupId: string) {
  return vistasRepo.getOrCreateGroup(groupId)
}

export async function updateGroup(group: VistaGroup) {
  return vistasRepo.updateGroup(group)
}
