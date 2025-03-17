import { coreDb } from "@/prisma/coreDb/client";
import { VistaGroup, Vistas } from "@/prisma/coreDb/interfaces";
import { create } from "domain";

export async function getOrCreateGroup(groupId: string): Promise<VistaGroup> {
  try {
    let result = await coreDb.vistaGroup.findUnique({
      where: { groupId },
      include: { vistas: true }
    })
    if( !result ) {
      result = await coreDb.vistaGroup.create({
        data: { groupId },
        include: { vistas: true }
      })
    }
    return result;
  }
  catch(e) {
    console.log(JSON.stringify(e))
    throw e
  }
}

export async function updateGroup(group: VistaGroup): Promise<VistaGroup | null> {
  try {
    const {groupId, vistas = [], ...data} = group
    const resultGroup = await coreDb.vistaGroup.update({
      where: { groupId },
      data,
      include: { vistas: true }
    })
    const existingVistasMap = new Map(resultGroup.vistas.map(v => [v.vistaId, v]))
    
    const newVistas = vistas.filter(v => !existingVistasMap.has(v.vistaId))
    const createdVistasResult = await coreDb.vistas.createMany({
      data: newVistas.map(v => ({
        ...v,
        groupId
      }))
    })

    const updatedVistas = vistas.filter(v => existingVistasMap.has(v.vistaId))
    const updatedVistasResult = await Promise.all(updatedVistas.map(v => {
      const { vistaId, groupId, group, ...data } = v
      return coreDb.vistas.update({
        where: { groupId_vistaId: { groupId, vistaId } },
        data,
      })
    }))

    const reqVistasMap = new Map(vistas.map(v => [v.vistaId, v]))
    const deletedVistas = resultGroup.vistas.filter(v => !reqVistasMap.has(v.vistaId))
    const deletedVistasResult = await coreDb.vistas.deleteMany({
      where: {
        groupId,
        vistaId: {
          in: deletedVistas.map(v => v.vistaId)
        }
      }
    })

    return await getOrCreateGroup(groupId)
  }
  catch(e) {
    console.log(JSON.stringify(e))
    throw e
  }
}

