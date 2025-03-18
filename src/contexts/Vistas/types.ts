import { VistaGroup, Vistas } from "@/prisma/coreDb/interfaces"

export type VistaConfig = {
  defaultVista: VistasView,
  availableFields?: string[]
}

//*********************** */
export type VistasGroupView = {
  groupId: string,
  favouriteVista: string,
  vistas: VistasView[]
}

export function convertVistasGroupToView(group: VistaGroup): VistasGroupView {
  return {
    ...group,
    vistas: group.vistas?.map(convertVistaToView) || []
  }
}

export function convertVistaGroupFromView(group: VistasGroupView): VistaGroup {
  // if( !group.vistas ) throw new Error('No vistas to convert')
  // if( !group.groupId ) throw new Error('No groupId to convert')
  // if( !group.favouriteVista ) throw new Error('No favouriteVista to convert')

  return {
    groupId: group.groupId,
    favouriteVista: group.favouriteVista,
    vistas: group.vistas?.map(convertVistaFromView)
  }
}

//*********************** */
export type VistasView = {
  groupId: string,
  vistaId: string,
  label: string,
  fields: string[]
  hasChanges?: boolean,
}

export function convertVistaToView(vista: Vistas): VistasView {
  return {
    ...vista,
    fields: JSON.parse(vista.fields)
  }
}

export function convertVistaFromView(vista: VistasView): Vistas {
  const { hasChanges, ...vistaData } = vista
  return {
    ...vistaData,
    fields: JSON.stringify(vista.fields)
  }
}
