import { VistasView } from "@/hooks/vistas/types"

export const vistaConfig = {
  defaultVista: {
    groupId: 'customers', // used to set the group in the useVistas hook
    vistaId: 'default',
    label: 'Default View',
    fields: ['CustomerID', 'OrganizationName', 'FederalTaxID', 'Telephone1'],
  } as VistasView,
  availableFields: [
    'CustomerID',
    'OrganizationName',
    'FederalTaxID',
    'Telephone1',
    'Address',
    'PostalCode',
    'Country',
  ]
}
// availableFields: [
//   {
//     field: 'CustomerID'
//   },
//   {
//     field: 'OrganizationName'
//   },
//   {
//     field: 'FederalTaxID'
//   },
//   {
//     field: 'Telephone1'
//   },
//   {
//     field: 'Address'
//   },
//   {
//     field: 'PostalCode'
//   },
//   {
//     field: 'Country'
//   },
// ]
